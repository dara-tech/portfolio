import { ArrowLeft, Wand2 } from 'lucide-react';

export const FormHeader = ({ id, navigate, setShowAiDialog }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-10">
      <div className="flex items-center">
        <button 
          onClick={() => navigate('/admin/lessons')}
          className="btn btn-circle btn-ghost mr-4 hover:bg-base-200"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {id ? 'Edit Lesson' : 'Create New Lesson'}
          </h1>
          <p className="text-base-content/70 mt-1">
            {id ? 'Update your existing lesson content' : 'Create a new educational lesson'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4 ">
        {!id && ( // Only show AI generation for new lessons
          <button
            type="button"
            onClick={() => setShowAiDialog(true)}
            className="btn btn-primary"
          >
            <Wand2 size={16} className="mr-2" />
            Generate with AI
          </button>
        )}
        
        {id && (
          <div className="badge badge-primary badge-outline p-3 font-semibold">
            Editing ID: {id.substring(0, 8)}...
          </div>
        )}
      </div>
    </div>
  );
}; 