import React from 'react';
import RoadMapCard from '../components/roadmap/RoadMapCard';
import { Loader2 } from 'lucide-react';
import { useRoadMapByID } from '../hooks/useRoadMap';

const RoadMapPage = () => {
  const { roadMaps, loading, error } = useRoadMapByID();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 font-semibold text-lg">{error}</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roadMaps.length > 0 ? (
          roadMaps.map((roadMap) => <RoadMapCard key={roadMap._id} roadMap={roadMap} />)
        ) : (
          <div className="col-span-full text-center text-gray-600 text-lg">No roadmaps found</div>
        )}
      </div>
    </div>
  );
};

export default RoadMapPage;
