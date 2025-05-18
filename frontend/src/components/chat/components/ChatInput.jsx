import React from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';

const ChatInput = ({ input, isLoading, inputRef, onInputChange, onSubmit }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 lg:mb-20 mb-10"
    >
      <form onSubmit={onSubmit} className="flex flex-col max-w-3xl mx-auto">
        <div className="join w-full shadow-lg ring-primary p-4 rounded-3xl bg-base-200">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={onInputChange}
            className="input input-bordered join-item flex-grow focus:outline-none focus:border-none"
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="btn btn-primary join-item"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? 
              <span className="loading loading-spinner loading-sm"></span> : 
              <Send size={18} />
            }
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ChatInput;
