import React from 'react';
import { Bot, Copy, Edit2, Download } from 'lucide-react';
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

  const renderMessageContent = (message) => {
    if (message.type === 'image') {
      return (
        <div className="relative w-full max-w-sm mx-auto">
          <img
            src={message.content}
            alt="AI Generated"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      );
    }

    const sanitizedContent = DOMPurify.sanitize(message.content);
    const rawMarkup = marked.parse(sanitizedContent);
    return { __html: DOMPurify.sanitize(rawMarkup) };
  };

  const handleDownload = (imageUrl) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'ai_generated_image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg">
              <img
                src={formData.profilePic}
                alt="Admin"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="p-2 rounded-full bg-white/10 backdrop-blur-xl text-white border border-white/20 shadow-lg grid place-items-center">
              <Bot size={20} />
            </div>
          )}
        </div>
      )}

      <div
        className={`chat-bubble ${
          message.role === 'user'
            ? 'bg-white/20 backdrop-blur-xl text-white border border-white/30 shadow-xl'
            : 'bg-white/10 backdrop-blur-xl text-white border border-white/20 shadow-xl'
        } relative group transition-all duration-200 ${
          animatingMessages.has(index) ? 'origin-left' : ''
        } max-w-[80%] break-words`}
      >
        {editingMessageId === index ? (
          <div className="flex flex-col gap-2 w-full">
            <textarea
              ref={editTextareaRef}
              value={editInput}
              onChange={onEditInputChange}
              onKeyDown={(e) => onKeyDown(e, index)}
              className="textarea my-2 rounded-lg bg-white/10 backdrop-blur-xl border border-white/30 text-white placeholder-white/60 w-full min-h-[100px] resize-none focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20"
              placeholder="Edit your message..."
            />
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/60">
                Press Enter to save, Esc to cancel
              </span>
              <div className="flex gap-2">
                <button
                  onClick={onCancelEdit}
                  className="btn btn-xs bg-white/10 backdrop-blur-xl text-white border border-white/20 hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onSaveEdit(index)}
                  className="btn btn-xs bg-white/20 backdrop-blur-xl text-white border border-white/30 hover:bg-white/30 transition-all hover:scale-105"
                  disabled={!editInput.trim()}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {message.type === 'image' ? (
              renderMessageContent(message)
            ) : (
              <div
                className="prose prose-sm max-w-none prose-invert"
                dangerouslySetInnerHTML={renderMessageContent(message)}
              />
            )}

            <div className="absolute -top-2 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
              <div className="flex gap-1 bg-white/10 backdrop-blur-xl rounded-full p-1 shadow-lg border border-white/20">
                {message.type === 'image' ? (
                  <button
                    onClick={() => handleDownload(message.content)}
                    className="btn btn-xs bg-transparent text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/20 transition-all duration-200 hover:scale-110 border-none"
                    title="Download image"
                  >
                    <Download size={14} />
                  </button>
                ) : (
                  <button
                    onClick={() => onCopy(message.content, index)}
                    className={`btn btn-xs bg-transparent p-1.5 rounded-full transition-all duration-200 border-none ${
                      copiedMessageId === index
                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        : 'text-white/70 hover:text-white hover:bg-white/20 hover:scale-110'
                    }`}
                    title={copiedMessageId === index ? 'Copied!' : 'Copy message'}
                  >
                    <Copy
                      size={14}
                      className={copiedMessageId === index ? 'animate-pulse' : ''}
                    />
                  </button>
                )}
                {message.role === 'user' && message.type !== 'image' && (
                  <button
                    onClick={() => onEdit(index, message.content)}
                    className="btn btn-xs bg-transparent text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/20 transition-all duration-200 hover:scale-110 border-none"
                    title="Edit message"
                  >
                    <Edit2 size={14} />
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
