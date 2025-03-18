import { AlertTriangle, Tag, Clock, BarChart, BookOpen, ArrowLeft, FileText } from 'lucide-react';
import DOMPurify from 'dompurify';

export const BasicInfoSection = ({ formData, formErrors, handleChange, setActiveSection }) => {
  const sanitizedTitle = DOMPurify.sanitize(formData.title);
  const sanitizedDescription = DOMPurify.sanitize(formData.description);
  const sanitizedCategory = DOMPurify.sanitize(formData.category);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6 flex items-center text-primary">
        <FileText size={20} className="mr-2" />
        Basic Information
      </h2>
      
      <div className="grid grid-cols-1 gap-8">
        <div className="space-y-6">
          {/* Title Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Title</span>
              <span className="label-text-alt text-error">*Required</span>
            </label>
            <input
              type="text"
              name="title"
              value={sanitizedTitle}
              onChange={handleChange}
              className={`input input-bordered w-full focus:outline-none transition-all ${
                formErrors.title ? 'input-error' : ''
              }`}
              placeholder="Enter an engaging title"
            />
            {formErrors.title && (
              <p className="text-error text-sm mt-1 flex items-center">
                <AlertTriangle size={14} className="mr-1" />
                {formErrors.title}
              </p>
            )}
          </div>

          {/* Description Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Description</span>
              <span className="label-text-alt text-error">*Required</span>
            </label>
            <textarea
              name="description"
              value={sanitizedDescription}
              onChange={handleChange}
              className={`textarea textarea-bordered h-32 focus:outline-none w-full transition-all ${
                formErrors.description ? 'textarea-error' : ''
              }`}
              placeholder="Write a compelling description that summarizes your lesson"
            />
            {formErrors.description && (
              <p className="text-error text-sm mt-1 flex items-center">
                <AlertTriangle size={14} className="mr-1" />
                {formErrors.description}
              </p>
            )}
          </div>

          {/* Metadata Section */}
          <div className="bg-base-200 p-4 rounded-lg">
            <h3 className="font-medium mb-4">Lesson Metadata</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center">
                    <Tag size={16} className="mr-1" />
                    Category
                  </span>
                </label>
                <input
                  type="text"
                  name="category"
                  value={sanitizedCategory}
                  onChange={handleChange}
                  className="input input-bordered w-full focus:outline-none transition-all"
                  placeholder="E.g., Programming, Design"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center">
                    <Clock size={16} className="mr-1" />
                    Duration (minutes)
                  </span>
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="input input-bordered w-full focus:outline-none transition-all"
                  placeholder="E.g., 30"
                  min="1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center">
                    <BarChart size={16} className="mr-1" />
                    Difficulty
                  </span>
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="select select-bordered w-full focus:outline-none transition-all"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center">
                    <BookOpen size={16} className="mr-1" />
                    Step Index
                  </span>
                </label>
                <input
                  type="number"
                  name="stepIndex"
                  value={formData.stepIndex}
                  onChange={handleChange}
                  className="input input-bordered w-full focus:outline-none transition-all"
                  placeholder="0"
                  min="0"
                />
                <label className="label">
                  <span className="label-text-alt">Order in learning path</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-6 pt-4 border-t border-base-200">
        <button 
          type="button" 
          className="btn btn-primary gap-2"
          onClick={() => setActiveSection('content')}
        >
          Next: Content
          <ArrowLeft size={16} className="rotate-180" />
        </button>
      </div>
    </div>
  );
}; 