import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  return (
    <div className="navbar bg-base-200 px-4 sm:px-8">
      <div className="navbar-start">
        <div className="dropdown lg:hidden">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            {token && (
              <>
                <li><Link to="/admin/dashboard">Dashboard</Link></li>
                <li><Link to="/admin/projects">Manage Projects</Link></li>
              </>
            )}
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost text-xl">Portfolio<span className="text-primary">.dev</span></Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li><Link to="/" className="rounded-lg">Home</Link></li>
          <li><Link to="/projects" className="rounded-lg">Projects</Link></li>
          {token && (
            <>
              <li><Link to="/admin/dashboard" className="rounded-lg">Dashboard</Link></li>
              <li><Link to="/admin/projects" className="rounded-lg">Manage Projects</Link></li>
            </>
          )}
        </ul>
      </div>
      
      <div className="navbar-end gap-2">
        {token ? (
          <button onClick={handleLogout} className="btn btn-error btn-sm">
            Logout
          </button>
        ) : (
          <>
            <Link to="/admin/login" className="btn btn-ghost btn-sm">Login</Link>
            {/* <Link to="/admin/register" className="btn btn-primary btn-sm">Register</Link> */}
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;