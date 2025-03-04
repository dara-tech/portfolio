import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import RoadMapDetail from '../components/RoadMapDetail';
import { Loader2 } from 'lucide-react';
import { useRoadMap } from '../hooks/useRoadMap';

const RoadMapDetailPage = () => {
  const { id } = useParams();
  const { roadMap, loading, error } = useRoadMap(id);

  useEffect(() => {
    console.log('RoadMap ID:', id);
    console.log('Loading:', loading);
    console.log('Error:', error);
    console.log('RoadMap:', roadMap);
  }, [id, loading, error, roadMap]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 font-semibold text-lg">{error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      {roadMap ? (
        <RoadMapDetail roadMap={roadMap} />
      ) : (
        <div className="text-center text-gray-600 text-lg">Roadmap not found</div>
      )}
    </div>
  );
};

export default RoadMapDetailPage;