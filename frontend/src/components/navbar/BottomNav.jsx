import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import { NAV_ITEMS, ADMIN_NAV_ITEMS } from './constants';

const BottomNav = memo(({ 
  token,
  userImage,
  isActive,
  isMobileMenuOpen 
}) => {
  return (
    <div className={`fixed bottom-0 left-0 right-0  shadow-lg z-50 transition-all duration-300 ${
      isMobileMenuOpen ? 'opacity-50' : 'opacity-100'
    }`}>
      <ul className="grid grid-cols-5 py-2 mb-6 bg-base-100 mx-4 backdrop-blur-xl rounded-full lg:max-w-lg lg:mx-auto">
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
                  {active && (
                    <span 
                      className="absolute inset-0 animate-ping rounded-lg bg-primary/30" 
                      style={{animationDuration: '1.5s'}}
                    />
                  )}
                </div>
                <span className={`text-xs mt-1 transition-all duration-300 ${active ? 'text-primary font-medium' : ''}`}>
                  {item.label}
                </span>
                {active && (
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </Link>
            </li>
          );
        })}
        <li className="relative">
          <Link
            to={token ? "/admin/profile" : "/admin/login"}
            className="flex flex-col items-center p-2 transition-all duration-300"
          >
            <div className={`relative p-1 rounded-lg ${
              isActive(token ? "/admin/profile" : "/admin/login") ? 'bg-primary/20' : ''
            }`}>
              {userImage && token ? (
                <img 
                  src={userImage} 
                  alt="Profile" 
                  className="w-5 h-5 rounded-full object-cover border border-primary/50"
                />
              ) : (
                <UserCircle className={`w-5 h-5 ${
                  isActive(token ? "/admin/profile" : "/admin/login") ? 'text-primary' : ''
                }`} />
              )}
            </div>
            <span className="text-xs mt-1">{token ? "Profile" : "Login"}</span>
          </Link>
        </li>
      </ul>
    </div>
  );
});

export default BottomNav;
