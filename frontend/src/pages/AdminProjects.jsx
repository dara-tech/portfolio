import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useProjects from '../hooks/useProjects';
import { Plus, Edit, Trash2, Loader2, X, Upload, Link as LinkIcon } from 'lucide-react';

const AdminProjects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    technologies: [],
    image: null,
    githubLink: '',
    liveLink: '',
  });
  const { projects, loading, error, createProject, updateProject, deleteProject, fetchProjects } = useProjects();

  const handleOpenModal = (project = null) => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        category: project.category || '',
        technologies: project.technologies || [],
        image: project.image || null,
        githubLink: project.githubLink || '',
        liveLink: project.liveLink || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: '',
        technologies: [],
        image: null,
        githubLink: '',
        liveLink: '',
      });
    }
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, image: file }));
  };

  const handleTechnologyAdd = (tech) => {
    if (tech && !formData.technologies.includes(tech)) {
      setFormData(prev => ({ ...prev, technologies: [...prev.technologies, tech] }));
    }
  };

  const handleTechnologyRemove = (tech) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const projectData = new FormData();
      for (const key in formData) {
        if (key === 'technologies') {
          projectData.append(key, JSON.stringify(formData[key]));
        } else if (key === 'image' && formData[key] instanceof File) {
          projectData.append(key, formData[key]);
        } else {
          projectData.append(key, formData[key]);
        }
      }

      if (selectedProject) {
        await updateProject(selectedProject._id, projectData);
      } else {
        await createProject(projectData);
      }
      handleCloseModal();
      fetchProjects();
    } catch (error) {
      console.error('Error submitting project:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="min-h-screen py-14 bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-primary">Manage Projects</h1>
          <button
         
            className="btn btn-primary"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Project
          </button>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="alert alert-error shadow-lg mb-6">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {!loading && (!projects || projects.length === 0) && (
          <div className="text-center py-16">
            <p className="text-2xl text-gray-500 dark:text-gray-400">No projects found. Add a new project to get started!</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects?.map((project) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card bg-white dark:bg-gray-800 shadow-xl"
            >
              <figure className="px-4 pt-4">
                <img 
                  src={project.image || '/placeholder-project.jpg'} 
                  alt={project.title}
                  className="rounded-xl h-56 w-full object-cover"
                  onError={(e) => {
                    e.target.src = '/placeholder-project.jpg';
                    e.target.onerror = null;
                  }}
                />
              </figure>
              <div className="card-body">
                <h3 className="card-title text-2xl">{project.title}</h3>
                <div className="text-gray-600 dark:text-gray-300 line-clamp-3" dangerouslySetInnerHTML={{ __html: project.description }}></div>
                
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="badge badge-primary badge-outline">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="card-actions justify-end mt-4">
                  <button 
                    onClick={() => handleOpenModal(project)} 
                    className="btn btn-sm btn-outline btn-accent"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(project._id)} 
                    className="btn btn-sm btn-outline btn-error"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50  p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{selectedProject ? 'Edit Project' : 'Create New Project'}</h2>
                <button onClick={handleCloseModal} className="btn btn-ghost btn-circle">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Title</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="textarea textarea-bordered focus:outline-none w-full h-24"
                    required
                  ></textarea>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Category</span>
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Technologies</span>
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.technologies.map((tech, index) => (
                      <span key={index} className="badge badge-primary gap-1">
                        {tech}
                        <button type="button" onClick={() => handleTechnologyRemove(tech)}>
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Add a technology"
                      className="input input-bordered w-full"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleTechnologyAdd(e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-square btn-outline"
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="Add a technology"]');
                        handleTechnologyAdd(input.value);
                        input.value = '';
                      }}
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Image</span>
                  </label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleImageChange}
                    className="file-input file-input-bordered w-full"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">GitHub Link</span>
                  </label>
                  <div className="input-group">
                    <span className="btn btn-square">
                      <LinkIcon className="w-5 h-5" />
                    </span>
                    <input
                      type="url"
                      name="githubLink"
                      value={formData.githubLink}
                      onChange={handleChange}
                      className="input input-bordered w-full"
                      placeholder="https://github.com/username/repo"
                    />
                  </div>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Live Link</span>
                  </label>
                  <div className="input-group">
                    <span className="btn btn-square">
                      <LinkIcon className="w-5 h-5" />
                    </span>
                    <input
                      type="url"
                      name="liveLink"
                      value={formData.liveLink}
                      onChange={handleChange}
                      className="input input-bordered w-full"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <button type="submit" className="btn btn-primary w-full">
                    {selectedProject ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProjects;
