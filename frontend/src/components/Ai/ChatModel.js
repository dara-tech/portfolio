import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);

export async function chatWithAI(messages) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const { content: lastMessage } = messages[messages.length - 1];
    const chat = model.startChat();
    const result = await chat.sendMessage(lastMessage);

    if (result && result.response) {
        const responseText = result.response.text();
      return responseText.replace(/\*.*\*/g, '').substring(0, 200); // Removes bullet points and shortens
    } else {
      throw new Error("No response received from AI");
    }
  } catch (error) {
    console.error('Error occurred in chatWithAI:', error);
    throw new Error('Failed to get AI response. Please try again later.');
  }
}
