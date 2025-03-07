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
      <div className="py-10">
        <Editor
          initialValue={content}
          onChange={onEditorChange}
          className="editor-class" // Ensure you have styling for 'editor-class'
        />
        {/* Render the children below the editor */}
        {children}
      </div>
    </motion.div>
  );
};

export default WriterLayout;
