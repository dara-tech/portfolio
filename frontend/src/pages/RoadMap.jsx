import React, { useState } from 'react';
import RoadMapCard from '../components/roadmap/RoadMapCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRoadMapByID } from '../hooks/useRoadMap';
import { Loading } from '../components/common/Loading';

const RoadMapPage = () => {
  const { roadMaps, loading, error } = useRoadMapByID();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  if (loading) {
    return <Loading type="grid" text="Loading roadmaps..." />;
  }

  if (error) {
    return <div className="text-center text-red-500 font-semibold text-lg">{error}</div>;
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRoadMaps = roadMaps.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(roadMaps.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {roadMaps.length > 0 ? (
            currentRoadMaps.map((roadMap) => <RoadMapCard key={roadMap._id} roadMap={roadMap} />)
          ) : (
            <div className="col-span-full text-center text-gray-600 text-lg">No roadmaps found</div>
          )}
        </div>

        {roadMaps.length > itemsPerPage && (
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

export default RoadMapPage;
