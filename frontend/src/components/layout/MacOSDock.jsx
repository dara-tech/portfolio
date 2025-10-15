import React, { memo, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const MacOSDock = memo(() => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const dockItems = [
    {
      id: 'home',
      path: '/',
      icon: '/icons/home.svg',
      label: 'Home',
      color: 'from-amber-500 to-orange-600',
      showOnMobile: true
    },
    {
      id: 'projects',
      path: '/projects',
      icon: '/icons/projects.svg',
      label: 'Projects',
      color: 'from-emerald-500 to-teal-600',
      showOnMobile: true
    },
    {
      id: 'roadmap',
      path: '/roadmap',
      icon: '/icons/roadmap.svg',
      label: 'Roadmap',
      color: 'from-cyan-500 to-emerald-600',
      showOnMobile: true
    },
    {
      id: 'chat',
      path: '/chat',
      icon: '/icons/chat.svg',
      label: 'Chat',
      color: 'from-indigo-500 to-violet-600',
      showOnMobile: false
    },
    {
      id: 'videos',
      path: '/videos',
      icon: '/icons/videos.svg',
      label: 'Videos',
      color: 'from-rose-500 to-red-600',
      showOnMobile: true
    },
    {
      id: 'lessons',
      path: '/lessons',
      icon: '/icons/lessons.svg',
      label: 'Lessons',
      color: 'from-pink-500 to-rose-600',
      showOnMobile: false
    },
    // Admin items (only show if logged in)
    ...(token ? [
      {
        id: 'admin-dashboard',
        path: '/admin/dashboard',
        icon: '/icons/dashboard.svg',
        label: 'Dashboard',
        color: 'from-slate-500 to-gray-600',
        showOnMobile: true
      },
      {
        id: 'admin-projects',
        path: '/admin/projects',
        icon: '/icons/projects.svg',
        label: 'Manage Projects',
        color: 'from-emerald-500 to-teal-600',
        showOnMobile: false
      },
      {
        id: 'admin-write',
        path: '/admin/write',
        icon: '/icons/writer.svg',
        label: 'Writer',
        color: 'from-cyan-500 to-blue-600',
        showOnMobile: false
      },
      {
        id: 'admin-profile',
        path: '/admin/profile',
        icon: '/icons/profile.svg',
        label: 'Profile',
        color: 'from-purple-500 to-violet-600',
        showOnMobile: true
      }
    ] : [
      {
        id: 'login',
        path: '/admin/login',
        icon: '/icons/login.svg',
        label: 'Login',
        color: 'from-amber-500 to-yellow-600',
        showOnMobile: true
      }
    ])
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Filter items based on screen size
  const filteredDockItems = dockItems.filter(item => 
    isMobile ? item.showOnMobile : true
  );

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="macos-glass macos-rounded-xl px-4 py-3 macos-shadow-xl">
        <div className="flex items-end space-x-2">
          {filteredDockItems.map((item) => {
            const active = isActive(item.path);
            const isHovered = hoveredItem === item.id;
            
            return (
              <motion.div
                key={item.id}
                className="relative dock-item"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                whileHover={{ scale: 1.1, y: -4 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  to={item.path}
                  className="block p-2 macos-rounded transition-all duration-300 macos-focus"
                >
                  <div className={`
                    relative w-12 h-12 macos-rounded flex items-center justify-center
                    transition-all duration-300 macos-hover
                    ${active 
                      ? `bg-gradient-to-br ${item.color} macos-shadow-lg` 
                      : 'bg-white/10 hover:bg-white/20'
                    }
                    ${isHovered ? 'macos-shadow-xl' : ''}
                  `}>
                    <div className={`w-6 h-6 transition-all duration-300 ${
                      active 
                        ? 'opacity-100' 
                        : 'opacity-60 hover:opacity-100'
                    }`}>
                      <img 
                        src={item.icon}
                        alt={item.label}
                        className="w-full h-full"
                        style={{
                          filter: active 
                            ? 'brightness(0) invert(1)' 
                            : 'brightness(0) invert(1) sepia(1) saturate(1.5) hue-rotate(180deg)'
                        }}
                      />
                    </div>
                    
                    {/* Active indicator */}
                    {active && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                    )}
                  </div>
                </Link>

                {/* Tooltip */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.8 }}
                      className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black/80 text-white text-xs macos-rounded whitespace-nowrap macos-blur-sm"
                    >
                      {item.label}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

MacOSDock.displayName = 'MacOSDock';

export default MacOSDock;
