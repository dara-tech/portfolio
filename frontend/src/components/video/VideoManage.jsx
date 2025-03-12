import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Edit, Loader, Search, Filter, ArrowUpDown } from 'lucide-react';
import useVideo from '../../hooks/useVideo';

const VideoManage = () => {
  // State management
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const navigate = useNavigate();
  
  // Custom hook
  const { getAllVideos, deleteVideo } = useVideo();

  // Get unique categories from videos
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(videos.map(video => video.category || 'Uncategorized'))];
    return ['all', ...uniqueCategories];
  }, [videos]);

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

  // Filtered and sorted videos with memoization
  const filteredVideos = useMemo(() => {
    return videos
      .filter(video => {
        const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortConfig.key === 'views') {
          return sortConfig.direction === 'asc' ? a.views - b.views : b.views - a.views;
        }
        return sortConfig.direction === 'asc' 
          ? a[sortConfig.key].localeCompare(b[sortConfig.key])
          : b[sortConfig.key].localeCompare(a[sortConfig.key]);
      });
  }, [videos, searchTerm, selectedCategory, sortConfig]);

  // Fetch videos on component mount
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await getAllVideos();
        setVideos(response.data || []);
      } catch (err) {
        setError('Failed to fetch videos');
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [getAllVideos]);

  // Event handlers
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await deleteVideo(id);
        setVideos(prevVideos => prevVideos.filter(video => video._id !== id));
        // Refresh the page after successful deletion
        navigate(0);
      } catch (err) {
        setError('Failed to delete video');
      }
    }
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin h-8 w-8" />
      </div>
    );
  }

  // Main render
  return (
    <div className=" p-6 py-24 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Manage Videos</h1>
        <Link 
          to="/admin/videos/new" 
          className="btn btn-primary btn-sm shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Add New Video
        </Link>
      </div>

      {/* Error message */}
      {error && (
        <div className="alert alert-error mb-6 shadow-lg">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Search and filter controls */}
      <div className="flex gap-6 mb-8">
        <div className="form-control flex-1">
          <div className="relative">
            <input
              type="search"
              placeholder="Search videos..."
              className="input input-bordered input-lg w-full pl-12 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          </div>
        </div>

        <select
          className="select select-bordered select-lg w-56 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Videos table */}
      <div className="overflow-x-auto bg-base-100 rounded-xl shadow-xl">
        <table className="table w-full">
          <thead>
            <tr className="bg-base-200">
              <th onClick={() => handleSort('title')} className="cursor-pointer hover:bg-base-300 transition-colors duration-200">
                <div className="flex items-center gap-2 py-4">
                  Title
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th onClick={() => handleSort('category')} className="cursor-pointer hover:bg-base-300 transition-colors duration-200">
                <div className="flex items-center gap-2 py-4">
                  Category
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th onClick={() => handleSort('views')} className="cursor-pointer hover:bg-base-300 transition-colors duration-200">
                <div className="flex items-center gap-2 py-4">
                  Views
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th className="py-4">Preview</th>
              <th className="py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVideos.map(video => (
              <tr key={video._id} className="hover:bg-base-200 transition-colors duration-200">
                <td className="font-medium py-4">{video.title}</td>
                <td className="py-4">
                  <span className="badge badge-lg badge-ghost">{video.category || 'N/A'}</span>
                </td>
                <td className="py-4">{video.views.toLocaleString()}</td>
                <td className="py-4">
                  {video.url && getYoutubeId(video.url) && (
                    <div className="w-48 aspect-video rounded-lg overflow-hidden shadow-lg">
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${getYoutubeId(video.url)}`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                </td>
                <td className="py-4">
                  <div className="flex flex-col gap-3 items-center justify-center">
                    <Link
                      to={`/admin/videos/edit/${video._id}`}
                      className="btn btn-ghost btn-sm hover:bg-primary/10 "
                      data-tip="Edit video"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(video._id)}
                      className="btn btn-ghost btn-sm hover:bg-error/10 text-error"
                      data-tip="Delete video"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VideoManage;
