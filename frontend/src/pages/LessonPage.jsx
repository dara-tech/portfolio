import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useLesson from "../hooks/useLesson";
import LessonCard from "../components/lesson/LessonCard";

const LessonPage = () => {
  const { id } = useParams();
  const { lesson, lessons, loading, error, fetchLessonById, fetchLessons } = useLesson();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    if (id) {
      // Removed fetchLessonById(id) as instructed
    } else {
      fetchLessons();
    }
  }, [id, fetchLessonById, fetchLessons]);

  if (loading) {
    return (
      <div className="min-h-screen overflow-y-auto">
        <div className="container mx-auto px-4 py-20">
          <h1 className="text-3xl font-bold mb-8 text-center">Lessons</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="card bg-base-100 shadow-xl animate-pulse">
                <div className="h-48 bg-base-300 rounded-t-xl"></div>
                <div className="card-body">
                  <div className="h-6 bg-base-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-base-300 rounded w-1/2 mb-4"></div>
                  <div className="h-20 bg-base-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 font-semibold text-lg">{error}</div>;
  }

  // If we have an ID, show the lesson detail
  if (id && lesson) {
    return <LessonDetail lesson={lesson} />;
  }

  // Otherwise, show the list of lessons
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLessons = lessons.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(lessons.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen overflow-y-auto">
      <div className="card mx-auto px-4 py-20 ">
        <h1 className="text-3xl font-bold mb-8 text-center">Lessons</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {lessons.length > 0 ? (
            currentLessons.map((lesson) => <LessonCard key={lesson._id} lesson={lesson} />)
          ) : (
            <div className="col-span-full text-center text-gray-600 text-lg">No lessons found</div>
          )}
        </div>

        {lessons.length > itemsPerPage && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn btn-circle btn-outline btn-sm"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`btn btn-circle btn-sm ${
                  currentPage === index + 1 ? 'btn-primary' : 'btn-outline'
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="btn btn-circle btn-outline btn-sm"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonPage;