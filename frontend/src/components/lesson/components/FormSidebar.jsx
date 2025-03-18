import { ArrowLeft, Save, FileText, BookOpen, LinkIcon, CheckCircle } from 'lucide-react';

export const FormSidebar = ({
  activeSection,
  setActiveSection,
  formData,
  navigate,
  handleSubmit,
  isSubmitting,
  loading,
  isFormComplete,
  id
}) => {
  const getCompletionPercentage = () => {
    let completed = 0;
    let total = 3; // Required fields: title, description, content
    
    if (formData.title) completed++;
    if (formData.description) completed++;
    if (formData.content) completed++;
    
    return Math.floor((completed / total) * 100);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">Form Sections</h3>
        <div className="radial-progress text-primary" style={{"--value": getCompletionPercentage(), "--size": "2rem"}}>
          <span className="text-xs">{getCompletionPercentage()}%</span>
        </div>
      </div>
      
      <ul className="steps steps-vertical">
        <li 
          className={`step cursor-pointer ${activeSection === 'basic' ? 'step-primary' : ''} ${formData.title && formData.description ? 'step-success' : ''}`}
          onClick={() => setActiveSection('basic')}
        >
          <div className="flex flex-col items-start">
            <span className="font-medium flex items-center">
              <FileText size={14} className="mr-1" />
              Basic Information
            </span>
            <span className="text-xs opacity-70">Title, description, etc.</span>
          </div>
        </li>
        <li 
          className={`step cursor-pointer ${activeSection === 'content' ? 'step-primary' : ''} ${formData.content ? 'step-success' : ''}`}
          onClick={() => setActiveSection('content')}
        >
          <div className="flex flex-col items-start">
            <span className="font-medium flex items-center">
              <BookOpen size={14} className="mr-1" />
              Lesson Content
            </span>
            <span className="text-xs opacity-70">Main lesson material</span>
          </div>
        </li>
        <li 
          className={`step cursor-pointer ${activeSection === 'resources' ? 'step-primary' : ''}`}
          onClick={() => setActiveSection('resources')}
        >
          <div className="flex flex-col items-start">
            <span className="font-medium flex items-center">
              <LinkIcon size={14} className="mr-1" />
              Resources
            </span>
            <span className="text-xs opacity-70">
              {formData.resources.length > 0 
                ? `${formData.resources.length} resources added` 
                : 'Additional materials'}
            </span>
          </div>
        </li>
      </ul>
      
      <div className="divider my-4"></div>
      
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => navigate('/admin/lessons')}
          className="btn btn-outline w-full"
        >
          <ArrowLeft size={16} className="mr-1" />
          Cancel
        </button>
        
        <button
          type="button"
          onClick={handleSubmit}
          className="btn btn-primary w-full"
          disabled={isSubmitting || loading || !isFormComplete()}
        >
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner loading-xs"></span>
              Saving...
            </>
          ) : (
            <>
              {id ? (
                <>
                  <Save size={16} className="mr-1" />
                  Update
                </>
              ) : (
                <>
                  <CheckCircle size={16} className="mr-1" />
                  Create
                </>
              )}
            </>
          )}
        </button>
      </div>
    </div>
  );
}; 