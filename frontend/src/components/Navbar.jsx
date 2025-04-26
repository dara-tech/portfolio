import React, { useState, useEffect, useRef } from 'react';
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
  X,
  Home,
  FolderKanban,
  PanelTopClose,
  Map,
  MessageSquare,
  PenSquare,
  Video,
  Clapperboard,
  BookOpen,
  ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const token = localStorage.getItem('token');
  const { formData: userData, loading } = useAdminProfile();

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Set user profile image
  useEffect(() => {
    if (userData) {
      const profilePicture = userData?.profilePic;
      setUserImage(profilePicture || null);
    }
  }, [userData]);

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
    { path: '/roadmap', label: 'Roadmap', icon: Map },
    { path: '/lessons', label: 'Lessons', icon: BookOpen },
    { path: '/chat', label: 'Chat', icon: MessageSquare },
    { path: '/videos', label: 'Videos', icon: Clapperboard },
  ];

  const adminNavItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/projects', label: 'Projects', icon: PanelTopClose },
    { path: '/admin/roadmap', label: 'Roadmap', icon: Map },
    { path: '/admin/lessons', label: 'Lessons', icon: BookOpen },
    { path: '/admin/write', label: 'Write', icon: PenSquare },   
    { path: '/admin/videos', label: 'Videos', icon: Clapperboard },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const Logo = ({ className = "" }) => (
    <Link 
      to="/" 
      className={`group flex items-center gap-2 btn btn-ghost normal-case font-bold hover:scale-105 transition-all duration-300 ${className}`}
    >
      <div className="relative">
        <Terminal className="w-6 h-6 text-primary transform transition-transform group-hover:rotate-12" />
        <Code2 className="w-3 h-3 text-secondary absolute -top-1 -right-1 transform transition-transform group-hover:scale-125" />
      </div>
      <div className="flex items-baseline">
        <span className="text-xl">Portfolio</span>
        <span className="text-xl text-primary font-extrabold transition-colors duration-300 group-hover:text-secondary">.Dara</span>
      </div>
    </Link>
  );

  return (
    <>
      {/* Main Navigation */}
      <div className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? 'bg-base-200/95 backdrop-blur-md shadow-lg py-1' : 'bg-base-200 py-3'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Logo className="ml-2 lg:ml-0" />

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              <ul className="flex space-x-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                          isActive(item.path) 
                            ? 'bg-primary text-primary-content shadow-lg scale-105' 
                            : 'hover:bg-primary/10 text-base-content'
                        }`}
                      >
                        <Icon className={`w-4 h-4 mr-2 transition-transform duration-300 ${isActive(item.path) ? 'scale-110' : ''}`} />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* User Menu - Desktop */}
              <div className="relative ml-4" ref={dropdownRef}>
                {token ? (
                  <>
                    <button 
                      onClick={toggleUserDropdown}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-base-300 transition-all duration-300"
                    >
                      {userImage ? (
                        <img 
                          src={userImage} 
                          alt="User" 
                          className="w-8 h-8 rounded-full border-2 border-primary/30 object-cover"
                        />
                      ) : (
                        <UserCircle className="w-6 h-6" />
                      )}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* User Dropdown */}
                    <div className={`absolute right-0 mt-2 w-48 rounded-lg bg-base-200 shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-300 origin-top-right ${
                      userDropdownOpen ? 'transform scale-100 opacity-100' : 'transform scale-95 opacity-0 pointer-events-none'
                    }`}>
                      <Link 
                        to="/admin/profile" 
                        className="flex items-center px-4 py-3 hover:bg-base-300 rounded-t-lg transition-colors duration-300"
                      >
                        <UserCircle className="w-4 h-4 mr-2" />
                        <span>Profile</span>
                      </Link>
                      <Link 
                        to="/admin/settings" 
                        className="flex items-center px-4 py-3 hover:bg-base-300 transition-colors duration-300"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        <span>Settings</span>
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center px-4 py-3 w-full text-left hover:bg-base-300 text-error rounded-b-lg transition-colors duration-300"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <Link 
                    to="/admin/login" 
                    className="btn btn-primary btn-sm hover:scale-105 transition-all duration-300"
                  >
                    <UserCircle className="w-4 h-4 mr-2" />
                    Login
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="container mx-auto px-4 py-4 bg-base-300/80 backdrop-blur-md shadow-inner">
            <ul className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
                        isActive(item.path) 
                          ? 'bg-primary text-primary-content' 
                          : 'hover:bg-base-200'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              
              {token && (
                <div className="pt-2 mt-2 border-t border-base-content/20">
                  <Link 
                    to="/admin/profile" 
                    className="flex items-center px-4 py-3 rounded-lg hover:bg-base-200 transition-colors duration-300"
                  >
                    <UserCircle className="w-5 h-5 mr-3" />
                    <span>Profile</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center px-4 py-3 w-full text-left rounded-lg hover:bg-base-200 text-error transition-colors duration-300"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
              
              {!token && (
                <li>
                  <Link 
                    to="/admin/login" 
                    className="flex items-center px-4 py-3 rounded-lg bg-primary text-primary-content transition-all duration-300"
                  >
                    <UserCircle className="w-5 h-5 mr-3" />
                    <span>Login</span>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-base-200 shadow-lg z-50">
        <ul className="grid grid-cols-5 py-1">
          {token ? (
            adminNavItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <li key={item.path} className="relative">
                  <Link
                    to={item.path}
                    className="flex flex-col items-center p-2 transition-all duration-300"
                  >
                    <div className={`relative p-1 rounded-lg ${active ? 'bg-primary/20' : ''}`}>
                      <Icon className={`w-5 h-5 ${active ? 'text-primary' : 'text-base-content'} transition-all duration-300`} />
                      {active && <span className="absolute inset-0 animate-ping rounded-lg bg-primary/30" style={{animationDuration: '1.5s'}}></span>}
                    </div>
                    <span className={`text-xs mt-1 transition-all duration-300 ${active ? 'text-primary font-medium' : ''}`}>
                      {item.label}
                    </span>
                    {active && <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>}
                  </Link>
                </li>
              );
            })
          ) : (
            navItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <li key={item.path} className="relative">
                  <Link
                    to={item.path}
                    className="flex flex-col items-center p-2 transition-all duration-300"
                  >
                    <div className={`relative p-1 rounded-lg ${active ? 'bg-primary/20' : ''}`}>
                      <Icon className={`w-5 h-5 ${active ? 'text-primary' : 'text-base-content'} transition-all duration-300`} />
                      {active && <span className="absolute inset-0 animate-ping rounded-lg bg-primary/30" style={{animationDuration: '1.5s'}}></span>}
                    </div>
                    <span className={`text-xs mt-1 transition-all duration-300 ${active ? 'text-primary font-medium' : ''}`}>
                      {item.label}
                    </span>
                    {active && <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>}
                  </Link>
                </li>
              );
            })
          )}
          <li className="relative">
            <Link
              to={token ? "/admin/profile" : "/admin/login"}
              className="flex flex-col items-center p-2 transition-all duration-300"
            >
              <div className={`relative p-1 rounded-lg ${isActive(token ? "/admin/profile" : "/admin/login") ? 'bg-primary/20' : ''}`}>
                {userImage && token ? (
                  <img 
                    src={userImage} 
                    alt="Profile" 
                    className="w-5 h-5 rounded-full object-cover border border-primary/50"
                  />
                ) : (
                  <UserCircle className={`w-5 h-5 ${isActive(token ? "/admin/profile" : "/admin/login") ? 'text-primary' : ''}`} />
                )}
              </div>
              <span className="text-xs mt-1">{token ? "Profile" : "Login"}</span>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;