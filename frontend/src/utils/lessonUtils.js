export const formatDuration = (duration) => {
  if (typeof duration === 'number') {
    return `${duration} min`;
  }
  return duration;
};

export const validateLessonData = (data) => {
  const errors = {};
  
  if (!data.title?.trim()) errors.title = 'Title is required';
  if (!data.description?.trim()) errors.description = 'Description is required';
  if (!data.content?.trim()) errors.content = 'Content is required';
  if (!data.category?.trim()) errors.category = 'Category is required';
  
  // Validate resources
  if (data.resources?.length > 0) {
    const invalidResources = data.resources.some(
      resource => !resource.title?.trim() || !resource.url?.trim()
    );
    if (invalidResources) {
      errors.resources = 'All resources must have a title and URL';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const sanitizeLessonData = (data) => {
  return {
    ...data,
    title: data.title?.trim(),
    description: data.description?.trim(),
    content: data.content?.trim(),
    category: data.category?.trim(),
    difficulty: data.difficulty || 'Beginner',
    duration: formatDuration(data.duration),
    stepIndex: parseInt(data.stepIndex, 10) || 0,
    resources: data.resources?.map(resource => ({
      title: resource.title?.trim(),
      url: resource.url?.trim(),
      type: resource.type
    })) || []
  };
}; 