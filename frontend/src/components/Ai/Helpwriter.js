import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: false,
  highlight: (code, lang) => `<pre class="bg-base-300 p-4 rounded-lg my-2"><code class="language-${lang}">${code}</code></pre>`
});

const useHelpWriter = (editor, tone, correctionType) => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState("");

  const formatResponse = (text) => {
    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/```(\w+)?\n([\s\S]*?)\n```/g, (_, lang, code) => `\n\`\`\`${lang || ''}\n${code.trim()}\n\`\`\`\n`);

    const htmlContent = marked(cleanText);
    const sanitizedHtml = DOMPurify.sanitize(htmlContent, {
      ADD_TAGS: ['code', 'pre'],
      ADD_ATTR: ['class'],
    });

    return sanitizedHtml
      .replace(/<a /g, '<a class="link link-primary" target="_blank" ')
      .replace(/<ul>/g, '<ul class="list-disc list-inside my-2 space-y-1">')
      .replace(/<ol>/g, '<ol class="list-decimal list-inside my-2 space-y-1">')
      .replace(/<h([1-6])>/g, '<h$1 class="font-bold my-2">')
      .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-primary pl-4 my-2">')
      .replace(/<table>/g, '<table class="table table-zebra w-full">')
      .replace(/<code>/g, '<code class="bg-base-300 px-1 rounded text-sm sm:text-base md:text-lg lg:text-xl">');
  };

  const generateSuggestion = async () => {
    if (!editor) return;

    const selectedText = editor.view.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      " "
    );

    if (!selectedText.trim()) {
      alert("Please select some text for AI suggestions.");
      return;
    }

    setIsLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-pro-exp-02-05" });

      const prompt = `
        Assume the role of a highly skilled multilingual writer and editor. Your task is to enhance the given text, maintaining its core message while elevating its engagement factor. Apply a "${tone}" writing style to the content. Analyze the text to determine its language, and craft your response in that same language. Focus on:
        1. Improving clarity and coherence
        2. Enhancing the overall flow and structure
        3. Adjusting vocabulary to match the desired tone
        4. Ensuring grammatical accuracy and stylistic consistency
        5. Correcting ${correctionType === 'word' ? 'incorrect' : 'grammatical'} errors

        Provide only the refined and corrected version of the text, without any additional commentary.

        Text to improve and correct:
        "${selectedText}"
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();

      setSuggestion(formatResponse(text));
    } catch (error) {
      console.error("Error generating suggestion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const applySuggestion = () => {
    if (suggestion) {
      editor.chain().focus().insertContent(suggestion).run();
      setSuggestion("");
    }
  };

  return { generateSuggestion, applySuggestion, isLoading, suggestion };
};

export default useHelpWriter;
