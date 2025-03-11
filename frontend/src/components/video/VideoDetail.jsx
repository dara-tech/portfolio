import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader, Play, Clock, Eye } from 'lucide-react';
import useVideo from '../../hooks/useVideo';

const VideoDetail = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { getVideoById, incrementVideoView } = useVideo();

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

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await getVideoById(id);
        setVideo(response.data);

        // Increment view count when video loads
        await incrementVideoView(id);

      } catch (err) {
        setError('Failed to fetch video details');
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [id, getVideoById, incrementVideoView]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin h-8 w-8" />
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="alert alert-error">
          <p>{error || 'Video not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Video Player */}
        <div className="relative aspect-video mb-6">
          <iframe
            className="w-full h-full rounded-xl"
            src={`https://www.youtube.com/embed/${getYoutubeId(video.url)}`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Video Info */}
        <div className="bg-base-100 rounded-xl p-6 ">
          <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
          
          <div className="flex items-center justify-between mb-6">
            <span className="badge badge-primary">{video.category || 'Uncategorized'}</span>
            <div className="flex items-center gap-4 text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{video.views.toLocaleString()} views</span>
              </div>
            </div>
          </div>

          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap">{video.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;
