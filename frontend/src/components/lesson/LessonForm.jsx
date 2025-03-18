import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Image, Clock, Tag, FileText, AlertTriangle, BookOpen, BarChart, Link as LinkIcon, Plus, CheckCircle, Wand2, Sparkles, AlertCircle } from 'lucide-react';
import { Lesson, useAiLessonGeneration } from '../Ai/Lesson'
import { BasicInfoSection } from './sections/BasicInfoSection';
import { ContentSection } from './sections/ContentSection';
import { ResourcesSection } from './sections/ResourcesSection';
import { FormSidebar } from './components/FormSidebar';
import { FormHeader } from './components/FormHeader';
import { AiGenerationDialog } from './components/AiGenerationDialog';

const LessonForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '', 
    content: '',
    category: '',
    duration: '',
    difficulty: 'Beginner',
    stepIndex: 0,
    resources: []
  });
  const [formErrors, setFormErrors] = useState({});
  const [newResource, setNewResource] = useState({ title: '', url: '', type: 'Link' });
  const [activeSection, setActiveSection] = useState('basic');
  const { generateLesson, loading: aiLoading, error: aiError } = useAiLessonGeneration();
  const [showAiDialog, setShowAiDialog] = useState(false);
  const [aiConfig, setAiConfig] = useState({
    topic: '',
    difficulty: 'Beginner',
    context: ''
  });

  useEffect(() => {
    // Fetch lesson data if in edit mode
    const fetchLesson = async () => {
      if (id) {
        setLoading(true);
        try {
          const lessonData = await Lesson.getById(id);
          setLesson(lessonData);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchLesson();
  }, [id]);

  // Update form when lesson data is loaded
  useEffect(() => {
    if (id && lesson) {
      setFormData({
        title: lesson.title || '',
        description: lesson.description || '',
        content: lesson.content || '',
        category: lesson.category || '',
        duration: lesson.duration || '',
        difficulty: lesson.difficulty || 'Beginner',
        stepIndex: lesson.stepIndex || 0,
        resources: lesson.resources || []
      });
    }
  }, [id, lesson]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleEditorChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, content: value }));
    if (formErrors.content) {
      setFormErrors(prev => ({ ...prev, content: null }));
    }
  };

  const handleResourceChange = (e) => {
    const { name, value } = e.target;
    setNewResource(prev => ({ ...prev, [name]: value }));
  };

  const addResource = () => {
    if (newResource.title.trim() && newResource.url.trim()) {
      setFormData(prev => ({
        ...prev,
        resources: [...prev.resources, { ...newResource }]
      }));
      setNewResource({ title: '', url: '', type: 'Link' });
    }
  };

  const removeResource = (index) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.content.trim()) errors.content = 'Content is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const firstError = Object.keys(formErrors)[0];
      const element = document.querySelector(`[name="${firstError}"]`);
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const submissionData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        content: formData.content.trim(),
        category: formData.category.trim(),
        difficulty: formData.difficulty,
        duration: formData.duration,
        stepIndex: parseInt(formData.stepIndex, 10),
        resources: formData.resources.map(resource => ({
          title: resource.title.trim(),
          url: resource.url.trim(),
          type: resource.type
        }))
      };
      
      let result;
      if (id) {
        result = await Lesson.update(id, submissionData);
      } else {
        result = await Lesson.create(submissionData);
      }
      
      if (result) {
        navigate('/admin/lessons');
      }
    } catch (err) {
      console.error('Error saving lesson:', err);
      setFormErrors(prev => ({
        ...prev,
        server: err.message || 'Error saving lesson'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add AI generation handler
  const handleAiGenerate = async () => {
    try {
      const generatedLesson = await generateLesson(
        aiConfig.topic,
        aiConfig.difficulty,
        aiConfig.context
      );

      // Update form with generated content
      setFormData(prev => ({
        ...prev,
        title: generatedLesson.title,
        description: generatedLesson.description,
        content: generatedLesson.content,
        category: generatedLesson.category,
        difficulty: generatedLesson.difficulty,
        duration: generatedLesson.duration,
        resources: [...prev.resources, ...generatedLesson.resources]
      }));

      setShowAiDialog(false);
      setActiveSection('content'); // Switch to content section to review generated content
    } catch (error) {
      console.error('Error generating lesson:', error);
    }
  };

  if (loading && id) {
    return (
      <div className="px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        <div className="card bg-base-200  w-full  text-center">
          <div className="flex flex-col items-center gap-6">
            <div className="loading loading-spinner loading-lg text-primary"></div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Loading Lesson</h2>
              <p className="text-base-content/70">Please wait while we fetch the lesson details...</p>
            </div>
            <progress className="progress progress-primary w-full"></progress>
            <button 
              onClick={() => navigate('/admin/lessons')}
              className="btn btn-outline btn-sm"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Lessons
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isFormComplete = () => {
    return formData.title && formData.description && formData.content;
  };

  const getCompletionPercentage = () => {
    let completed = 0;
    let total = 3; // Required fields: title, description, content
    
    if (formData.title) completed++;
    if (formData.description) completed++;
    if (formData.content) completed++;
    
    return Math.floor((completed / total) * 100);
  };

  return (
    <div className="container mx-auto px-4 py-20 min-h-screen">
      <FormHeader 
        id={id} 
        navigate={navigate}
        setShowAiDialog={setShowAiDialog}
      />
      
      {error && (
        <div className="alert alert-error mb-8">
          <div className="flex items-center">
            <AlertTriangle size={20} />
            <span>{error}</span>
          </div>
          <button className="btn btn-sm btn-circle btn-ghost">×</button>
        </div>
      )}

      {formErrors.server && (
        <div className="alert alert-error mb-8">
          <div className="flex items-center">
            <AlertTriangle size={20} />
            <span>{formErrors.server}</span>
          </div>
          <button 
            className="btn btn-sm btn-circle btn-ghost"
            onClick={() => setFormErrors(prev => ({ ...prev, server: null }))}
          >×</button>
        </div>
      )}

      <div className="card bg-base-100 overflow-hidden ">
        <div className="grid grid-cols-1 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1 border-r border-base-200">
            <div className="sticky top-8 p-4">
              <FormSidebar 
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                formData={formData}
                navigate={navigate}
                handleSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                loading={loading}
                isFormComplete={isFormComplete}
                id={id}
              />
            </div>
          </div>

          {/* Main Form Content */}
          <div className="lg:col-span-3">
            <div className="p-0">
              <form onSubmit={handleSubmit} className="divide-y divide-base-200">
                {activeSection === 'basic' && (
                  <BasicInfoSection 
                    formData={formData}
                    formErrors={formErrors}
                    handleChange={handleChange}
                    setActiveSection={setActiveSection}
                  />
                )}

                {activeSection === 'content' && (
                  <ContentSection 
                    formData={formData}
                    formErrors={formErrors}
                    handleEditorChange={handleEditorChange}
                    setActiveSection={setActiveSection}
                  />
                )}

                {activeSection === 'resources' && (
                  <ResourcesSection 
                    formData={formData}
                    setFormData={setFormData}
                    newResource={newResource}
                    handleResourceChange={handleResourceChange}
                    addResource={addResource}
                    removeResource={removeResource}
                    setActiveSection={setActiveSection}
                    handleSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    loading={loading}
                    id={id}
                  />
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <AiGenerationDialog 
        showAiDialog={showAiDialog}
        setShowAiDialog={setShowAiDialog}
        aiConfig={aiConfig}
        setAiConfig={setAiConfig}
        handleAiGenerate={handleAiGenerate}
        aiLoading={aiLoading}
        aiError={aiError}
      />
    </div>
  );
};

export default LessonForm;