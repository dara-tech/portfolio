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
    <div className="flex flex-col items-center justify-center h-full p-6 space-y-8 bg-gradient-to-b from-base-200 to-base-300">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="p-4 bg-primary/20 rounded-full shadow-lg"
      >
        {formData?.profilePic ? (
          <img src={formData.profilePic} alt="Admin" className="w-20 h-20 rounded-full" />
        ) : (
          <Bot size={40} className="text-primary" />
        )}
      </motion.div>
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Welcome to AI Chat</h2>
        <p className="text-base text-base-content/70 max-w-md">
          Your intelligent assistant is ready to help. What would you like to explore today?
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex flex-col items-center justify-center p-4 bg-base-100 rounded-lg shadow-md hover:shadow-lg transition-all ${suggestion.color}`}
          >
            {suggestion.icon}
            <span className="mt-2 text-sm font-medium">{suggestion.text}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default EmptyChat;
