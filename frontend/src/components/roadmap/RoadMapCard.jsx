import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const RoadMapCard = ({ roadMap }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    whileHover={{ scale: 1.02, y: -5 }}
    className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 h-full flex flex-col group"
  >
    <div className="p-6 flex-grow">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-white/90 transition-colors">
          {roadMap.title}
        </h3>
        <p className="text-white/70 text-sm leading-relaxed line-clamp-3">
          {roadMap.description}
        </p>
      </div>
    </div>
    
    <div className="p-6 pt-0 mt-auto">
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs border border-white/30">
          {roadMap.category}
        </span>
        <span className="px-3 py-1 bg-white/10 text-white/80 rounded-full text-xs border border-white/20">
          {roadMap.difficulty}
        </span>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-sm text-white/60">
          <Clock className="w-4 h-4 mr-2" />
          <span>{roadMap.estimatedTime}</span>
        </div>
      </div>
      
      <Link 
        to={`/roadmap/${roadMap._id}`} 
        className="w-full bg-white/20 hover:bg-white/30 text-white text-center py-3 rounded-xl border border-white/30 hover:border-white/40 transition-all duration-300 flex items-center justify-center gap-2 font-medium"
      >
        View Roadmap
        <span className="text-sm">→</span>
      </Link>
    </div>
  </motion.div>
);

export default RoadMapCard;
