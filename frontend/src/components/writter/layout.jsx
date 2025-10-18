import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Editor from './Editor';

const WriterLayout = ({ children, content, onEditorChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      <div className="py-10 px-4">
        <div className="max-w-7xl mx-auto">
        
            <Editor
              initialValue={content}
              onChange={onEditorChange}
              className="bg-white/5  rounded-xl border border-white/10 p-6 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-300"
            />
            {/* Render the children below the editor */}
            <div className="mt-6">
              {children}
            </div>
          </div>
        </div>
   
    </motion.div>
  );
};

export default WriterLayout;
