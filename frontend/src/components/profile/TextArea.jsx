import React, { useState } from 'react';
import { useGeminiGeneration } from '../Ai/AboutMe';

const TextArea = ({ label, name, value, onChange, placeholder }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { generateResponse, loading } = useGeminiGeneration();

  const handleAiGenerate = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Generate a professional ${label.toLowerCase()} text for a profile`;
      const response = await generateResponse(prompt);
      onChange({ target: { name, value: response } });
    } catch (error) {
      console.error('Error generating AI response:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="form-control">
      <div className="flex justify-between items-center">
        <label className="label">
          <span className="label-text text-lg text-white/90 font-medium">{label}</span>
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleAiGenerate}
            disabled={loading || isGenerating}
            className="px-3 py-1.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-lg hover:bg-blue-500/30 hover:border-blue-400/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            {(loading || isGenerating) ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              'AI Generate'
            )}
          </button>
          <button
            type="button"
            onClick={() => onChange({ target: { name, value: '' } })}
            className="px-3 py-1.5 bg-white/10 text-white/80 border border-white/20 rounded-lg hover:bg-white/20 hover:border-white/30 transition-all duration-300 text-sm font-medium"
          >
            Clear
          </button>
        </div>
      </div>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 bg-white/10 text-white placeholder-white/50 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-300 h-32 resize-none"
        placeholder={placeholder}
      ></textarea>
    </div>
  );
};

export default TextArea;
