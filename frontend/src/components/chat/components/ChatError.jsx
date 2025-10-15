import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const ChatError = ({ error, onRetry, isLoading }) => {
  if (!error) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex justify-start mb-6"
    >
      <div className="max-w-[80%]">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-red-500/30 text-red-400 flex items-center justify-center backdrop-blur-sm shadow-lg border border-red-500/30">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="bg-red-500/20 text-red-400 border border-red-500/30 backdrop-blur-xl p-6 rounded-3xl shadow-xl relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-red-500/10 before:to-transparent before:rounded-3xl before:pointer-events-none">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium">{error}</span>
              <motion.button 
                onClick={onRetry} 
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm text-red-400 rounded-2xl border border-red-500/30 hover:border-red-500/40 transition-all duration-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Retrying...' : 'Try Again'}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatError;
