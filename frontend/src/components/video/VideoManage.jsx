import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Edit, Loader, Search, Filter, ArrowUpDown, Plus, RefreshCw, AlertTriangle, Eye, Film } from 'lucide-react';
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
      <div className="flex flex-col justify-center items-center min-h-screen bg-base-100">
        <div className="card shadow-xl bg-base-200 p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="loading loading-spinner loading-lg text-primary"></div>
            <h2 className="text-xl font-semibold mt-2">Loading Videos</h2>
            <p className="text-base-content/70">Please wait while we fetch your video library...</p>
          </div>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="container mx-auto p-6  py-20 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Video Library
        </h1>
        <Link 
          to="/admin/videos/new" 
          className="btn btn-primary shadow-md hover:shadow-lg transition-all duration-300"
        >
          <Plus size={18} className="mr-1" />
          Add New Video
        </Link>
      </div>

      {/* Error message */}
      {error && (
        <div className="alert alert-error mb-6 shadow-lg">
          <AlertTriangle className="h-6 w-6 mr-2" />
          <p>{error}</p>
          <button 
            className="btn btn-sm btn-ghost ml-auto"
            onClick={() => setError('')}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search and filter controls */}
      <div className="card bg-base-200 shadow-md mb-8">
        <div className="card-body p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="form-control flex-1">
              <div className="input-group">
                <input
                  type="search"
                  placeholder="Search videos by title..."
                  className="input input-bordered w-full focus:outline-none focus:border-primary"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>

            <div className="form-control w-full md:w-56">
              <div className="input-group">
                <select
                  className="select select-bordered w-full focus:outline-none focus:border-primary"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats summary */}
      <div className="stats shadow mb-8 w-full">
        <div className="stat">
          <div className="stat-figure text-primary">
            <Film className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Videos</div>
          <div className="stat-value">{videos.length}</div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-secondary">
            <Eye className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Views</div>
          <div className="stat-value">
            {videos.reduce((sum, video) => sum + video.views, 0).toLocaleString()}
          </div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-accent">
            <Filter className="w-8 h-8" />
          </div>
          <div className="stat-title">Categories</div>
          <div className="stat-value">{categories.length - 1}</div>
        </div>
      </div>

      {/* Videos table */}
      <div className="card bg-base-100 shadow-xl overflow-hidden ">
        <div className="card-body p-0">
          {filteredVideos.length === 0 ? (
            <div className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <Film className="w-16 h-16 text-base-content/30" />
                <h3 className="text-xl font-semibold">No videos found</h3>
                <p className="text-base-content/70 max-w-md">
                  {searchTerm || selectedCategory !== 'all' 
                    ? "Try adjusting your search or filter criteria" 
                    : "Add your first video to get started"}
                </p>
                <Link to="/admin/videos/new" className="btn btn-primary mt-4">
                  <Plus size={18} className="mr-1" />
                  Add New Video
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="bg-base-200">
                    <th onClick={() => handleSort('title')} className="cursor-pointer hover:bg-base-300 transition-colors">
                      <div className="flex items-center gap-2 py-4">
                        Title
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </th>
                    <th onClick={() => handleSort('category')} className="cursor-pointer hover:bg-base-300 transition-colors">
                      <div className="flex items-center gap-2 py-4">
                        Category
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </th>
                    <th onClick={() => handleSort('views')} className="cursor-pointer hover:bg-base-300 transition-colors">
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
                    <tr key={video._id} className="hover:bg-base-200 transition-colors">
                      <td className="font-medium py-4">{video.title}</td>
                      <td className="py-4">
                        <div className="badge badge-lg badge-outline">{video.category || 'Uncategorized'}</div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-base-content/70" />
                          {video.views.toLocaleString()}
                        </div>
                      </td>
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
                        <div className="flex gap-2">
                          <Link
                            to={`/admin/videos/edit/${video._id}`}
                            className="btn btn-sm btn-outline btn-primary"
                            data-tip="Edit video"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(video._id)}
                            className="btn btn-sm btn-outline btn-error"
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
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoManage;
