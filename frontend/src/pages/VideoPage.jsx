import React, { useState, useEffect } from 'react';
import VideoCard from '../components/video/VideoCard';
import useVideo from '../hooks/useVideo';
import { Loader } from 'lucide-react';

const VideoPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { getAllVideos } = useVideo();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await getAllVideos();
        setVideos(response.data || []);
      } catch (err) {
        setError('Failed to fetch videos');
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [getAllVideos]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="alert alert-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Videos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map(video => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default VideoPage;
