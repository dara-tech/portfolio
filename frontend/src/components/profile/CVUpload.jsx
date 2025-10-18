import React, { useState, useRef } from 'react';

const CVUpload = ({ cvFile, handleCvChange, currentCV, setFormData, formData }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length) {
      validateAndProcessFile(files[0]);
    }
  };

  const validateAndProcessFile = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return;
    }
    if (!file.type.includes("pdf")) {
      alert("Only PDF files are allowed");
      return;
    }

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setUploadProgress(0);
          handleCvChange({ target: { files: [file] } });
        }, 500);
      }
    }, 100);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };

  const handleRemove = () => {
    setFormData({ ...formData, cv: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.172 2.219l-9.172 9.172v-1.391h-2v5h5v-2h-1.391l9.172-9.172-1.609-1.609zm0 0l1.609 1.609 3.219-3.219-1.609-1.609-3.219 3.219zm-11.172 15.781h14v2h-14v-2zm16 2h2v-2h-2v2zm0-3v-2h2v2h-2zm-16-2v2h-2v-2h2zm18 0v2h-2v-2h2zm-18-1h2v2h-2v-2zm18 0h-2v2h2v-2z"/>
    </svg>
  );

  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text text-lg text-white/90 font-medium">CV / Resume</span>
      </label>

      {/* Drag & Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 bg-white/5
          ${isDragging ? 'border-blue-400 bg-blue-500/10' : 'border-white/20 hover:border-blue-400/50 hover:bg-white/10'}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf"
          onChange={handleFileSelect}
        />

        <div className="flex flex-col items-center gap-4">
          {uploadProgress > 0 ? (
            <div className="w-full max-w-xs">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-white/80">Uploading...</span>
                <span className="text-sm text-white/80">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          ) : cvFile || currentCV ? (
            <div className="w-full">
              <div className="bg-white/10 border border-white/20 rounded-xl p-4">
                <div className="flex items-start gap-4">
                  <div className="text-blue-400">
                    {getFileIcon()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold truncate text-white">
                      {cvFile?.name || 'Current CV'}
                    </h3>
                    {cvFile && (
                      <p className="text-sm text-white/70">
                        {formatFileSize(cvFile.size)}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 ">
                    {currentCV && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowPreview(true);
                            }}
                            className="px-3 py-1.5 bg-white/10 text-white/80 border border-white/20 rounded-lg hover:bg-white/20 hover:border-white/30 transition-all duration-300 text-sm"
                        >
                          Preview
                        </button>
                        <a
                          href={currentCV}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-white/10 text-white/80 border border-white/20 rounded-lg hover:bg-white/20 hover:border-white/30 transition-all duration-300 text-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Download
                        </a>
                      </>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove();
                      }}
                      className="px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-400/30 rounded-lg hover:bg-red-500/30 hover:border-red-400/50 transition-all duration-300 text-sm"
                    >
                      X
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Drop your CV here</h3>
                <p className="text-sm text-white/70">
                  or click to browse (PDF only, max 5MB)
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && currentCV && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 border border-white/20 rounded-2xl w-11/12 max-w-5xl h-5/6">
            <div className="flex justify-between items-center mb-4 p-6 border-b border-white/20">
              <h3 className="font-bold text-lg text-white">CV Preview</h3>
              <div className="flex gap-2">
                <a
                  href={currentCV}
                  download
                  className="px-4 py-2 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-lg hover:bg-blue-500/30 hover:border-blue-400/50 transition-all duration-300 text-sm font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  Download
                </a>
                <button
                  className="px-4 py-2 bg-white/10 text-white/80 border border-white/20 rounded-lg hover:bg-white/20 hover:border-white/30 transition-all duration-300 text-sm font-medium"
                  onClick={() => setShowPreview(false)}
                >
                  Close
                </button>
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 h-[calc(100%-4rem)] mx-6 mb-6">
              <iframe
                src={currentCV}
                className="w-full h-full rounded-lg"
                title="CV Preview"
              />
            </div>
          </div>
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowPreview(false)}></div>
        </div>
      )}
    </div>
  );
};

export default CVUpload;
