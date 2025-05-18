import React from 'react';
import { Bot, Copy, Edit2 } from 'lucide-react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { useAdminProfile } from '../../../hooks/useAdminProfile';

const ChatMessage = ({
  message,
  index,
  editingMessageId,
  editInput,
  editTextareaRef,
  copiedMessageId,
  animatingMessages,
  onEdit,
  onCopy,
  onEditInputChange,
  onKeyDown,
  onCancelEdit,
  onSaveEdit
}) => {
  const { formData } = useAdminProfile();

  const renderMessageContent = (content) => {
    const sanitizedContent = DOMPurify.sanitize(content, { ALLOWED_TAGS: [] });
    const rawMarkup = marked(sanitizedContent);
    const sanitizedMarkup = DOMPurify.sanitize(rawMarkup);
    return { __html: sanitizedMarkup };
  };

  return (
    <div 
      className={`chat ${message.role === 'user' ? 'chat-end' : 'chat-start'} ${
        animatingMessages.has(index) && message.role === 'assistant'
          ? 'opacity-0 translate-y-5 scale-95 animate-[messageAppear_0.6s_ease-out_forwards]' 
          : ''
      }`}
    >
      {message.role === 'assistant' && (
        <div className="chat-image avatar">
          {formData?.profilePic ? (
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img 
                src={formData.profilePic} 
                alt="Admin" 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="p-2 rounded-full justify-center items-center bg-primary/20 text-primary grid place-items-center">
              <Bot size={20} />
            </div>
          )}
        </div>
      )}
      <div 
        className={`chat-bubble ${
          message.role === 'user' 
            ? 'chat-bubble-primary text-primary-content' 
            : 'chat-bubble-secondary text-secondary-content'
        } shadow-md relative group transition-all duration-200 ${
          animatingMessages.has(index) ? 'origin-left' : ''
        }`}
      >
        {editingMessageId === index ? (
          <div className="flex flex-col gap-2 w-full">
            <textarea
              ref={editTextareaRef}
              value={editInput}
              onChange={onEditInputChange}
              onKeyDown={(e) => onKeyDown(e, index)}
              className="textarea my-2 rounded-lg textarea-bordered w-full min-h-[100px] text-primary resize-none focus:outline-none focus:border-primary"
              placeholder="Edit your message..."
            />
            <div className="flex justify-between items-center text-xs">
              <span className="text-base-content/60">Press Enter to save, Esc to cancel</span>
              <div className="flex gap-2">
                <button 
                  onClick={onCancelEdit}
                  className="btn btn-xs btn-ghost hover:bg-base-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => onSaveEdit(index)}
                  className="btn btn-xs btn-primary transition-all hover:scale-105"
                  disabled={!editInput.trim()}
                >
                  Save 
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
                  onClick={() => onCopy(message.content, index)}
                  className={`btn btn-xs btn-ghost p-1.5 rounded-full transition-all duration-200 ${
                    copiedMessageId === index 
                      ? 'bg-success/20 text-success hover:bg-success/30' 
                      : 'hover:bg-base-200 hover:scale-110'
                  }`}
                  title={copiedMessageId === index ? "Copied!" : "Copy message"}
                >
                  <Copy size={14} className={`${copiedMessageId === index ? 'animate-pulse' : ''}`} />
                </button>
                {message.role === 'user' && (
                  <button
                    onClick={() => onEdit(index, message.content)}
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
  );
};

export default ChatMessage;
