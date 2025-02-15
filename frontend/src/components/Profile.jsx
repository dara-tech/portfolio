import React, { useState, useEffect } from 'react';
import { useAdminProfile } from "../hooks/useAdminProfile";
import ProfilePicture from './profile/ProfilePicture';
import ProfileForm from './profile/ProfileForm';

const AdminProfile = () => {
  const {
    formData,
    setFormData,
    loading,
    error,
    success,
    isSubmitting,
    handleUpdateProfile,
  } = useAdminProfile();

  const [imagePreview, setImagePreview] = useState(formData.profilePic || null);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [cvFile, setCvFile] = useState(formData.cv || null);

  useEffect(() => {
    if (formData.profilePic && typeof formData.profilePic === 'string') {
      setImagePreview(formData.profilePic);
    }
  }, [formData.profilePic]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCvChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
      if (!file.type.includes("pdf")) {
        alert("Only PDF files are allowed");
        return;
      }
      setCvFile(file);
      setFormData({ ...formData, cv: file });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setFormData({ ...formData, profilePic: file });
      setShowUploadOptions(false);
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-min-screen bg-base-100 py-10 px-4">
      <div className="max-w-4xl mx-auto card bg-base-100 py-8">
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold text-center mb-8">Admin Profile</h2>
          
          {error && (
            <div className="alert alert-error mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-8">
              <ProfilePicture 
                imagePreview={imagePreview}
                showUploadOptions={showUploadOptions}
                setShowUploadOptions={setShowUploadOptions}
                handleFileChange={handleFileChange}
                formData={formData}
                setImagePreview={setImagePreview}
                setFormData={setFormData}
              />

              <ProfileForm 
                formData={formData}
                handleChange={handleChange}
                cvFile={cvFile}
                handleCvChange={handleCvChange}
                setFormData={setFormData}
              />
            </div>

            <div className="divider"></div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary btn-lg"
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Updating...
                  </>
                ) : (
                  'Update Profile'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.2s ease-in-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .arrow-down {
          position: absolute;
          bottom: -8px;
          right: 20px;
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 8px solid hsl(var(--b2));
        }
      `}</style>
    </div>
  );
};

export default AdminProfile;