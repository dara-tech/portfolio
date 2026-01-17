import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProjectCard = ({ project }) => {
  const { _id, title, description, image, technologies, githubLink, liveDemoLink, slug } = project;

  return (
    <motion.div 
      className="group relative bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-500 overflow-hidden flex flex-col h-full"
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden flex-shrink-0">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex space-x-3">
            {githubLink && (
              <motion.a 
                href={githubLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaGithub className="w-5 h-5" />
              </motion.a>
            )}
            {liveDemoLink && (
              <motion.a 
                href={liveDemoLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaExternalLinkAlt className="w-5 h-5" />
              </motion.a>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-white/90 transition-colors">
          {title}
        </h2>
        <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-3">
          {description.substring(0, 120)}...
        </p>
        
        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-6">
          {technologies.slice(0, 4).map((tech, index) => (
            <span 
              key={index} 
              className="px-3 py-1 bg-white/10 text-white/80 text-xs rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              {tech}
            </span>
          ))}
          {technologies.length > 4 && (
            <span className="px-3 py-1 bg-white/5 text-white/60 text-xs rounded-full border border-white/10">
              +{technologies.length - 4} more
            </span>
          )}
        </div>

        {/* Action Button - Pushed to bottom */}
        <div className="mt-auto">
          <Link 
            to={`/projects/${_id}`} 
            className="block w-full bg-white/10 hover:bg-white/20 text-white text-center py-3 rounded-lg border border-white/20 transition-all duration-300 font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;