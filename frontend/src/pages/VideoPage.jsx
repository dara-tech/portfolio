import React, { useState, useEffect } from 'react';
import VideoCard from '../components/video/VideoCard';
import useVideo from '../hooks/useVideo';

const VideoPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 6;
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

  const totalPages = Math.ceil(videos.length / videosPerPage);
  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = videos.slice(indexOfFirstVideo, indexOfLastVideo);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-500/[0.15] backdrop-blur-xl text-red-400 px-8 py-6 rounded-3xl border border-red-500/20 max-w-md shadow-2xl">
          <h3 className="text-xl font-semibold mb-2">Error Loading Videos</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentVideos.map(video => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] backdrop-blur-xl text-white border border-white/[0.12] rounded-2xl hover:bg-white/[0.12] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    className={`w-10 h-10 rounded-2xl transition-all duration-300 flex items-center justify-center shadow-lg ${
                      currentPage === i + 1 
                        ? 'bg-blue-500/20 text-white border border-blue-400/30 shadow-xl backdrop-blur-xl' 
                        : 'bg-white/[0.08] backdrop-blur-xl text-white border border-white/[0.12] hover:bg-white/[0.12]'
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              
              <button
                className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] backdrop-blur-xl text-white border border-white/[0.12] rounded-2xl hover:bg-white/[0.12] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}

          {/* No Results Message */}
          {videos.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="bg-white/[0.06] backdrop-blur-2xl rounded-3xl p-12 border border-white/[0.08] max-w-md mx-auto shadow-2xl">
                <div className="w-16 h-16 bg-white/[0.08] backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No videos found</h3>
                <p className="text-white/60 mb-4">
                  No videos are available at the moment
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
