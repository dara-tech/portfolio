import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useProjects from '../../hooks/useProjects';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import useSEO from '../../hooks/useSEO';

const ProjectDetail = () => {
  const { id } = useParams();
  const { project, loading, error, fetchProjectById, sendView } = useProjects();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    
    const loadProject = async () => {
      try {
        const projectData = await fetchProjectById(id);
        if (!isMounted) return;
        
        if (projectData) {
          setViewCount(projectData.views);
          const viewData = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
          };
          const updatedProject = await sendView(id, viewData);
          if (updatedProject && isMounted) {
            setViewCount(updatedProject.views);
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error loading project:', error);
        }
      }
    };
    
    loadProject();
    return () => { isMounted = false; };
  }, [id, fetchProjectById, sendView]);

  const fadeInUp = useMemo(() => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }), []);

  // ✅ Safe SEO hook call

 
    const cleanDescription = project?.description?.replace(/<[^>]*>/g, '').substring(0, 155);

    useSEO({
      title: project ? `${project.title} | Portfolio Project` : 'Loading...',
      description: cleanDescription || '',
      image: project?.image || '/vite.svg',
      url: `/projects/${id}`,
      type: 'article',
      keywords: project?.technologies || []
    });


  if (loading) return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen flex items-center justify-center"
    >
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      </div>
    </motion.div>
  );
  
  if (error) return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen flex items-center justify-center"
    >
      <div className="bg-red-500/20 backdrop-blur-sm text-red-400 px-8 py-6 rounded-2xl border border-red-500/30 max-w-md">
        <h3 className="text-xl font-semibold mb-2">Error Loading Project</h3>
        <p>{error}</p>
      </div>
    </motion.div>
  );
  
  if (!project) return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen flex items-center justify-center"
    >
      <div className="bg-yellow-500/20 backdrop-blur-sm text-yellow-400 px-8 py-6 rounded-2xl border border-yellow-500/30 max-w-md">
        <h3 className="text-xl font-semibold mb-2">Project Not Found</h3>
        <p>The project you're looking for doesn't exist.</p>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link 
            to="/projects" 
            className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            <span>←</span>
            <span>Back to Projects</span>
          </Link>
        </motion.div>

        {/* Main Content Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Header */}
            <motion.div 
              {...fadeInUp}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
            >
              <h1 className="text-5xl font-bold text-white mb-4">{project.title}</h1>
              <div className="flex items-center space-x-4 text-white/70">
                <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                <span>•</span>
                <span>Views: {viewCount}</span>
              </div>
            </motion.div>

            {/* Project Image */}
            <motion.div 
              {...fadeInUp}
              className="relative aspect-video overflow-hidden rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm"
            >
              <motion.img 
                src={project.image || '/vite.svg'} 
                alt={project.title} 
                className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/vite.svg';
                }}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-white/10 animate-pulse flex items-center justify-center">
                  <div className="w-12 h-12 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
              )}
            </motion.div>

            {/* Project Description */}
            <motion.div 
              {...fadeInUp}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
            >
              <h2 className="text-2xl font-bold text-white mb-4">About This Project</h2>
              <div 
                className="prose prose-lg max-w-none text-white/80 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: project.description }} 
              />
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Technologies */}
            <motion.div 
              {...fadeInUp}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            >
              <h3 className="text-xl font-bold text-white mb-4">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies?.map((tech, index) => (
                  <span 
                    key={index} 
                    className="px-4 py-2 bg-white/20 text-white rounded-full text-sm border border-white/30 hover:bg-white/30 transition-all duration-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              {...fadeInUp}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            >
              <h3 className="text-xl font-bold text-white mb-4">Project Links</h3>
              <div className="space-y-3">
                {project.githubLink && (
                  <a 
                    href={project.githubLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl border border-white/30 transition-all duration-300 flex items-center justify-center space-x-3"
                  >
                    <FaGithub className="w-5 h-5" />
                    <span>View on GitHub</span>
                  </a>
                )}
                {project.liveDemoLink && (
                  <a 
                    href={project.liveDemoLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-white px-6 py-3 rounded-xl border border-blue-500/30 transition-all duration-300 flex items-center justify-center space-x-3"
                  >
                    <FaExternalLinkAlt className="w-5 h-5" />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            </motion.div>

            {/* Project Stats */}
            <motion.div 
              {...fadeInUp}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            >
              <h3 className="text-xl font-bold text-white mb-4">Project Stats</h3>
              <div className="space-y-3 text-white/80">
                <div className="flex justify-between">
                  <span>Created</span>
                  <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Updated</span>
                  <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Views</span>
                  <span className="text-white">{viewCount}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
