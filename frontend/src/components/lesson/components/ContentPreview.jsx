import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Eye, Code } from 'lucide-react';
import DOMPurify from 'dompurify';

export const ContentPreview = ({ content }) => {
  const [previewMode, setPreviewMode] = useState('preview'); // 'preview' or 'source'
  
  const sanitizedContent = DOMPurify.sanitize(content);
  
  return (
    <div className="mt-4">
      <div className="card bg-base-200 overflow-hidden">
        <div className="card-body p-0">
          <div className="tabs tabs-boxed bg-base-300 rounded-t-lg rounded-b-none">
            <a 
              className={`tab ${previewMode === 'preview' ? 'tab-active' : ''}`}
              onClick={() => setPreviewMode('preview')}
            >
              <Eye size={16} className="mr-2" />
              Preview
            </a>
            <a 
              className={`tab ${previewMode === 'source' ? 'tab-active' : ''}`}
              onClick={() => setPreviewMode('source')}
            >
              <Code size={16} className="mr-2" />
              Source
            </a>
          </div>
          
          <div className="p-4">
            {previewMode === 'preview' ? (
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
              </div>
            ) : (
              <pre className="whitespace-pre-wrap bg-base-300 p-4 rounded-lg overflow-auto max-h-96">
                {content}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 