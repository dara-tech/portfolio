import { GoogleGenerativeAI } from "@google/generative-ai";
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const MAX_RETRIES = 3;

// Helper function to check if video exists and get metadata using YouTube API
async function checkVideoExists(videoId) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=status,statistics,contentDetails,snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`
    );
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error('YouTube API request failed');
    }

    return {
      exists: data.items && data.items.length > 0,
      metadata: data.items?.[0]
    };
  } catch (error) {
    console.error('Error checking video existence:', error);
    return { exists: false, metadata: null };
  }
}

export async function generateVideoSuggestion(topic, retryCount = 0) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Create a highly sophisticated YouTube video suggestion for the topic: "${topic}".
    
    Format the response EXACTLY as a JSON object with these fields only:
    {
      "title": "string", 
      "description": "string",
      "youtubeId": "string", 
      "thumbnail": "string",
      "duration": "string",
      "category": "string"
    }
    
    Rules:
    - Find a real, existing YouTube video that matches the topic
    - Prioritize videos with:
      * High view counts (>100k views preferred)
      * High like ratios
      * Reputable channels (>10k subscribers)
      * Comprehensive educational content
      * High production quality
    - Use the actual video title, description and ID from YouTube
    - The youtubeId should be the real video ID from the YouTube URL
    - The thumbnail should be the actual video thumbnail URL
    - Duration should be in the format HH:MM:SS
    - Category should be one of: "Programming", "Web Development", "Data Science", "Machine Learning", "DevOps", "Mobile Development", "Game Development", "Computer Science", "Software Engineering", "Other"
    - Do not include backticks or markdown formatting
    - Ensure valid JSON format
    - Use double quotes for strings`;

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    // Clean the response
    let cleanResponse = response
      .trim()
      // Remove any markdown code block indicators
      .replace(/```json/g, '')
      .replace(/```/g, '')
      // Remove any trailing commas before closing braces
      .replace(/,(\s*[}\]])/g, '$1')
      .trim();

    try {
      // Attempt to parse the cleaned response
      const parsedResponse = JSON.parse(cleanResponse);

      // Validate the required fields
      const requiredFields = ['title', 'description', 'youtubeId', 'thumbnail', 'duration', 'category'];
      const missingFields = requiredFields.filter(field => !parsedResponse[field]);

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Validate duration format
      const duration = parsedResponse.duration;
      const durationRegex = /^(?:(\d+):)?(?:(\d+):)?(\d+)$/; // HH:MM:SS or MM:SS or SS
      const matches = duration.match(durationRegex);
      
      if (matches) {
        const hours = parseInt(matches[1] || 0);
        const minutes = parseInt(matches[2] || 0);
        const seconds = parseInt(matches[3] || 0);
        parsedResponse.duration = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      } else {
        parsedResponse.duration = '00:00:00';
      }

      // Validate YouTube ID format
      const youtubeIdRegex = /^[a-zA-Z0-9_-]{11}$/;
      if (!youtubeIdRegex.test(parsedResponse.youtubeId)) {
        throw new Error("Invalid YouTube video ID format");
      }

      // Check if video exists and get metadata using YouTube API
      const { exists, metadata } = await checkVideoExists(parsedResponse.youtubeId);
      if (!exists) {
        console.error(`Failed to parse AI response: Error: This video isn't available anymore`);
        throw new Error("This video isn't available anymore");
      }

      // Validate video quality metrics
      const viewCount = parseInt(metadata?.statistics?.viewCount || 0);
      const likeCount = parseInt(metadata?.statistics?.likeCount || 0);
      const subscriberCount = parseInt(metadata?.snippet?.channelStatistics?.subscriberCount || 0);

      if (viewCount < 10000) {
        throw new Error("Video has insufficient views for optimal learning experience");
      }

      // Validate thumbnail URL
      if (!parsedResponse.thumbnail.startsWith('https://i.ytimg.com/')) {
        throw new Error("Invalid YouTube thumbnail URL");
      }

      // Validate category
      const validCategories = [
        "Programming",
        "Web Development", 
        "Data Science",
        "Machine Learning",
        "DevOps",
        "Mobile Development",
        "Game Development",
        "Computer Science",
        "Software Engineering",
        "Other"
      ];

      if (!validCategories.includes(parsedResponse.category)) {
        parsedResponse.category = "Other";
      }

      // Enhance response with metadata
      parsedResponse.viewCount = viewCount;
      parsedResponse.likeCount = likeCount;
      parsedResponse.channelTitle = metadata?.snippet?.channelTitle || '';

      return {
        success: true,
        data: parsedResponse
      };
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      console.log("Raw response:", response);
      console.log("Cleaned response:", cleanResponse);

      if (retryCount < MAX_RETRIES) {
        console.warn(`Parse error, retrying (${retryCount + 1}/${MAX_RETRIES})`);
        return generateVideoSuggestion(topic, retryCount + 1);
      }

      throw new Error("Failed to parse video suggestion format");
    }

  } catch (error) {
    if (retryCount < MAX_RETRIES && !error.message.includes("Failed to parse")) {
      console.warn(`API error, retrying (${retryCount + 1}/${MAX_RETRIES})`);
      return generateVideoSuggestion(topic, retryCount + 1);
    }

    return {
      success: false,
      error: error.message || "Failed to generate video suggestion. Please try again later."
    };
  }
}

// Helper function to validate JSON structure
function validateVideoData(data) {
  return {
    title: String(data.title || ''),
    description: String(data.description || ''),
    youtubeId: String(data.youtubeId || ''),
    thumbnail: String(data.thumbnail || ''),
    duration: String(data.duration || '00:00:00'),
    viewCount: Number(data.viewCount || 0),
    likeCount: Number(data.likeCount || 0),
    channelTitle: String(data.channelTitle || ''),
    category: String(data.category || 'Other')
  };
}
