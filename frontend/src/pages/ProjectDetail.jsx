import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useProjects from '../hooks/useProjects';
import { Helmet } from 'react-helmet';

const ProjectDetail = () => {
  const { id } = useParams();
  const { projects, loading, error } = useProjects();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState(null);

  const project = projects.find(p => p._id === id);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading project: {error.message}</div>;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen py-12 px-4"
    >
      <Helmet>
        <title>{project ? `${project.title} - My Portfolio` : 'Project Not Found'}</title>
        <meta name="description" content={project ? project.description : 'Details about the project.'} />
        <meta property="og:title" content={project ? project.title : 'Project Not Found'} />
        <meta property="og:description" content={project ? project.description : 'Details about the project.'} />
        <meta property="og:image" content={project ? project.image : 'default-image-url.jpg'} />
        <meta property="og:url" content={project ? `https://yourwebsite.com/projects/${project._id}` : 'https://yourwebsite.com'} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={project ? project.title : 'Project Not Found'} />
        <meta name="twitter:description" content={project ? project.description : 'Details about the project.'} />
        <meta name="twitter:image" content={project ? project.image : 'default-image-url.jpg'} />
      </Helmet>

      {/* ... existing code ... */}
    </motion.div>
  );
};

export default ProjectDetail; 