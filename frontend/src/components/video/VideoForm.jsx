import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader, Video, Link, FileText, Image, Clock, Eye, Wand2 } from 'lucide-react';
import useVideo from '../../hooks/useVideo';
import { generateVideoSuggestion } from '../Ai/VideoGenerator';
import SuggestedVideoSelector from './SuggestedVideoSelector';

const VideoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading, error, getVideoById, createVideo, updateVideo } = useVideo();

  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    url: '',
    thumbnail: '',
    duration: '',
    views: 0,
    category: 'Other',
    createdAt: null,
    updatedAt: null
  });

  const [errors, setErrors] = React.useState({});
  const [submitError, setSubmitError] = React.useState('');
  const [youtubeId, setYoutubeId] = React.useState('');
  const [isShort, setIsShort] = React.useState(false);
  const [aiLoading, setAiLoading] = React.useState(false);

  const categories = [
    "Programming",
    "Web Development",
    "Data Science", 
    "Machine Learning",
    "DevOps",
    "Mobile Development",
    "Game Development",
    "Computer Science",
    "Software Engineering",
    "Other"
  ];

  React.useEffect(() => {
    const fetchVideo = async () => {
      if (id) {
        try {
          const response = await getVideoById(id);
          const video = response.data;
          setFormData({
            title: video.title || '',
            description: video.description || '',
            url: video.url || '',
            thumbnail: video.thumbnail || '',
            duration: video.duration || '',
            views: video.views || 0,
            category: video.category || 'Other',
            createdAt: video.createdAt || null,
            updatedAt: video.updatedAt || null
          });
          // Extract YouTube ID from URL
          if (video.url) {
            const url = new URL(video.url);
            if (url.pathname.includes('/shorts/')) {
              setIsShort(true);
              setYoutubeId(url.pathname.split('/shorts/')[1]);
            } else {
              setIsShort(false);
              setYoutubeId(url.searchParams.get('v'));
            }
          }
        } catch (err) {
          setSubmitError('Failed to fetch video details');
        }
      }
    };
    fetchVideo();
  }, [id, getVideoById]);

  React.useEffect(() => {
    // Extract YouTube ID whenever URL changes
    if (formData.url) {
      try {
        const url = new URL(formData.url);
        if (url.pathname.includes('/shorts/')) {
          setIsShort(true);
          setYoutubeId(url.pathname.split('/shorts/')[1]);
        } else {
          setIsShort(false);
          setYoutubeId(url.searchParams.get('v'));
        }
      } catch (err) {
        setYoutubeId('');
        setIsShort(false);
      }
    } else {
      setYoutubeId('');
      setIsShort(false);
    }
  }, [formData.url]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!formData.url.trim()) {
      newErrors.url = 'URL is required';
    } else {
      try {
        const url = new URL(formData.url);
        const isYoutubeUrl = url.hostname === 'www.youtube.com' || url.hostname === 'youtube.com' || url.hostname === 'youtu.be';
        if (!isYoutubeUrl) {
          newErrors.url = 'Must be a valid YouTube URL';
        }
      } catch (err) {
        newErrors.url = 'Must be a valid URL';
      }
    }

    if (formData.description && formData.description.length > 5000) {
      newErrors.description = 'Description must be less than 5000 characters';
    }

    if (formData.duration) {
      const durationRegex = /^(\d{1,2}):([0-5]?\d):([0-5]\d)$/; // Updated regex to allow HH:MM:SS format
      if (!durationRegex.test(formData.duration)) {
        newErrors.duration = 'Duration must be in format HH:MM:SS (e.g. 04:26:52)';
      }
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    if (!validateForm()) {
      return;
    }

    try {
      const videoData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        url: formData.url.trim(),
        thumbnail: formData.thumbnail,
        duration: formData.duration.trim(),
        views: formData.views,
        category: formData.category
      };

      if (id) {
        await updateVideo(id, videoData);
      } else {
        await createVideo(videoData);
      }
      navigate('/admin/videos');
    } catch (err) {
      setSubmitError(err.message || 'Failed to save video. Please check all required fields.');
    }
  };

  const handleAiSuggestion = async () => {
    if (!formData.title) {
      setSubmitError('Please enter a title first to get AI suggestions');
      return;
    }

    setAiLoading(true);
    try {
      const result = await generateVideoSuggestion(formData.title);
      if (result.success) {
        setFormData(prev => ({
          ...prev,
          description: result.data.description || prev.description,
          url: result.data.youtubeId ? `https://www.youtube.com/watch?v=${result.data.youtubeId}` : prev.url,
          thumbnail: result.data.thumbnail || prev.thumbnail,
          duration: result.data.duration ? result.data.duration : prev.duration,
          category: result.data.category || prev.category
        }));
      } else {
        setSubmitError(result.error);
      }
    } catch (err) {
      setSubmitError('Failed to get AI suggestions. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 py-24">
      {submitError && (
        <div className="alert alert-error mb-6 shadow-lg">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p>{submitError}</p>
          </div>
        </div>
      )}

      <SuggestedVideoSelector onVideoSelect={(video) => {
        setFormData({
          title: video.title,
          description: video.description,
          url: `https://www.youtube.com/watch?v=${video.youtubeId}`,
          thumbnail: video.thumbnail,
          duration: video.duration,
          views: video.views,
          category: video.category
        });
      }} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div className="card-body space-y-6">
            <div className="form-control relative">
              <label className="label">
                <span className="label-text flex items-center gap-2 text-base font-medium">
                  <Video className="w-4 h-4" />
                  Title
                  <span className="text-error">*</span>
                </span>
                <span className="label-text-alt">{formData.title.length}/100</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`input input-bordered w-full pl-10 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 ${errors.title ? 'input-error' : ''}`}
                  placeholder="Enter video title"
                  maxLength={100}
                  required
                />
                <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              {errors.title && (
                <label className="label">
                  <span className="label-text-alt text-error flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.title}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control relative">
              <label className="label">
                <span className="label-text flex items-center gap-2 text-base font-medium">
                  <Link className="w-4 h-4" />
                  YouTube URL
                  <span className="text-error">*</span>
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  className={`input input-bordered w-full pl-10 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 ${errors.url ? 'input-error' : ''}`}
                  placeholder="https://www.youtube.com/watch?v=... or https://youtube.com/shorts/..."
                  required
                />
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              {errors.url && (
                <label className="label">
                  <span className="label-text-alt text-error flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.url}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control relative">
              <label className="label">
                <span className="label-text flex items-center gap-2 text-base font-medium">
                  <FileText className="w-4 h-4" />
                  Description
                </span>
                <span className="label-text-alt">{formData.description.length}/5000</span>
              </label>
              <div className="relative">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered w-full pl-10 h-32 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Enter video description"
                  maxLength={5000}
                />
                <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              </div>
              {errors.description && (
                <label className="label">
                  <span className="label-text-alt text-error flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.description}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control relative">
              <label className="label">
                <span className="label-text flex items-center gap-2 text-base font-medium">
                  <Image className="w-4 h-4" />
                  Thumbnail URL
                </span>
              </label>
              <div className="relative">
                <input
                  type="url" 
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleInputChange}
                  className="input input-bordered w-full pl-10 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Enter thumbnail URL"
                />
                <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="form-control relative">
              <label className="label">
                <span className="label-text flex items-center gap-2 text-base font-medium">
                  <Clock className="w-4 h-4" />
                  Duration
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className={`input input-bordered w-full pl-10 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 ${errors.duration ? 'input-error' : ''}`}
                  placeholder="e.g. 04:26:52"
                />
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              {errors.duration && (
                <label className="label">
                  <span className="label-text-alt text-error flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.duration}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control relative">
              <label className="label">
                <span className="label-text flex items-center gap-2 text-base font-medium">
                  Category
                  <span className="text-error">*</span>
                </span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`select select-bordered w-full focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 ${errors.category ? 'select-error' : ''}`}
                required
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && (
                <label className="label">
                  <span className="label-text-alt text-error flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.category}
                  </span>
                </label>
              )}
            </div>

            <div className="flex gap-4">
              <button 
                type="submit" 
                className="btn btn-primary flex-1 mt-6 gap-2 hover:opacity-90 transition-all duration-200 hover:shadow-lg disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Video className="w-5 h-5" />
                    {id ? 'Update Video' : 'Create Video'}
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn btn-secondary mt-6 gap-2 hover:opacity-90 transition-all duration-200 hover:shadow-lg disabled:opacity-50"
                onClick={handleAiSuggestion}
                disabled={aiLoading || !formData.title}
              >
                {aiLoading ? (
                  <>
                    <Loader className="animate-spin" />
                    Getting suggestions...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    Get AI Suggestions
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div className="card-body">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Preview
            </h3>
            <div className="card bg-base-100 hover:shadow-lg transition-shadow duration-200">
              <div className="card-body">
                <h2 className="card-title">{formData.title || 'Video Title'}</h2>
                
                {youtubeId ? (
                  <div className={`w-full mt-2 ${isShort ? 'aspect-[9/16]' : 'aspect-video'}`}>
                    <iframe
                      className="w-full h-full rounded-lg shadow-md"
                      src={`https://www.youtube.com/embed/${youtubeId}${isShort ? '?loop=1' : ''}`}
                      title={formData.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : formData.thumbnail && (
                  <figure className="mt-2">
                    <img src={formData.thumbnail} alt="Video thumbnail" className="rounded-lg w-full shadow-md" />
                  </figure>
                )}

                <p className="mt-4 whitespace-pre-wrap text-base">{formData.description || 'Video description will appear here'}</p>
                <div className="flex flex-wrap gap-4 mt-4">
                  {formData.duration && (
                    <div className="badge badge-outline flex items-center gap-1 p-3">
                      <Clock className="w-3 h-3" />
                      {formData.duration}
                    </div>
                  )}
                  <div className="badge badge-outline flex items-center gap-1 p-3">
                    <Eye className="w-3 h-3" />
                    {formData.viewCount ? formData.viewCount.toLocaleString() : 'N/A'} views
                  </div>
                  {isShort && (
                    <div className="badge badge-secondary p-3">Short</div>
                  )}
                  <div className="badge badge-primary p-3">{formData.category}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoForm;
