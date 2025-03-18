import { Sparkles, AlertCircle, Wand2, Info, X } from 'lucide-react';

export const AiGenerationDialog = ({
  showAiDialog,
  setShowAiDialog,
  aiConfig,
  setAiConfig,
  handleAiGenerate,
  aiLoading,
  aiError
}) => {
  return (
    <dialog id="ai_generation_modal" className={`modal ${showAiDialog ? 'modal-open' : ''}`}>
      <div className="modal-box max-w-2xl relative">
        <button 
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => setShowAiDialog(false)}
        >
          <X size={18} />
        </button>

        <h3 className="font-bold text-xl flex items-center gap-3 mb-6">
          <Sparkles className="text-primary w-6 h-6" />
          AI Lesson Generator
          <div className="tooltip tooltip-right" data-tip="Let AI help create your lesson content">
            <Info size={16} className="text-base-content/60" />
          </div>
        </h3>
        
        <div className="py-4 space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-sm">What would you like to teach?</span>
            </label>
            <input
              type="text"
              value={aiConfig.topic}
              onChange={(e) => setAiConfig(prev => ({ ...prev, topic: e.target.value }))}
              className="input w-full input-bordered input-lg focus:input-primary transition-colors text-sm"
              placeholder="e.g., React Hooks, CSS Grid, JavaScript Promises..."
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-sm w-full">Select Difficulty Level</span>
            </label>
            <div className="join w-full">
              {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                <input
                  key={level}
                  type="radio"
                  name="difficulty"
                  className="join-item btn text-sm"
                  aria-label={level}
                  checked={aiConfig.difficulty === level}
                  onChange={() => setAiConfig(prev => ({ ...prev, difficulty: level }))}
                />
              ))}
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-sm">Additional Context</span>
              <span className="label-text-alt text-xs text-base-content/60">Optional</span>
            </label>
            <textarea
              value={aiConfig.context}
              onChange={(e) => setAiConfig(prev => ({ ...prev, context: e.target.value }))}
              className="textarea w-full textarea-bordered min-h-32 focus:textarea-primary transition-colors text-sm"
              placeholder="Add any specific requirements, prerequisites, or areas you'd like the lesson to focus on..."
            />
          </div>

          {aiError && (
            <div className="alert alert-error shadow-lg text-sm">
              <AlertCircle size={18} />
              <span className="font-medium">{aiError}</span>
            </div>
          )}
        </div>

        <div className="modal-action gap-3">
          <button 
            className="btn btn-ghost text-sm"
            onClick={() => setShowAiDialog(false)}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary text-sm"
            onClick={handleAiGenerate}
            disabled={!aiConfig.topic || aiLoading}
          >
            {aiLoading ? (
              <>
                <span className="loading loading-spinner loading-md"></span>
                Creating Your Lesson...
              </>
            ) : (
              <>
                <Wand2 size={20} />
                Generate Lesson
              </>
            )}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => setShowAiDialog(false)}>close</button>
      </form>
    </dialog>
  );
};