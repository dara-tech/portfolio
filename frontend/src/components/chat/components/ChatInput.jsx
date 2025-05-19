import React, { useState } from 'react';
import { Send, Wand2, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const ChatInput = ({ input, isLoading, inputRef, onInputChange, onSubmit, onGenerateImage }) => {
  const [isImageMode, setIsImageMode] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isImageMode) {
      onGenerateImage(input);
    } else {
      onSubmit(e);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 lg:mb-20 mb-10"
    >
      <form onSubmit={handleSubmit} className="flex flex-col max-w-3xl mx-auto">
        <div className="join w-full shadow-lg ring-primary p-4 rounded-3xl bg-base-200">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={onInputChange}
            className="input input-bordered join-item flex-grow focus:outline-none focus:border-none"
            placeholder={isImageMode ? "Describe an image to generate..." : "Type your message..."}
            disabled={isLoading}
          />
          
          <button 
            type="button" 
            className={`btn join-item ${isImageMode ? 'btn-secondary' : 'btn-ghost'}`}
            onClick={() => setIsImageMode(!isImageMode)}
            disabled={isLoading}
            title={isImageMode ? "Switch to text mode" : "Switch to image mode"}
          >
            <ImageIcon size={18} />
          </button>
          
          <button 
            type="submit" 
            className="btn btn-primary join-item"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? 
              <span className="loading loading-spinner loading-sm"></span> : 
              isImageMode ? <Wand2 size={18} /> : <Send size={18} />
            }
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ChatInput;
