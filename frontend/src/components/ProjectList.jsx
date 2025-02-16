import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useProjects from '../hooks/useProjects';
import ErrorBoundary from './ErrorBoundary';
import ProjectCard from '../components/ProjectCard';

const ProjectList = () => {
  const { projects = [], loading, error } = useProjects();
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeSort, setActiveSort] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = useMemo(() => {
    if (!Array.isArray(projects)) return ['all'];
    const cats = new Set(projects.map(p => p.category).filter(Boolean));
    return ['all', ...Array.from(cats)];
  }, [projects]);

  const technologies = useMemo(() => {
    if (!Array.isArray(projects)) return [];
    const techs = new Set(projects.flatMap(p => p.technologies || []).filter(Boolean));
    return Array.from(techs);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (!Array.isArray(projects)) return [];
    
    let filtered = [...projects];

    if (activeFilter !== 'all') {
      filtered = filtered.filter(p => p.category === activeFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.title?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.technologies?.some(tech => tech.toLowerCase().includes(query))
      );
    }

    filtered.sort((a, b) => {
      if (activeSort === 'newest') {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      if (activeSort === 'oldest') {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }
      return 0;
    });

    return filtered;
  }, [projects, activeFilter, searchQuery, activeSort]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error max-w-2xl mx-auto mt-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Error loading projects: {error.message}</span>
      </div>
    );
  }

  return (
    <div className="container w-full max-w-6xl mx-auto p-4 ">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
      </div>

      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered w-full max-w-xs"
            />
          </div>
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="select select-bordered"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={activeSort}
            onChange={(e) => setActiveSort(e.target.value)}
            className="select select-bordered"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {technologies.map(tech => (
              <span key={tech} className="badge badge-primary badge-outline">
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={filteredProjects.length}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No projects found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(project => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const ProjectListWithErrorBoundary = () => (
  <ErrorBoundary>
    <ProjectList />
  </ErrorBoundary>
);

export default ProjectListWithErrorBoundary;