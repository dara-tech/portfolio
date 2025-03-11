import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock, Eye } from 'lucide-react';

const VideoCard = ({ video }) => {
  // Extract YouTube ID from URL
  const getYoutubeId = (url) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.pathname.includes('/shorts/')) {
        return urlObj.pathname.split('/shorts/')[1];
      }
      return urlObj.searchParams.get('v');
    } catch (err) {
      return null;
    }
  };

  // Format duration to minutes:seconds
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Link to={`/videos/${video._id}`}>
      <div 
        className="group relative bg-base-100 rounded-xl overflow-hidden shadow-lg ring-2 ring-primary/10 transition-all duration-300"
      >
        {/* Thumbnail Container */}
        <div className="relative aspect-video">
          <img
            src={`https://img.youtube.com/vi/${getYoutubeId(video.url)}/maxresdefault.jpg`}
            alt={video.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Play className="w-16 h-16 text-white" />
          </div>
          
          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded-md text-sm flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {formatDuration(video.duration || 0)}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {video.title}
          </h3>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span className="badge badge-ghost">{video.category || 'Uncategorized'}</span>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {video.views.toLocaleString()} views
            </div>
          </div>
          
          {/* Description preview */}
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {video.description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
