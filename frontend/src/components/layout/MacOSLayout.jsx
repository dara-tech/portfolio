import React, { memo } from 'react';
import MacOSNavbar from './MacOSNavbar';
import MacOSDock from './MacOSDock';

const MacOSLayout = memo(({ children }) => {
  return (
    <div className="h-screen w-screen overflow-hidden fixed inset-0">
      {/* Modern gradient background with black and green */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-emerald-950"></div>
      
      {/* Dynamic overlay with green accents */}
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/20 via-green-500/15 to-lime-400/10"></div>
      
      {/* Additional modern accent layer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/8 to-transparent"></div>

      {/* Main content - Fixed height with no scroll */}
      <div className="relative z-10 h-full flex flex-col">
        <MacOSNavbar />
        <main className="flex-1 pt-8 pb-20 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-600/5 via-green-500/8 to-lime-400/5 pointer-events-none"></div>
            <div className="relative z-10 h-full">
              {children}
            </div>
          </div>
        </main>
        <MacOSDock />
      </div>

    </div>
  );
});

MacOSLayout.displayName = 'MacOSLayout';

export default MacOSLayout;
