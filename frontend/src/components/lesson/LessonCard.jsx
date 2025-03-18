import { Link } from "react-router-dom";
import { Calendar, Clock, Tag } from "lucide-react";

const LessonCard = ({ lesson }) => {
  return (
    <li className="card bg-base-100 transition-shadow duration-300 border-primary/20 border-1">
      {lesson.image && (
        <figure className="h-48 overflow-hidden">
          <img 
            src={lesson.image} 
            alt={lesson.title} 
            className="w-full h-full object-cover"
          />
        </figure>
      )}
      
      <div className="card-body">
        <h2 className="card-title text-xl font-bold">{lesson.title}</h2>
        
        <ul className="flex flex-wrap gap-2 text-sm text-base-content/70 my-2">
          {lesson.createdAt && (
            <li className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{new Date(lesson.createdAt).toLocaleDateString()}</span>
            </li>
          )}
          
          {lesson.duration && (
            <li className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{lesson.duration} min</span>
            </li>
          )}
          
          {lesson.category && (
            <li className="flex items-center">
              <Tag className="w-4 h-4 mr-1" />
              <span>{lesson.category}</span>
            </li>
          )}
        </ul>
        
        <p className="text-base-content/80 line-clamp-3">{lesson.description}</p>
        
        <div className="card-actions justify-end mt-4">
          <Link to={`/lessons/${lesson._id}`} className="btn btn-primary btn-sm">
            Read More
          </Link>
        </div>
      </div>
    </li>
  );
};

export default LessonCard;
