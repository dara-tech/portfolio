import React, { useState, useEffect } from 'react';
import { Bot, Trash2, RefreshCw, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminProfile } from '../../../hooks/useAdminProfile';

const ChatHeader = ({ onClear, onRetry, isLoading, hasMessages }) => {
  const [showInfo, setShowInfo] = useState(false);
  const { formData } = useAdminProfile();

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
      className="py-4 px-6 border-b border-white/30 flex items-center justify-between relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:via-white/5 before:to-transparent before:pointer-events-none after:absolute after:inset-0 after:bg-gradient-to-b after:from-transparent after:to-white/5 after:pointer-events-none"
    >
      <div className="flex items-center gap-4 relative z-10">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500/30 to-purple-500/30 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:rounded-2xl before:pointer-events-none">
          {formData?.profilePic ? (
            <img 
              src={formData.profilePic} 
              alt="Admin" 
              className="w-8 h-8 rounded-xl object-cover" 
            />
          ) : (
            <Bot size={24} className="text-white drop-shadow-lg" />
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white drop-shadow-sm">AI Assistant</h2>
          <p className="text-sm text-white/70 drop-shadow-sm">Ready to help you with anything</p>
        </div>
      </div>
      <div className="flex gap-3 relative z-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowInfo(prev => !prev)}
          className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white rounded-2xl border border-white/20 flex items-center justify-center transition-all duration-300 shadow-xl hover:shadow-2xl"
          title="Info"
        >
          <Info size={20} className="text-white" />
        </motion.button>
        {hasMessages && (
          <>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClear} 
              className="w-12 h-12 bg-red-500/10 hover:bg-red-500/20 backdrop-blur-xl text-red-400 rounded-2xl border border-red-500/20 flex items-center justify-center transition-all duration-300 shadow-xl hover:shadow-2xl"
              title="Clear Chat"
              disabled={isLoading}
            >
              <Trash2 size={20} />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRetry} 
              className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white rounded-2xl border border-white/20 flex items-center justify-center transition-all duration-300 shadow-xl hover:shadow-2xl"
              title="Retry Last Message"
              disabled={isLoading}
            >
              <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
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
            className="absolute top-full left-0 mt-2 p-4 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-10 max-w-xs"
          >
            <p className="text-sm text-white/90">This is an AI-powered chat assistant.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default React.memo(ChatHeader);
