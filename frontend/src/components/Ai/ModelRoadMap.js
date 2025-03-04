import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export async function generateRoadMap(title, description) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // Changed to gemini-pro as it's more suitable

  const prompt = `Create a detailed roadmap for learning "${title}". The roadmap should include:
  1. A series of steps (at least 5)
  2. Each step should have:
     - A name
     - A description
     - An estimated time (e.g., "2 weeks", "1 month")
     - 2-3 resources with working URLs
  3. Consider the following description: "${description}"
  4. The response should be a JSON object with the following structure:
  {
    "title": "${title}",
    "description": "${description}",
    "category": "",
    "difficulty": "",
    "estimatedTime": "",
    "steps": [
      {
        "name": "",
        "description": "",
        "estimatedTime": "",
        "resources": [
          {
            "title": "",
            "url": "https://example.com" // Ensure valid URLs
          }
        ]
      }
    ]
  }
  Important: Ensure all URLs are valid and working links, and each step has an estimated time.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = await response.text();

    // Parse and validate the JSON response
    try {
      const jsonStart = responseText.indexOf("{");
      const jsonEnd = responseText.lastIndexOf("}");
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error("Invalid JSON format in response");
      }
      const validJson = responseText.substring(jsonStart, jsonEnd + 1);
      const roadmap = JSON.parse(validJson);

      // Validate the structure
      if (!roadmap.steps || !Array.isArray(roadmap.steps)) {
        throw new Error("Invalid roadmap structure");
      }

      return roadmap;
    } catch (error) {
      throw new Error(`Failed to parse AI response: ${error.message}`);
    }
  } catch (error) {
    throw new Error(`AI generation failed: ${error.message}`);
  }
}