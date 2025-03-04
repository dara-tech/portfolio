import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { useRoadMapByID, useDeleteRoadMap, useUpdateRoadMap } from '../hooks/useRoadMap';
import RoadmapEdit from '../components/roadmap/RoadmapEdit';
import RoadMapCreate from './RoadMapCreate';

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || deleteError || updateError) {
    return <div className="text-center text-red-500 font-semibold text-lg">{error || deleteError || updateError}</div>;
  }

  if (isCreating) {
    return (
      <RoadMapCreate onSave={handleSaveRoadmap} onCancel={handleCancel} />
    );
  }

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Roadmaps</h1>
        <button onClick={() => setIsCreating(true)} className="btn btn-primary px-4 py-2 rounded flex items-center">
          <Plus className="mr-2" size={20} />
          Create New
        </button>
      </div>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center">
        <div className="relative w-full md:w-1/2 mb-4 md:mb-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search roadmaps..."
            className="w-full pl-10 pr-4 py-2 border border-primary rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative w-full md:w-1/4">
          <select
            className="w-full pl-4 pr-10 py-2 border border-primary rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-primary"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="title">Sort by Title</option>
            <option value="createdAt">Sort by Date</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoadMaps.map((roadMap) => (
          <div
            key={roadMap._id}
            className="bg-base-200 p-4 rounded flex flex-col h-full"
          >
            {editingRoadmap && editingRoadmap._id === roadMap._id ? (
              <RoadmapEdit
                roadmap={editingRoadmap}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            ) : (
              <>
                <h3 className="text-xl text-primary font-bold mb-2">{roadMap.title}</h3>
                <p className="mb-2 flex-grow">{roadMap.description}</p>
                <div className="flex justify-between mt-4">
                  <button onClick={() => handleEdit(roadMap)} className="btn-sm btn-primary btn text flex items-center transition-colors">
                    <Edit className="mr-1" size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(roadMap._id)}
                    className="btn-sm btn-danger btn flex items-center transition-colors"
                    disabled={deleteLoading && deleteId === roadMap._id}
                  >
                    {deleteLoading && deleteId === roadMap._id ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-1" />
                    ) : (
                      <Trash2 className="mr-1" size={16} />
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
  );
};

export default RoadMapManage;
