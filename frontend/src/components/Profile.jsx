import React, { useState, useEffect } from 'react';
import { useAdminProfile } from "../hooks/useAdminProfile";
import ProfilePicture from './profile/ProfilePicture';
import ProfileForm from './profile/ProfileForm';
import { Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

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
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-bold text-white">Admin Profile</h2>
            <Link 
              to="/admin/settings" 
              className="w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 hover:border-white/30 transition-all duration-300 flex items-center justify-center"
            >
              <Settings size={20} />
            </Link>
          </div>
          
          {error && (
            <div className="bg-red-500/20 text-red-400 px-6 py-4 rounded-xl border border-red-500/30 mb-6 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 text-green-400 px-6 py-4 rounded-xl border border-green-500/30 mb-6 flex items-center gap-3">
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
    </div>
  );
};

export default AdminProfile;