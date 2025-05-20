import { GoogleGenAI, Modality } from "@google/genai";

// Secure version (assumes backend environment)
export async function generateImageFromPrompt(prompt) {
  try {
    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_API_KEY });


    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    const parts = response?.candidates?.[0]?.content?.parts;
    if (!parts) throw new Error("Invalid response format from the API");

    let imageData = null;
    let text = "";

    for (const part of parts) {
      if (part.text) text = part.text;
      else if (part.inlineData?.data) imageData = part.inlineData.data;
    }

    if (!imageData) throw new Error("No image data returned from the API");

    return {
      text,
      image: `data:image/png;base64,${imageData}`,
    };
  } catch (error) {
    console.error("Error generating image from prompt:", error);
    throw new Error("Image generation failed. Please try again later.");
  }
}
