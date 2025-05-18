import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';
import { chatWithAI } from '../Ai/ChatModel';
import ChatHeader from './components/ChatHeader';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import EmptyChat from './components/EmptyChat';
import ChatError from './components/ChatError';

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
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [showCopyTooltip, setShowCopyTooltip] = useState(false);

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
    // First sanitize the content to remove any HTML tags
    const sanitizedContent = DOMPurify.sanitize(content, { ALLOWED_TAGS: [] });
    // Then convert markdown to HTML
    const rawMarkup = marked(sanitizedContent);
    // Sanitize the markdown HTML output
    const sanitizedMarkup = DOMPurify.sanitize(rawMarkup);
    return { __html: sanitizedMarkup };
  };

  const copyMessage = async (content, messageId) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setShowCopyTooltip(true);
      setTimeout(() => {
        setShowCopyTooltip(false);
        setTimeout(() => setCopiedMessageId(null), 300);
      }, 2000);
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
      <ChatHeader 
        onClear={clearChat}
        onRetry={retryLastMessage}
        isLoading={isLoading}
        hasMessages={messages.length > 0}
      />

      <div 
        ref={chatContainerRef}
        className="flex-grow overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        {messages.length === 0 && !isTyping && <EmptyChat />}

        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
            index={index}
            editingMessageId={editingMessageId}
            editInput={editInput}
            editTextareaRef={editTextareaRef}
            copiedMessageId={copiedMessageId}
            animatingMessages={animatingMessages}
            onEdit={startEditing}
            onCopy={copyMessage}
            onEditInputChange={(e) => setEditInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onCancelEdit={() => setEditingMessageId(null)}
            onSaveEdit={saveEdit}
          />
        ))}

        {isTyping && (
          <ChatMessage
            message={{ role: 'assistant', content: streamedText }}
            index={messages.length}
            editingMessageId={null}
            copiedMessageId={null}
            animatingMessages={new Set()}
            onCopy={() => {}}
          />
        )}

        <ChatError 
          error={error}
          onRetry={retryLastMessage}
          isLoading={isLoading}
        />
        
        <div ref={messagesEndRef} />
      </div>

      {showScrollButton && (
        <button 
          onClick={scrollToBottom}
          className="absolute right-4 bottom-24 lg:bottom-20 btn btn-circle btn-sm btn-primary shadow-lg animate-bounce"
          aria-label="Scroll to bottom"
        >
          <ArrowUp size={16} />
        </button>
      )}

      <ChatInput
        input={input}
        isLoading={isLoading}
        inputRef={inputRef}
        onInputChange={(e) => setInput(e.target.value)}
        onSubmit={handleSubmit}
      />

      <style>{`
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