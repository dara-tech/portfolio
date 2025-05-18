import React, { useState, useEffect } from 'react';
import { Bot, Trash2, RefreshCw, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatHeader = ({ onClear, onRetry, isLoading, hasMessages }) => {
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        setShowInfo(false);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 bg-base-200/80 backdrop-blur-sm border-b border-base-300 flex items-center justify-between shadow-sm relative"
    >
      <h2 className="text-lg font-semibold flex items-center">
        <Bot size={20} className="mr-2 text-primary" />
        Chat Assistant
      </h2>
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowInfo(prev => !prev)}
          className="btn btn-sm btn-ghost tooltip tooltip-left"
          data-tip="Info"
        >
          <Info size={18} className="text-info" />
        </motion.button>
        {hasMessages && (
          <>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClear} 
              className="btn btn-sm btn-ghost tooltip tooltip-left" 
              data-tip="Clear Chat"
              disabled={isLoading}
            >
              <Trash2 size={18} className="text-error" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onRetry} 
              className="btn btn-sm btn-ghost tooltip tooltip-left" 
              data-tip="Retry Last Message"
              disabled={isLoading}
            >
              <RefreshCw size={18} className={`text-primary ${isLoading ? 'animate-spin' : ''}`} />
            </motion.button>
          </>
        )}
      </div>
      
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 mt-2 p-4 bg-base-100 rounded-lg shadow-lg z-10 max-w-xs"
          >
            <p className="text-sm">This is an AI-powered chat assistant.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default React.memo(ChatHeader);
