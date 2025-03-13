import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock, Eye } from 'lucide-react';

const VideoCard = ({ video }) => {
  // Extract YouTube ID from URL
  const getYoutubeId = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.includes('/shorts/') 
        ? urlObj.pathname.split('/shorts/')[1]
        : urlObj.searchParams.get('v');
    } catch {
      return null;
    }
  };

  // Format duration to hh:mm:ss
  const formatDuration = (duration) => {
    if (!duration) return '00:00:00'; // Handle zero duration
    const [hours, minutes, seconds] = duration.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
  };

  return (
    <Link to={`/videos/${video._id}`}>
      <div 
        className="card card-compact group relative bg-base-100 overflow-hidden shadow-lg ring-2 ring-primary/10 transition-all duration-300"
      >
        {/* Video Container */}
        <div className="relative aspect-video">
          {getYoutubeId(video.url) ? (
            <iframe
              src={`https://www.youtube.com/embed/${getYoutubeId(video.url)}`}
              title={video.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full bg-base-200 flex items-center justify-center">
              <Play className="w-12 h-12 text-base-content/50" />
            </div>
          )}
          
          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded-md text-sm flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {formatDuration(video.duration || '00:00:00')}
          </div>

          {/* Category badge */}
          <div className="absolute top-2 left-2">
            <span className="badge badge-primary">{video.category || 'Uncategorized'}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {video.title}
          </h3>
          
          <div className="flex items-center justify-end text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {video.views.toLocaleString()} views
            </div>
          </div>
          
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {video.description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
