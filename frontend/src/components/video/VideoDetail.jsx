import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader } from 'lucide-react';
import useVideo from '../../hooks/useVideo';

const VideoDetail = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { getVideoById, incrementVideoView } = useVideo();

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

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await getVideoById(id);
        setVideo(response.data);
        await incrementVideoView(id);
      } catch {
        setError('Failed to fetch video details');
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [id, getVideoById, incrementVideoView]);

  // Format duration to hh:mm:ss following VideoCard.jsx format
  const formatDuration = (duration) => {
    if (!duration) return '00:00:00'; // Handle zero duration
    const [hours, minutes, seconds] = duration.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-500/20 backdrop-blur-sm text-red-400 px-8 py-6 rounded-2xl border border-red-500/30 max-w-md">
          <h3 className="text-xl font-semibold mb-2">Error Loading Video</h3>
          <p>{error || 'Video not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            <span>←</span>
            <span>Back to Videos</span>
          </button>
        </div>

        {/* Main Content Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Video Player */}
          <div className="lg:col-span-2 space-y-8">
            {/* Video Player */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="aspect-video overflow-hidden rounded-xl">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${getYoutubeId(video.url)}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Video Description */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">Description</h2>
              <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{video.description}</p>
            </div>
          </div>

          {/* Right Column - Video Info */}
          <div className="space-y-6">
            {/* Video Header */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h1 className="text-2xl font-bold text-white mb-4 line-clamp-3">{video.title}</h1>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-white/70">
                  <span>Category</span>
                  <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm border border-white/30">
                    {video.category || 'Uncategorized'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-white/70">
                  <span>Duration</span>
                  <span className="text-white">{formatDuration(video.duration)}</span>
                </div>
                
                <div className="flex items-center justify-between text-white/70">
                  <span>Views</span>
                  <span className="text-white">{video.viewCount ? video.viewCount.toLocaleString() : 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Video Stats */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Video Information</h3>
              <div className="space-y-3 text-white/80">
                <div className="flex justify-between">
                  <span>Published</span>
                  <span>{video.createdAt ? new Date(video.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Updated</span>
                  <span>{video.updatedAt ? new Date(video.updatedAt).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className="text-green-400">Published</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Actions</h3>
              <div className="space-y-3">
                <a 
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 text-white px-6 py-3 rounded-xl border border-red-500/30 transition-all duration-300 flex items-center justify-center space-x-3"
                >
                  <span>Watch on YouTube</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;
