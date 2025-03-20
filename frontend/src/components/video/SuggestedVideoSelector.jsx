import React, { useState } from 'react';
import { generateVideoSuggestion } from '../Ai/VideoGenerator';
import { Loader, Video, Eye, Wand2 } from 'lucide-react';

const SuggestedVideoSelector = ({ onVideoSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [enhancingDescription, setEnhancingDescription] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-2.0-flash');

  const models = [
    { id: 'gemini-2.0-flash', name: 'Gemini Flash' },
    { id: 'gemini-1.0-pro', name: 'Gemini Pro' },
    { id: 'gemini-1.0-ultra', name: 'Gemini Ultra' }
  ];

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError('');
    setSuggestions([]);
    setEnhancingDescription(false);

    try {
      const result = await generateVideoSuggestion(searchTerm, 0, selectedModel);
      if (result.success) {
        setEnhancingDescription(true);
        setSuggestions([result.data]);
        setEnhancingDescription(false);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to fetch suggestions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mb-8">
      <div className="flex gap-2 mb-4">
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="select select-bordered"
        >
          {models.map(model => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter topic for video suggestions..."
          className="input input-bordered flex-1"
        />
        <button 
          type="button" 
          className="btn btn-primary"
          onClick={handleSearch}
          disabled={loading || enhancingDescription}
        >
          {loading ? <Loader className="animate-spin" /> : enhancingDescription ? <Wand2 className="animate-pulse" /> : 'Get Suggestions'}
        </button>
      </div>

      {error && (
        <div className="alert alert-error mt-4">
          <p>{error}</p>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="mt-4">
          {suggestions.map((video) => (
            <div 
              key={video.youtubeId}
              className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow cursor-pointer mb-2"
              onClick={() => onVideoSelect(video)}
            >
              <div className="flex flex-col md:flex-row">
                <figure className="relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 text-xs rounded">
                    {video.duration}
                  </div>
                </figure>
                <div className="card-body">
                  <h3 className="card-title text-base">{video.title}</h3>
                  <p className="text-sm line-clamp-2">{video.description}</p>
                  <div className="flex gap-4 mt-2">
                    <span className="flex items-center gap-1 text-sm">
                      <Eye className="w-4 h-4" />
                      {video.viewCount ? video.viewCount.toLocaleString() : 'N/A'} views
                    </span>
                    {video.channelTitle && (
                      <span className="text-sm text-gray-500">
                        {video.channelTitle}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuggestedVideoSelector;