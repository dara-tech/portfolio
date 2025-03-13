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
          <span className="label-text text-lg">{label}</span>
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleAiGenerate}
            disabled={loading || isGenerating}
            className="btn btn-sm btn-primary"
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
            className="btn btn-sm btn-ghost"
          >
            Clear
          </button>
        </div>
      </div>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        className="textarea w-full textarea-bordered focus:outline-none textarea-primary h-32"
        placeholder={placeholder}
      ></textarea>
    </div>
  );
};

export default TextArea;
