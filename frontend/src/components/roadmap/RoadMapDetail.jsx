import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, BookOpen, Link as LinkIcon, Clock, Zap, AlertCircle, Eye } from 'lucide-react';

const RoadMapDetail = ({ roadMap }) => {
  if (!roadMap) {
    return <div className="flex justify-center items-center h-screen text-base-content/60">Initializing roadmap...</div>;
  }

  return (
    <div className="container mx-auto bg-base-100 py-24 px-4">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4 text-base-content">{roadMap.title}</h1>
        <p className="text-xl text-base-content/70 max-w-2xl mx-auto">{roadMap.description}</p>
      </motion.header>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-between mb-12"
      >
        <div className="text-center">
          <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
          <div className="text-sm text-base-content/60">Estimated Time</div>
          <div className="font-semibold">{roadMap.estimatedTime || "N/A"}</div>
        </div>
        <div className="text-center">
          <AlertCircle className="w-6 h-6 mx-auto mb-2 text-warning" />
          <div className="text-sm text-base-content/60">Difficulty</div>
          <div className="font-semibold">{roadMap.difficulty || "N/A"}</div>
        </div>
        <div className="text-center">
          <Eye className="w-6 h-6 mx-auto mb-2 text-info" />
          <div className="text-sm text-base-content/60">Views</div>
          <div className="font-semibold">{roadMap.views || 0}</div>
        </div>
      </motion.div>

      <div className="space-y-8">
        {roadMap.steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex"
          >
            <div className="flex-shrink-0 mr-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-content font-bold">
                {index + 1}
              </div>
            </div>
            <div className="flex-grow pb-8 border-l-2 border-primary/20 pl-6">
              <h2 className="text-2xl font-semibold text-base-content mb-2">{step.name}</h2>
              <p className="text-base-content/70 mb-4">{step.description}</p>
              <div className="text-sm text-base-content/50 mb-4">
                <Clock className="w-4 h-4 inline mr-1" />
                Estimated time: {step.estimatedTime ?? "Not specified"}
              </div>
              {step?.resources && step?.resources?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-base-content mb-2 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-primary" />
                    Learning Resources
                  </h3>
                  <ul className="space-y-2">
                    {step.resources.map((resource, resourceIndex) => (
                      <li key={resourceIndex} className="bg-base-200 p-2 rounded">
                        <a 
                          href={resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="link link-primary flex items-center justify-between"
                        >
                          <span>{resource.title}</span>
                          <LinkIcon className="w-4 h-4" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-16 text-center"
      >
        <p className="text-base-content/70 mb-6 text-xl">Ready to start your journey?</p>
        <button className="btn btn-primary btn-lg gap-2">
          <Zap className="w-5 h-5" />
          Begin Learning
          <ChevronRight className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
};

export default RoadMapDetail;
