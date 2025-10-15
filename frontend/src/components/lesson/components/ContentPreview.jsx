import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Eye, Code } from 'lucide-react';
import DOMPurify from 'dompurify';

export const ContentPreview = ({ content }) => {
  const [previewMode, setPreviewMode] = useState('preview'); // 'preview' or 'source'
  
  const sanitizedContent = DOMPurify.sanitize(content);
  
  return (
    <div className="mt-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
        <div className="p-0">
          <div className="flex bg-white/5 backdrop-blur-sm rounded-t-2xl">
            <button 
              className={`px-4 py-3 text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                previewMode === 'preview' 
                  ? 'bg-white/20 text-white border-b-2 border-white/40' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              onClick={() => setPreviewMode('preview')}
            >
              <Eye size={16} />
              Preview
            </button>
            <button 
              className={`px-4 py-3 text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                previewMode === 'source' 
                  ? 'bg-white/20 text-white border-b-2 border-white/40' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              onClick={() => setPreviewMode('source')}
            >
              <Code size={16} />
              Source
            </button>
          </div>
          
          <div className="p-6">
            {previewMode === 'preview' ? (
              <div className="prose max-w-none prose-invert">
                <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
              </div>
            ) : (
              <pre className="whitespace-pre-wrap bg-white/5 backdrop-blur-sm text-white p-4 rounded-xl overflow-auto max-h-96 border border-white/10">
                {content}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 