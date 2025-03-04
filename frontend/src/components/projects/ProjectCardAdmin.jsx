// ProjectCard.js
import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2 } from 'lucide-react';

const ProjectCard = ({ project, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="card bg-base-200 border border-primary/10 shadow-xl p-4"
    >
      <figure className="px-4 pt-4">
        <img 
          src={project.image || '/placeholder-project.jpg'} 
          alt={project.title}
          className="rounded-xl h-56 w-full object-cover"
          onError={(e) => {
            e.target.src = '/placeholder-project.jpg';
            e.target.onerror = null;
          }}
        />
      </figure>
      <div className="card-body">
        <h3 className="card-title text-2xl">{project.title}</h3>
        <div className="text-base-500 line-clamp-3" 
          dangerouslySetInnerHTML={{ __html: project.description }}>
        </div>
        
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {project.technologies.map((tech, index) => (
              <span key={index} className="badge badge-primary badge-outline">
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="card-actions justify-end mt-auto">
        <button 
          onClick={() => onEdit(project)} 
          className="btn btn-sm btn-outline btn-primary"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </button>
        <button 
          onClick={() => onDelete(project._id)} 
          className="btn btn-sm btn-outline btn-error"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </button>
      </div>
    </motion.div>
  );
};

export default ProjectCard;