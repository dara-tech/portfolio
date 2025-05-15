import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { UserCircle, Settings, HelpCircle, LogOut } from 'lucide-react';
import { NAV_ITEMS, ADMIN_NAV_ITEMS } from './constants';
import NavItem from './NavItem';

const MobileNav = memo(({ 
  isOpen,
  token,
  userImage,
  userData,
  isActive,
  onClose,
  onLogout
}) => {
  return (
    <div className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${
      isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
    }`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Mobile Menu Content */}
      <div className="absolute left-0 top-0 bottom-0 w-full max-w-sm bg-base-200 shadow-xl flex flex-col">
        {/* Profile Header */}
        {token && (
          <div className="bg-primary text-primary-content p-4">
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
                  <span className="text-xs font-medium">Online</span>
                  <span className="text-xs opacity-60">•</span>
                  <span className="text-xs">{userData?.role || 'User'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-16">
          <div className="p-4">
            <div className="space-y-4">
              {/* Main Navigation */}
              <ul className="space-y-1">
                {NAV_ITEMS.map((item) => (
                  <li key={item.path}>
                    <NavItem item={item} isActive={isActive(item.path)} />
                  </li>
                ))}
              </ul>

              {/* Admin Navigation */}
              {token && (
                <div>
                  <h3 className="px-3 py-2 text-sm font-semibold text-base-content/60">Admin</h3>
                  <ul className="space-y-1">
                    {ADMIN_NAV_ITEMS.map((item) => (
                      <li key={item.path}>
                        <NavItem item={item} isActive={isActive(item.path)} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Account Menu */}
              {token && (
                <div>
                  <h3 className="px-3 py-2 text-sm font-semibold text-base-content/60">Account</h3>
                  <ul className="space-y-1">
                    <li>
                      <Link 
                        to="/admin/settings" 
                        className="flex items-center px-3 py-2 rounded-md hover:bg-base-300 transition-colors"
                      >
                        <Settings className="w-5 h-5 mr-3" />
                        <span>Settings</span>
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/help" 
                        className="flex items-center px-3 py-2 rounded-md hover:bg-base-300 transition-colors"
                      >
                        <HelpCircle className="w-5 h-5 mr-3" />
                        <span>Help & Support</span>
                      </Link>
                    </li>
                    <li>
                      <button 
                        onClick={onLogout}
                        className="flex items-center px-3 py-2 w-full text-left rounded-md hover:bg-base-300 text-error transition-colors"
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
                    className="flex items-center justify-center px-4 py-3 rounded-lg bg-primary text-primary-content transition-colors"
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
});

export default MobileNav;
