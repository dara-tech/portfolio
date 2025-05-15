import React, { memo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_ITEMS } from './constants';
import NavItem from './NavItem';
import ProfileCard from './ProfileCard';

const DesktopNav = memo(({ 
  token, 
  userImage, 
  userData, 
  isActive,
  userDropdownOpen,
  dropdownRef,
  onToggleDropdown,
  onLogout 
}) => {
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const activeItem = NAV_ITEMS.findIndex(item => isActive(item.path));
    setActiveIndex(activeItem);
  }, [isActive]);

  return (
    <nav className="hidden lg:flex items-center space-x-4">
      <ul className="flex space-x-2 bg-base-300 p-1 rounded">
        {NAV_ITEMS.map((item, index) => (
          <motion.li key={item.path} className="relative">
            <NavItem item={item} isActive={isActive(item.path)} />
            {index === activeIndex && (
              <motion.div
                className="absolute -bottom-1  left-0 right-0 h-0.5  bg-primary rounded-b-full"
                layoutId="activeIndicator"
                initial={false}
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
              />
            )}
          </motion.li>
        ))}
      </ul>

      <div className="relative ml-4" ref={dropdownRef}>
        {token ? (
          <>
            <motion.button 
              onClick={onToggleDropdown}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-base-300 hover:bg-base-200 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {userImage ? (
                <img 
                  src={userImage} 
                  alt="User" 
                  className="w-8 h-8 rounded-full border-2 border-primary object-cover"
                />
              ) : (
                <UserCircle className="w-6 h-6" />
              )}
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${userDropdownOpen ? 'rotate-180' : ''}`} />
            </motion.button>
            
            <AnimatePresence>
              {userDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-72 rounded-lg bg-base-200 shadow-xl ring-1 ring-black ring-opacity-5"
                >
                  <div className="p-3">
                    <ProfileCard 
                      userData={userData} 
                      userImage={userImage} 
                      onLogout={onLogout}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/admin/login" 
              className="btn btn-primary btn-sm"
            >
              <UserCircle className="w-4 h-4 mr-2" />
              Login
            </Link>
          </motion.div>
        )}
      </div>
    </nav>
  );
});

export default DesktopNav;
