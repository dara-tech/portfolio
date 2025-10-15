import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { useRoadMapByID, useDeleteRoadMap, useUpdateRoadMap } from '../hooks/useRoadMap';
import RoadmapEdit from '../components/roadmap/RoadmapEdit';
import RoadMapCreate from './RoadMapCreate';
import { Loading } from '../components/common/Loading';

const RoadMapManage = () => {
  const { roadMaps, loading, error } = useRoadMapByID();
  const { deleteRoadMap, loading: deleteLoading, error: deleteError } = useDeleteRoadMap();
  const { updateRoadMap, loading: updateLoading, error: updateError } = useUpdateRoadMap();
  const [deleteId, setDeleteId] = useState(null);
  const [editingRoadmap, setEditingRoadmap] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [filteredRoadMaps, setFilteredRoadMaps] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (roadMaps) {
      const filtered = roadMaps.filter(roadMap => 
        roadMap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        roadMap.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const sorted = filtered.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
      setFilteredRoadMaps(sorted);
    }
  }, [roadMaps, searchTerm, sortBy]);

  const handleDelete = async (id) => {
    setDeleteId(id);
    try {
      await deleteRoadMap(id);
      setFilteredRoadMaps(filteredRoadMaps.filter(roadMap => roadMap._id !== id));
    } catch (err) {
      console.error('Failed to delete roadmap:', err);
    }
    setDeleteId(null);
  };

  const handleEdit = (roadmap) => {
    setEditingRoadmap({ ...roadmap });
  };

  const handleSave = async (updatedRoadmap) => {
    try {
      await updateRoadMap(updatedRoadmap._id, updatedRoadmap);
      setEditingRoadmap(null);
      setFilteredRoadMaps(filteredRoadMaps.map(roadMap => 
        roadMap._id === updatedRoadmap._id ? updatedRoadmap : roadMap
      ));
    } catch (err) {
      console.error('Failed to update roadmap:', err);
    }
  };

  const handleCancel = () => {
    setEditingRoadmap(null);
    setIsCreating(false);
  };

  const handleSaveRoadmap = (newRoadmap) => {
    // Handle the saved roadmap, e.g., save it to state or make an API call
  };

  const renderSkeletonLoader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-pulse">
          <div className="h-6 bg-white/20 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-white/20 rounded w-full mb-2"></div>
          <div className="h-4 bg-white/20 rounded w-5/6 mb-4"></div>
          <div className="flex justify-between gap-3">
            <div className="h-10 bg-white/20 rounded-lg flex-1"></div>
            <div className="h-10 bg-white/20 rounded-lg flex-1"></div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="h-12 bg-white/20 rounded-xl w-1/3 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-white/20 rounded w-1/2 mx-auto animate-pulse"></div>
          </div>
          <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="w-full md:w-1/2 h-12 bg-white/20 rounded-xl animate-pulse"></div>
            <div className="w-full md:w-1/4 h-12 bg-white/20 rounded-xl animate-pulse"></div>
          </div>
          {renderSkeletonLoader()}
        </div>
      </div>
    );
  }

  if (error || deleteError || updateError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-500/20 backdrop-blur-sm text-red-400 px-8 py-6 rounded-2xl border border-red-500/30 max-w-md">
          <h3 className="text-xl font-semibold mb-2">Error Loading Roadmaps</h3>
          <p>{error || deleteError || updateError}</p>
        </div>
      </div>
    );
  }

  if (isCreating) {
    return (
      <RoadMapCreate onSave={handleSaveRoadmap} onCancel={handleCancel} />
    );
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">Manage Roadmaps</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
            Create, edit, and manage your learning roadmaps
          </p>
          <button 
            onClick={() => setIsCreating(true)} 
            className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-300 flex items-center gap-3 mx-auto"
          >
            <Plus className="w-5 h-5" />
            Create New Roadmap
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
              <input
                type="text"
                placeholder="Search roadmaps..."
                className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <select
                className="px-4 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 appearance-none pr-10"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="title" className="bg-gray-800 text-white">Sort by Title</option>
                <option value="createdAt" className="bg-gray-800 text-white">Sort by Date</option>
              </select>
            </div>
          </div>
        </div>

        {/* Roadmaps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRoadMaps.map((roadMap) => (
            <div
              key={roadMap._id}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
            >
              {editingRoadmap && editingRoadmap._id === roadMap._id ? (
                <RoadmapEdit
                  roadmap={editingRoadmap}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              ) : (
                <>
                  <h3 className="text-xl font-bold text-white mb-3">{roadMap.title}</h3>
                  <p className="text-white/70 mb-4 flex-grow line-clamp-3">{roadMap.description}</p>
                  <div className="flex justify-between gap-3">
                    <button 
                      onClick={() => handleEdit(roadMap)} 
                      className="flex-1 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg border border-white/30 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(roadMap._id)}
                      className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg border border-red-500/30 transition-all duration-300 flex items-center justify-center gap-2"
                      disabled={deleteLoading && deleteId === roadMap._id}
                    >
                      {deleteLoading && deleteId === roadMap._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoadMapManage;
