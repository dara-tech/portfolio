import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFolder, FaUser, FaChartBar, FaMap, FaVideo } from 'react-icons/fa';
import useProjects from '../hooks/useProjects';
import { useAdminProfile } from '../hooks/useAdminProfile';
import { useRoadMapByID } from '../hooks/useRoadMap';
import useVideo from '../hooks/useVideo';

const AdminDashboard = () => {
  const { projects, loading: projectsLoading } = useProjects();
  const { profile: userData, loading: userLoading } = useAdminProfile();
  const { roadMaps, loading: roadmapsLoading } = useRoadMapByID();
  const { videos, getAllVideos, loading: videosLoading } = useVideo();
  const [stats, setStats] = useState({
    totalViews: 0,
    totalVideoViews: 0
  });

  // Fetch videos on mount
  useEffect(() => {
    getAllVideos();
  }, [getAllVideos]);

  // Calculate stats when projects or videos change
  useEffect(() => {
    if (!projects) return;

    const totalViews = projects.reduce((sum, project) => sum + (project.views || 0), 0);
    
    // Calculate total video views only if videos is an array
    const totalVideoViews = Array.isArray(videos?.data) 
      ? videos.data.reduce((sum, video) => sum + (video.views || 0), 0)
      : 0;

    setStats({
      totalViews,
      totalVideoViews
    });
  }, [projects, videos]);

  if (projectsLoading || userLoading || roadmapsLoading || videosLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6 drop-shadow-lg">Admin Dashboard</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto drop-shadow-md">
            Welcome back, {userData?.username || 'Admin'}! Manage your portfolio content
          </p>
        </div>

        {/* Stats Overview */}
        <div className="bg-white/5  rounded-3xl p-8 border border-white/10 shadow-2xl mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-md">Portfolio Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 shadow-xl hover:bg-white/10 transition-all duration-300">
              <div className="text-3xl font-bold text-white mb-2 drop-shadow-md">{projects?.length || 0}</div>
              <div className="text-white/80 font-medium">Total Projects</div>
              <div className="text-sm text-white/60">Portfolio items</div>
            </div>
            
            <div className="bg-white/5  rounded-2xl p-6 border border-white/10 shadow-xl hover:bg-white/10 transition-all duration-300">
              <div className="text-3xl font-bold text-white mb-2 drop-shadow-md">{stats.totalViews}</div>
              <div className="text-white/80 font-medium">Total Views</div>
              <div className="text-sm text-white/60">Lifetime project views</div>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 shadow-xl hover:bg-white/10 transition-all duration-300">
              <div className="text-3xl font-bold text-white mb-2 drop-shadow-md">{roadMaps?.length || 0}</div>
              <div className="text-white/80 font-medium">Learning Roadmaps</div>
              <div className="text-sm text-white/60">Learning paths created</div>
            </div>

            <div className="bg-white/5  rounded-2xl p-6 border border-white/10 shadow-xl hover:bg-white/10 transition-all duration-300">
              <div className="text-3xl font-bold text-white mb-2 drop-shadow-md">{videos?.data?.length || 0}</div>
              <div className="text-white/80 font-medium">Video Tutorials</div>
              <div className="text-sm text-white/60">{stats.totalVideoViews} total views</div>
            </div>
          </div>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link 
            to="/admin/projects" 
            className="bg-white/5  rounded-3xl p-8 border border-white/10 shadow-2xl hover:bg-white/10 hover:shadow-3xl hover:scale-105 transition-all duration-300 group"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20  rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/30 transition-colors shadow-lg">
                <FaFolder className="text-2xl text-white drop-shadow-md" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 drop-shadow-md">Manage Projects</h3>
              <p className="text-white/80 mb-6">Create, edit, and delete your portfolio projects</p>
              <div className="bg-white/10  hover:bg-white/20 text-white px-6 py-3 rounded-xl border border-white/20 transition-all duration-300 inline-block shadow-lg">
                Open
              </div>
            </div>
          </Link>

          <Link 
            to="/admin/profile" 
            className="bg-white/5  rounded-3xl p-8 border border-white/10 shadow-2xl hover:bg-white/10 hover:shadow-3xl hover:scale-105 transition-all duration-300 group"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20  rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/30 transition-colors shadow-lg">
                <FaUser className="text-2xl text-white drop-shadow-md" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 drop-shadow-md">Profile Settings</h3>
              <p className="text-white/80 mb-6">Update your personal information and CV</p>
              <div className="bg-white/10  hover:bg-white/20 text-white px-6 py-3 rounded-xl border border-white/20 transition-all duration-300 inline-block shadow-lg">
                Edit
              </div>
            </div>
          </Link>

          <Link 
            to="/admin/analytics" 
            className="bg-white/5  rounded-3xl p-8 border border-white/10 shadow-2xl hover:bg-white/10 hover:shadow-3xl hover:scale-105 transition-all duration-300 group"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20  rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/30 transition-colors shadow-lg">
                <FaChartBar className="text-2xl text-white drop-shadow-md" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 drop-shadow-md">Analytics Dashboard</h3>
              <p className="text-white/80 mb-6">View detailed analytics and engagement metrics</p>
              <div className="bg-white/10  hover:bg-white/20 text-white px-6 py-3 rounded-xl border border-white/20 transition-all duration-300 inline-block shadow-lg">
                View
              </div>
            </div>
          </Link>

          <Link 
            to="/admin/roadmap" 
            className="bg-white/5  rounded-3xl p-8 border border-white/10 shadow-2xl hover:bg-white/10 hover:shadow-3xl hover:scale-105 transition-all duration-300 group"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500/20  rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500/30 transition-colors shadow-lg">
                <FaMap className="text-2xl text-white drop-shadow-md" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 drop-shadow-md">Learning Roadmap ({roadMaps?.length || 0})</h3>
              <p className="text-white/80 mb-6">Create and manage learning paths</p>
              <div className="bg-white/10  hover:bg-white/20 text-white px-6 py-3 rounded-xl border border-white/20 transition-all duration-300 inline-block shadow-lg">
                Manage
              </div>
            </div>
          </Link>

          <Link 
            to="/admin/videos" 
            className="bg-white/5  rounded-3xl p-8 border border-white/10 shadow-2xl hover:bg-white/10 hover:shadow-3xl hover:scale-105 transition-all duration-300 group"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20  rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-red-500/30 transition-colors shadow-lg">
                <FaVideo className="text-2xl text-white drop-shadow-md" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 drop-shadow-md">Video Tutorials ({videos?.data?.length || 0})</h3>
              <p className="text-white/80 mb-6">Manage your video content</p>
              <div className="bg-white/10  hover:bg-white/20 text-white px-6 py-3 rounded-xl border border-white/20 transition-all duration-300 inline-block shadow-lg">
                Manage
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;