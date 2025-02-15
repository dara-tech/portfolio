import React from 'react';

const ProfilePicture = ({ 
  imagePreview, 
  showUploadOptions, 
  setShowUploadOptions, 
  handleFileChange, 
  formData, 
  setImagePreview, 
  setFormData 
}) => {
  return (
    <div className="md:w-1/3">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative group">
          <div className="avatar">
            <div className="w-48 h-48 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Profile Preview" 
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-avatar.png';
                  }}
                />
              ) : (
                <div className="bg-base-300 w-full h-full flex items-center justify-center">
                  <span className="text-4xl">👤</span>
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowUploadOptions(!showUploadOptions)}
            className="absolute bottom-2 right-2 btn btn-circle btn-sm btn-primary hover:btn-secondary transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </button>

          {showUploadOptions && (
            <div className="absolute -right-4 bottom-16 bg-base-200 rounded-lg shadow-xl p-4 animate-fade-in z-10">
              <div className="arrow-down"></div>
              <div className="flex flex-col gap-2">
                <label className="btn btn-sm btn-primary w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  Choose Photo
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData({ ...formData, profilePic: null });
                      setShowUploadOptions(false);
                    }}
                    className="btn btn-sm btn-error w-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Remove Photo
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <p className="text-xs text-base-content/70">
          Click the camera icon to update your profile picture
        </p>
        <p className="text-xs text-error">
          Maximum file size: 5MB
        </p>
      </div>
    </div>
  );
};

export default ProfilePicture;
