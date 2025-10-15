import React, { memo } from 'react';
import MacOSNavbar from './MacOSNavbar';
import MacOSDock from './MacOSDock';

const MacOSLayout = memo(({ children }) => {
  return (
    <div className="h-screen w-screen overflow-hidden fixed inset-0">
      {/* Simple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-orange-600 to-purple-900"></div>
      
      {/* Subtle glass morphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/30 via-orange-500/20 to-purple-800/25"></div>

      {/* Main content - Fixed height with no scroll */}
      <div className="relative z-10 h-full flex flex-col">
        <MacOSNavbar />
        <main className="flex-1 pt-8 pb-20 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-600/10 to-transparent pointer-events-none"></div>
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
