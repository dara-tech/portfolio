import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { UserCircle, Settings, LogOut } from 'lucide-react';

const ProfileCard = memo(({ userData, userImage, onLogout }) => {
  return (
    <div className="flex flex-col space-y-3 p-4 bg-base-200 rounded-lg shadow-lg">
      <div className="flex items-center space-x-3">
        <div className="relative">
          {userImage ? (
            <img 
              src={userImage} 
              alt="Profile" 
              className="w-12 h-12 rounded-full object-cover border border-primary/30"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <UserCircle className="w-8 h-8 text-primary" />
            </div>
          )}
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-success rounded-full border border-base-200"></div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold truncate">{userData?.username || 'User'}</h3>
          <p className="text-xs text-base-content/60 truncate">{userData?.email || 'user@example.com'}</p>
          <div className="flex items-center space-x-1 mt-1">
            <span className="text-xs text-success">Online</span>
            <span className="text-xs text-base-content/40">•</span>
            <span className="text-xs text-base-content/60">{userData?.role || 'User'}</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between pt-2 border-t border-base-content/10">
        <Link to="/admin/settings" className="flex items-center space-x-2 px-3 py-1.5 rounded-md hover:bg-base-300">
          <Settings className="w-4 h-4" />
          <span className="text-sm">Settings</span>
        </Link>
        <button onClick={onLogout} className="flex items-center space-x-2 px-3 py-1.5 rounded-md hover:bg-base-300 text-error">
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
});

export default ProfileCard;
