import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useProjects from '../hooks/useProjects';

const ProjectDetail = () => {
  const { id } = useParams();
  const { projects, loading, error } = useProjects();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error max-w-2xl mx-auto mt-8">
        <span>Error loading project: {error.message}</span>
      </div>
    );
  }

  const project = projects.find(p => p._id === id);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
        <Link to="/" className="btn btn-primary">Return Home</Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'features', label: 'Features', icon: '⭐' },
    { id: 'technical', label: 'Technical Details', icon: '⚙️' },
    { id: 'gallery', label: 'Gallery', icon: '🖼️' },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen py-12 px-4"
    >
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto mb-8">
        <motion.div variants={itemVariants} className="text-sm breadcrumbs">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/#projects">Projects</Link></li>
            <li>{project.title}</li>
          </ul>
        </motion.div>
      </div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto bg-base-200 rounded-box overflow-hidden shadow-xl">
        <motion.div
          variants={itemVariants}
          className="relative h-[400px] overflow-hidden"
        >
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-base-200 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
            <div className="flex flex-wrap gap-2">
              {project.technologies?.map((tech, index) => (
                <motion.div
                  key={tech}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="badge badge-primary"
                >
                  {tech}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-6xl mx-auto mt-8">
        <motion.div variants={itemVariants} className="tabs tabs-boxed">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'tab-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-8 bg-base-200 p-8 rounded-box"
          >
            {activeTab === 'overview' && (
              <div className="prose max-w-none">
                <p className="text-lg">{project.description}</p>
                <div className="mt-6 flex flex-wrap gap-4">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost"
                    >
                      View Source
                    </a>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.features?.map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="card bg-base-300"
                  >
                    <div className="card-body">
                      <h3 className="card-title text-lg">{feature.title}</h3>
                      <p>{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'technical' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-4">Tech Stack</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {project.technologies?.map((tech, index) => (
                      <motion.div
                        key={tech}
                        variants={itemVariants}
                        className="card bg-base-300"
                      >
                        <div className="card-body p-4 items-center text-center">
                          <span className="text-2xl mb-2">
                            {['⚛️', '🌐', '🗄️', '⚙️'][index % 4]}
                          </span>
                          <span className="font-medium">{tech}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {project.architecture && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">Architecture</h3>
                    <pre className="bg-base-300 p-4 rounded-lg overflow-x-auto">
                      {project.architecture}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'gallery' && (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {project.gallery?.map((image, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="relative group cursor-pointer"
                      onClick={() => setSelectedImage(image)}
                    >
                      <img
                        src={image.url}
                        alt={image.caption}
                        className="w-full h-48 object-cover rounded-lg transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-base-300 opacity-0 group-hover:opacity-50 transition-opacity rounded-lg" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white">View</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              className="relative max-w-4xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={selectedImage.url}
                alt={selectedImage.caption}
                className="w-full rounded-lg"
              />
              {selectedImage.caption && (
                <p className="text-white text-center mt-4">{selectedImage.caption}</p>
              )}
              <button
                className="absolute top-4 right-4 text-white"
                onClick={() => setSelectedImage(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProjectDetail;
