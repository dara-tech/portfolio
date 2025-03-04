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
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onSubmit={handleSubmit}
      className="card max-w-3xl mx-auto p-6 py-24 min-h-screen"
    >
      <h2 className="card-title text-3xl mb-6 text-center text-primary">Create New Roadmap</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Title</span>
          </label>
          <input
            type="text"
            name="title"
            value={roadmap.title}
            onChange={handleInputChange}
            className="input input-bordered w-full focus:outline-none"
            required
          />
        </div>
        <div className="form-control flex items-end">
          <button
            type="button"
            onClick={handleGenerateRoadmap}
            disabled={isGenerating}
            className="btn btn-secondary focus:outline-none w-full"
          >
            {isGenerating ? <Loader className="animate-spin mr-2" /> : null}
            {isGenerating ? 'Generating...' : 'Generate with AI'}
          </button>
        </div>
        {['category', 'difficulty', 'estimatedTime'].map((field) => (
          <div key={field} className="form-control">
            <label className="label">
              <span className="label-text font-semibold">{field.charAt(0).toUpperCase() + field.slice(1)}</span>
            </label>
            {field === 'category' || field === 'difficulty' ? (
              <select
                name={field}
                value={roadmap[field]}
                onChange={handleInputChange}
                className="select select-bordered w-full focus:outline-none"
                required
              >
                <option value="">Select {field}</option>
                {field === 'category' 
                  ? ['Frontend', 'Backend', 'FullStack', 'DevOps', 'Mobile', 'Other'].map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))
                  : ['Beginner', 'Intermediate', 'Advanced'].map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))
                }
              </select>
            ) : (
              <input
                type="text"
                name={field}
                value={roadmap[field]}
                onChange={handleInputChange}
                className="input input-bordered w-full focus:outline-none"
                placeholder={field === 'estimatedTime' ? "e.g., 2 weeks, 3 months" : ""}
                required
              />
            )}
          </div>
        ))}
      </div>

      <div className="form-control mt-4">
        <label className="label">
          <span className="label-text font-semibold">Description</span>
        </label>
        <textarea
          name="description"
          value={roadmap.description}
          onChange={handleInputChange}
          className="textarea textarea-bordered h-24 focus:outline-none w-full"
          required
        />
      </div>

      <div className="mt-6">
        <h3 className="text-2xl font-semibold mb-4">Steps</h3>
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
          className="btn btn-primary mt-4 focus:outline-none"
        >
          <Plus size={20} className="mr-2" /> Add Step
        </button>
      </div>

      {error && <div className="alert alert-error mt-4">{error}</div>}
      {generationError && <div className="alert alert-error mt-4">{generationError}</div>}

      <div className="card-actions justify-end mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-ghost focus:outline-none"
        >
          <X size={20} className="mr-2" /> Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary focus:outline-none"
        >
          <Save size={20} className="mr-2" /> {loading ? 'Saving...' : 'Save Roadmap'}
        </button>
      </div>
    </motion.form>
  );
};

export default RoadMapCreate;
