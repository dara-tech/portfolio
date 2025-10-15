import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Save, X, Loader } from 'lucide-react';
import { useCreateRoadMap } from '../hooks/useRoadMap';
import StepForm from '../components/roadmap/RoadForm';
import { useNavigate } from 'react-router-dom';
import { generateRoadMap } from '../components/Ai/ModelRoadMap';

const RoadMapCreate = ({ onSave, onCancel }) => {
  const [roadmap, setRoadmap] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: '',
    estimatedTime: '',
    steps: [{ name: '', description: '', resources: [], estimatedTime: '' }]
  });
  const [activeStep, setActiveStep] = useState(0);
  const { createRoadMap, loading, error } = useCreateRoadMap();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRoadmap(prev => ({ ...prev, [name]: value }));
  };

  const handleStepChange = (index, field, value) => {
    setRoadmap(prev => {
      const updatedSteps = [...prev.steps];
      updatedSteps[index] = { ...updatedSteps[index], [field]: value };
      return { ...prev, steps: updatedSteps };
    });
  };

  const handleRemoveStep = (index) => {
    setRoadmap(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
    setActiveStep(prev => (prev >= index ? Math.max(0, prev - 1) : prev));
  };

  const handleAddStep = () => {
    setRoadmap(prev => ({
      ...prev,
      steps: [...prev.steps, { 
        name: '', 
        description: '', 
        resources: [],
        estimatedTime: '' // Add this field
      }]
    }));
    setActiveStep(prev => prev + 1);
  };

  const handleAddResource = (stepIndex) => {
    setRoadmap(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) =>
        i === stepIndex
          ? { ...step, resources: [...step.resources, { title: '', url: '' }] }
          : step
      )
    }));
  };

  const handleResourceChange = (stepIndex, resourceIndex, field, value) => {
    setRoadmap(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) =>
        i === stepIndex
          ? {
              ...step,
              resources: step.resources.map((resource, j) =>
                j === resourceIndex ? { ...resource, [field]: value } : resource
              ),
            }
          : step
      )
    }));
  };

  const handleRemoveResource = (stepIndex, resourceIndex) => {
    setRoadmap(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) =>
        i === stepIndex
          ? {
              ...step,
              resources: step.resources.filter((_, j) => j !== resourceIndex),
            }
          : step
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const createdRoadmap = await createRoadMap(roadmap);
      onSave(createdRoadmap);
      navigate('/roadmap');
    } catch (err) {
      console.error('Failed to create roadmap:', err);
    }
  };

  const handleGenerateRoadmap = async () => {
    if (!roadmap.title) {
      alert("Please enter a title before generating a roadmap.");
      return;
    }
  
    setIsGenerating(true);
    setGenerationError(null);
    try {
      const generatedRoadmap = await generateRoadMap(roadmap.title, roadmap.description);
      console.log("Generated Roadmap:", generatedRoadmap);
  
      if (!generatedRoadmap || typeof generatedRoadmap !== "object") {
        throw new Error("Invalid roadmap format from AI.");
      }
  
      if (!Array.isArray(generatedRoadmap.steps)) {
        throw new Error("Generated roadmap steps are not in an array format.");
      }
  
      // Validate and transform the response
      const transformedSteps = generatedRoadmap.steps.map(step => {
        // Ensure resources is always an array
        const resources = Array.isArray(step.resources) ? step.resources : [];
        
        return {
          name: step.name || "Untitled Step",
          description: step.description || "No description provided",
          estimatedTime: step.estimatedTime || "Not specified",
          resources: resources.map(res => ({
            title: res.title || "Untitled Resource",
            url: res.url && res.url.startsWith('http') ? res.url : "#",
          })),
        };
      });
  
      setRoadmap(prev => ({
        ...prev,
        title: generatedRoadmap.title || prev.title,
        description: generatedRoadmap.description || prev.description,
        category: generatedRoadmap.category || prev.category || "",
        difficulty: generatedRoadmap.difficulty || prev.difficulty || "",
        estimatedTime: generatedRoadmap.estimatedTime || prev.estimatedTime || "",
        steps: transformedSteps,
      }));
  
    } catch (err) {
      console.error("Failed to generate roadmap:", err);
      setGenerationError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };
  

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-2">Create New Roadmap</h2>
            <p className="text-white/70">Build a comprehensive learning path</p>
          </div>
      
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block">
                <span className="text-lg font-semibold text-white">Title</span>
              </label>
              <input
                type="text"
                name="title"
                value={roadmap.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40"
                placeholder="Enter roadmap title"
                required
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleGenerateRoadmap}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 text-white px-6 py-3 rounded-xl border border-purple-500/30 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? <Loader className="animate-spin w-4 h-4" /> : null}
                {isGenerating ? 'Generating...' : 'Generate with AI'}
              </button>
            </div>
            {['category', 'difficulty', 'estimatedTime'].map((field) => (
              <div key={field} className="space-y-2">
                <label className="block">
                  <span className="text-lg font-semibold text-white">{field.charAt(0).toUpperCase() + field.slice(1)}</span>
                </label>
                {field === 'category' || field === 'difficulty' ? (
                  <select
                    name={field}
                    value={roadmap[field]}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 appearance-none pr-10"
                    required
                  >
                    <option value="" className="bg-gray-800 text-white">Select {field}</option>
                    {field === 'category' 
                      ? ['Frontend', 'Backend', 'FullStack', 'DevOps', 'Mobile', 'Other'].map(opt => (
                          <option key={opt} value={opt} className="bg-gray-800 text-white">{opt}</option>
                        ))
                      : ['Beginner', 'Intermediate', 'Advanced'].map(opt => (
                          <option key={opt} value={opt} className="bg-gray-800 text-white">{opt}</option>
                        ))
                    }
                  </select>
                ) : (
                  <input
                    type="text"
                    name={field}
                    value={roadmap[field]}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40"
                    placeholder={field === 'estimatedTime' ? "e.g., 2 weeks, 3 months" : ""}
                    required
                  />
                )}
              </div>
            ))}
          </div>

          <div className="space-y-2 mt-6">
            <label className="block">
              <span className="text-lg font-semibold text-white">Description</span>
            </label>
            <textarea
              name="description"
              value={roadmap.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 h-24 resize-none"
              placeholder="Describe the learning roadmap"
              required
            />
          </div>

          <div className="mt-8">
            <h3 className="text-2xl font-bold text-white mb-6">Learning Steps</h3>
            {roadmap.steps.map((step, index) => (
              <StepForm
                key={index}
                step={step}
                index={index}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                handleStepChange={handleStepChange}
                handleRemoveStep={handleRemoveStep}
                handleAddResource={handleAddResource}
                handleResourceChange={handleResourceChange}
                handleRemoveResource={handleRemoveResource}
              />
            ))}
            <button
              type="button"
              onClick={handleAddStep}
              className="w-full bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-300 flex items-center justify-center gap-2 mt-4"
            >
              <Plus size={20} />
              Add Step
            </button>
          </div>

          {error && (
            <div className="bg-red-500/20 backdrop-blur-sm text-red-400 px-6 py-4 rounded-xl border border-red-500/30 mt-6">
              <p>{error}</p>
            </div>
          )}
          {generationError && (
            <div className="bg-red-500/20 backdrop-blur-sm text-red-400 px-6 py-4 rounded-xl border border-red-500/30 mt-6">
              <p>{generationError}</p>
            </div>
          )}

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onCancel}
              className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
            >
              <X size={20} />
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={20} />
              {loading ? 'Saving...' : 'Save Roadmap'}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default RoadMapCreate;
