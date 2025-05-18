import React from 'react';

const ChatError = ({ error, onRetry, isLoading }) => {
  if (!error) return null;
  
  return (
    <div className="chat chat-start">
      <div className="chat-bubble bg-error/20 text-error border border-error/30">
        <div className="flex items-center">
          {error}
          <button 
            onClick={onRetry} 
            className="btn btn-xs btn-ghost ml-2"
            disabled={isLoading}
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatError;
