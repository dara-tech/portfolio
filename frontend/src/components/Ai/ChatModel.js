import { GoogleGenerativeAI } from "@google/generative-ai";
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);

const MAX_RETRIES = 3;
const CONVERSATION_MEMORY = 5;

marked.setOptions({
breaks: true,
gfm: true,
headerIds: false,
highlight: (code, lang) => `<pre class="bg-base-300 p-4 rounded-lg my-2"><code class="language-${lang}">${code}</code></pre>`
});

export async function chatWithAI(messages, retryCount = 0) {
try {
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
const recentMessages = messages.slice(-CONVERSATION_MEMORY);
const finalPrompt = recentMessages.map(msg => `${msg.role}: ${msg.content}`).join("\n\n");

const chat = model.startChat();
const result = await chat.sendMessage(finalPrompt);

if (result?.response) {
const responseText = await result.response.text();

if (responseText.trim().startsWith('{')) {
try {
return JSON.parse(responseText);
} catch (error) {
console.warn("Response looked like JSON but failed to parse");
return formatResponse(responseText);
}
}

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
}