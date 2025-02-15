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
        <span className="label-text text-lg">CV / Resume</span>
      </label>

      {/* Drag & Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragging ? 'border-primary bg-primary/5' : 'border-base-300 hover:border-primary'}
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
                <span className="text-sm">Uploading...</span>
                <span className="text-sm">{uploadProgress}%</span>
              </div>
              <progress 
                className="progress progress-primary w-full" 
                value={uploadProgress} 
                max="100"
              ></progress>
            </div>
          ) : cvFile || currentCV ? (
            <div className="w-full">
              <div className="card bg-base-200">
                <div className="card-body p-4">
                  <div className="flex items-start gap-4">
                    <div className="text-primary">
                      {getFileIcon()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold truncate">
                        {cvFile?.name || 'Current CV'}
                      </h3>
                      {cvFile && (
                        <p className="text-sm text-base-content/70">
                          {formatFileSize(cvFile.size)}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {currentCV && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowPreview(true);
                            }}
                            className="btn btn-ghost btn-sm"
                          >
                            Preview
                          </button>
                          <a
                            href={currentCV}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-ghost btn-sm"
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
                        className="btn btn-ghost btn-sm text-error"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Drop your CV here</h3>
                <p className="text-sm text-base-content/70">
                  or click to browse (PDF only, max 5MB)
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && currentCV && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-5xl h-5/6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">CV Preview</h3>
              <div className="flex gap-2">
                <a
                  href={currentCV}
                  download
                  className="btn btn-primary btn-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  Download
                </a>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setShowPreview(false)}
                >
                  Close
                </button>
              </div>
            </div>
            <div className="bg-base-200 rounded-lg p-4 h-[calc(100%-4rem)]">
              <iframe
                src={currentCV}
                className="w-full h-full rounded-lg"
                title="CV Preview"
              />
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowPreview(false)}></div>
        </div>
      )}
    </div>
  );
};

export default CVUpload;
