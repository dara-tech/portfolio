import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader, Trash2, RefreshCw, Bot } from 'lucide-react';
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, streamedText]);

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

  const renderMessageContent = (content) => {
    const rawMarkup = marked(content);
    const sanitizedMarkup = DOMPurify.sanitize(rawMarkup);
    return { __html: sanitizedMarkup };
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-base-200 to-base-300">
      <div className="navbar mt-20">
        <h2 className="flex-grow"></h2>
        <button onClick={clearChat} className="btn btn-ghost btn-circle mr-2" disabled={isLoading}>
          <Trash2 size={20} className="text-error" />
        </button>
        <button onClick={retryLastMessage} className="btn btn-ghost btn-circle" disabled={isLoading || messages.length === 0}>
          <RefreshCw size={20} className="text-primary" />
        </button>
      </div>
      <div className="flex-grow overflow-y-auto p-4 space-y-3">
        {messages.map((message, index) => (
          <div key={index} className={`chat ${message.role === 'user' ? 'chat-end' : 'chat-start'}`}>
            {message.role === 'assistant' && (
              <div className="chat-image avatar">
                <div className="p-1 rounded-full bg-primary text-neutral-content grid place-items-center">
                  <Bot size={20} />
                </div>
              </div>
            )}
            <div className={`chat-bubble ${message.role === 'user' ? 'chat-bubble-primary' : 'chat-bubble-secondary'}`}>
              <div dangerouslySetInnerHTML={renderMessageContent(message.content)} />
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="chat chat-start">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full bg-neutral-focus text-neutral-content grid place-items-center">
                <Bot size={20} />
              </div>
            </div>
            <div className="chat-bubble chat-bubble-secondary">
              <div dangerouslySetInnerHTML={renderMessageContent(streamedText)} />
              <span className="loading loading-dots loading-sm"></span>
            </div>
          </div>
        )}
        {error && (
          <div className="chat chat-start">
            <div className="chat-bubble chat-bubble-error">{error}</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 bg-base-200 flex justify-center">
        <div className="flex join w-full lg:w-3xl mb-20">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input input-bordered join-item flex-grow focus-visible:outline-none focus-visible:ring-none focus:border-none"
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button type="submit" className="btn btn-primary join-item" disabled={isLoading || !input.trim()}>
            {isLoading ? <span className="loading loading-spinner"></span> : <Send size={20} />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;