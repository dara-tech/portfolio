// ProjectForm.js
import React, { useState } from 'react';
import { Plus, Link as LinkIcon, X, Upload } from 'lucide-react';

const ProjectForm = ({ formData, onSubmit, onChange, onImageChange, onTechnologyAdd, onTechnologyRemove }) => {
  const [dragActive, setDragActive] = useState(false);

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

  return (
    <form onSubmit={onSubmit}>

      <div className="flex flex-col gap-6">
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
        {formData.image && (
          <div className="mt-3">
            <img src={formData.image} alt="Project" className="w-full h-auto rounded-xl border border-white/20" />
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
        <button type="submit" className="w-full py-3 bg-white/20 border border-white/30 rounded-xl text-white font-medium hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
          {formData.id ? 'Update Project' : 'Create Project'}
        </button>
      </div>
      </div>
     
    </form>
  );
};

export default ProjectForm;