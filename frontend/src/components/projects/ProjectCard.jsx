import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';     

const ProjectCard = ({ project }) => {
  const { _id, title, description, image, technologies, githubLink, liveDemoLink, slug } = project;

  return (
    <motion.div
      className="card bg-base-200 focus:outline-none"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <figure className="h-48 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p className="text-sm">{description.substring(0, 100)}...</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {technologies.slice(0, 3).map((tech, index) => (
            <span key={index} className="badge badge-primary">{tech}</span>
          ))}
        </div>
        <div className="card-actions justify-end mt-4">
          {githubLink && (
            <a href={githubLink} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline">
              <FaGithub className="mr-2" /> GitHub
            </a>
          )}
          {liveDemoLink && (
            <a href={liveDemoLink} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">
              <FaExternalLinkAlt className="mr-2" /> Live Demo
            </a>
          )}
          <Link to={`/projects/${_id}`} className="btn btn-sm btn-primary">
            Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;