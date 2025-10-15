import React from 'react';
import { Bot, MessageCircle, Lightbulb, HelpCircle, Zap } from 'lucide-react';
import { useAdminProfile } from '../../../hooks/useAdminProfile';
import { motion } from 'framer-motion';

const EmptyChat = () => {
  const { formData } = useAdminProfile();

  const suggestions = [
    { icon: <MessageCircle size={18} />, text: "Ask", color: "text-blue-500" },
    { icon: <Lightbulb size={18} />, text: "Create", color: "text-yellow-500" },
    { icon: <HelpCircle size={18} />, text: "Help", color: "text-green-500" },
    { icon: <Zap size={18} />, text: "Innovate", color: "text-purple-500" }
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full p-12 space-y-8">
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
        className="relative"
      >
        <div className="w-32 h-32 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-3xl flex items-center justify-center shadow-2xl border border-white/30 backdrop-blur-xl relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:rounded-3xl before:pointer-events-none">
          {formData?.profilePic ? (
            <img src={formData.profilePic} alt="Admin" className="w-20 h-20 rounded-2xl object-cover" />
          ) : (
            <Bot size={56} className="text-white drop-shadow-lg" />
          )}
        </div>
        <div className="absolute -top-3 -right-3 w-10 h-10 bg-green-500/30 rounded-full flex items-center justify-center border border-green-500/40 backdrop-blur-sm shadow-lg">
          <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <h2 className="text-5xl font-bold text-white mb-6 drop-shadow-sm">Welcome to AI Assistant</h2>
        <p className="text-xl text-white/80 max-w-2xl leading-relaxed">
          Your intelligent companion is ready to help with coding, creative tasks, problem-solving, and much more. 
          What would you like to explore today?
        </p>
      </motion.div>
     
       
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center"
      >
   
     
      </motion.div>
    </div>
  );
};

export default EmptyChat;
