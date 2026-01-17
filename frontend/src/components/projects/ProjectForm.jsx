// ProjectForm.js
import React, { useState } from 'react';
import { Plus, Link as LinkIcon, X, Upload, Sparkles, Loader2 } from 'lucide-react';
import { useAiProjectGeneration } from '../Ai/ProjectGenerator';

const ProjectForm = ({ formData, imagePreview, onSubmit, onChange, onImageChange, onTechnologyAdd, onTechnologyRemove, onAiGenerate, isSubmitting = false }) => {
  const [dragActive, setDragActive] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [generateImage, setGenerateImage] = useState(false);
  const { generateProject, loading: aiLoading, error: aiError, progress } = useAiProjectGeneration();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageChange({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) {
      alert('Please enter a project description');
      return;
    }

    try {
      const generatedData = await generateProject(aiPrompt, generateImage);
      
      if (onAiGenerate) {
        onAiGenerate(generatedData);
      }
      
      setShowAiModal(false);
      setAiPrompt('');
      setGenerateImage(false);
    } catch (error) {
      console.error('AI generation error:', error);
      alert('Failed to generate project. Please try again.');
    }
  };

  return (
    <>
      <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-6">
      {/* AI Generate Button */}
      {!formData.id && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setShowAiModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-xl text-white hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300"
          >
            <Sparkles className="w-4 h-4" />
            Generate with AI
          </button>
        </div>
      )}
      <div className="space-y-2">
        <label className="block text-white/80 text-sm font-medium">
          Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={onChange}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
          required
          placeholder="Enter project title"
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-white/80 text-sm font-medium">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={onChange}
          className="w-full px-4 py-3 bg-white/10  border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all h-24 resize-none"
          required
          placeholder="Enter project description"
        ></textarea>
      </div>

      <div className="space-y-2">
        <label className="block text-white/80 text-sm font-medium">
          Category
        </label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={onChange}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
          placeholder="Enter project category"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-white/80 text-sm font-medium">
          Technologies
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.technologies.map((tech, index) => (
            <span key={index} className="bg-white/20  text-white px-3 py-1 rounded-lg border border-white/30 flex items-center gap-2 text-sm">
              {tech}
              <button type="button" onClick={() => onTechnologyRemove(tech)} className="hover:bg-white/20 rounded-full p-1 transition-colors">
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add a technology"
            className="flex-1 px-4 py-3 bg-white/10  border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onTechnologyAdd(e.target.value);
                e.target.value = '';
              }
            }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-white/80 text-sm font-medium">
          Image
        </label>
        <div 
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${dragActive ? 'border-white/50 bg-white/10' : 'border-white/30 hover:border-white/50'} bg-white/5 `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            name="image"
            onChange={onImageChange}
            className="hidden"
            id="image-upload"
            accept="image/*"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <Upload className="mx-auto h-12 w-12 text-white/70" />
            <p className="mt-2 text-sm text-white/70">
              Drag and drop an image here, or click to select a file
            </p>
          </label>
        </div>
        {imagePreview && (
          <div className="mt-3">
            <img src={imagePreview} alt="Project preview" className="w-full h-auto rounded-xl border border-white/20 max-h-96 object-contain" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-white/80 text-sm font-medium">
          GitHub Link
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            name="githubLink"
            value={formData.githubLink}
            onChange={onChange}
            className="w-full px-4 py-3 bg-white/10  border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
            placeholder="https://github.com/username/repo"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-white/80 text-sm font-medium">
          Live Demo Link
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            name="liveDemoLink"
            value={formData.liveDemoLink}
            onChange={onChange}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
            placeholder="https://example.com"
          />
        </div>
      </div>

      <div className="mt-8">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full py-3 bg-white/20 border border-white/30 rounded-xl text-white font-medium hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{formData.id ? 'Updating Project...' : 'Creating Project...'}</span>
            </>
          ) : (
            <span>{formData.id ? 'Update Project' : 'Create Project'}</span>
          )}
        </button>
      </div>
      </div>
     
    </form>

    {/* AI Generation Modal */}
    {showAiModal && (
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget && !aiLoading) {
            setShowAiModal(false);
            setAiPrompt('');
            setGenerateImage(false);
          }
        }}
      >
        <div 
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              Generate Project with AI
            </h2>
            <button
              onClick={() => {
                setShowAiModal(false);
                setAiPrompt('');
                setGenerateImage(false);
              }}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Describe your project idea
              </label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g., A task management web app with drag-and-drop features, calendar integration, and team collaboration tools"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-transparent transition-all h-32 resize-none"
              />
              <p className="text-white/50 text-xs mt-2">
                Describe what you want to build and AI will generate title, description, category, and technologies.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="generateImage"
                checked={generateImage}
                onChange={(e) => setGenerateImage(e.target.checked)}
                className="w-4 h-4 rounded border-white/30 bg-white/10 text-purple-500 focus:ring-purple-400"
              />
              <label htmlFor="generateImage" className="text-white/80 text-sm cursor-pointer">
                Also generate project thumbnail image (takes longer)
              </label>
            </div>

            {aiError && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-300 text-sm">
                {aiError}
              </div>
            )}

            {aiLoading && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-purple-300">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating project... {progress > 0 && `${progress}%`}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleAiGenerate}
                disabled={aiLoading || !aiPrompt.trim()}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-medium hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Project
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAiModal(false);
                  setAiPrompt('');
                  setGenerateImage(false);
                }}
                className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default ProjectForm;