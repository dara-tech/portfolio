import { Link } from "react-router-dom";
import { Calendar, Clock, Tag } from "lucide-react";

const LessonCard = ({ lesson }) => {
  return (
    <li className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 h-full flex flex-col group">
      {lesson.image && (
        <figure className="h-48 overflow-hidden rounded-t-2xl">
          <img 
            src={lesson.image} 
            alt={lesson.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </figure>
      )}
      
      <div className="p-6 flex-grow flex flex-col">
        <h2 className="text-xl font-bold text-white mb-4 line-clamp-2 group-hover:text-white/90 transition-colors">
          {lesson.title}
        </h2>
        
        <div className="flex flex-wrap gap-2 text-sm text-white/60 mb-4">
          {lesson.createdAt && (
            <div className="flex items-center px-2 py-1 bg-white/10 rounded-full">
              <Calendar className="w-3 h-3 mr-1" />
              <span className="text-xs">{new Date(lesson.createdAt).toLocaleDateString()}</span>
            </div>
          )}
          
          {lesson.duration && (
            <div className="flex items-center px-2 py-1 bg-white/10 rounded-full">
              <Clock className="w-3 h-3 mr-1" />
              <span className="text-xs">{lesson.duration} min</span>
            </div>
          )}
          
          {lesson.category && (
            <div className="flex items-center px-2 py-1 bg-white/10 rounded-full">
              <Tag className="w-3 h-3 mr-1" />
              <span className="text-xs">{lesson.category}</span>
            </div>
          )}
        </div>
        
        <p className="text-white/70 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
          {lesson.description}
        </p>
        
        <div className="mt-auto">
          <Link 
            to={`/lessons/${lesson._id}`} 
            className="w-full bg-white/20 hover:bg-white/30 text-white text-center py-3 rounded-xl border border-white/30 hover:border-white/40 transition-all duration-300 flex items-center justify-center gap-2 font-medium"
          >
            Read More
            <span className="text-sm">→</span>
          </Link>
        </div>
      </div>
    </li>
  );
};

export default LessonCard;
