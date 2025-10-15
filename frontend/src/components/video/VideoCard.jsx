import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <motion.div
      className="group relative bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-500 overflow-hidden h-full"
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link to={`/videos/${video._id}`} className="block h-full">
        {/* Video Container */}
        <div className="relative aspect-video overflow-hidden">
          {getYoutubeId(video.url) ? (
            <iframe
              src={`https://www.youtube.com/embed/${getYoutubeId(video.url)}`}
              title={video.title}
              className="w-full h-full transition-transform duration-500 group-hover:scale-105"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full bg-white/10 flex items-center justify-center">
              <Play className="w-16 h-16 text-white/50" />
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.div 
              className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Play className="w-8 h-8 ml-1" />
            </motion.div>
          </div>
          
          {/* Duration badge */}
          <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 border border-white/20">
            <Clock className="w-4 h-4" />
            {formatDuration(video.duration || '00:00:00')}
          </div>

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full border border-white/30">
              {video.category || 'Uncategorized'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-lg font-bold text-white line-clamp-2 mb-3 group-hover:text-white/90 transition-colors">
            {video.title}
          </h3>
          
          <p className="text-sm text-white/70 line-clamp-2 flex-1 leading-relaxed mb-4">
            {video.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm text-white/60">
              <Eye className="w-4 h-4" />
              <span>{video.views?.toLocaleString() || '0'} views</span>
            </div>
            
            <div className="text-sm text-white/60">
              Watch Now →
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default VideoCard;
