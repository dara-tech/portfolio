import React from 'react';
import { useParams } from 'react-router-dom';
import useProjectById from '../hooks/useProjects';

const ProjectDetail = () => {
  const { id } = useParams(); // Expecting a route like /projects/:id
  const { project, loading, error } = useProjectById(id);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-error text-xl">Error: {error.message}</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">No project found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <figure className="px-4 pt-4">
            <img
              src={project.image}
              alt={project.title}
              className="rounded-xl w-full h-64 object-cover"
            />
          </figure>
          <div className="card-body">
            <h1 className="card-title text-3xl font-bold">{project.title}</h1>
            <p className="text-lg opacity-90">{project.description}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {project.technologies &&
                project.technologies.map((tech, index) => (
                  <div key={index} className="badge badge-primary badge-lg">
                    {tech}
                  </div>
                ))}
            </div>
            <div className="card-actions justify-end mt-6">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
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
                  GitHub Repo
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Project Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Features */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">Key Features</h2>
              <ul className="space-y-2">
                {project.features &&
                  project.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <svg
                        className="h-6 w-6 text-primary flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          {/* Project Info */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">Project Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Timeline</h3>
                  <p className="opacity-90">{project.timeline}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Role</h3>
                  <p className="opacity-90">{project.role}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Challenges & Solutions</h3>
                  <p className="opacity-90">{project.challenges}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Screenshots */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">Project Screenshots</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {project.screenshots &&
                project.screenshots.map((screenshot, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={screenshot}
                      alt={`Screenshot ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-base-300 opacity-0 group-hover:opacity-50 transition-opacity rounded-lg"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="btn btn-primary btn-sm">View Full Size</button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button className="btn btn-ghost">← Previous Project</button>
          <button className="btn btn-ghost">Next Project →</button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
