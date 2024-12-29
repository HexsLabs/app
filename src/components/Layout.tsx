// components/Layout.tsx
import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Separator } from '@/components/ui/Separator';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#101012] text-white">
      <div className="flex">
        {/* Sidebar with fixed width */}
        <div className="w-48 fixed">
          <Sidebar />
        </div>

        {/* Vertical Separator */}
        <div className="fixed left-48 h-screen">
          <Separator orientation="vertical" className="h-full bg-zinc-700/50" />
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-48">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
