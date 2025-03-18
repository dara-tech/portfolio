import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const MODEL = "gemini-2.0-pro-exp-02-05";

// Enhanced marked configuration with structured data
marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: true,
  headerPrefix: 'lesson-',
  highlight: (code, lang) => {
    return `<pre class="bg-base-300 p-4 rounded-lg my-2 overflow-x-auto">
      <code class="language-${lang} text-sm">${code}</code>
    </pre>`;
  },
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: true
});

// Advanced response formatting with enhanced styling
const formatResponse = (text) => {
  // Advanced text preprocessing
  const preprocessedText = text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    .replace(/```(\w+)?\n([\s\S]*?)\n```/g, (_, lang, code) => 
      `\n\`\`\`${lang || ''}\n${code.trim()}\n\`\`\`\n`
    )
    .replace(/\[\[(.*?)\]\]/g, '<mark class="bg-primary/20 px-1 rounded">$1</mark>');

  // Convert to HTML with marked
  const htmlContent = marked(preprocessedText);

  // Enhanced sanitization with more allowed elements and attributes
  const sanitizedHtml = DOMPurify.sanitize(htmlContent, {
    ADD_TAGS: ['code', 'pre', 'mark', 'sup', 'sub', 'details', 'summary'],
    ADD_ATTR: ['class', 'id', 'target', 'rel', 'data-*'],
    FORBID_TAGS: ['style', 'script'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick']
  });

  // Advanced styling with Tailwind classes
  return sanitizedHtml
    .replace(/<a /g, '<a class="link link-primary hover:link-secondary transition-colors" target="_blank" rel="noopener noreferrer" ')
    .replace(/<ul>/g, '<ul class="list-disc list-inside my-3 space-y-2">')
    .replace(/<ol>/g, '<ol class="list-decimal list-inside my-3 space-y-2">')
    .replace(/<h1>/g, '<h1 class="text-4xl font-bold my-6 text-primary">')
    .replace(/<h2>/g, '<h2 class="text-3xl font-semibold my-5 text-primary/90">')
    .replace(/<h3>/g, '<h3 class="text-2xl font-medium my-4 text-primary/80">')
    .replace(/<h4>/g, '<h4 class="text-xl font-medium my-3 text-primary/70">')
    .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-primary pl-4 my-4 italic bg-base-200 p-4 rounded-r">')
    .replace(/<table>/g, '<div class="overflow-x-auto my-4"><table class="table table-zebra w-full">')
    .replace(/<\/table>/g, '</table></div>')
    .replace(/<code>/g, '<code class="bg-base-300 px-1.5 py-0.5 rounded text-sm font-mono">')
    .replace(/<pre>/g, '<pre class="relative group">')
    .replace(/<p>/g, '<p class="my-3 leading-relaxed">');
};

export class Lesson {
  static async create(lessonData) {
    try {
      const enrichedData = await this.#enrichLessonData(lessonData);
      const response = await this.#makeRequest('POST', '/api/admin/lessons', enrichedData);
      return response;
    } catch (error) {
      this.#handleError('create', error);
    }
  }

  static async update(id, lessonData) {
    try {
      const enrichedData = await this.#enrichLessonData(lessonData);
      const response = await this.#makeRequest('PUT', `/api/admin/lessons/${id}`, enrichedData);
      return response;
    } catch (error) {
      this.#handleError('update', error);
    }
  }

  static async getById(id) {
    try {
      const response = await this.#makeRequest('GET', `/api/lessons/${id}`);
      return response;
    } catch (error) {
      this.#handleError('fetch', error);
    }
  }

  static async delete(id) {
    try {
      await this.#makeRequest('DELETE', `/api/admin/lessons/${id}`);
      return true;
    } catch (error) {
      this.#handleError('delete', error);
    }
  }

  // Private helper methods
  static async #enrichLessonData(lessonData) {
    return {
      title: lessonData.title,
      description: lessonData.description,
      content: lessonData.content,
      category: lessonData.category,
      difficulty: lessonData.difficulty,
      duration: lessonData.duration,
      stepIndex: parseInt(lessonData.stepIndex, 10),
      resources: lessonData.resources
    };
  }

  static async #makeRequest(method, endpoint, data = null) {
    const headers = {
      'Content-Type': 'application/json',
      ...(method !== 'GET' && { 'Authorization': `Bearer ${localStorage.getItem('token')}` })
    };

    const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
      method,
      headers,
      ...(data && { body: JSON.stringify(data) })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to ${method.toLowerCase()} lesson`);
    }

    return method === 'DELETE' ? true : await response.json();
  }

  static #handleError(operation, error) {
    console.error(`Error ${operation}ing lesson:`, error);
    throw error;
  }
}

export function useAiLessonGeneration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const generateLesson = async (topic, difficulty, additionalContext = '') => {
    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      const model = genAI.getGenerativeModel({ model: MODEL });
      
      const prompt = `
        Create a detailed lesson about ${topic} at ${difficulty} level.
        Additional context: ${additionalContext}
        
        Structure the lesson with:
        - Clear title
        - Description/Introduction
        - Main content with examples
        - Code samples where relevant
        - Practice exercises
        - Additional resources
        
        Use markdown formatting.
      `;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      setProgress(50);
      
      const formattedContent = formatResponse(text);
      setProgress(75);
      
      const lessonData = {
        title: topic,
        description: additionalContext || `A ${difficulty} level lesson about ${topic}`,
        content: formattedContent,
        category: topic.split(' ')[0].toLowerCase(),
        difficulty: difficulty.toLowerCase(),
        duration: '30m',
        stepIndex: 0,
        resources: []
      };
      
      setProgress(100);
      
      return lessonData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateLesson,
    loading,
    error,
    progress
  };
}
