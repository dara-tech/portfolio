import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, CheckCircle } from 'lucide-react';

const RoadMap = ({ roadMap }) => {
  if (!roadMap || !roadMap.steps) {
    return <div className="flex justify-center items-center h-40 text-gray-500">Loading roadmap...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white shadow-xl rounded-2xl">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-800">{roadMap.title}</h1>
      <p className="text-lg text-gray-600 mb-8 text-center">{roadMap.description}</p>
      
      <div className="space-y-10">
        {roadMap.steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-100 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-900">
              <span className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4 text-lg font-bold">
                {index + 1}
              </span>
              {step.name}
            </h2>
            <p className="text-gray-700 mb-4">{step.description}</p>
            {step.resources && step.resources.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Resources:</h3>
                <ul className="list-none space-y-2">
                  {step.resources.map((resource, resourceIndex) => (
                    <li key={resourceIndex} className="flex items-center">
                      <ChevronRight className="w-5 h-5 text-blue-500 mr-2" />
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:underline"
                      >
                        {resource.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      <div className="mt-12 text-center bg-gray-200 p-6 rounded-xl shadow-md">
        <p className="text-lg font-semibold text-gray-800 flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
          Difficulty: {roadMap.difficulty}
        </p>
        <p className="text-gray-700">Estimated Time: {roadMap.estimatedTime}</p>
        <p className="text-gray-700">Category: {roadMap.category}</p>
      </div>
    </div>
  );
};

export default RoadMap;
