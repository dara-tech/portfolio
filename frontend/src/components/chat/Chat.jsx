import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';
import { chatWithAI } from '../Ai/ChatModel';
import { generateImageFromPrompt } from '../Ai/AiImageGen';
import { marked } from 'marked';
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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, streamedText]);

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
    
    const newMessage = { role: 'assistant', content: text, type: 'text' };
    setMessages(prev => [...prev, newMessage]);
    
    const messageId = messages.length;
    setAnimatingMessages(prev => new Set([...prev, messageId]));
    
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

    const userMessage = { role: 'user', content: input.trim(), type: 'text' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const aiResponse = await chatWithAI([...messages, userMessage]);
      const aiMessage = { role: 'assistant', content: aiResponse, type: 'text' };
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

  // Message content is now handled by ChatMessage component

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
    if (messages[messageId].role !== 'user') return;
    
    setEditingMessageId(messageId);
    setEditInput(content);
    setTimeout(() => {
      editTextareaRef.current?.focus();
      editTextareaRef.current?.setSelectionRange(
        editTextareaRef.current.value.length,
        editTextareaRef.current.value.length
      );
    }, 0);
  };

  const saveEdit = async (messageId) => {
    if (!editInput.trim()) return;
    
    if (messages[messageId].role !== 'user') return;
    
    const editedMessage = { ...messages[messageId], content: editInput };
    
    const messagesUpToEdit = messages.slice(0, messageId + 1);
    setMessages(messagesUpToEdit);
    
    setMessages(prev => prev.map((msg, idx) => 
      idx === messageId ? editedMessage : msg
    ));
    
    setEditingMessageId(null);
    setEditInput('');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const aiResponse = await chatWithAI(messagesUpToEdit);
      
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error('Error getting new response:', error);
      setError('Failed to get new response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async (prompt) => {
    if (!prompt.trim() || isLoading) return;
  
    const userMessage = { role: 'user', content: prompt.trim(), type: 'text' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);
  
    try {
      const result = await generateImageFromPrompt(prompt);
      
      console.log("Generated result:", result);  // Log the result to inspect the data structure
  
      if (result && result.image) {
        const aiMessage = { role: 'assistant', content: result.image, type: 'image' };
        setMessages(prev => [...prev, aiMessage]);
        
        if (result.text) {
          const textMessage = { role: 'assistant', content: result.text, type: 'text' };
          setMessages(prev => [...prev, textMessage]);
        }
      } else {
        // Log an error if the result does not contain an image
        console.error('No image returned from the image generation API.');
        setError('Failed to generate image. Please try again.');
      }
    } catch (error) {
      console.error('Image generation error:', error);
      setError('Failed to generate image. Please try again.');
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
            message={{ role: 'assistant', content: streamedText, type: 'text' }}
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
        onGenerateImage={handleGenerateImage}
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