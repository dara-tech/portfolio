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
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 overflow-hidden group"
    >
      <div className="relative">
        <img 
          src={project.image || '/placeholder-project.jpg'} 
          alt={project.title}
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = '/placeholder-project.jpg';
            e.target.onerror = null;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-white/90 transition-colors">
          {project.title}
        </h3>
        
        <div 
          className="text-white/70 text-sm leading-relaxed line-clamp-3 mb-4" 
          dangerouslySetInnerHTML={{ __html: project.description }}
        />
        
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.map((tech, index) => (
              <span key={index} className="px-3 py-1 bg-white/10 text-white/80 text-xs rounded-full border border-white/20">
                {tech}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex gap-3">
          <motion.button 
            onClick={() => onEdit(project)} 
            className="flex-1 bg-white/20 hover:bg-white/30 text-white px-4 py-3 rounded-xl border border-white/30 hover:border-white/40 transition-all duration-300 flex items-center justify-center gap-2 font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Edit className="w-4 h-4" />
            Edit
          </motion.button>
          <motion.button 
            onClick={() => onDelete(project._id)} 
            className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-3 rounded-xl border border-red-500/30 hover:border-red-500/40 transition-all duration-300 flex items-center justify-center gap-2 font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;