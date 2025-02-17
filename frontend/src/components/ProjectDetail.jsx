      import React, { useEffect, useState, useMemo } from 'react';
      import { useParams, Link } from 'react-router-dom';
      import { motion } from 'framer-motion';
      import useProjects from '../hooks/useProjects';
      import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
      import { Helmet } from 'react-helmet';

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

        if (loading) return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center items-center h-screen"><div className="loading loading-spinner loading-lg"></div></motion.div>;
        if (error) return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="alert alert-error shadow-lg"><div><span>Error: {error}</span></div></motion.div>;
        if (!project) return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="alert alert-warning shadow-lg"><div><span>Project not found</span></div></motion.div>;

        return (
          <>
       
              <title>{project.title}</title>
              <meta name="description" content={project.description?.replace(/<[^>]*>/g, '').substring(0, 155)} />
              <meta property="og:title" content={`${project.title} | Portfolio Project`} />
              <meta property="og:description" content={project.description?.replace(/<[^>]*>/g, '').substring(0, 155)} />
              {project.image && <meta property="og:image" content={project.image} />}
              <meta property="og:url" content={`https://daracheol.onrender.com/projects/${project._id}`} />
              <meta property="og:type" content="website" />
              <meta name="keywords" content={project.technologies?.join(', ')} />
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:title" content={project.title} />
              <meta name="twitter:description" content={project.description?.replace(/<[^>]*>/g, '').substring(0, 155)} />
              <meta name="twitter:image" content={project.image} />
           
      
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="container mx-auto px-4 py-8 max-w-4xl min-h-screen">
              <Link to="/projects" className="btn btn-ghost btn-sm mb-8">&larr; Back to Projects</Link>
              <motion.h1 {...fadeInUp} className="text-5xl font-bold mb-6 text-primary">{project.title}</motion.h1>
              <motion.div {...fadeInUp} className="relative aspect-video mb-8 overflow-hidden rounded-xl shadow-2xl">
                <motion.img 
                  src={project.image} 
                  alt={project.title} 
                  className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                  loading="lazy"
                />
                {!imageLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>}
              </motion.div>
              <motion.div {...fadeInUp} className="prose prose-lg max-w-none mb-8" dangerouslySetInnerHTML={{ __html: project.description }} />
              <motion.div {...fadeInUp} className="flex flex-wrap gap-2 mb-8">
                {project.technologies?.map((tech, index) => (
                  <span key={index} className="px-3 py-1 bg-primary text-primary-content rounded-full text-sm">{tech}</span>
                ))}
              </motion.div>
              <motion.div {...fadeInUp} className="flex gap-4 mb-8">
                {project.githubLink && (
                  <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                    <FaGithub className="mr-2" /> GitHub
                  </a>
                )}
                {project.liveDemoLink && (
                  <a href={project.liveDemoLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    <FaExternalLinkAlt className="mr-2" /> Live Demo
                  </a>
                )}
              </motion.div>
              <motion.div {...fadeInUp} className="text-sm text-gray-500">
                <p>Created: {new Date(project.createdAt).toLocaleDateString()}</p>
                <p>Last updated: {new Date(project.updatedAt).toLocaleDateString()}</p>
                <p>Views: {viewCount}</p>
              </motion.div>
            </motion.div>
          </>
        );
      };

      export default ProjectDetail;
