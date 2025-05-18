import React from 'react';
import { Bot, MessageCircle, Lightbulb, HelpCircle } from 'lucide-react';
import { useAdminProfile } from '../../../hooks/useAdminProfile';

const EmptyChat = () => {
  const { formData } = useAdminProfile();

  const suggestions = [
    { icon: <MessageCircle size={16} />, text: "Ask a question" },
    { icon: <Lightbulb size={16} />, text: "Get creative ideas" },
    { icon: <HelpCircle size={16} />, text: "Seek advice" }
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-gradient-to-b from-base-200 to-base-300 rounded-lg shadow-inner">
      <div className="mb-8 p-4 bg-primary/10 rounded-full">
        {formData?.profilePic ? (
          <img src={formData.profilePic} alt="Admin" className="w-20 h-20 rounded-full" />
        ) : (
          <Bot size={40} className="text-primary" />
        )}
      </div>
      <h2 className="text-2xl font-bold mb-4 text-base-content">Welcome to AI Chat</h2>
      <p className="max-w-md text-base-content/70 mb-8">I'm here to assist you with any questions or tasks you might have.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="flex items-center p-3 bg-base-100 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="mr-3 text-primary">{suggestion.icon}</div>
            <span className="text-sm font-medium">{suggestion.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmptyChat;
