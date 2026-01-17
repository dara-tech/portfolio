import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateImageFromPrompt } from './AiImageGen';

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const MODEL = "gemini-2.0-flash";

export function useAiProjectGeneration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const generateProject = async (prompt, generateImage = false) => {
    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      const model = genAI.getGenerativeModel({ model: MODEL });
      
      const enhancedPrompt = `
        Generate a professional project portfolio entry based on this description: "${prompt}"
        
        Return a JSON object with the following structure (no markdown formatting, pure JSON only):
        {
          "title": "A compelling project title (5-8 words)",
          "description": "A detailed project description (50-150 words) explaining what the project does, its key features, and value proposition",
          "category": "Project category (e.g., Web App, Mobile App, API, Game, Tool, etc.)",
          "technologies": ["tech1", "tech2", "tech3", "tech4", "tech5"] (array of 3-7 relevant technologies/frameworks),
          "githubLink": "",
          "liveDemoLink": ""
        }
        
        Requirements:
        - Title should be catchy and professional
        - Description should be clear, engaging, and highlight key features
        - Category should be a single word or short phrase
        - Technologies should be relevant to the project type
        - Only return valid JSON, no explanations or additional text
      `;

      setProgress(20);
      const result = await model.generateContent(enhancedPrompt);
      const response = await result.response;
      let text = response.text().trim();
      
      // Clean up the response if it has markdown code blocks
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      setProgress(60);
      
      let projectData;
      try {
        projectData = JSON.parse(text);
      } catch (parseError) {
        // If JSON parsing fails, try to extract JSON from the text
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          projectData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Failed to parse AI response as JSON");
        }
      }

      setProgress(80);

      // Generate image if requested
      let imageUrl = null;
      if (generateImage) {
        try {
          const imagePrompt = `A modern, professional project thumbnail image for: ${projectData.title}. ${projectData.description}`;
          const imageResult = await generateImageFromPrompt(imagePrompt);
          imageUrl = imageResult.image;
          setProgress(95);
        } catch (imageError) {
          console.warn("Image generation failed:", imageError);
          // Continue without image
        }
      }

      setProgress(100);

      // Ensure technologies is an array
      if (!Array.isArray(projectData.technologies)) {
        projectData.technologies = projectData.technologies 
          ? [projectData.technologies] 
          : [];
      }

      return {
        ...projectData,
        image: imageUrl
      };

    } catch (err) {
      console.error("Project generation error:", err);
      setError(err.message || "Failed to generate project. Please try again.");
      setLoading(false);
      throw err;
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return {
    generateProject,
    loading,
    error,
    progress
  };
}
