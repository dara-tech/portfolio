import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import useProjects from '../hooks/useProjects';
import ProjectCard from '../components/projects/ProjectCardAdmin';
import ProjectForm from '../components/projects/ProjectForm';
import ProjectModal from '../components/projects/ProjectModal';
import { Loading } from '../components/common/Loading';

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
    liveDemoLink: '',
  });
  
  const { 
    projects, 
    loading, 
    error, 
    createProject, 
    updateProject, 
    deleteProject, 
    fetchProjects 
  } = useProjects();

  const handleOpenModal = (project = null) => {
    if (project) {
      setFormData({
        ...project,
        technologies: project.technologies || [],
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: '',
        technologies: [],
        image: null,
        githubLink: '',
        liveDemoLink: '',
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

  const renderSkeletonCards = () => {
    return Array(6).fill().map((_, index) => (
      <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-pulse">
        <div className="h-48 bg-white/20 rounded-xl mb-4"></div>
        <div className="space-y-3">
          <div className="h-6 bg-white/20 rounded w-3/4"></div>
          <div className="h-4 bg-white/20 rounded w-1/2"></div>
          <div className="flex space-x-2">
            <div className="h-8 bg-white/20 rounded w-1/4"></div>
            <div className="h-8 bg-white/20 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">Manage Projects</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
            Create, edit, and manage your portfolio projects
          </p>
          <button
            onClick={() => handleOpenModal()}
            className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-300 flex items-center gap-3 mx-auto"
          >
            <Plus className="w-5 h-5" />
            Create New Project
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 backdrop-blur-sm text-red-400 px-8 py-6 rounded-2xl border border-red-500/30 max-w-md mx-auto mb-8">
            <h3 className="text-xl font-semibold mb-2">Error Loading Projects</h3>
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {renderSkeletonCards()}
          </div>
        ) : !projects || projects.length === 0 ? (
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20">
              <h3 className="text-2xl font-semibold text-white mb-4">No Projects Found</h3>
              <p className="text-white/70 mb-6">Add a new project to get started!</p>
              <button
                onClick={() => handleOpenModal()}
                className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-300"
              >
                Create Your First Project
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onEdit={handleOpenModal}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        <ProjectModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={selectedProject ? 'Edit Project' : 'Create New Project'}
        >
          <ProjectForm
            formData={formData}
            onSubmit={handleSubmit}
            onChange={handleChange}
            onImageChange={handleImageChange}
            onTechnologyAdd={handleTechnologyAdd}
            onTechnologyRemove={handleTechnologyRemove}
          />
        </ProjectModal>
      </AnimatePresence>
    </div>
  );
};

export default AdminProjects;