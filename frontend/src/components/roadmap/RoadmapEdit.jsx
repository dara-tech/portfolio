import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, X, Save, ChevronUp, ChevronDown, Link as LinkIcon } from "lucide-react";

const RoadmapEdit = ({ roadmap, onSave, onCancel }) => {
  const [editedRoadmap, setEditedRoadmap] = useState(roadmap);
  const [errors, setErrors] = useState({});
  const [expandedStep, setExpandedStep] = useState(null);

  useEffect(() => {
    validateRoadmap(editedRoadmap);
  }, [editedRoadmap]);

  const validateRoadmap = (roadmap) => {
    const newErrors = {};
    if (!roadmap.title.trim()) newErrors.title = "Title is required";
    if (!roadmap.description.trim()) newErrors.description = "Description is required";
    if (roadmap.steps.length === 0) newErrors.steps = "At least one step is required";
    roadmap.steps.forEach((step, index) => {
      if (!step.name.trim()) newErrors[`step_${index}_name`] = "Step name is required";
      if (!step.description.trim()) newErrors[`step_${index}_description`] = "Step description is required";
      step.resources.forEach((resource, resourceIndex) => {
        if (!resource.title.trim()) newErrors[`step_${index}_resource_${resourceIndex}_title`] = "Resource title is required";
        if (!resource.url.trim()) newErrors[`step_${index}_resource_${resourceIndex}_url`] = "Resource URL is required";
        if (resource.url.trim() && !isValidUrl(resource.url)) newErrors[`step_${index}_resource_${resourceIndex}_url`] = "Invalid URL format";
      });
    });
    setErrors(newErrors);
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedRoadmap((prev) => ({ ...prev, [name]: value }));
  };

  const handleStepChange = (index, field, value) => {
    setEditedRoadmap((prev) => {
      const updatedSteps = [...prev.steps];
      updatedSteps[index] = { ...updatedSteps[index], [field]: value };
      return { ...prev, steps: updatedSteps };
    });
  };

  const handleAddStep = () => {
    setEditedRoadmap((prev) => ({
      ...prev,
      steps: [...prev.steps, { name: "", description: "", resources: [] }]
    }));
    setExpandedStep(editedRoadmap.steps.length);
  };

  const handleRemoveStep = (index) => {
    setEditedRoadmap((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
    if (expandedStep === index) setExpandedStep(null);
  };

  const handleMoveStep = (index, direction) => {
    setEditedRoadmap((prev) => {
      const newSteps = [...prev.steps];
      const step = newSteps[index];
      newSteps.splice(index, 1);
      newSteps.splice(index + direction, 0, step);
      return { ...prev, steps: newSteps };
    });
    setExpandedStep(index + direction);
  };

  const handleAddResource = (stepIndex) => {
    setEditedRoadmap((prev) => {
      const updatedSteps = [...prev.steps];
      updatedSteps[stepIndex].resources.push({ title: "", url: "", type: "article" });
      return { ...prev, steps: updatedSteps };
    });
  };

  const handleResourceChange = (stepIndex, resourceIndex, field, value) => {
    setEditedRoadmap((prev) => {
      const updatedSteps = [...prev.steps];
      updatedSteps[stepIndex].resources[resourceIndex][field] = value;
      return { ...prev, steps: updatedSteps };
    });
  };

  const handleRemoveResource = (stepIndex, resourceIndex) => {
    setEditedRoadmap((prev) => {
      const updatedSteps = [...prev.steps];
      updatedSteps[stepIndex].resources = updatedSteps[stepIndex].resources.filter((_, i) => i !== resourceIndex);
      return { ...prev, steps: updatedSteps };
    });
  };

  const handleSubmit = () => {
    if (Object.keys(errors).length === 0) {
      onSave(editedRoadmap);
    } else {
      alert("Please fix the errors before saving.");
    }
  };

  const toggleStepExpansion = (index) => {
    setExpandedStep(expandedStep === index ? null : index);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="card space-y-4"
    >
      <input
        type="text"
        name="title"
        value={editedRoadmap.title}
        onChange={handleInputChange}
        className={`input input-bordered w-full ${errors.title ? 'input-error' : ''}`}
        placeholder="Roadmap Title"
      />
      {errors.title && <p className="text-error text-sm">{errors.title}</p>}
      <textarea
        name="description"
        value={editedRoadmap.description}
        onChange={handleInputChange}
        className={`textarea textarea-bordered w-full ${errors.description ? 'textarea-error' : ''}`}
        placeholder="Roadmap Description"
      />
      {errors.description && <p className="text-error text-sm">{errors.description}</p>}
      <AnimatePresence>
        {editedRoadmap.steps.map((step, stepIndex) => (
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card bg-base-200"
          >
            <div 
              className="card-title p-4 cursor-pointer"
              onClick={() => toggleStepExpansion(stepIndex)}
            >
              <h3 className="flex-grow">Step {stepIndex + 1}: {step.name}</h3>
              <div className="flex space-x-2">
                <button className="btn btn-square btn-sm" onClick={(e) => { e.stopPropagation(); handleMoveStep(stepIndex, -1); }} disabled={stepIndex === 0}><ChevronUp size={20} /></button>
                <button className="btn btn-square btn-sm" onClick={(e) => { e.stopPropagation(); handleMoveStep(stepIndex, 1); }} disabled={stepIndex === editedRoadmap.steps.length - 1}><ChevronDown size={20} /></button>
                <button className="btn btn-square btn-sm btn-error" onClick={(e) => { e.stopPropagation(); handleRemoveStep(stepIndex); }}><X size={20} /></button>
              </div>
            </div>
            {expandedStep === stepIndex && (
              <div className="card-body p-4">
                <input
                  type="text"
                  value={step.name}
                  onChange={(e) => handleStepChange(stepIndex, 'name', e.target.value)}
                  className={`input input-bordered w-full ${errors[`step_${stepIndex}_name`] ? 'input-error' : ''}`}
                  placeholder="Step Name"
                />
                {errors[`step_${stepIndex}_name`] && <p className="text-error text-sm">{errors[`step_${stepIndex}_name`]}</p>}
                <textarea
                  value={step.description}
                  onChange={(e) => handleStepChange(stepIndex, 'description', e.target.value)}
                  className={`textarea textarea-bordered w-full ${errors[`step_${stepIndex}_description`] ? 'textarea-error' : ''}`}
                  placeholder="Step Description"
                />
                {errors[`step_${stepIndex}_description`] && <p className="text-error text-sm">{errors[`step_${stepIndex}_description`]}</p>}
                <div className="space-y-2">
                  <h4 className="font-medium">Resources</h4>
                  {step.resources.map((resource, resourceIndex) => (
                    <div key={resourceIndex} className="card bg-base-100 shadow-sm">
                      <div className="card-body p-4 space-y-2">
                        <input
                          type="text"
                          value={resource.title}
                          onChange={(e) => handleResourceChange(stepIndex, resourceIndex, 'title', e.target.value)}
                          className={`input input-bordered w-full ${errors[`step_${stepIndex}_resource_${resourceIndex}_title`] ? 'input-error' : ''}`}
                          placeholder="Resource Title"
                        />
                        {errors[`step_${stepIndex}_resource_${resourceIndex}_title`] && <p className="text-error text-sm">{errors[`step_${stepIndex}_resource_${resourceIndex}_title`]}</p>}
                        <div className="flex items-center space-x-2">
                          <LinkIcon size={20} className="text-base-content" />
                          <input
                            type="text"
                            value={resource.url}
                            onChange={(e) => handleResourceChange(stepIndex, resourceIndex, 'url', e.target.value)}
                            className={`input input-bordered flex-grow ${errors[`step_${stepIndex}_resource_${resourceIndex}_url`] ? 'input-error' : ''}`}
                            placeholder="Resource URL"
                          />
                        </div>
                        {errors[`step_${stepIndex}_resource_${resourceIndex}_url`] && <p className="text-error text-sm">{errors[`step_${stepIndex}_resource_${resourceIndex}_url`]}</p>}
                        <select
                          value={resource.type}
                          onChange={(e) => handleResourceChange(stepIndex, resourceIndex, 'type', e.target.value)}
                          className="select select-bordered w-full"
                        >
                          <option value="article">Article</option>
                          <option value="video">Video</option>
                          <option value="course">Course</option>
                          <option value="book">Book</option>
                          <option value="tool">Tool</option>
                        </select>
                        <button onClick={() => handleRemoveResource(stepIndex, resourceIndex)} className="btn btn-sm btn-error self-end"><Minus size={20} /></button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => handleAddResource(stepIndex)} className="btn btn-sm btn-success">
                    <Plus size={20} />
                    Add Resource
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
      <button onClick={handleAddStep} className="btn btn-primary btn-sm">
        <Plus size={20} />
        Add Step
      </button>
      <div className="flex justify-end space-x-2">
        <button onClick={onCancel} className="btn btn-ghost btn-sm">Cancel</button>
        <button onClick={handleSubmit} className="btn btn-primary btn-sm">
          <Save size={20} />
          Save
        </button>
      </div>
    </motion.div>
  );
};

export default RoadmapEdit;
