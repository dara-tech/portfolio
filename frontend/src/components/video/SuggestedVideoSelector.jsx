import React, { useState } from 'react';
import { generateVideoSuggestion } from '../Ai/VideoGenerator';
import { Loader, Video, Eye } from 'lucide-react';

const SuggestedVideoSelector = ({ onVideoSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError('');
    setSuggestions([]);

    try {
      const result = await generateVideoSuggestion(searchTerm);
      if (result.success) {
        setSuggestions([result.data]); // Assuming we get a single suggestion
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
          disabled={loading}
        >
          {loading ? <Loader className="animate-spin" /> : 'Get Suggestions'}
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
                <figure className=" relative">
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
                      {video.views ? video.views.toLocaleString() : 'N/A'} views
                    </span>
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