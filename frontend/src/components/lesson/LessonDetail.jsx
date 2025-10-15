import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Clock, BookOpen, Tag, ChevronRight, Heart, Share2, Bookmark, MessageCircle, Edit } from 'lucide-react';
import useLesson from '../../hooks/useLesson';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

const LessonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lesson, loading, error, fetchLessonById, updateLesson } = useLesson();
  const [activeTab, setActiveTab] = useState('content');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [processedContent, setProcessedContent] = useState('');

  useEffect(() => {
    // Configure marked options with enhanced code highlighting
    marked.setOptions({
      renderer: new marked.Renderer(),
      highlight: function(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      },
      langPrefix: 'hljs language-',
      pedantic: false,
      gfm: true,
      breaks: true,
      sanitize: false,
      smartypants: false,
      xhtml: false
    });
  }, []);

  useEffect(() => {
    if (id) {
      fetchLessonById(id);
      window.scrollTo(0, 0);
    }
  }, [id, fetchLessonById]);

  useEffect(() => {
    if (lesson?.content) {
      // Process content through marked for rendering
      const rawContent = DOMPurify.sanitize(lesson.content);
      const processed = marked(rawContent);
      setProcessedContent(processed);
    }
  }, [lesson?.content]);

  // Show loading state with skeleton
  if (loading) {
    return (
      <div className="card bg-base-100 py-20 min-h-screen animate-pulse">
        <div className="h-48 w-full bg-base-300 rounded-lg"></div>
        <div className="card-body">
          <div className="h-8 w-3/4 bg-base-300 rounded-lg mb-4"></div>
          <div className="h-4 w-1/2 bg-base-300 rounded-lg mb-2"></div>
          <div className="h-4 w-1/3 bg-base-300 rounded-lg mb-6"></div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-base-300 rounded-lg"></div>
            <div className="h-4 w-full bg-base-300 rounded-lg"></div>
            <div className="h-4 w-3/4 bg-base-300 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64 p-6 bg-red-50 rounded-lg border border-red-200">
        <p className="text-lg text-red-500 font-semibold mb-2">Error Loading Lesson</p>
        <p className="text-red-400">{error}</p>
        <button 
          onClick={() => fetchLessonById(id)} 
          className="mt-4 btn btn-sm btn-outline btn-error"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Check if lesson is undefined
  if (!lesson) {
    return (
      <div className="flex flex-col justify-center items-center h-64 p-6 bg-base-200 rounded-lg">
        <p className="text-lg text-base-content/70 font-semibold">Lesson not found</p>
        <Link to="/lessons" className="mt-4 btn btn-sm btn-primary">
          Browse Lessons
        </Link>
      </div>
    );
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Here you would implement actual bookmark functionality
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // Here you would implement actual like functionality
  };

  const handleEdit = () => {
    navigate(`/admin/lessons/${id}/edit`);
  };

  const sanitizedDescription = lesson.description ? DOMPurify.sanitize(lesson.description) : '';

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 min-h-screen overflow-hidden">
      {lesson.thumbnail && (
        <div className="relative">
          <figure className="relative h-64 md:h-80 w-full">
            <img 
              src={lesson.thumbnail} 
              alt={lesson.title || 'Lesson Thumbnail'} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/api/placeholder/500/500";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          </figure>
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md">{lesson.title}</h1>
            {lesson.isAuthor && (
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg border border-white/30 hover:border-white/40 transition-all duration-300 flex items-center gap-2 font-medium"
              >
                <Edit size={16} />
                Edit Lesson
              </button>
            )}
          </div>
        </div>
      )}
      
      <div className="relative z-10 -mt-6 bg-white/10 backdrop-blur-sm rounded-t-3xl shadow-lg p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/20">
          <div className="flex flex-wrap items-center gap-2 text-sm text-white/70">
            {lesson.duration && (
              <div className="flex items-center px-3 py-2 bg-white/10 text-white/80 rounded-full border border-white/20">
                <Clock className="w-4 h-4 mr-2" />
                <span>{lesson.duration === "PT30M" ? "30 min" : lesson.duration}</span>
              </div>
            )}
            
            {lesson.category && (
              <div className="flex items-center px-3 py-2 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
                <Tag className="w-4 h-4 mr-2" />
                <span>{lesson.category}</span>
              </div>
            )}

            {lesson.difficulty && (
              <div className="flex items-center px-3 py-2 bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/30">
                <BookOpen className="w-4 h-4 mr-2" />
                <span>{lesson.difficulty}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleLike}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                isLiked 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                  : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20 hover:text-white'
              }`}
              aria-label="Like lesson"
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button 
              onClick={handleBookmark}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                isBookmarked 
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                  : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20 hover:text-white'
              }`}
              aria-label="Bookmark lesson"
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
            <button 
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 text-white/70 border border-white/20 hover:bg-white/20 hover:text-white transition-all duration-300"
              aria-label="Share lesson"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex gap-2 my-6">
          <button 
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'content' 
                ? 'bg-white/20 text-white border border-white/40' 
                : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/15 hover:text-white'
            }`}
            onClick={() => setActiveTab('content')}
          >
            Content
          </button>
          <button 
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'resources' 
                ? 'bg-white/20 text-white border border-white/40' 
                : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/15 hover:text-white'
            }`}
            onClick={() => setActiveTab('resources')}
          >
            Resources
          </button>
          <button 
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'discussion' 
                ? 'bg-white/20 text-white border border-white/40' 
                : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/15 hover:text-white'
            }`}
            onClick={() => setActiveTab('discussion')}
          >
            Discussion
          </button>
        </div>
        
        {activeTab === 'content' && (
          <>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 mb-6">
              <p className="text-white/80 italic text-lg leading-relaxed">{sanitizedDescription}</p>
            </div>
            
            {lesson.content && (
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/20 mb-6">
                <div className="prose prose-invert prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: processedContent }} />
              </div>
            )}
          </>
        )}
        
        {activeTab === 'resources' && (
          <div className="mt-4">
            {lesson.resources && lesson.resources.length > 0 ? (
              <>
                <h3 className="font-semibold text-base-content mb-3 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-primary" />
                  Additional Resources
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lesson.resources.map((resource, index) => (
                    <div key={index} className="bg-base-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                      <h4 className="font-medium mb-2">{resource.title}</h4>
                      <p className="text-sm text-base-content/70 mb-3">{resource.description}</p>
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-sm btn-primary w-full"
                      >
                        Open Resource
                      </a>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-base-content/70">
                <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No additional resources available for this lesson.</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'discussion' && (
          <div className="mt-4">
            <div className="text-center py-8 text-base-content/70">
              <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="mb-4">Join the discussion about this lesson.</p>
              <button className="btn btn-primary">Start Discussion</button>
            </div>
          </div>
        )}
        
        <div className="card-actions justify-between pb-15 ">
          <Link to={`/lessons`} className="btn btn-outline gap-2">
            <ChevronRight className="w-5 h-5 rotate-180" />
            Back to Lessons
          </Link>
          {lesson.nextLessonId ? (
            <Link to={`/lessons/${lesson.nextLessonId}`} className="btn btn-primary gap-2">
              Next Lesson
              <ChevronRight className="w-5 h-5" />
            </Link>
          ) : (
            <button className="btn btn-disabled gap-2">
              Last Lesson
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonDetail;