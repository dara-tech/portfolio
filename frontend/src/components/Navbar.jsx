import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAdminProfile } from "../hooks/useAdminProfile";
import { 
  Code2, 
  Terminal, 
  UserCircle, 
  LayoutDashboard, 
  LogOut, 
  Settings, 
  Menu,
  Home,
  FolderKanban,
  PanelTopClose
} from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const token = localStorage.getItem('token');
  const { formData: userData, loading } = useAdminProfile();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/projects', label: 'Projects', icon: FolderKanban },
    ...(token ? [
      // { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/admin/projects', label: 'Manage Projects', icon: PanelTopClose },
      { path: '/admin/profile', label: 'Profile', icon: UserCircle },
    ] : [])
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const Logo = ({ className = "" }) => (
    <Link 
      to="/" 
      className={`group flex items-center gap-2 btn btn-ghost normal-case font-bold hover:scale-105 transition-all duration-300 ${className}`}
    >
      <div className="relative">
        <Terminal className="w-6 h-6 text-primary transform transition-transform group-hover:rotate-12" />
        {/* <Code2 className="w-4 h-4 absolute -bottom-1 -right-1 text-secondary transform transition-transform group-hover:-rotate-12" /> */}
      </div>
      <div className="flex items-baseline">
        <span className="text-xl">Portfolio</span>
        <span className="text-xl text-primary font-extrabold transition-colors duration-300 group-hover:text-secondary">.dev</span>
      </div>
    </Link>
  );

  return (
    <div className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-base-200/95 backdrop-blur-md shadow-lg' : 'bg-base-200'
    }`}>
      <div className="navbar container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="navbar-start">
          <div className="lg:hidden dropdown">
            <button 
              onClick={toggleMobileMenu}
              className={`btn btn-ghost btn-sm rounded-lg hover:bg-primary/10 ${
                mobileMenuOpen ? 'bg-primary/20' : ''
              }`}
              aria-label="Toggle menu"
            >
              <Menu className={`h-5 w-5 transition-transform duration-200 ${
                mobileMenuOpen ? 'rotate-90' : ''
              }`} />
            </button>
          </div>
          <Logo className="ml-2 lg:ml-0" />
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`rounded-lg px-4 hover:bg-primary/20 transition-colors duration-200 ${
                      isActive(item.path) ? 'bg-primary text-primary-content hover:bg-primary' : ''
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="navbar-end">
          {token ? (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar ring ring-primary ring-offset-base-100 ring-offset-2">
                {loading ? (
                  <div className="loading loading-spinner loading-sm"></div>
                ) : userData?.profilePic ? (
                  <div className="w-10 rounded-full">
                    <img 
                      src={userData.profilePic} 
                      alt="profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'default-avatar.png';
                      }}
                    />
                  </div>
                ) : (
                  <div className="bg-primary text-primary-content rounded-full w-10 h-10 flex items-center justify-center">
                    <span>{userData?.username?.[0]?.toUpperCase() || '?'}</span>
                  </div>
                )}
              </label>
              <div tabIndex={0} className="dropdown-content mt-3 z-[1] shadow-2xl bg-base-200 rounded-box w-64">
                <div className="p-4 border-b border-base-300">
                  <p className="font-bold">{userData?.username || 'User'}</p>
                  <p className="text-sm opacity-70">{userData?.email || 'email@example.com'}</p>
                </div>
                <ul className="menu menu-sm gap-1 p-3 w-full">
                  <li>
                    <Link to="/admin/dashboard" className="flex items-center gap-3 p-3 hover:bg-base-300 rounded-lg transition-colors">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/profile" className="flex items-center gap-3 p-3 hover:bg-base-300 rounded-lg transition-colors">
                      <UserCircle className="w-4 h-4" />
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/settings" className="flex items-center gap-3 p-3 hover:bg-base-300 rounded-lg transition-colors">
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                  </li>
                  <div className="divider my-1"></div>
                  <li>
                    <button 
                      onClick={handleLogout} 
                      className="flex items-center gap-3 p-3 text-error hover:bg-error/10 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <Link 
              to="/admin/login" 
              className="btn btn-primary btn-sm"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div className={`lg:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/20" onClick={toggleMobileMenu}>
          <div 
            className={`absolute top-[64px] left-0 right-0 bg-base-200 shadow-lg transform transition-all duration-300 ease-in-out ${
              mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
            }`}
            onClick={e => e.stopPropagation()}
          >
            <ul className="menu menu-sm p-4 w-full">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <Link 
                      to={item.path}
                      className={`flex items-center gap-2 p-3 rounded-lg transition-all duration-200 ${
                        isActive(item.path) 
                          ? 'bg-primary text-primary-content hover:bg-primary/90' 
                          : 'hover:bg-primary/10'
                      }`}
                      onClick={toggleMobileMenu}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              {token && (
                <li>
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center gap-2 p-3 mt-2 text-error hover:bg-error/10 rounded-lg transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;