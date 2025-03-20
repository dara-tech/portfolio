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

  if (loading) {
    return (
      <div className="grid place-items-center min-h-screen">
        <Loader className="animate-spin h-8 w-8" />
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="grid place-items-center min-h-screen">
        <div className="alert alert-error">
          {error || 'Video not found'}
        </div>
      </div>
    );
  }

  // Format duration to hh:mm:ss following VideoCard.jsx format
  const formatDuration = (duration) => {
    if (!duration) return '00:00:00'; // Handle zero duration
    const [hours, minutes, seconds] = duration.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 min-h-screen">
      <div className="aspect-video mb-8">
        <iframe
          className="w-full h-full rounded-lg"
          src={`https://www.youtube.com/embed/${getYoutubeId(video.url)}`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div className="space-y-4">
        <h1 className="text-2xl font-medium">{video.title}</h1>
        
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="badge badge-sm">{video.category || 'Uncategorized'}</span>
          <span>{formatDuration(video.duration)}</span>
          <span> {video.viewCount ? video.viewCount.toLocaleString() : 'N/A'} views</span>
        </div>

        <p className="text-gray-600 whitespace-pre-wrap">{video.description}</p>
      </div>
    </div>
  );
};

export default VideoDetail;
