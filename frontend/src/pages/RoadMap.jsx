import React, { useState } from 'react';
import RoadMapCard from '../components/roadmap/RoadMapCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRoadMapByID } from '../hooks/useRoadMap';
import { Loading } from '../components/common/Loading';

const RoadMapPage = () => {
  const { roadMaps, loading, error } = useRoadMapByID();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRoadMaps = roadMaps.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(roadMaps.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">Learning Roadmaps</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Follow structured learning paths to master new skills and technologies
          </p>
        </div>
        
        {/* Roadmaps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {loading ? (
            Array(6).fill().map((_, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-pulse">
                <div className="h-40 bg-white/20 rounded-xl mb-4"></div>
                <div className="space-y-3">
                  <div className="h-6 bg-white/20 rounded w-3/4"></div>
                  <div className="h-4 bg-white/20 rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-full text-center">
              <div className="bg-red-500/20 backdrop-blur-sm text-red-400 px-8 py-6 rounded-2xl border border-red-500/30 max-w-md mx-auto">
                <h3 className="text-xl font-semibold mb-2">Error Loading Roadmaps</h3>
                <p>{error}</p>
              </div>
            </div>
          ) : roadMaps.length > 0 ? (
            currentRoadMaps.map((roadMap) => <RoadMapCard key={roadMap._id} roadMap={roadMap} />)
          ) : (
            <div className="col-span-full text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20">
                <h3 className="text-2xl font-semibold text-white mb-4">No Roadmaps Found</h3>
                <p className="text-white/70">Check back later for new learning paths!</p>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && roadMaps.length > itemsPerPage && (
          <div className="flex justify-center items-center gap-3">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-12 h-12 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`w-12 h-12 rounded-full transition-all duration-300 flex items-center justify-center ${
                  currentPage === index + 1 
                    ? 'bg-white/30 text-white border border-white/40' 
                    : 'bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20'
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-12 h-12 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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
