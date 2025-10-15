import React, { memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAdminProfile } from '../../hooks/useAdminProfile';

// Custom SVG Icons
const MangoIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 128 128" fill="currentColor">
    <radialGradient id="IconifyId17ecdb2904d178eab13511" cx="75.424" cy="-61.613" r="183.963" gradientUnits="userSpaceOnUse">
      <stop offset=".532" stopColor="#f33a1f"></stop>
      <stop offset=".615" stopColor="#f86922"></stop>
      <stop offset=".696" stopColor="#fd9124"></stop>
      <stop offset=".739" stopColor="#ffa025"></stop>
      <stop offset=".793" stopColor="#fca025"></stop>
      <stop offset=".839" stopColor="#f1a124"></stop>
      <stop offset=".883" stopColor="#dfa222"></stop>
      <stop offset=".925" stopColor="#c7a41f"></stop>
      <stop offset=".962" stopColor="#aaa61c"></stop>
    </radialGradient>
    <path d="M4.03 89.43c-1.2 6.01 5.66 29.12 41.45 33.74c18.39 2.37 36.45-4.16 50.75-15.11S119.3 83 122.31 70.11c4.63-19.85-.69-49.82-40.06-51.59c-40.26-1.81-53.79 40.28-62.23 52.65C9.86 86.08 5.12 84 4.03 89.43z" fill="url(#IconifyId17ecdb2904d178eab13511)"></path>
    <path d="M41.89 36.33s13.57 6.9 34.61 5.44c17.03-1.18 23.73-9.54 23.73-9.54s7.49 2.06 12.46.74c1.99-.53 2.42-1.61-.01-4.13c-3.67-3.82-16.27-10.89-34.85-9.7c-23.25 1.51-35.94 17.19-35.94 17.19z" fill="#dc0d27"></path>
    <path d="M26.04 76.62c2.36 3.93 9.35-1.14 14.27-6.07c7.1-7.12 10.33-13.64 12.22-16.95c1.89-3.31 4.45-10.44-.71-11.59c-5.37-1.19-6.96 5.45-9.72 10.34s-6.6 10.71-9.68 14.5c-3.27 4.03-7.78 7.44-6.38 9.77z" fill="#ffebc9"></path>
    <path d="M102.36 24.98c-.68 2.97 2.05 5.05 3.94 6.54s6.15 2.05 7.57 1.02c1.42-1.02-.16-4.02.87-5.83c1.02-1.81 2.84-4.02.63-5.52c-1.85-1.26-4.34-1.73-6.62-1.26s-2.29 2.21-3.23 2.68c-.96.48-2.93 1.35-3.16 2.37z" fill="#6d4c41"></path>
    <path d="M100.14 25.88c-2.52 1.1-9.94 6.95-27.26 8.28c-19.1 1.47-41.53-.8-45.27-1.33c-3.74-.53-10.12-.78-10.03-2.38c.13-2.4 2.61-1.63 7.61-3.07c6.01-1.74 12.15-4.14 16.83-6.94c7.18-4.31 21.8-15.09 36.19-15.36c15.76-.29 20.83 4.67 24.7 8.81s3.93 8.48 2.86 10.22c-1.06 1.74-2.56.44-5.63 1.77z" fill="#518e30"></path>
    <path d="M50.46 24.92c.37.46 7.35.72 11.24.59c8.88-.29 15.91-2.65 24.66-3.63s16.38 0 16.67-.34c.53-.62-4.84-7.92-22.41-5.95c-6.47.73-14.79 4.02-20.53 6.31c-3.66 1.49-9.98 2.58-9.63 3.02z" fill="#366918"></path>
  </svg>
);

const WifiIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
  </svg>
);

const BatteryIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.67 4H14V2c0-.55-.45-1-1-1s-1 .45-1 1v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4zM11 20v-5.5H9L13 7v5.5h2L11 20z"/>
  </svg>
);

const VolumeIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"/>
  </svg>
);

const ChevronDownIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
  </svg>
);

const UserCircleIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
  </svg>
);

const MacOSNavbar = memo(() => {
  const location = useLocation();
  const { formData: userData } = useAdminProfile();
  const token = localStorage.getItem('token');

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Portfolio';
    if (path.startsWith('/projects')) return 'Projects';
    if (path.startsWith('/roadmap')) return 'Roadmap';
    if (path.startsWith('/chat')) return 'Chat';
    if (path.startsWith('/videos')) return 'Videos';
    if (path.startsWith('/lessons')) return 'Lessons';
    if (path.startsWith('/admin')) return 'Admin Dashboard';
    return 'Portfolio';
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-8 macos-glass border-b border-white/10 macos-shadow-sm">
      <div className="flex items-center justify-between h-full px-4 text-white text-sm">
        {/* Left side - Apple menu and page title */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 hover:bg-white/10 px-2 py-1 macos-rounded transition-all duration-200">
            <MangoIcon className="w-4 h-4" />
            <span className="text-xs font-medium">{getPageTitle()}</span>
          </div>
        </div>

        {/* Center - Page title (optional, can be removed for cleaner look) */}
       

        {/* Right side - System info and user */}
        <div className="flex items-center space-x-3">
             <div className="hidden md:block">
          <span className="text-xs text-white/70">
            {getPageTitle()}
          </span>
        </div>
          {/* System icons */}
          <div className="flex items-center space-x-2 bg-white/5 px-2 py-1 ">
            <WifiIcon className="w-4 h-4 text-white/70 hover:text-white transition-colors" />
            <BatteryIcon className="w-4 h-4 text-white/70 hover:text-white transition-colors" />
            <VolumeIcon className="w-4 h-4 text-white/70 hover:text-white transition-colors" />
          </div>

          {/* Time */}
          <div className="flex items-center space-x-1 5 px-2 py-1 ">
            <ClockIcon className="w-4 h-4 text-white/70" />
            <span className="text-xs">{getCurrentTime()}</span>
          </div>

          {/* User profile */}
          {token && (
            <div className="flex items-center space-x-1 bg-white/5 px-2 py-1 macos-rounded border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer">
              {userData?.profilePic ? (
                <img
                  src={userData.profilePic}
                  alt="Profile"
                  className="w-5 h-5 object-cover "
                />
              ) : (
                <UserCircleIcon className="w-5 h-5 text-white/70" />
              )}
              <ChevronDownIcon className="w-3 h-3 text-white/50" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

MacOSNavbar.displayName = 'MacOSNavbar';

export default MacOSNavbar;
