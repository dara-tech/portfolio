import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
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
  ChevronDown,
  HelpCircle
} from 'lucide-react';

// Constants
const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/projects', label: 'Projects', icon: FolderKanban },
  { path: '/roadmap', label: 'Roadmap', icon: Map },
  { path: '/lessons', label: 'Lessons', icon: BookOpen },
  { path: '/chat', label: 'Chat', icon: MessageSquare },
  { path: '/videos', label: 'Videos', icon: Clapperboard },
];

const ADMIN_NAV_ITEMS = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/projects', label: 'Projects', icon: PanelTopClose },
  { path: '/admin/roadmap', label: 'Roadmap', icon: Map },
  { path: '/admin/lessons', label: 'Lessons', icon: BookOpen },
  { path: '/admin/write', label: 'Write', icon: PenSquare },   
  { path: '/admin/videos', label: 'Videos', icon: Clapperboard },
];

// Memoized Components
const Logo = memo(({ className = "" }) => (
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
));

const ProfileCard = memo(({ userData, userImage }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    projects: 12,
    lessons: 24,
    videos: 8
  });

  useEffect(() => {
    // Simulate loading stats
    setIsLoading(true);
    setTimeout(() => {
      setStats({
        projects: userData?.projects || 12,
        lessons: userData?.lessons || 24,
        videos: userData?.videos || 8
      });
      setIsLoading(false);
    }, 500);
  }, [userData]);

  return (
    <div 
      className="flex flex-col space-y-4 p-4 bg-base-200 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Profile Header */}
      <div className="flex items-center space-x-4">
        <div className="relative group">
          {userImage ? (
            <img 
              src={userImage} 
              alt="Profile" 
              className="w-16 h-16 rounded-full object-cover border-2 border-primary/50 shadow-lg group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
              <UserCircle className="w-10 h-10 text-primary" />
            </div>
          )}
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-success rounded-full border-2 border-base-200 shadow-sm group-hover:scale-110 transition-transform duration-300"></div>
          {isHovered && (
            <div className="absolute inset-0 rounded-full bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-white text-xs font-medium">Change Photo</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold truncate group-hover:text-primary transition-colors duration-300">
            {userData?.name || 'User'}
          </h3>
          <p className="text-sm text-base-content/60 truncate">
            {userData?.email || 'user@example.com'}
          </p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs text-success font-medium flex items-center">
              <span className="w-2 h-2 bg-success rounded-full mr-1 animate-pulse"></span>
              Online
            </span>
            <span className="text-xs text-base-content/40">•</span>
            <span className="text-xs text-base-content/60">Last active: Just now</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-base-content/10">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex flex-col items-center p-2 rounded-lg">
              <div className="w-8 h-6 bg-base-300 rounded animate-pulse"></div>
              <div className="w-12 h-4 bg-base-300 rounded mt-1 animate-pulse"></div>
            </div>
          ))
        ) : (
          <>
            <div className="flex flex-col items-center p-2 rounded-lg hover:bg-base-300 transition-colors duration-200 group">
              <span className="text-lg font-semibold text-primary group-hover:scale-110 transition-transform duration-300">
                {stats.projects}
              </span>
              <span className="text-xs text-base-content/60">Projects</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-lg hover:bg-base-300 transition-colors duration-200 group">
              <span className="text-lg font-semibold text-primary group-hover:scale-110 transition-transform duration-300">
                {stats.lessons}
              </span>
              <span className="text-xs text-base-content/60">Lessons</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-lg hover:bg-base-300 transition-colors duration-200 group">
              <span className="text-lg font-semibold text-primary group-hover:scale-110 transition-transform duration-300">
                {stats.videos}
              </span>
              <span className="text-xs text-base-content/60">Videos</span>
            </div>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-2 pt-2 border-t border-base-content/10">
        <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-200 group">
          <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
          <span className="text-sm">Settings</span>
        </button>
        <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-200 group">
          <HelpCircle className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
          <span className="text-sm">Help</span>
        </button>
      </div>

      {/* Additional Info */}
      <div className="pt-2 border-t border-base-content/10">
        <div className="flex items-center justify-between text-xs text-base-content/60">
          <span>Member since</span>
          <span className="font-medium">{userData?.joinDate || 'Jan 2024'}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-base-content/60 mt-1">
          <span>Role</span>
          <span className="font-medium">{userData?.role || 'User'}</span>
        </div>
      </div>
    </div>
  );
});

const MobileNavItem = memo(({ item, isActive }) => {
  const Icon = item.icon;
  return (
    <Link
      to={item.path}
      className={`flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
        isActive 
          ? 'bg-primary text-primary-content' 
          : 'hover:bg-base-200'
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span>{item.label}</span>
    </Link>
  );
});

const MobileActionButton = memo(({ icon: Icon, onClick, badge, className = "" }) => (
  <button 
    onClick={onClick}
    className={`p-2 rounded-lg hover:bg-base-300 transition-all duration-300 ${className}`}
  >
    <div className="relative">
      <Icon className="w-5 h-5" />
      {badge && (
        <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span>
      )}
    </div>
  </button>
));

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

  // Scroll handler
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);
  }, []);

  // Toggle handlers
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const toggleUserDropdown = useCallback(() => {
    setUserDropdownOpen(prev => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [navigate]);

  // Effects
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    if (userData?.profilePic) {
      setUserImage(userData.profilePic);
    }
  }, [userData]);

  // Helper functions
  const isActive = useCallback((path) => {
    return location.pathname === path;
  }, [location.pathname]);

  // Render functions
  const renderDesktopNav = () => (
    <div className="hidden lg:flex items-center space-x-2">
      <ul className="flex space-x-1">
        {NAV_ITEMS.map((item) => (
          <li key={item.path}>
            <MobileNavItem 
              item={item} 
              isActive={isActive(item.path)} 
            />
          </li>
        ))}
      </ul>

      <div className="relative ml-2" ref={dropdownRef}>
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
            
            <div className={`absolute right-0 mt-2 w-72 rounded-lg bg-base-200 shadow-xl ring-1 ring-black ring-opacity-5 transition-all duration-300 origin-top-right ${
              userDropdownOpen ? 'transform scale-100 opacity-100' : 'transform scale-95 opacity-0 pointer-events-none'
            }`}>
              <div className="p-3">
                <ProfileCard userData={userData} userImage={userImage} />
              </div>
              <div className="py-2 border-t border-base-content/10">
                <Link 
                  to="/admin/settings" 
                  className="flex items-center px-4 py-3 hover:bg-base-300 transition-colors duration-300"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  <span>Settings</span>
                </Link>
                <Link 
                  to="/help" 
                  className="flex items-center px-4 py-3 hover:bg-base-300 transition-colors duration-300"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  <span>Help & Support</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center px-4 py-3 w-full text-left hover:bg-base-300 text-error transition-colors duration-300"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Logout</span>
                </button>
              </div>
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
  );

  const renderMobileNav = () => (
    <div className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${
      mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
    }`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={toggleMobileMenu}
      />
      
      {/* Mobile Menu Content */}
      <div className="absolute left-0 top-0 bottom-0 w-full bg-base-200 shadow-xl flex flex-col">
        {/* Profile Header */}
        {token && (
          <div className="bg-primary text-primary-content p-4">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {userImage ? (
                    <img 
                      src={userImage} 
                      alt="Profile" 
                      className="w-12 h-12 rounded-full object-cover border-2 border-white"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <UserCircle className="w-8 h-8 text-white" />
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold truncate">{userData?.name || 'User'}</h3>
                  <p className="text-xs opacity-80 truncate">{userData?.email || 'user@example.com'}</p>
                  <div className="flex items-center space-x-1 mt-0.5">
                    <span className="text-xs text-success font-medium">Online</span>
                    <span className="text-xs opacity-60">•</span>
                    <span className="text-xs opacity-80">Just now</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-16">
          <div className="p-4">
            {/* Navigation Section */}
            <div className="space-y-4">
              <div>
                <ul className="space-y-1">
                  {NAV_ITEMS.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
                          isActive(item.path) 
                            ? 'bg-primary/10 text-primary' 
                            : 'hover:bg-base-300'
                        }`}
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Admin Navigation */}
              {token && (
                <div>
                  <h3 className="px-4 py-2 text-sm font-semibold text-base-content/60">Admin</h3>
                  <ul className="space-y-1">
                    {ADMIN_NAV_ITEMS.map((item) => (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          className={`flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
                            isActive(item.path) 
                              ? 'bg-primary/10 text-primary' 
                              : 'hover:bg-base-300'
                          }`}
                        >
                          <item.icon className="w-5 h-5 mr-3" />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Account Menu */}
              {token && (
                <div>
                  <h3 className="px-4 py-2 text-sm font-semibold text-base-content/60">Account</h3>
                  <ul className="space-y-1">
                    <li>
                      <Link 
                        to="/admin/settings" 
                        className="flex items-center px-4 py-3 rounded-lg hover:bg-base-300 transition-colors duration-300"
                      >
                        <Settings className="w-5 h-5 mr-3" />
                        <span>Settings</span>
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/help" 
                        className="flex items-center px-4 py-3 rounded-lg hover:bg-base-300 transition-colors duration-300"
                      >
                        <HelpCircle className="w-5 h-5 mr-3" />
                        <span>Help & Support</span>
                      </Link>
                    </li>
                    <li>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center px-4 py-3 w-full text-left rounded-lg hover:bg-base-300 text-error transition-colors duration-300"
                      >
                        <LogOut className="w-5 h-5 mr-3" />
                        <span>Logout</span>
                      </button>
                    </li>
                  </ul>
                </div>
              )}

              {/* Login Button */}
              {!token && (
                <div className="pt-4">
                  <Link 
                    to="/admin/login" 
                    className="flex items-center justify-center px-4 py-3 rounded-lg bg-primary text-primary-content transition-all duration-300"
                  >
                    <UserCircle className="w-5 h-5 mr-3" />
                    <span>Login</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBottomNav = () => (
    <div className={`fixed bottom-0 left-0 right-0 bg-base-200/95 backdrop-blur-xl shadow-lg z-50 transition-all duration-300 ${
      mobileMenuOpen ? 'opacity-50 ' : 'opacity-100 '
    }`}>
      <ul className="grid grid-cols-5 py-2">
        {(token ? ADMIN_NAV_ITEMS : NAV_ITEMS).slice(0, 4).map((item) => {
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
        })}
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
  );

  return (
    <>
      <div className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? 'bg-base-200/80 backdrop-blur-xl shadow-lg py-1' : 'bg-base-200/95 backdrop-blur-md py-3'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Logo className="ml-2 lg:ml-0" />
            {renderDesktopNav()}
            <button 
              className="lg:hidden p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      {renderMobileNav()}
      {renderBottomNav()}
    </>
  );
};

export default memo(Navbar);