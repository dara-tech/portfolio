import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const MODEL = "gemini-2.0-pro-exp-02-05";

export function useGeminiGeneration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateResponse = async (prompt) => {
    setLoading(true);
    setError(null);
    
    try {
      const model = genAI.getGenerativeModel({ model: MODEL });
      
      const enhancedPrompt = `
        You are a professional profile writer helping create compelling content for user profiles.
        Generate a concise and engaging response (50-75 words) that:
        
        1. Addresses: ${prompt}
        2. Uses professional yet approachable language
        3. Focuses on highlighting skills and experience
        4. Avoids generic statements
        5. Maintains a confident, positive tone
        
        Do not include any meta-commentary or explanations.
        Do not mention that you are an AI or reference profile writing.
        Focus on delivering the actual content only.
      `;

      const result = await model.generateContent(enhancedPrompt);
      const response = await result.response;
      const text = response.text();
      
      setLoading(false);
      return text.trim();

    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return {
    generateResponse,
    loading,
    error
  };
}