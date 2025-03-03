import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Save, X } from 'lucide-react';
import { useCreateRoadMap } from '../hooks/useRoadMap';
import StepForm from '../components/roadmap/RoadForm';
import { useNavigate } from 'react-router-dom';

const RoadMapCreate = ({ onSave, onCancel }) => {
  const [roadmap, setRoadmap] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: '',
    estimatedTime: '',
    steps: [{ name: '', description: '', resources: [] }]
  });
  const [activeStep, setActiveStep] = useState(0);
  const { createRoadMap, loading, error } = useCreateRoadMap();
  const navigate = useNavigate();

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
    if (activeStep >= index) {
      setActiveStep(Math.max(0, activeStep - 1));
    }
  };

  const handleAddStep = () => {
    setRoadmap(prev => {
      const newSteps = [...prev.steps, { name: '', description: '', resources: [] }];
      return { ...prev, steps: newSteps };
    });
    setActiveStep(prev => prev + 1);
  };

  const handleAddResource = (stepIndex) => {
    setRoadmap(prev => {
      const updatedSteps = prev.steps.map((step, i) =>
        i === stepIndex
          ? { ...step, resources: [...step.resources, { title: '', link: '' }] }
          : step
      );
      return { ...prev, steps: updatedSteps };
    });
  };

  const handleResourceChange = (stepIndex, resourceIndex, field, value) => {
    setRoadmap(prev => {
      const updatedSteps = prev.steps.map((step, i) =>
        i === stepIndex
          ? {
              ...step,
              resources: step.resources.map((resource, j) =>
                j === resourceIndex ? { ...resource, [field]: value } : resource
              ),
            }
          : step
      );
      return { ...prev, steps: updatedSteps };
    });
  };

  const handleRemoveResource = (stepIndex, resourceIndex) => {
    setRoadmap(prev => {
      const updatedSteps = prev.steps.map((step, i) =>
        i === stepIndex
          ? {
              ...step,
              resources: step.resources.filter((_, j) => j !== resourceIndex),
            }
          : step
      );
      return { ...prev, steps: updatedSteps };
    });
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

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Category</span>
          </label>
          <select
            name="category"
            value={roadmap.category}
            onChange={handleInputChange}
            className="select select-bordered w-full focus:outline-none"
            required
          >
            <option value="">Select a category</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="FullStack">FullStack</option>
            <option value="DevOps">DevOps</option>
            <option value="Mobile">Mobile</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Difficulty</span>
          </label>
          <select
            name="difficulty"
            value={roadmap.difficulty}
            onChange={handleInputChange}
            className="select select-bordered w-full focus:outline-none"
            required
          >
            <option value="">Select difficulty</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Estimated Time</span>
          </label>
          <input
            type="text"
            name="estimatedTime"
            value={roadmap.estimatedTime}
            onChange={handleInputChange}
            className="input input-bordered w-full focus:outline-none"
            placeholder="e.g., 2 weeks, 3 months"
            required
          />
        </div>
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
        <h3 className="text-2xl font-semibold mb-4 ">Steps</h3>
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
