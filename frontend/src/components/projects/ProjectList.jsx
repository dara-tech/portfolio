import React from 'react';
import useProjects from '../../hooks/useProjects';
import ErrorBoundary from '../ErrorBoundary';
import ProjectCard from '../projects/ProjectCard';
import { X } from 'lucide-react';

const ProjectList = () => {
  const { projects = [], loading, error } = useProjects();

  if (error) return <div className="alert alert-error max-w-2xl mx-auto mt-8 "><X className="w-6 h-6" /><span>Error loading projects: {error.message}</span></div>;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-5xl font-bold text-white">Projects</h1>
      </div>

      <div>
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2 text-white">No projects found</h3>
            <p className="text-white/60">Check back later for new projects!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ProjectListWithErrorBoundary = () => (
  <ErrorBoundary>
    <ProjectList />
  </ErrorBoundary>
);

export default ProjectListWithErrorBoundary;