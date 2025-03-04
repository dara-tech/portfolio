import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useProjects from '../hooks/useProjects';
import { useAdminProfile } from '../hooks/useAdminProfile';

const AdminDashboard = () => {
  const { projects, loading: projectsLoading } = useProjects();
  const { formData: userData, loading: userLoading } = useAdminProfile();
  const [stats, setStats] = useState({
    totalViews: 0,
    monthlyViews: 0,
    monthlyGrowth: 0
  });

  useEffect(() => {
    if (projects) {
      const totalViews = projects.reduce((sum, project) => sum + (project.views || 0), 0);
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const monthlyViews = projects.reduce((sum, project) => {
        const recentViews = project.viewHistory?.filter(view => 
          new Date(view.timestamp) > thirtyDaysAgo
        ).length || 0;
        return sum + recentViews;
      }, 0);

      const previousMonthViews = projects.reduce((sum, project) => {
        const previousViews = project.viewHistory?.filter(view => {
          const viewDate = new Date(view.timestamp);
          return viewDate > new Date(thirtyDaysAgo - 30) && viewDate < thirtyDaysAgo;
        }).length || 0;
        return sum + previousViews;
      }, 0);

      const growth = previousMonthViews === 0 ? 100 : 
        ((monthlyViews - previousMonthViews) / previousMonthViews * 100).toFixed(1);

      setStats({
        totalViews,
        monthlyViews,
        monthlyGrowth: growth
      });
    }
  }, [projects]);

  if (projectsLoading || userLoading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="loading loading-spinner loading-lg"></div>
    </div>;
  }

  return (
    <div className="container mx-auto py-20 px-4 min-h-screen ">
      <div className="flex flex-col gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-3xl font-bold mb-4">
              Welcome back, {userData?.username || 'Admin'}!
            </h2>
            <div className="stats shadow">
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
                <div className="stat-title">Monthly Views</div>
                <div className="stat-value">{stats.monthlyViews}</div>
                <div className="stat-desc">
                  {stats.monthlyGrowth > 0 ? '↗︎' : '↘︎'} {Math.abs(stats.monthlyGrowth)}% from last month
                </div>
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
              <h2 className="card-title">Analytics</h2>
              <p>View detailed project engagement metrics</p>
              <div className="card-actions justify-end">
                <button className="btn">View</button>
              </div>
            </div>
          </Link>

          <Link to="/admin/roadmap" className="card bg-info text-info-content hover:bg-info-focus transition-colors">
            <div className="card-body">
              <h2 className="card-title">Roadmap</h2>
              <p>Manage your learning roadmap</p>
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