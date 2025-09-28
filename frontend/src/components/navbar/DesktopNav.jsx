import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { UserCircle, ChevronDown, LogIn } from 'lucide-react';
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
  return (
    <nav className="hidden lg:flex items-center space-x-6">
      <ul className="flex bg-base-200 p-2 rounded-lg">
        {NAV_ITEMS.map((item) => (
          <li key={item.path} className="px-2">
            <NavItem item={item} isActive={isActive(item.path)} />
          </li>
        ))}
      </ul>

      <div className="relative" ref={dropdownRef}>
        {token ? (
          <>
            <button
              onClick={onToggleDropdown}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-base-200 hover:bg-base-300"
            >
              {userImage ? (
                <img
                  src={userImage}
                  alt="User Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <UserCircle className="w-6 h-6" />
              )}
              <ChevronDown className={`w-4 h-4 ${userDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {userDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-64 rounded-lg bg-base-100 shadow-lg"
                >
                  <ProfileCard
                    userData={userData}
                    userImage={userImage}
                    onLogout={onLogout}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <Link
            to="/admin/login"
            className="btn btn-primary"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Login
          </Link>
        )}
      </div>
    </nav>
  );
});

export default DesktopNav;