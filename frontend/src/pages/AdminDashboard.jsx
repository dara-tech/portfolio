import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-3xl font-bold mb-4">Welcome to Admin Dashboard</h2>
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Total Projects</div>
                <div className="stat-value">89</div>
                <div className="stat-desc">21% more than last month</div>
              </div>
              
              <div className="stat">
                <div className="stat-title">Page Views</div>
                <div className="stat-value">2,200</div>
                <div className="stat-desc">↗︎ 400 (22%)</div>
              </div>
              
              <div className="stat">
                <div className="stat-title">New Users</div>
                <div className="stat-value">150</div>
                <div className="stat-desc">↘︎ 90 (14%)</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card bg-primary text-primary-content">
            <div className="card-body">
              <h2 className="card-title">Manage Projects</h2>
              <p>Create, edit, and delete your portfolio projects</p>
              <div className="card-actions justify-end">
                <button className="btn">Open</button>
              </div>
            </div>
          </div>

          <div className="card bg-secondary text-secondary-content">
            <div className="card-body">
              <h2 className="card-title">Analytics</h2>
              <p>View detailed statistics and user engagement</p>
              <div className="card-actions justify-end">
                <button className="btn">View</button>
              </div>
            </div>
          </div>

          <div className="card bg-accent text-accent-content">
            <div className="card-body">
              <h2 className="card-title">Settings</h2>
              <p>Configure your dashboard preferences</p>
              <div className="card-actions justify-end">
                <button className="btn">Configure</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;