// components/Layout.tsx
import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Separator } from '@/components/ui/Separator';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="w-64 fixed">
        <Sidebar />
      </div>
      <div className="fixed left-64 h-[calc(100vh-4rem)]">
        <Separator orientation="vertical" className="h-full" />
      </div>
      <div className="flex-1 ml-64">
        {children}
      </div>
    </div>
  );
};

export default Layout;
