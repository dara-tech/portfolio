import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);

const MAX_RETRIES = 3;
const CONVERSATION_MEMORY = 5;

export async function chatWithAI(messages, retryCount = 0) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const recentMessages = messages.slice(-CONVERSATION_MEMORY);

    const finalPrompt = recentMessages.map(msg => msg.content).join("\n\n");

    const chat = model.startChat();
    const result = await chat.sendMessage(finalPrompt);

    if (result && result.response) {
      const responseText = await result.response.text();
      
      // Check if the response starts with '{' to determine if it might be JSON
      if (responseText.trim().startsWith('{')) {
        try {
          const jsonResponse = JSON.parse(responseText);
          return jsonResponse;
        } catch (error) {
          console.warn("Response looked like JSON but failed to parse");
          return formatResponse(responseText);
        }
      }
      
      // If not JSON, return formatted text directly
      return formatResponse(responseText);
    }
    throw new Error("No response received from AI");
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.warn(`Retry attempt ${retryCount + 1} of ${MAX_RETRIES}`);
      return chatWithAI(messages, retryCount + 1);
    }
    console.error("Error occurred in chatWithAI:", error);
    throw new Error("Failed to get AI response. Please try again later.");
  }
}

function formatResponse(text) {
  const removeAsterisks = (str) => str.replace(/\*.*?\*/g, '');
  const consolidateNewlines = (str) => str.replace(/\n{2,}/g, '\n');
  const trimWhitespace = (str) => str.trim();

  return [removeAsterisks, consolidateNewlines, trimWhitespace]
    .reduce((result, fn) => fn(result), text);
}