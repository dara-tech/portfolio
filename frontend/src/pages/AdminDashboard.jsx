import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
    return <div className="flex justify-center items-center h-screen">
      <div className="loading loading-spinner loading-lg"></div>
    </div>;
  }

  return (
    <div className="container mx-auto py-20 px-4 min-h-screen">
      <div className="flex flex-col gap-6">
        <div className="card bg-base-100 ring-1 ring-primary/10">
          <div className="card-body">
            <h2 className="card-title text-3xl font-bold mb-4">
              Welcome back, {userData?.username || 'Admin'}!
            </h2>
            <div className="stats ring-1 ring-primary/10 bg-base-200">
              <div className="stat">
                <div className="stat-title">Total Projects</div>
                <div className="stat-value">{projects?.length || 0}</div>
                <div className="stat-desc">Your portfolio items</div>
              </div>
              
              <div className="stat">
                <div className="stat-title">Total Views</div>
                <div className="stat-value">{stats.totalViews}</div>
                <div className="stat-desc">Lifetime project views</div>
              </div>

              <div className="stat">
                <div className="stat-title">Total Roadmaps</div>
                <div className="stat-value">{roadMaps?.length || 0}</div>
                <div className="stat-desc">Learning paths created</div>
              </div>

              <div className="stat">
                <div className="stat-title">Total Videos</div>
                <div className="stat-value">{videos?.data?.length || 0}</div>
                <div className="stat-desc">{stats.totalVideoViews} total views</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/admin/projects" className="card bg-primary text-primary-content hover:bg-primary-focus transition-colors">
            <div className="card-body">
              <h2 className="card-title">Manage Projects</h2>
              <p>Create, edit, and delete your portfolio projects</p>
              <div className="card-actions justify-end">
                <button className="btn">Open</button>
              </div>
            </div>
          </Link>

          <Link to="/admin/profile" className="card bg-secondary text-secondary-content hover:bg-secondary-focus transition-colors">
            <div className="card-body">
              <h2 className="card-title">Profile Settings</h2>
              <p>Update your personal information and CV</p>
              <div className="card-actions justify-end">
                <button className="btn">Edit</button>
              </div>
            </div>
          </Link>

          <Link to="/admin/analytics" className="card bg-accent text-accent-content hover:bg-accent-focus transition-colors">
            <div className="card-body">
              <h2 className="card-title">Analytics Dashboard</h2>
              <p>View detailed analytics and engagement metrics</p>
              <div className="card-actions justify-end">
                <button className="btn">View</button>
              </div>
            </div>
          </Link>

          <Link to="/admin/roadmap" className="card bg-info text-info-content hover:bg-info-focus transition-colors">
            <div className="card-body">
              <h2 className="card-title">Learning Roadmap ({roadMaps?.length || 0})</h2>
              <p>Create and manage learning paths</p>
              <div className="card-actions justify-end">
                <button className="btn">Manage</button>
              </div>
            </div>
          </Link>

          <Link to="/admin/videos" className="card bg-warning text-warning-content hover:bg-warning-focus transition-colors">
            <div className="card-body">
              <h2 className="card-title">Video Tutorials ({videos?.data?.length || 0})</h2>
              <p>Manage your video content</p>
              <div className="card-actions justify-end">
                <button className="btn">Manage</button>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;