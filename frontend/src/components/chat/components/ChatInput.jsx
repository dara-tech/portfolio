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
      className="p-4 border-t border-white/30 relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:to-transparent before:pointer-events-none"
    >
      <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div 
            key={isImageMode ? 'image' : 'text'}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-4"
          >
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={onInputChange}
                className={`w-full h-12 px-6 pr-16 bg-white/10 backdrop-blur-xl text-white placeholder-white/60 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 resize-none shadow-xl transition-all duration-300 ${isLoading ? 'opacity-50' : ''}`}
                placeholder={isImageMode ? "Describe an image..." : "Type your message..."}
                disabled={isLoading}
              />
              
              {/* Send Button */}
              <motion.button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/20 hover:bg-white/30 backdrop-blur-xl text-white rounded-xl border border-white/30 hover:border-white/40 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : isImageMode ? (
                  <Wand2 size={16} />
                ) : (
                  <Send size={16} />
                )}
              </motion.button>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <motion.button 
                type="button" 
                className={`w-12 h-12 ${isImageMode ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-white/10 text-white hover:bg-white/20 border-white/20'} backdrop-blur-xl rounded-2xl border flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl`}
                onClick={() => setIsImageMode(!isImageMode)}
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={isImageMode ? "Switch to text mode" : "Switch to image mode"}
              >
                <ImageIcon size={20} />
              </motion.button>
              
              <motion.button
                type="button"
                onClick={() => onInputChange({ target: { value: '' } })}
                className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white rounded-2xl border border-white/20 hover:border-white/30 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Clear Input"
              >
                ×
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </form>
    </motion.div>
  );
};

export default ChatInput;
