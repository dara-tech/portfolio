import { useState, useCallback } from 'react';

const initialProjectState = {
  title: '',
  description: '',
  imageFile: null,
  imagePreview: null,
  technologies: '',
  liveUrl: '',
  githubUrl: ''
};

const useProjectForm = ({ onSubmit, initialData = null }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [projectData, setProjectData] = useState(initialData || initialProjectState);
  const [errors, setErrors] = useState({});

  const resetForm = useCallback(() => {
    setProjectData(initialData || initialProjectState);
    setErrors({});
  }, [initialData]);

  const openModal = useCallback((data = null) => {
    if (data) {
      setProjectData(data);
    } else {
      resetForm();
    }
    setIsVisible(true);
  }, [resetForm]);

  const closeModal = useCallback(() => {
    setIsVisible(false);
    resetForm();
  }, [resetForm]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!projectData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!projectData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (projectData.imageUrl && !isValidUrl(projectData.imageUrl)) {
      newErrors.imageUrl = 'Invalid image URL';
    }
    
    if (projectData.liveUrl && !isValidUrl(projectData.liveUrl)) {
      newErrors.liveUrl = 'Invalid live URL';
    }
    
    if (projectData.githubUrl && !isValidUrl(projectData.githubUrl)) {
      newErrors.githubUrl = 'Invalid GitHub URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [projectData]);

  const handleSubmit = useCallback(async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(projectData);
      closeModal();
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'An error occurred while submitting'
      }));
    }
  }, [projectData, validateForm, onSubmit, closeModal]);

  const handleChange = useCallback((field, value) => {
    setProjectData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear field-specific error when user starts typing
    setErrors(prev => ({
      ...prev,
      [field]: undefined
    }));
  }, []);

  return {
    isVisible,
    projectData,
    errors,
    openModal,
    closeModal,
    handleChange,
    handleSubmit,
    resetForm
  };
};

// Utility function to validate URLs
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

export default useProjectForm;