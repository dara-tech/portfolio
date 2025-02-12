import React from 'react';
import useProjects from '../hooks/useProjects';
import { Link } from 'react-router-dom';


const ProjectList = () => {
  const { projects, loading, error } = useProjects();

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

  if (projects.length === 0) {
    return (
      <div className="alert alert-info max-w-2xl mx-auto mt-8">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>No projects found.</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="flex text-3xl font-bold mb-8 ">Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project._id} className="card bg-base-300 transition-shadow">
            {project.image && (
              <figure>
                <img src={project.image} alt={project.title} className="h-48 w-full object-cover" />
              </figure>
            )}
            <div className="card-body">
              <h3 className="card-title">
                {project.title}
                <div className="badge badge-secondary">New</div>
              </h3>
              <p className="text-base-content/80">{project.description}</p>
              <div className="card-actions justify-end mt-4">
              <Link to={`/projects/${project._id}`} className="btn btn-ghost btn-sm">View</Link>

                <button className="btn btn-ghost btn-sm">Share</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;