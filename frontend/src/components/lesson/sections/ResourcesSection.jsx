import { useState } from 'react';
import { LinkIcon, Plus, Trash2, ArrowLeft, CheckCircle, ExternalLink, BookOpen, Video, FileText, Github, Database, Search, Wand2, Type } from 'lucide-react';

export const ResourcesSection = ({
  formData,
  setFormData,
  newResource,
  handleResourceChange,
  addResource,
  removeResource,
  setActiveSection,
  handleSubmit,
  isSubmitting,
  loading,
  id
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [generatingResources, setGeneratingResources] = useState(false);
  const [generatingTitle, setGeneratingTitle] = useState(false);
  const [suggestedTitle, setSuggestedTitle] = useState('');
  
  // Filter resources based on search term
  const filteredResources = formData.resources.filter(resource => 
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    resource.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get resource icon based on type
  const getResourceIcon = (type) => {
    switch(type.toLowerCase()) {
      case 'video':
        return <Video size={16} className="text-red-500" />;
      case 'documentation':
        return <FileText size={16} className="text-blue-500" />;
      case 'repository':
        return <Github size={16} className="text-purple-500" />;
      case 'tutorial':
        return <BookOpen size={16} className="text-green-500" />;
      case 'database':
        return <Database size={16} className="text-amber-500" />;
      default:
        return <ExternalLink size={16} className="text-primary" />;
    }
  };
  
  // Auto-generate resources based on lesson content
  const generateResources = async () => {
    if (!formData.content) {
      alert("Please add lesson content first to generate relevant resources.");
      return;
    }
    
    setGeneratingResources(true);
    
    try {
      // Extract keywords from content
      const keywords = extractKeywords(formData.content);
      
      // Simulate API call to generate resources
      // In a real implementation, this would call an AI service or backend API
      const generatedResources = await simulateResourceGeneration(keywords, formData.title);
      
      // Add generated resources to form data, avoiding duplicates
      const existingUrls = formData.resources.map(r => r.url);
      const newResources = generatedResources.filter(r => !existingUrls.includes(r.url));
      
      if (newResources.length > 0) {
        setFormData(prev => ({
          ...prev,
          resources: [...prev.resources, ...newResources]
        }));
      }
    } catch (error) {
      console.error("Error generating resources:", error);
    } finally {
      setGeneratingResources(false);
    }
  };
  
  // Generate a better title based on content
  const generateTitle = async () => {
    if (!formData.content) {
      alert("Please add lesson content first to generate a title.");
      return;
    }
    
    setGeneratingTitle(true);
    
    try {
      // Extract main topics and themes from content
      const text = formData.content.replace(/<[^>]*>/g, ' '); // Remove HTML tags
      
      // Simulate API call to generate title
      // In a real implementation, this would call an AI service or backend API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate title based on content analysis
      const topics = extractMainTopics(text);
      const generatedTitle = generateTitleFromTopics(topics, formData.difficulty);
      
      setSuggestedTitle(generatedTitle);
    } catch (error) {
      console.error("Error generating title:", error);
    } finally {
      setGeneratingTitle(false);
    }
  };
  
  // Apply the suggested title
  const applyTitle = () => {
    if (suggestedTitle) {
      setFormData(prev => ({
        ...prev,
        title: suggestedTitle
      }));
      setSuggestedTitle('');
    }
  };
  
  // Extract main topics from content
  const extractMainTopics = (text) => {
    // Simple topic extraction - in a real implementation, this would be more sophisticated
    const words = text.toLowerCase().split(/\W+/);
    const stopWords = ['the', 'and', 'a', 'an', 'in', 'on', 'at', 'for', 'to', 'of', 'with', 'is', 'are', 'this', 'that'];
    const filteredWords = words.filter(word => 
      word.length > 3 && !stopWords.includes(word)
    );
    
    // Count word frequency
    const wordCount = {};
    filteredWords.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    // Get top topics
    return Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(entry => entry[0]);
  };
  
  // Generate title from topics
  const generateTitleFromTopics = (topics, difficulty) => {
    // Extract key topics from the content
    const mainTopic = topics[0] ? topics[0].charAt(0).toUpperCase() + topics[0].slice(1) : '';
    const secondaryTopic = topics[1] ? topics[1] : '';
    
    // Title templates based on difficulty
    const titleTemplates = {
      'Beginner': [
        `Introduction to ${mainTopic}: A Beginner's Guide`,
        `${mainTopic} Fundamentals: Getting Started`,
        `${mainTopic} 101: Essential Concepts for Beginners`,
        `Understanding ${mainTopic}: First Steps`,
        `The Complete Beginner's Guide to ${mainTopic}`
      ],
      'Intermediate': [
        `Mastering ${mainTopic}: Intermediate Techniques`,
        `${mainTopic} in Practice: Beyond the Basics`,
        `Advanced ${mainTopic} Concepts and Applications`,
        `${mainTopic} and ${secondaryTopic}: Practical Approaches`,
        `Developing ${mainTopic} Skills: Intermediate Level`
      ],
      'Advanced': [
        `Expert ${mainTopic}: Advanced Strategies and Patterns`,
        `${mainTopic} Mastery: Professional Techniques`,
        `Advanced ${mainTopic}: Optimizing for Performance`,
        `${mainTopic} Architecture: Professional Implementation`,
        `${mainTopic} at Scale: Advanced Implementation Strategies`
      ]
    };
    
    // Select a random title template based on difficulty
    const templates = titleTemplates[difficulty] || titleTemplates['Beginner'];
    const randomIndex = Math.floor(Math.random() * templates.length);
    
    return templates[randomIndex];
  };
  
  // Extract keywords from content
  const extractKeywords = (content) => {
    // Simple keyword extraction - in a real implementation, this would be more sophisticated
    const text = content.replace(/<[^>]*>/g, ' '); // Remove HTML tags
    const words = text.toLowerCase().split(/\W+/);
    const stopWords = ['the', 'and', 'a', 'an', 'in', 'on', 'at', 'for', 'to', 'of', 'with'];
    const filteredWords = words.filter(word => 
      word.length > 3 && !stopWords.includes(word)
    );
    
    // Count word frequency
    const wordCount = {};
    filteredWords.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    // Get top keywords
    return Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(entry => entry[0]);
  };
  
  // Simulate resource generation
  const simulateResourceGeneration = async (keywords, title) => {
    // In a real implementation, this would call an AI service or backend API
    // For now, we'll simulate with some predefined resources based on keywords
    
    // Wait to simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const resourceTemplates = [
      {
        keyword: 'ai',
        resources: [
          { title: 'Introduction to AI', url: 'https://www.ibm.com/cloud/learn/what-is-artificial-intelligence', type: 'Documentation' },
          { title: 'AI Explained', url: 'https://www.youtube.com/watch?v=mJeNghZXtMo', type: 'Video' },
          { title: 'Machine Learning for Beginners', url: 'https://github.com/microsoft/ML-For-Beginners', type: 'Repository' }
        ]
      },
      {
        keyword: 'machine',
        resources: [
          { title: 'Machine Learning Crash Course', url: 'https://developers.google.com/machine-learning/crash-course', type: 'Tutorial' },
          { title: 'Scikit-Learn Documentation', url: 'https://scikit-learn.org/stable/documentation.html', type: 'Documentation' }
        ]
      },
      {
        keyword: 'learning',
        resources: [
          { title: 'Deep Learning Specialization', url: 'https://www.coursera.org/specializations/deep-learning', type: 'Tutorial' },
          { title: 'TensorFlow Tutorials', url: 'https://www.tensorflow.org/tutorials', type: 'Documentation' }
        ]
      },
      {
        keyword: 'neural',
        resources: [
          { title: 'Neural Networks Explained', url: 'https://www.youtube.com/watch?v=aircAruvnKk', type: 'Video' },
          { title: 'Neural Network Playground', url: 'https://playground.tensorflow.org/', type: 'Link' }
        ]
      },
      {
        keyword: 'data',
        resources: [
          { title: 'Kaggle Datasets', url: 'https://www.kaggle.com/datasets', type: 'Database' },
          { title: 'Data Science Handbook', url: 'https://jakevdp.github.io/PythonDataScienceHandbook/', type: 'Documentation' }
        ]
      },
      {
        keyword: 'algorithm',
        resources: [
          { title: 'Algorithm Visualizations', url: 'https://visualgo.net/', type: 'Link' },
          { title: 'Introduction to Algorithms', url: 'https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-006-introduction-to-algorithms-fall-2011/', type: 'Tutorial' }
        ]
      },
      {
        keyword: 'python',
        resources: [
          { title: 'Python Documentation', url: 'https://docs.python.org/3/', type: 'Documentation' },
          { title: 'Python for Data Science', url: 'https://www.youtube.com/watch?v=LHBE6Q9XlzI', type: 'Video' }
        ]
      },
      {
        keyword: 'beginner',
        resources: [
          { title: 'Programming for Beginners', url: 'https://www.freecodecamp.org/learn', type: 'Tutorial' },
          { title: 'Beginner Coding Projects', url: 'https://github.com/practical-tutorials/project-based-learning', type: 'Repository' }
        ]
      },
      {
        keyword: 'artificial',
        resources: [
          { title: 'Artificial Intelligence: A Modern Approach', url: 'http://aima.cs.berkeley.edu/', type: 'Documentation' },
          { title: 'AI Research Papers', url: 'https://arxiv.org/list/cs.AI/recent', type: 'Documentation' }
        ]
      },
      {
        keyword: 'intelligence',
        resources: [
          { title: 'Elements of AI', url: 'https://www.elementsofai.com/', type: 'Tutorial' },
          { title: 'AI Ethics Guidelines', url: 'https://www.microsoft.com/en-us/ai/responsible-ai', type: 'Documentation' }
        ]
      }
    ];
    
    // Match keywords with resource templates
    let matchedResources = [];
    keywords.forEach(keyword => {
      const template = resourceTemplates.find(t => 
        keyword.includes(t.keyword) || t.keyword.includes(keyword)
      );
      if (template) {
        matchedResources = [...matchedResources, ...template.resources];
      }
    });
    
    // Add a generic resource based on the title
    matchedResources.push({
      title: `Learn more about ${title}`,
      url: `https://www.google.com/search?q=${encodeURIComponent(title)}`,
      type: 'Link'
    });
    
    // Remove duplicates
    const uniqueResources = [];
    const urls = new Set();
    matchedResources.forEach(resource => {
      if (!urls.has(resource.url)) {
        urls.add(resource.url);
        uniqueResources.push(resource);
      }
    });
    
    return uniqueResources.slice(0, 5); // Return up to 5 resources
  };
  
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6 flex items-center text-primary">
        <LinkIcon size={20} className="mr-2" />
        Additional Resources
      </h2>
      
      <div className="space-y-6">
        {/* AI Enhancement Tools */}
        <div className="bg-base-200 p-4 rounded-lg">
          <h3 className="font-medium mb-4">AI Enhancement Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title Generator */}
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body p-4">
                <h4 className="card-title text-sm flex items-center">
                  <Type size={16} className="mr-2" />
                  Title Generator
                </h4>
                <p className="text-xs text-base-content/70 mb-2">
                  Generate an engaging title based on your lesson content.
                </p>
                
                {suggestedTitle && (
                  <div className="alert alert-info mb-3 py-2">
                    <div className="flex flex-col items-start">
                      <span className="text-xs font-semibold">Suggested Title:</span>
                      <p className="text-sm">{suggestedTitle}</p>
                    </div>
                    <div>
                      <button 
                        className="btn btn-xs btn-ghost"
                        onClick={applyTitle}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={generateTitle}
                  className="btn btn-sm btn-primary w-full"
                  disabled={generatingTitle || !formData.content}
                >
                  {generatingTitle ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 size={14} className="mr-1" />
                      Generate Title
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Resource Generator */}
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body p-4">
                <h4 className="card-title text-sm flex items-center">
                  <LinkIcon size={16} className="mr-2" />
                  Resource Generator
                </h4>
                <p className="text-xs text-base-content/70 mb-2">
                  Generate helpful resources based on your lesson content.
                </p>
                <button
                  type="button"
                  onClick={generateResources}
                  className="btn btn-sm btn-primary w-full"
                  disabled={generatingResources || !formData.content}
                >
                  {generatingResources ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 size={14} className="mr-1" />
                      Generate Resources
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Search and Filter */}
        {formData.resources.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="form-control flex-1">
              <div className="input-group">
                <span className="btn btn-square btn-ghost">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  placeholder="Search resources..."
                  className="input input-bordered w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button 
                    className="btn btn-square"
                    onClick={() => setSearchTerm('')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
              </div>
            </div>
            <div className="badge badge-neutral">{formData.resources.length} resources</div>
          </div>
        )}
        
        {/* Resources Grid */}
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResources.map((resource, index) => (
              <div key={index} className="bg-base-200 p-4 rounded-lg hover:shadow-md transition-shadow relative group">
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => removeResource(formData.resources.findIndex(r => r === resource))}
                    className="btn btn-error btn-xs btn-circle"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  {getResourceIcon(resource.type)}
                  {resource.title}
                </h4>
                <p className="text-sm text-base-content/70 mb-3 truncate">{resource.url}</p>
                <div className="flex justify-between items-center">
                  <div className="badge badge-outline">{resource.type}</div>
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-xs btn-primary"
                  >
                    Open
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert bg-base-200">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span>
                {searchTerm ? 'No resources match your search.' : 'No resources added yet. Add some helpful links for your students!'}
              </span>
            </div>
          </div>
        )}

        {/* Add New Resource Form */}
        <div className="card bg-base-200 p-4 rounded-lg">
          <h3 className="font-medium mb-4">Add New Resource</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Resource Title</span>
              </label>
              <input
                type="text"
                name="title"
                value={newResource.title}
                onChange={handleResourceChange}
                className="input input-bordered w-full bg-base-100 focus:outline-none"
                placeholder="E.g., Documentation"
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Resource URL</span>
              </label>
              <input
                type="url"
                name="url"
                value={newResource.url}
                onChange={handleResourceChange}
                className="input input-bordered w-full bg-base-100 focus:outline-none"
                placeholder="https://example.com"
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Resource Type</span>
              </label>
              <select
                name="type"
                value={newResource.type}
                onChange={handleResourceChange}
                className="select select-bordered w-full bg-base-100 focus:outline-none"
              >
                <option value="Link">Link</option>
                <option value="Video">Video</option>
                <option value="Documentation">Documentation</option>
                <option value="Repository">Repository</option>
                <option value="Tutorial">Tutorial</option>
                <option value="Database">Database</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={addResource}
              className="btn btn-primary"
              disabled={!newResource.title || !newResource.url}
            >
              <Plus size={18} className="mr-1" />
              Add Resource
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-6 pt-4 border-t border-base-200">
        <button 
          type="button" 
          className="btn btn-outline gap-2"
          onClick={() => setActiveSection('content')}
        >
          <ArrowLeft size={16} />
          Back: Content
        </button>
        <button
          type="submit"
          className="btn btn-success gap-2"
          disabled={isSubmitting || loading}
          onClick={handleSubmit}
        >
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner"></span>
              Saving...
            </>
          ) : (
            <>
              <CheckCircle size={18} className="mr-1" />
              {id ? 'Update Lesson' : 'Create Lesson'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}; 