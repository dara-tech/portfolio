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
  PanelTopClose,
  Map,
  MessageSquare
} from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userImage, setUserImage] = useState('');

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

  useEffect(() => {
    if (userData) {
      const profilePicture = userData?.profilePic;
      setUserImage(profilePicture);
    }
  }, [userData]);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/projects', label: 'Projects', icon: FolderKanban },
    { path: '/roadmap', label: 'Roadmap', icon: Map },
    { path: '/chat', label: 'Chat', icon: MessageSquare },
  ];

  const adminNavItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/projects', label: 'Manage Projects', icon: PanelTopClose },
    { path: '/admin/roadmap', label: 'Manage Roadmap', icon: Map },
    { path: '/admin/profile', label: 'Profile', icon: UserCircle, userImage: userData?.profilePic || '/default-avatar.png' },
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
      </div>
      <div className="flex items-baseline">
        <span className="text-xl">Portfolio</span>
        <span className="text-xl text-primary font-extrabold transition-colors duration-300 group-hover:text-secondary">.dev</span>
      </div>
    </Link>
  );

  return (
    <>
      <div className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-base-200/95 backdrop-blur-md shadow-lg' : 'bg-base-200'
      }`}>
        <div className="navbar container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="navbar-start">
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
              <button 
                onClick={handleLogout}
                className="btn btn-ghost btn-sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            ) : (
              <Link 
                to="/admin/login" 
                className="btn btn-primary btn-sm"
              >
                <UserCircle className="w-4 h-4 mr-2" />
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-base-200 shadow-lg z-50">
        <ul className="flex justify-around py-2">
          {token ? (
            <>
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex flex-col items-center p-2 rounded-lg transition-colors duration-200 ${
                      isActive(item.path) ? 'text-primary' : 'text-base-content'
                    }`}
                  >
                   {item.userImage ? (
  <img src={userImage} alt="User" className="w-7 h-7 rounded-full  " />
) : (
  <Icon className="w-6 h-6 mb-1" />
)}
                    <span className="text-xs">{item.label}</span>
                  </Link>
                </li>
                );
              })}
            </>
          ) : (
            <>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex flex-col items-center p-2 rounded-lg transition-colors duration-200 ${
                        isActive(item.path) ? 'text-primary' : 'text-base-content'
                      }`}
                    >
                      <Icon className="w-6 h-6 mb-1" />
                      <span className="text-xs">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link
                  to="/admin/login"
                  className="flex flex-col items-center p-2 rounded-lg transition-colors duration-200 text-primary"
                >
                  <UserCircle className="w-6 h-6 mb-1" />
                  <span className="text-xs">Login</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </>
  );
};

export default Navbar;