import { ArrowLeft, Wand2 } from 'lucide-react';

export const FormHeader = ({ id, navigate, setShowAiDialog }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 py-10">
      <div className="flex items-center">
        <button 
          onClick={() => navigate('/admin/lessons')}
          className="w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 hover:border-white/30 transition-all duration-300 flex items-center justify-center mr-4"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {id ? 'Edit Lesson' : 'Create New Lesson'}
          </h1>
          <p className="text-white/70 mt-2 text-lg">
            {id ? 'Update your existing lesson content' : 'Create a new educational lesson'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {!id && ( // Only show AI generation for new lessons
          <button
            type="button"
            onClick={() => setShowAiDialog(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 text-white rounded-xl border border-purple-500/30 hover:border-purple-500/40 transition-all duration-300 flex items-center gap-2 font-medium"
          >
            <Wand2 size={16} />
            Generate with AI
          </button>
        )}
        
        {id && (
          <div className="px-4 py-3 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30 font-semibold">
            Editing ID: {id.substring(0, 8)}...
          </div>
        )}
      </div>
    </div>
  );
}; 