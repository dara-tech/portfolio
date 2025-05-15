import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus, Search, ArrowUpDown, Eye, BookOpen, Filter, AlertTriangle } from 'lucide-react';
import useLesson from '../../hooks/useLesson';

const LessonManage = () => {
  const navigate = useNavigate();
  const { lessons, loading, error, fetchLessons, deleteLesson } = useLesson();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  const categories = React.useMemo(() => {
    if (!lessons) return ['all'];
    const uniqueCategories = [...new Set(lessons.map(lesson => lesson.category || 'Uncategorized'))];
    return ['all', ...uniqueCategories];
  }, [lessons]);

  useEffect(() => {
    if (lessons) {
      const filtered = lessons.filter(lesson => {
        const matchesSearch = 
          (lesson.title && lesson.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (lesson.description && lesson.description.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory === 'all' || lesson.category === selectedCategory;
        return matchesSearch && matchesCategory;
      });
      
      const sorted = [...filtered].sort((a, b) => {
        if (!a[sortField] || !b[sortField]) return 0;
        
        const aValue = typeof a[sortField] === 'string' ? a[sortField].toLowerCase() : a[sortField];
        const bValue = typeof b[sortField] === 'string' ? b[sortField].toLowerCase() : b[sortField];
        
        if (sortDirection === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
      
      setFilteredLessons(sorted);
    }
  }, [lessons, searchTerm, sortField, sortDirection, selectedCategory]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsDeleting(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteLesson(deleteId);
      fetchLessons();
      setIsDeleting(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting lesson:", error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/lessons/edit/${id}`);
  };

  const handleView = (id) => {
    navigate(`/lessons/${id}`);
  };

  const renderSkeleton = () => (
    <div className="container mx-auto justify-center w-full p-6 py-20 min-h-screen">
      <div className="flex md:flex-row justify-between items-center mb-8 gap-4">
        <div className="h-10 bg-base-300 rounded w-48 animate-pulse"></div>
        <div className="h-10 bg-base-300 rounded w-40 animate-pulse"></div>
      </div>
      <div className="stats mb-8 w-full">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="stat">
            <div className="h-8 bg-base-300 rounded w-16 mb-2 animate-pulse"></div>
            <div className="h-6 bg-base-300 rounded w-24 mb-1 animate-pulse"></div>
            <div className="h-10 bg-base-300 rounded w-20 animate-pulse"></div>
          </div>
        ))}
      </div>
      <div className="card bg-base-200 mb-8">
        <div className="card-body p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="h-12 bg-base-300 rounded flex-1 animate-pulse"></div>
            <div className="h-12 bg-base-300 rounded w-56 animate-pulse"></div>
          </div>
        </div>
      </div>
      <div className="card bg-base-100 overflow-hidden">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-base-200">
                  {[...Array(4)].map((_, index) => (
                    <th key={index} className="py-4">
                      <div className="h-6 bg-base-300 rounded w-24 animate-pulse"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-base-200 transition-colors">
                    {[...Array(4)].map((_, colIndex) => (
                      <td key={colIndex} className="py-4">
                        <div className="h-6 bg-base-300 rounded w-full animate-pulse"></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return renderSkeleton();
  }

  if (error) {
    return (
      <div className="alert alert-error mb-6">
        <AlertTriangle className="h-6 w-6 mr-2" />
        <div>
          <h3 className="font-bold">Error!</h3>
          <div className="text-xs">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto justify-center w-full p-6 py-20 min-h-screen">
      <div className="flex  md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Lesson Library
        </h1>
        <Link 
          to="/admin/lessons/new" 
          className="btn btn-primary btn-sm hover:shadow-lg transition-all duration-300"
        >
          <Plus size={18} className="mr-1" />
          Add New Lesson
        </Link>
      </div>

      <div className="stats mb-8 w-full">
        <div className="stat">
          <div className="stat-figure text-primary">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Lessons</div>
          <div className="stat-value">{lessons.length}</div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-secondary">
            <Eye className="w-8 h-8" />
          </div>
          <div className="stat-title">Most Recent</div>
          <div className="stat-value text-lg">
            {lessons.length > 0 ? new Date(
              Math.max(...lessons.map(l => new Date(l.createdAt)))
            ).toLocaleDateString() : 'N/A'}
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

      <div className="card bg-base-200 mb-8">
        <div className="card-body p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="form-control flex-1">
              <div className="input-group">
                <input
                  type="search"
                  placeholder="Search lessons by title or description..."
                  className="input input-bordered w-full focus:outline-none focus:border-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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

      <div className="card bg-base-100 overflow-hidden">
        <div className="card-body p-0">
          {filteredLessons.length === 0 ? (
            <div className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <BookOpen className="w-16 h-16 text-base-content/30" />
                <h3 className="text-xl font-semibold">No lessons found</h3>
                <p className="text-base-content/70 max-w-md">
                  {searchTerm || selectedCategory !== 'all' 
                    ? "Try adjusting your search or filter criteria" 
                    : "Add your first lesson to get started"}
                </p>
                <Link to="/admin/lessons/new" className="btn btn-primary mt-4">
                  <Plus size={18} className="mr-1" />
                  Add New Lesson
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
                    <th onClick={() => handleSort('createdAt')} className="cursor-pointer hover:bg-base-300 transition-colors">
                      <div className="flex items-center gap-2 py-4">
                        Created
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </th>
                    <th className="py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLessons.map((lesson) => (
                    <tr key={lesson._id} className="hover:bg-base-200 transition-colors">
                      <td className="font-medium py-4">{lesson.title || 'Untitled'}</td>
                      <td className="py-4">
                        <div className="badge badge-lg badge-outline">{lesson.category || 'Uncategorized'}</div>
                      </td>
                      <td className="py-4">{new Date(lesson.createdAt).toLocaleDateString()}</td>
                      <td className="py-4">
                        <div className="flex space-x-2">
                          <button 
                            className="btn btn-sm btn-circle btn-outline btn-info"
                            onClick={() => handleView(lesson._id)}
                            title="View Lesson"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            className="btn btn-sm btn-circle btn-outline"
                            onClick={() => handleEdit(lesson._id)}
                            title="Edit Lesson"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="btn btn-sm btn-circle btn-outline btn-error"
                            onClick={() => handleDeleteClick(lesson._id)}
                            title="Delete Lesson"
                          >
                            <Trash2 size={16} />
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

      {isDeleting && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Deletion</h3>
            <p className="py-4">Are you sure you want to delete this lesson? This action cannot be undone.</p>
            <div className="modal-action">
              <button 
                className="btn btn-outline"
                onClick={() => setIsDeleting(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-error"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setIsDeleting(false)}></div>
        </div>
      )}
    </div>
  );
};

export default LessonManage;
