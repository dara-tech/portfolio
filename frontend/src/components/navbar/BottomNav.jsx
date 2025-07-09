import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import { NAV_ITEMS, ADMIN_NAV_ITEMS } from './constants'; // Assuming these are defined

const BottomNav = memo(({ 
  token,
  userImage,
  isActive,
  isMobileMenuOpen 
}) => {
  const navItems = token ? ADMIN_NAV_ITEMS : NAV_ITEMS;

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out
      ${isMobileMenuOpen ? 'opacity-50 blur-sm' : 'opacity-100'}
      transform translate-y-0 `} // Added transform for potential future animations
    >
      <div className="relative mx-4 mb-6 p-1 bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20
                      lg:max-w-lg lg:mx-auto">
        <ul className="grid grid-cols-5 py-2">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <li key={item.path} className="relative group">
                <Link
                  to={item.path}
                  className="flex flex-col items-center p-2 text-white transition-all duration-300 ease-out transform group-hover:scale-105"
                >
                  <div className={`relative p-2 rounded-full transition-all duration-300 ease-out
                                    ${active ? 'bg-primary/30 shadow-lg' : 'group-hover:bg-white/10'}`}>
                    <Icon className={`w-6 h-6 transition-all duration-300 ease-out
                                      ${active ? 'text-primary' : 'text-gray-300 group-hover:text-white'}`} />
                    {active && (
                      <span 
                        className="absolute inset-0 animate-ping rounded-full bg-primary/40" 
                        style={{animationDuration: '1.8s'}}
                      />
                    )}
                  </div>
                  <span className={`text-xs mt-2 transition-all duration-300 ease-out
                                    ${active ? 'text-primary font-semibold' : 'text-gray-300 group-hover:text-white'}`}>
                    {item.label}
                  </span>
                  {active && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary rounded-full shadow-md animate-bounce-slow" />
                  )}
                </Link>
              </li>
            );
          })}

          {/* Profile/Login Item */}
          <li className="relative group">
            <Link
              to={token ? "/admin/profile" : "/admin/login"}
              className="flex flex-col items-center p-2 text-white transition-all duration-300 ease-out transform group-hover:scale-105"
            >
              <div className={`relative p-2 rounded-full transition-all duration-300 ease-out
                                ${isActive(token ? "/admin/profile" : "/admin/login") ? 'bg-primary/30 shadow-lg' : 'group-hover:bg-white/10'}`}>
                {userImage && token ? (
                  <img 
                    src={userImage} 
                    alt="Profile" 
                    className="w-6 h-6 rounded-full object-cover border border-primary/50 shadow-sm"
                  />
                ) : (
                  <UserCircle className={`w-6 h-6 transition-all duration-300 ease-out
                                        ${isActive(token ? "/admin/profile" : "/admin/login") ? 'text-primary' : 'text-gray-300 group-hover:text-white'}`} />
                )}
                 {isActive(token ? "/admin/profile" : "/admin/login") && (
                    <span 
                      className="absolute inset-0 animate-ping rounded-full bg-primary/40" 
                      style={{animationDuration: '1.8s'}}
                    />
                  )}
              </div>
              <span className={`text-xs mt-2 transition-all duration-300 ease-out
                                ${isActive(token ? "/admin/profile" : "/admin/login") ? 'text-primary font-semibold' : 'text-gray-300 group-hover:text-white'}`}>
                {token ? "Profile" : "Login"}
              </span>
              {isActive(token ? "/admin/profile" : "/admin/login") && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary rounded-full shadow-md animate-bounce-slow" />
              )}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
});

export default BottomNav;