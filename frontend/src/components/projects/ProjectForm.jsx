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
      <div className="form-control">
        <label className="label">
          <span className="label-text">Title</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={onChange}
          className="input input-bordered focus:border-primary w-full focus:outline-none"
          required
          placeholder="Enter project title"
        />
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">Description</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={onChange}
          className="textarea textarea-bordered focus:border-primary focus:outline-none w-full h-24"
          required
          placeholder="Enter project description"
        ></textarea>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Category</span>
        </label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={onChange}
          className="input input-bordered focus:border-primary w-full focus:outline-none"
          placeholder="Enter project category"
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Technologies</span>
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.technologies.map((tech, index) => (
            <span key={index} className="badge badge-primary gap-1">
              {tech}
              <button type="button" onClick={() => onTechnologyRemove(tech)}>
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
        <div className="input-group">
          <input
            type="text"
            placeholder="Add a technology"
            className="input input-bordered w-full focus:outline-none"
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

      <div className="form-control">
        <label className="label">
          <span className="label-text">Image</span>
        </label>
        <div 
          className={`border-2 border-dashed hover:border-primary rounded-lg p-4 text-center ${dragActive ? 'border-primary' : 'border-gray-300'}`}
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
            <Upload className="mx-auto h-12 w-12 text-primary" />
            <p className="mt-2 text-sm text-gray-500">
              Drag and drop an image here, or click to select a file
            </p>
          </label>
        </div>
        {formData.image && (
          <div className="mt-2">
            <img src={formData.image} alt="Project" className="w-full h-auto rounded-lg" />
          </div>
        )}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">GitHub Link</span>
        </label>
        <div className="input-group">
          <input
            type="url"
            name="githubLink"
            value={formData.githubLink}
            onChange={onChange}
            className="input input-bordered focus:border-primary w-full focus:outline-none"
            placeholder="https://github.com/username/repo"
          />
        </div>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Live Demo Link</span>
        </label>
        <div className="input-group">
          <input
            type="url"
            name="liveDemoLink"
            value={formData.liveDemoLink}
            onChange={onChange}
            className="input input-bordered focus:border-primary w-full focus:outline-none"
            placeholder="https://example.com"
          />
        </div>
      </div>

      <div className="mt-6">
        <button type="submit" className="btn btn-primary w-full">
          {formData.id ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;