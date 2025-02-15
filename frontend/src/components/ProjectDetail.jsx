import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaClock, FaUsers, FaCode } from 'react-icons/fa';
import { format } from 'date-fns';

const ProjectDetail = ({ project }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeImage, setActiveImage] = useState(null);

  const {
    title,
    description,
    shortDescription,
    image,
    gallery,
    technologies,
    features,
    architecture,
    status,
    completionDate,
    category,
    githubUrl,
    demoUrl,
    role,
    team
  } = project;

  const statusColors = {
    in_progress: 'bg-yellow-500',
    completed: 'bg-green-500',
    archived: 'bg-gray-500'
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'features', label: 'Features' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'technical', label: 'Technical Details' },
    { id: 'team', label: 'Team' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative h-96 rounded-xl overflow-hidden mb-8">
        <img
          src={image || '/placeholder-project.jpg'}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="flex items-center gap-4 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${statusColors[status]}`}>
              {status?.replace('_', ' ')}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-500 text-white">
              {category}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
          <p className="text-xl text-white/90 max-w-3xl">{shortDescription}</p>
        </div>
      </div>

      {/* Project Links */}
      <div className="flex flex-wrap gap-4 mb-8">
        {demoUrl && (
          <a
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaExternalLinkAlt />
            Live Demo
          </a>
        )}
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            <FaGithub />
            View Code
          </a>
        )}
        {completionDate && (
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">
            <FaClock />
            Completed: {format(new Date(completionDate), 'MMMM yyyy')}
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex gap-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-2 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="min-h-[400px]"
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
                <div className="prose prose-lg max-w-none">
                  {description}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {technologies?.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features?.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-white rounded-xl shadow-lg"
                >
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'gallery' && (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {gallery?.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group cursor-pointer"
                    onClick={() => setActiveImage(item)}
                  >
                    <img
                      src={item.url}
                      alt={item.caption}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-lg" />
                    {item.caption && (
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-sm">{item.caption}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Image Modal */}
              <AnimatePresence>
                {activeImage && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
                    onClick={() => setActiveImage(null)}
                  >
                    <motion.div
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.5 }}
                      className="relative max-w-4xl w-full"
                      onClick={e => e.stopPropagation()}
                    >
                      <img
                        src={activeImage.url}
                        alt={activeImage.caption}
                        className="w-full rounded-lg"
                      />
                      {activeImage.caption && (
                        <p className="text-white text-center mt-4">{activeImage.caption}</p>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {activeTab === 'technical' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <FaCode />
                  Technical Architecture
                </h2>
                <div className="prose prose-lg max-w-none">
                  {architecture}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <FaUsers />
                  Project Role
                </h2>
                <p className="text-lg text-gray-700">{role}</p>
              </div>

              {team?.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Team Members</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {team.map((member, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 bg-white rounded-xl shadow-lg"
                      >
                        <h4 className="text-lg font-semibold mb-2">{member.name}</h4>
                        <p className="text-gray-600">{member.role}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetail;
