import React, { useState, useEffect, useRef } from 'react';
import { Send, Trash2, RefreshCw, Bot, PanelRight, ArrowUp } from 'lucide-react';
import { chatWithAI } from '../Ai/ChatModel';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const chatContainerRef = useRef(null);

  // Detect scroll position to show/hide scroll button
  useEffect(() => {
    const handleScroll = () => {
      if (!chatContainerRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100;
      setShowScrollButton(isScrolledUp);
    };

    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener('scroll', handleScroll);
      return () => chatContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, streamedText]);

  // Focus input on component mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const animateTextStream = async (text) => {
    setIsTyping(true);
    for (let i = 0; i <= text.length; i++) {
      setStreamedText(text.slice(0, i));
      await new Promise(resolve => setTimeout(resolve, 5)); // Reduced from 20ms to 5ms
    }
    setIsTyping(false);
    setStreamedText('');
    setMessages(prev => [...prev, { role: 'assistant', content: text }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const aiResponse = await chatWithAI([...messages, userMessage]);
      animateTextStream(aiResponse);
    } catch (error) {
      console.error('Chat Error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
    setStreamedText('');
    inputRef.current?.focus();
  };

  const retryLastMessage = async () => {
    if (messages.length === 0 || isLoading) return;
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    if (!lastUserMessage) return;

    setIsLoading(true);
    setError(null);

    try {
      const aiResponse = await chatWithAI([...messages.slice(0, -1), lastUserMessage]);
      setMessages(prev => prev.slice(0, -1));
      animateTextStream(aiResponse);
    } catch (error) {
      console.error('Retry Error:', error);
      setError('Failed to retry. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const renderMessageContent = (content) => {
    const rawMarkup = marked(content);
    const sanitizedMarkup = DOMPurify.sanitize(rawMarkup);
    return { __html: sanitizedMarkup };
  };

  return (
    <div className="pt-16 pb-16 lg:pb-4 flex flex-col h-screen bg-gradient-to-br from-base-200 to-base-300">
      {/* Chat header with controls */}
      <div className="p-4 bg-base-200/80 backdrop-blur-sm border-b border-base-300 flex items-center justify-between shadow-sm">
        <h2 className="text-lg font-semibold flex items-center">
          <Bot size={20} className="mr-2 text-primary" />
          Chat Assistant
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={clearChat} 
            className="btn btn-sm btn-ghost tooltip tooltip-left" 
            data-tip="Clear chat"
            disabled={isLoading || messages.length === 0}
          >
            <Trash2 size={18} className="text-error" />
          </button>
          <button 
            onClick={retryLastMessage} 
            className="btn btn-sm btn-ghost tooltip tooltip-left" 
            data-tip="Retry last message"
            disabled={isLoading || messages.length === 0}
          >
            <RefreshCw size={18} className={`text-primary ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Chat messages area */}
      <div 
        ref={chatContainerRef}
        className="flex-grow overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        {messages.length === 0 && !isTyping && (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-70">
            <Bot size={48} className="mb-4 text-primary opacity-50" />
            <h3 className="text-xl font-medium mb-2">How can I help you today?</h3>
            <p className="max-w-md text-sm">Ask me anything, and I'll do my best to assist you!</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div key={index} className={`chat ${message.role === 'user' ? 'chat-end' : 'chat-start'}`}>
            {message.role === 'assistant' && (
              <div className="chat-image avatar">
                <div className="p-2 rounded-full justify-center items-center bg-primary/20 text-primary grid place-items-center">
                  <Bot size={20} />
                </div>
              </div>
            )}
            <div 
              className={`chat-bubble ${
                message.role === 'user' 
                  ? 'chat-bubble-primary text-primary-content' 
                  : 'chat-bubble-secondary text-secondary-content'
              } shadow-md`}
            >
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={renderMessageContent(message.content)} 
              />
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="chat chat-start">
            <div className="chat-image avatar">
              <div className="w-8 h-8 rounded-full items-center justify-center bg-primary/20 text-primary grid place-items-center">
                <Bot size={16} />
              </div>
            </div>
            <div className="chat-bubble chat-bubble-secondary text-secondary-content shadow-md">
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={renderMessageContent(streamedText)} 
              />
              <span className="loading loading-dots loading-sm"></span>
            </div>
          </div>
        )}

        {error && (
          <div className="chat chat-start">
            <div className="chat-bubble bg-error/20 text-error border border-error/30">
              <div className="flex items-center">
                {error}
                <button 
                  onClick={retryLastMessage} 
                  className="btn btn-xs btn-ghost ml-2"
                  disabled={isLoading}
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button 
          onClick={scrollToBottom}
          className="absolute right-4 bottom-24 lg:bottom-20 btn btn-circle btn-sm btn-primary shadow-lg animate-bounce"
          aria-label="Scroll to bottom"
        >
          <ArrowUp size={16} />
        </button>
      )}

      {/* Input form */}
      <div className="p-4 lg:mb-14  ">
        <form onSubmit={handleSubmit} className="flex max-w-3xl mx-auto">
          <div className="join w-full shadow-lg ring-primary p-4 rounded-3xl bg-base-200">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="input input-bordered join-item flex-grow focus:outline-none focus:border-none "
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
      </div>
    </div>
  );
};

export default Chat;