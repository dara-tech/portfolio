import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import RoadMapDetail from '../components/roadmap/RoadMapDetail';
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-500/20 backdrop-blur-sm text-red-400 px-8 py-6 rounded-2xl border border-red-500/30 max-w-md">
          <h3 className="text-xl font-semibold mb-2">Error Loading Roadmap</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {roadMap ? (
          <RoadMapDetail roadMap={roadMap} />
        ) : (
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20">
              <h3 className="text-2xl font-semibold text-white mb-4">Roadmap Not Found</h3>
              <p className="text-white/70">The roadmap you're looking for doesn't exist.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadMapDetailPage;