import React, { useState } from 'react';
import { Send, Wand2, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatInput = ({ input, isLoading, inputRef, onInputChange, onSubmit, onGenerateImage }) => {
  const [isImageMode, setIsImageMode] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    isImageMode ? onGenerateImage(input) : onSubmit(e);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 lg:mb-20 mb-10"
    >
      <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div 
            key={isImageMode ? 'image' : 'text'}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="join w-full border-b-2 border-primary p-1 gap-2 backdrop-blur-sm"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={onInputChange}
              className={`input join-item flex-grow focus:shadow-none border-none focus:outline-none px-4 ${isLoading ? 'bg-base-300' : 'bg-transparent'}`}
              placeholder={isImageMode ? "Describe an image..." : "Type your message..."}
              disabled={isLoading}
            />
            <motion.button 
              type="button" 
              className={`btn btn-circle btn-sm join-item ${isImageMode ? 'btn-secondary' : 'btn-ghost'}`}
              onClick={() => setIsImageMode(!isImageMode)}
              disabled={isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ImageIcon size={16} />
            </motion.button>
            <motion.button 
              type="submit" 
              className="btn btn-circle btn-primary btn-sm join-item"
              disabled={isLoading || !input.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLoading ? 
                <span className="loading loading-spinner loading-xs"></span> : 
                isImageMode ? <Wand2 size={16} /> : <Send size={16} />
              }
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </form>
    </motion.div>
  );
};

export default ChatInput;
