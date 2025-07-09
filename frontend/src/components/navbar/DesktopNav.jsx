import React, { memo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserCircle, ChevronDown, LogIn } from 'lucide-react'; // Added LogIn icon
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_ITEMS } from './constants';
import NavItem from './NavItem'; // Assuming this component is styled well internally
import ProfileCard from './ProfileCard'; // Assuming this component is styled well internally

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
  const [hoveredIndex, setHoveredIndex] = useState(null); // New state for hover effect

  // Use useEffect to set the initial active index when component mounts or isActive changes
  const [activeIndex, setActiveIndex] = useState(null);
  useEffect(() => {
    const currentActiveIndex = NAV_ITEMS.findIndex(item => isActive(item.path));
    setActiveIndex(currentActiveIndex);
  }, [isActive]);


  return (
    <nav className="hidden lg:flex items-center space-x-6"> {/* Increased space-x for more breathing room */}
      <ul className="flex bg-base-200 p-2 rounded-xl shadow-lg border border-base-300 relative"> {/* More rounded and elevated */}
        {NAV_ITEMS.map((item, index) => (
          <motion.li
            key={item.path}
            className="relative px-3 py-1.5 cursor-pointer" // Added padding for better hover target
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
          >
            <NavItem item={item} isActive={isActive(item.path)} />
            
            {/* Active indicator with better animation */}
            {index === activeIndex && (
              <motion.div
                className="absolute inset-x-0 bottom-0 h-0.5 bg-primary rounded-b-full"
                layoutId="activeDesktopIndicator" // Unique layoutId for this component
                initial={false}
                transition={{ type: "spring", stiffness: 250, damping: 25 }} // Smoother spring animation
              />
            )}

            {/* Hover background for all items */}
            {hoveredIndex === index && (
              <motion.div
                className="absolute inset-0 bg-base-300 rounded-lg -z-10" // Rounded background
                layoutId="desktopHoverBackground" // Unique layoutId for hover
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </motion.li>
        ))}
      </ul>

      <div className="relative" ref={dropdownRef}>
        {token ? (
          <>
            <motion.button
              onClick={onToggleDropdown}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-base-200 text-base-content hover:bg-base-300 transition-all duration-300 shadow-md border border-base-300" // Pill shape, enhanced hover
              whileHover={{ scale: 1.02, boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }} // Subtle lift and shadow
              whileTap={{ scale: 0.98 }}
            >
              {userImage ? (
                <img
                  src={userImage}
                  alt="User Profile"
                  className="w-9 h-9 rounded-full border-2 border-primary object-cover shadow-sm" // Slightly larger, added shadow
                />
              ) : (
                <UserCircle className="w-7 h-7 text-primary" /> // Slightly larger, primary color
              )}
              {userData?.username && ( // Display username if available
                <span className="font-medium hidden md:block">{userData.username.split(' ')[0]}</span>
              )}
              <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${userDropdownOpen ? 'rotate-180' : ''}`} /> {/* Larger icon */}
            </motion.button>

            <AnimatePresence>
              {userDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }} // Added scale for pop effect
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 mt-3 w-72 rounded-xl bg-base-100 shadow-2xl ring-1 ring-base-300 z-50 overflow-hidden" // More rounded, stronger shadow, z-index
                >
                  <div className="p-4"> {/* Increased padding */}
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
              className="btn btn-primary px-5 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300" // Styled as a full button, rounded
            >
              <LogIn className="w-5 h-5 mr-2" /> {/* Use LogIn icon */}
              Login
            </Link>
          </motion.div>
        )}
      </div>
    </nav>
  );
});

export default DesktopNav;