import React, { useState, useEffect, useRef } from 'react';
import { Send, Trash2, RefreshCw, Bot, PanelRight, ArrowUp, Copy, Edit2 } from 'lucide-react';
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
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editInput, setEditInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const editTextareaRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const chatContainerRef = useRef(null);
  const [animatingMessages, setAnimatingMessages] = useState(new Set());

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
      await new Promise(resolve => setTimeout(resolve, 5));
    }
    setIsTyping(false);
    setStreamedText('');
    
    // Add animation for the new message
    const newMessage = { role: 'assistant', content: text };
    setMessages(prev => [...prev, newMessage]);
    
    // Add animation class
    const messageId = messages.length;
    setAnimatingMessages(prev => new Set([...prev, messageId]));
    
    // Remove animation class after animation completes
    setTimeout(() => {
      setAnimatingMessages(prev => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
    }, 1000);
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

  const copyMessage = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  const startEditing = (messageId, content) => {
    // Only allow editing of user messages
    if (messages[messageId].role !== 'user') return;
    
    setEditingMessageId(messageId);
    setEditInput(content);
    // Focus the textarea after a small delay to ensure it's rendered
    setTimeout(() => {
      editTextareaRef.current?.focus();
      // Move cursor to end of text
      editTextareaRef.current?.setSelectionRange(
        editTextareaRef.current.value.length,
        editTextareaRef.current.value.length
      );
    }, 0);
  };

  const saveEdit = async (messageId) => {
    if (!editInput.trim()) return;
    
    // Only allow editing of user messages
    if (messages[messageId].role !== 'user') return;
    
    const editedMessage = { ...messages[messageId], content: editInput };
    
    // Remove the old AI response if it exists
    const messagesUpToEdit = messages.slice(0, messageId + 1);
    setMessages(messagesUpToEdit);
    
    // Update the edited message
    setMessages(prev => prev.map((msg, idx) => 
      idx === messageId ? editedMessage : msg
    ));
    
    setEditingMessageId(null);
    setEditInput('');
    
    // Get new AI response
    setIsLoading(true);
    setError(null);
    
    try {
      const aiResponse = await chatWithAI(messagesUpToEdit);
      
      // Add new AI response
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error('Error getting new response:', error);
      setError('Failed to get new response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e, messageId) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveEdit(messageId);
    } else if (e.key === 'Escape') {
      setEditingMessageId(null);
      setEditInput('');
    }
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
            <Bot size={20} className="p-2 rounded-full justify-center items-center text-primary opacity-50" />
            <h3 className="text-xl font-medium mb-2">How can I help you today?</h3>
            <p className="max-w-md text-sm">Ask me anything, and I'll do my best to assist you!</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`chat ${message.role === 'user' ? 'chat-end' : 'chat-start'} ${
              animatingMessages.has(index) ? 'animate-[messageAppear_0.6s_ease-out_forwards]' : ''
            }`}
          >
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
              } shadow-md relative group transition-transform duration-200 ${
                animatingMessages.has(index) ? 'origin-left scale-95' : ''
              }`}
            >
              {editingMessageId === index ? (
                <div className="flex flex-col gap-2 w-full">
                  <textarea
                    ref={editTextareaRef}
                    value={editInput}
                    onChange={(e) => setEditInput(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="textarea textarea-bordered w-full min-h-[100px] resize-none focus:outline-none focus:border-primary"
                    placeholder="Edit your message..."
                  />
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-base-content/60">Press Enter to save, Esc to cancel</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setEditingMessageId(null)}
                        className="btn btn-xs btn-ghost hover:bg-base-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => saveEdit(index)}
                        className="btn btn-xs btn-primary transition-all hover:scale-105"
                        disabled={!editInput.trim()}
                      >
                        Save & Get New Response
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={renderMessageContent(message.content)} 
                  />
                  <div className="absolute -top-2 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                    <div className="flex gap-1 bg-base-100/90 backdrop-blur-sm rounded-full p-1 shadow-lg border border-base-200">
                      <button
                        onClick={() => copyMessage(message.content)}
                        className="btn btn-xs btn-ghost p-1.5 rounded-full hover:bg-base-200 transition-all duration-200 hover:scale-110"
                        title="Copy message"
                      >
                        <Copy size={14} className="text-base-content/70" />
                      </button>
                      {message.role === 'user' && (
                        <button
                          onClick={() => startEditing(index, message.content)}
                          className="btn btn-xs btn-ghost p-1.5 rounded-full hover:bg-base-200 transition-all duration-200 hover:scale-110"
                          title="Edit message"
                        >
                          <Edit2 size={14} className="text-base-content/70" />
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="chat chat-start">
            <div className="chat-image avatar">
              <div className=" rounded-full items-center justify-center bg-primary/20 text-primary grid place-items-center">
                <Bot size={20} />
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

      <style jsx global>{`
        @keyframes messageAppear {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          50% {
            opacity: 0.5;
            transform: translateY(-5px) scale(1.02);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default Chat;