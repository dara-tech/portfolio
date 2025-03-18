import { useState, useEffect, useRef } from 'react';
import { FileText, AlertTriangle, ArrowLeft, Code, Eye, Layout, Maximize2, Minimize2, Copy, Check, Wand } from 'lucide-react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

export const ContentSection = ({ 
  formData, 
  formErrors, 
  handleEditorChange, 
  setActiveSection 
}) => {
  const [viewMode, setViewMode] = useState('edit'); // 'edit', 'preview', 'split'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [processedContent, setProcessedContent] = useState('');
  const previewRef = useRef(null);
  
  // Configure marked options with enhanced code highlighting
  useEffect(() => {
    marked.setOptions({
      renderer: new marked.Renderer(),
      highlight: function(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        try {
          const highlighted = hljs.highlight(code, { 
            language,
            ignoreIllegals: true
          }).value;
          
          // Add line numbers, enhanced styling and copy button
          const lines = highlighted.split('\n');
          const numberedLines = lines.map((line, i) => 
            `<span class="hljs-line-wrapper">
              <span class="hljs-line-number">${i + 1}</span>
              <span class="hljs-line">${line || ' '}</span>
             </span>`
          ).join('');
          
          return `<div class="hljs-code-block" data-language="${language}">${numberedLines}</div>`;
        } catch (err) {
          console.error('Highlight error:', err);
          return hljs.highlight(code, { language: 'plaintext' }).value;
        }
      },
      langPrefix: 'hljs language-',
      pedantic: false,
      gfm: true,
      breaks: true,
      sanitize: false,
      smartypants: false,
      xhtml: false
    });

    // Add custom styles for code highlighting
    const style = document.createElement('style');
    style.textContent = `
      .hljs-code-block {
        counter-reset: line;
        padding: 1em;
        background: var(--hljs-bg);
        border-radius: 0.75em;
        position: relative;
        margin: 1em 0;
        font-size: 0.95em;
        line-height: 1.5;
        overflow-x: auto;
      }
      
      .hljs-code-block::before {
        content: attr(data-language);
        position: absolute;
        top: 0.5em;
        right: 1em;
        font-size: 0.8em;
        color: #888;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      
      .hljs-line-wrapper {
        display: flex;
        width: 100%;
      }
      
      .hljs-line-number {
        user-select: none;
        text-align: right;
        padding-right: 1em;
        min-width: 3em;
        color: #666;
        border-right: 1px solid #444;
        margin-right: 1em;
        opacity: 0.5;
      }
      
      .hljs-line {
        flex: 1;
        padding-left: 0.5em;
      }
      
      .hljs-code-block:hover {
        background: var(--hljs-bg-hover);
      }
      
      .hljs-code-block:hover .hljs-line-number {
        opacity: 0.8;
      }
      
      .hljs-keyword { color: #569CD6; font-weight: bold; }
      .hljs-string { color: #CE9178; }
      .hljs-number { color: #B5CEA8; }
      .hljs-comment { color: #6A9955; font-style: italic; }
      .hljs-function { color: #DCDCAA; font-weight: bold; }
      .hljs-class { color: #4EC9B0; font-weight: bold; }
      .hljs-operator { color: #D4D4D4; }
      .hljs-punctuation { color: #D4D4D4; }
      .hljs-property { color: #9CDCFE; }
      .hljs-tag { color: #569CD6; }
      .hljs-name { color: #569CD6; }
      .hljs-attr { color: #9CDCFE; }
      .hljs-built_in { color: #4EC9B0; }
      .hljs-literal { color: #569CD6; }
      .hljs-params { color: #9CDCFE; }
      .hljs-regexp { color: #D16969; }
      .hljs-title { color: #DCDCAA; }
      .hljs-variable { color: #9CDCFE; }
    `;
    document.head.appendChild(style);
  }, []);
  
  // Process content when it changes
  useEffect(() => {
    try {
      // Check if content is already HTML
      if (formData.content.trim().startsWith('<')) {
        // It's HTML, sanitize it
        const sanitized = DOMPurify.sanitize(formData.content, {
          ADD_TAGS: ['iframe', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'p', 'strong', 'em', 'code', 'pre', 'blockquote', 'table', 'tr', 'td', 'th'],
          ADD_ATTR: ['class', 'style', 'allow', 'allowfullscreen', 'frameborder', 'scrolling']
        });
        setProcessedContent(sanitized);
      } else {
        // It's markdown, convert to HTML then sanitize
        const html = marked(formData.content);
        const sanitized = DOMPurify.sanitize(html, {
          ADD_TAGS: ['iframe', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'p', 'strong', 'em', 'code', 'pre', 'blockquote', 'table', 'tr', 'td', 'th'],
          ADD_ATTR: ['class', 'style', 'allow', 'allowfullscreen', 'frameborder', 'scrolling']
        });
        setProcessedContent(sanitized);
      }
    } catch (error) {
      console.error('Error processing content:', error);
      setProcessedContent('<div class="text-error">Error rendering content</div>');
    }
  }, [formData.content]);
  
  // Fix nested lists after rendering
  useEffect(() => {
    if (viewMode === 'preview' || viewMode === 'split') {
      if (previewRef.current) {
        // Fix nested lists
        const nestedLists = previewRef.current.querySelectorAll('li > ul, li > ol');
        nestedLists.forEach(list => {
          if (!list.classList.contains('list-disc') && !list.classList.contains('list-decimal')) {
            if (list.tagName === 'UL') {
              list.classList.add('list-disc', 'list-inside', 'my-2', 'space-y-1', 'ml-4');
            } else if (list.tagName === 'OL') {
              list.classList.add('list-decimal', 'list-inside', 'my-2', 'space-y-1', 'ml-4');
            }
          }
        });
        
        // Fix code blocks with enhanced styling
        const codeBlocks = previewRef.current.querySelectorAll('pre code');
        codeBlocks.forEach(block => {
          if (!block.classList.contains('bg-base-300')) {
            block.classList.add(
              'bg-base-300',
              'p-4',
              'rounded-lg',
              'my-2',
              'block',
              'overflow-x-auto',
              'relative',
              'font-mono',
              'text-sm',
              'leading-relaxed'
            );
            
            // Add copy button to code blocks
            const copyButton = document.createElement('button');
            copyButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>';
            copyButton.className = 'absolute top-2 right-2 p-2 rounded-md bg-base-200 opacity-50 hover:opacity-100 transition-opacity';
            copyButton.onclick = () => {
              navigator.clipboard.writeText(block.textContent);
              copyButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>';
              setTimeout(() => {
                copyButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>';
              }, 2000);
            };
            block.parentElement.appendChild(copyButton);
          }
        });
      }
    }
  }, [processedContent, viewMode]);
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.getElementById('content-editor-container').requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(err => console.error(err));
    } else {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(err => console.error(err));
    }
  };
  
  const copyContent = () => {
    navigator.clipboard.writeText(formData.content)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(err => console.error('Failed to copy content:', err));
  };
  
  const fixFormatting = () => {
    // Fix common formatting issues
    let fixedContent = formData.content;
    
    // Fix broken code blocks
    fixedContent = fixedContent.replace(/```(\w+)?\s*\n([\s\S]*?)```/g, (match, lang, code) => {
      return `\n\`\`\`${lang || ''}\n${code.trim()}\n\`\`\`\n`;
    });
    
    // Fix HTML entities in code blocks
    fixedContent = fixedContent.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    
    // Fix nested lists
    fixedContent = fixedContent.replace(/<\/li>\s*<ul/g, '</li>\n<ul class="list-disc list-inside my-2 space-y-1 ml-4"');
    fixedContent = fixedContent.replace(/<\/li>\s*<ol/g, '</li>\n<ol class="list-decimal list-inside my-2 space-y-1 ml-4"');
    
    // Fix broken HTML tags
    fixedContent = fixedContent.replace(/<(\/?)h([1-6])>/g, '<$1h$2 class="font-bold my-2">');
    fixedContent = fixedContent.replace(/<ul>/g, '<ul class="list-disc list-inside my-2 space-y-1">');
    fixedContent = fixedContent.replace(/<ol>/g, '<ol class="list-decimal list-inside my-2 space-y-1">');
    
    // Fix code tags
    fixedContent = fixedContent.replace(/<code>/g, '<code class="bg-base-300 px-1 rounded text-sm">');
    
    // Apply the fixed content
    handleEditorChange({ target: { value: fixedContent } });
  };
  
  const beautifyContent = () => {
    try {
      // Convert to HTML if it's markdown
      let html = formData.content;
      if (!html.trim().startsWith('<')) {
        html = marked(formData.content);
      }
      
      // Sanitize and format
      const sanitized = DOMPurify.sanitize(html, {
        ADD_TAGS: ['iframe', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'p', 'strong', 'em', 'code', 'pre', 'blockquote', 'table', 'tr', 'td', 'th'],
        ADD_ATTR: ['class', 'style', 'allow', 'allowfullscreen', 'frameborder', 'scrolling']
      });
      
      // Apply consistent formatting
      let formatted = sanitized
        .replace(/<h1>/g, '<h1 class="font-bold my-2">')
        .replace(/<h2>/g, '<h2 class="font-bold my-2">')
        .replace(/<h3>/g, '<h3 class="font-bold my-2">')
        .replace(/<h4>/g, '<h4 class="font-bold my-2">')
        .replace(/<h5>/g, '<h5 class="font-bold my-2">')
        .replace(/<h6>/g, '<h6 class="font-bold my-2">')
        .replace(/<ul>/g, '<ul class="list-disc list-inside my-2 space-y-1">')
        .replace(/<ol>/g, '<ol class="list-decimal list-inside my-2 space-y-1">')
        .replace(/<li><ul>/g, '<li><ul class="list-disc list-inside my-2 space-y-1 ml-4">')
        .replace(/<li><ol>/g, '<li><ol class="list-decimal list-inside my-2 space-y-1 ml-4">')
        .replace(/<pre><code>/g, '<pre><code class="bg-base-300 p-4 rounded-lg my-2 block overflow-x-auto">')
        .replace(/<code>/g, '<code class="bg-base-300 px-1 rounded text-sm">')
        .replace(/<a /g, '<a class="link link-primary" target="_blank" ')
        .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-primary pl-4 my-2">')
        .replace(/<table>/g, '<table class="table table-zebra w-full">');
      
      // Apply the beautified content
      handleEditorChange({ target: { value: formatted } });
    } catch (error) {
      console.error('Error beautifying content:', error);
    }
  };
  
  return (
    <div className="p-6" id="content-editor-container">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center text-primary">
          <FileText size={20} className="mr-2" />
          Lesson Content
        </h2>
        
        <div className="flex items-center gap-2">
          <div className="tabs tabs-boxed bg-base-200">
            <button 
              type="button"
              className={`tab ${viewMode === 'edit' ? 'tab-active' : ''}`}
              onClick={() => setViewMode('edit')}
            >
              <Code size={16} className="mr-2" />
              Edit
            </button>
            <button 
              type="button"
              className={`tab ${viewMode === 'preview' ? 'tab-active' : ''}`}
              onClick={() => setViewMode('preview')}
            >
              <Eye size={16} className="mr-2" />
              Preview
            </button>
            <button 
              type="button"
              className={`tab ${viewMode === 'split' ? 'tab-active' : ''}`}
              onClick={() => setViewMode('split')}
            >
              <Layout size={16} className="mr-2" />
              Split
            </button>
          </div>
          
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-sm btn-ghost">
              <Wand size={16} />
            </label>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
              <li><a onClick={fixFormatting}>Fix Formatting</a></li>
              <li><a onClick={beautifyContent}>Beautify Content</a></li>
            </ul>
          </div>
          
          <button
            type="button"
            onClick={copyContent}
            className="btn btn-sm btn-ghost tooltip tooltip-left"
            data-tip={isCopied ? "Copied!" : "Copy content"}
          >
            {isCopied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
          </button>
          
          <button
            type="button"
            onClick={toggleFullscreen}
            className="btn btn-sm btn-ghost tooltip tooltip-left"
            data-tip={isFullscreen ? "Exit fullscreen" : "Fullscreen mode"}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>
      
      <div className={`form-control ${isFullscreen ? 'h-screen pb-20' : ''}`}>
        <div className="bg-base-200 p-2 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="badge badge-primary">HTML & Markdown</span>
            <span className="text-xs opacity-70">Rich content supported</span>
          </div>
          <span className="text-xs opacity-70">{formData.content.length} characters</span>
        </div>
        
        <div className={`${viewMode === 'split' ? 'grid grid-cols-2 gap-0' : ''} border border-base-300 rounded-b-lg overflow-hidden`}>
          {/* Editor */}
          {(viewMode === 'edit' || viewMode === 'split') && (
            <div className={`${viewMode === 'split' ? 'border-r border-base-300' : ''}`}>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleEditorChange}
                className={`textarea w-full ${isFullscreen ? 'h-full' : 'h-96'} focus:outline-none transition-all rounded-none p-4 font-mono text-sm ${
                  formErrors.content ? 'textarea-error' : ''
                }`}
                placeholder="Write your lesson content here using HTML or Markdown..."
                style={{ resize: 'none' }}
              />
            </div>
          )}
          
          {/* Preview */}
          {(viewMode === 'preview' || viewMode === 'split') && (
            <div className={`bg-base-200 overflow-auto ${isFullscreen ? 'h-full' : 'h-96'} p-4`}>
              <div className="prose prose-lg max-w-none" ref={previewRef}>
                <div dangerouslySetInnerHTML={{ __html: processedContent }} />
              </div>
            </div>
          )}
        </div>
        
        {formErrors.content && (
          <p className="text-error text-sm mt-1 flex items-center">
            <AlertTriangle size={14} className="mr-1" />
            {formErrors.content}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-2 text-xs text-base-content/70">
          <span>Supports HTML and Markdown formatting</span>
          <span>
            <kbd className="kbd kbd-sm">Tab</kbd> to indent, 
            <kbd className="kbd kbd-sm ml-1">Shift+Tab</kbd> to unindent
          </span>
        </div>
      </div>
      
      <div className="flex justify-between mt-6 pt-4 border-t border-base-200">
        <button 
          type="button" 
          className="btn btn-outline gap-2"
          onClick={() => setActiveSection('basic')}
        >
          <ArrowLeft size={16} />
          Back: Basic Info
        </button>
        <button 
          type="button" 
          className="btn btn-primary gap-2"
          onClick={() => setActiveSection('resources')}
        >
          Next: Resources
          <ArrowLeft size={16} className="rotate-180" />
        </button>
      </div>
    </div>
  );
}; 