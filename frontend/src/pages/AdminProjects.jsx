import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus, Loader2 } from 'lucide-react';
import useProjects from '../hooks/useProjects';
import ProjectCard from '../components/projects/ProjectCardAdmin';
import ProjectForm from '../components/projects/ProjectForm';
import ProjectModal from '../components/projects/ProjectModal';

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

  return (
    <div className="min-h-screen py-14 bg-base-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-primary">Manage Projects</h1>
          <button
            onClick={() => handleOpenModal()}
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
            <p className="text-2xl text-gray-500 dark:text-gray-400">
              No projects found. Add a new project to get started!
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects?.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
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