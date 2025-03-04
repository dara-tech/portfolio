import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, BookOpen, Code, Link as LinkIcon, Clock } from 'lucide-react';

const RoadMapDetail = ({ roadMap }) => {
  if (!roadMap) {
    return <div className="flex justify-center items-center h-screen text-base-content">Loading roadmap...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 py-20">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-6 text-center text-primary"
      >
        {roadMap.title}
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl text-base-content mb-12 text-center"
      >
        {roadMap.description}
      </motion.p>
      
      <div className="space-y-12">
        {roadMap.steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-base-100 rounded-lg border border-base-content/10 overflow-hidden"
          >
            <div className="bg-primary-content p-6">
              <h2 className="text-2xl font-semibold text-primary flex items-center">
                <span className="bg-primary text-primary-content rounded-full w-8 h-8 flex items-center justify-center mr-4 text-sm font-bold">
                  {index + 1}
                </span>
                {step.name}
              </h2>
            </div>
            <div className="p-6">
              <p className="text-base-content mb-6">{step.description}</p>
              <div className="flex items-center text-base-content mb-6">
                <Clock className="w-5 h-5 mr-2" />
                <span>Estimated time: {step.estimatedTime ?? "Not specified"}</span>
       
              </div>
              {step?.resources && step?.resources?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-primary mb-4 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Learning Resources
                  </h3>
                  <ul className="space-y-3">
                    {step.resources.map((resource, resourceIndex) => (
                      <motion.li 
                        key={resourceIndex}
                        whileHover={{ scale: 1.03 }}
                        className="flex items-center bg-base-200 p-3 rounded-md"
                      >
                        <ChevronRight className="w-5 h-5 text-primary mr-2" />
                        <a 
                          href={resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-primary hover:text-primary-focus flex items-center"
                        >
                          <span className="mr-2">{resource.title}</span>
                          <LinkIcon className="w-4 h-4" />
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center"
      >
        <p className="text-base-content mb-4">Ready to start your journey?</p>
        <button className="btn btn-primary">
          <Code className="w-5 h-5 mr-2" />
          Start Coding
        </button>
      </motion.div>
    </div>
  );
};

export default RoadMapDetail;
