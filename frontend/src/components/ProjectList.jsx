import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useProjects from '../hooks/useProjects';
import ErrorBoundary from './ErrorBoundary';
import ProjectCard from '../components/ProjectCard';
import { Search, Filter, X, ChevronDown, Sliders } from 'lucide-react';

const ProjectList = () => {
  const { projects = [], loading, error } = useProjects();
  const [filters, setFilters] = useState({ category: 'all', technology: 'all' });
  const [sort, setSort] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = useMemo(() => ['all', ...new Set(projects.map(p => p.category).filter(Boolean))], [projects]);
  const technologies = useMemo(() => ['all', ...new Set(projects.flatMap(p => p.technologies || []).filter(Boolean))], [projects]);

  const filteredProjects = useMemo(() => {
    if (!Array.isArray(projects)) return [];
    return projects
      .filter(p => 
        (filters.category === 'all' || p.category === filters.category) &&
        (filters.technology === 'all' || p.technologies?.includes(filters.technology)) &&
        (!searchQuery || 
          [p.title, p.description, ...(p.technologies || [])].some(field => 
            field?.toLowerCase().includes(searchQuery.toLowerCase())
          )
        )
      )
      .sort((a, b) => sort === 'newest' ? new Date(b.createdAt || 0) - new Date(a.createdAt || 0) : new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
  }, [projects, filters, searchQuery, sort]);

  const handleFilterChange = useCallback((key, value) => setFilters(prev => ({ ...prev, [key]: value })), []);
  const clearFilters = useCallback(() => {
    setFilters({ category: 'all', technology: 'all' });
    setSearchQuery('');
  }, []);

  if (loading) return <div className="flex justify-center items-center min-h-[400px]"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
  if (error) return <div className="alert alert-error max-w-2xl mx-auto mt-8 "><X className="w-6 h-6" /><span>Error loading projects: {error.message}</span></div>;

  return (
    <div className=" container mx-auto px-4 py-24 ">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="btn btn-primary">
          <Sliders className="mr-2" /> {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8 space-y-4 bg-base-200 p-4 rounded-lg shadow-md overflow-hidden "
          >
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input input-bordered w-full pl-10 focus:outline-none"
                />
                <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="select select-bordered flex-1 min-w-[150px]"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category === 'all' ? 'All Categories' : category}</option>
                ))}
              </select>
              <select
                value={filters.technology}
                onChange={(e) => handleFilterChange('technology', e.target.value)}
                className="select select-bordered flex-1 min-w-[150px]"
              >
                {technologies.map(tech => (
                  <option key={tech} value={tech}>{tech === 'all' ? 'All Technologies' : tech}</option>
                ))}
              </select>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="select select-bordered flex-1 min-w-[150px]"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
            {(filters.category !== 'all' || filters.technology !== 'all' || searchQuery) && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">Active filters:</span>
                {filters.category !== 'all' && <span className="badge badge-primary">{filters.category}</span>}
                {filters.technology !== 'all' && <span className="badge badge-secondary">{filters.technology}</span>}
                {searchQuery && <span className="badge badge-accent">"{searchQuery}"</span>}
                <button onClick={clearFilters} className="btn btn-sm btn-ghost">Clear all</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

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
              <Filter className="mx-auto mb-4 w-12 h-12 text-gray-400" />
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