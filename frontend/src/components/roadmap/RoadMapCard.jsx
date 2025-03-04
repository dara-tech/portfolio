import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const RoadMapCard = ({ roadMap }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="card bg-base-100 shadow-xl h-full flex flex-col border border-primary/10"
  >
    <div className="card-body flex-grow">
      <div className="flex items-center mb-2">
        <h3 className="card-title">{roadMap.title}</h3>
       
      </div>
      <p className="text-base-content/70">{roadMap.description}</p>
    </div>
    <div className="card-actions flex-col p-4 mt-auto">
      <div className="flex justify-between items-center w-full mb-2">
        <span className="badge badge-primary">{roadMap.category}</span>
        <div className="flex items-center text-sm text-base-content/60">
          <Clock className="w-4 h-4 mr-1" />
          {roadMap.estimatedTime}
        </div>
        <span className="badge badge-outline">{roadMap.difficulty}</span>
      </div>
      <Link to={`/roadmap/${roadMap._id}`} className="btn btn-primary w-full">
        View Roadmap
      </Link>
    </div>
  </motion.div>
);

export default RoadMapCard;
