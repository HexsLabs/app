import React from 'react';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/Search';
import { DeploymentTable } from '@/components/DeploymentTable';
import { Separator } from '@/components/ui/Separator';

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-[#101012] text-white">
      <div className="flex">
        {/* Sidebar with fixed width */}
        {/* <div className="w-48 fixed">
          <Sidebar />
        </div> */}
        
        {/* Vertical Separator - Fixed position */}
        {/* <div className="fixed left-48 h-screen">
          <Separator orientation="vertical" className="h-full bg-zinc-700/50" />
        </div> */}

        {/* Main Content */}
        <div className="flex-1 ">
          <Header />
          {/* Horizontal Separator */}
          <Separator orientation="horizontal" className="w-full bg-zinc-700/50" />
          
          <div className="p-6">
            {/* Dashboard Title and Search in single line */}
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-semibold">Your Deployments (75)</h1>
                </div>
                <p className="text-sm text-gray-400">
                  Manage all your deployed applications in one place.
                </p>
              </div>
              <div className="w-72 mt-4 ">
                <SearchBar />
              </div>
            </div>

            <DeploymentTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;