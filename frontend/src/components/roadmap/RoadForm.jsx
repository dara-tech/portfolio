import React from 'react';
import { Plus, Minus, ChevronDown, ChevronUp, X, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const StepForm = ({
  step, 
  index, 
  activeStep, 
  setActiveStep, 
  handleStepChange, 
  handleRemoveStep, 
  handleAddResource, 
  handleResourceChange, 
  handleRemoveResource
}) => {
  return (
    <motion.div 
      className="mb-4 p-4 border border-primary rounded shadow-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-lg font-semibold">Step {index + 1}</h4>
        <div>
          <button
            type="button"
            onClick={() => setActiveStep(activeStep === index ? -1 : index)}
            className="text-indigo-600 mr-2 focus:outline-none"
          >
            {activeStep === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          <button
            type="button"
            onClick={() => handleRemoveStep(index)}
            className="text-red-500 focus:outline-none"
          >
            <Minus size={20} />
          </button>
        </div>
      </div>
      {activeStep === index && (
        <div className="space-y-2">
          <input
            type="text"
            value={step.name}
            onChange={(e) => handleStepChange(index, 'name', e.target.value)}
            placeholder="Step Name"
            className="w-full p-2 border rounded focus:outline-none"
            required
          />
          <textarea
            value={step.description}
            onChange={(e) => handleStepChange(index, 'description', e.target.value)}
            placeholder="Step Description"
            className="w-full p-2 border rounded focus:outline-none"
            rows="3"
            required
          />
          <div className="flex items-center space-x-2">
            <Clock size={20} className="text-gray-500" />
            <input
              type="number"
              value={step.estimatedTime || ''}
              onChange={(e) => handleStepChange(index, 'estimatedTime', e.target.value)}
              placeholder="Estimated Time (hours)"
              className="w-full p-2 border rounded focus:outline-none"
            />
          </div>
          <div>
            <h5 className="font-semibold mb-2">Resources</h5>
            {step.resources.map((resource, resourceIndex) => (
              <div key={resourceIndex} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={resource.title}
                  onChange={(e) => handleResourceChange(index, resourceIndex, 'title', e.target.value)}
                  placeholder="Resource Title"
                  className="flex-grow p-2 border rounded focus:outline-none"
                />
                <input
                  type="url"
                  value={resource.link}
                  onChange={(e) => handleResourceChange(index, resourceIndex, 'link', e.target.value)}
                  placeholder="Resource Link"
                  className="flex-grow p-2 border rounded focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveResource(index, resourceIndex)}
                  className="text-red-500 focus:outline-none"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddResource(index)}
              className="text-indigo-600 flex items-center focus:outline-none"
            >
              <Plus size={16} className="mr-1" /> Add Resource
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default StepForm;
