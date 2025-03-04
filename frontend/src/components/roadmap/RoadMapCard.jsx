import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const RoadMapCard = ({ roadMap }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="card bg-base-100 shadow-xl h-full flex flex-col border border-primary/10"
  >
    <div className="card-body flex-grow">
      <h3 className="card-title">{roadMap.title}</h3>
      <p className="text-base-content/70">{roadMap.description}</p>
      <div className="flex justify-between items-center mt-2">
        <span className="badge badge-primary">{roadMap.category}</span>
        <span className="badge badge-outline">{roadMap.difficulty}</span>
      </div>
      <p className="text-sm text-base-content/60 mt-2">{roadMap.estimatedTime}</p>
    </div>
    <div className="card-actions justify-end p-4 mt-auto">
      <Link to={`/roadmap/${roadMap._id}`} className="btn btn-primary w-full">
        View Roadmap
      </Link>
    </div>
  </motion.div>
);

export default RoadMapCard;
