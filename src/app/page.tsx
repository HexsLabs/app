'use client';

import { useState, useEffect } from 'react';
import { DeploymentTable } from '@/components/DeploymentTable';
import { UserAuth } from '@/components/UserAuth';
import { Toaster } from '@/components/ui/toaster';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  // Set userId to 5 explicitly for now
  const [userId, setUserId] = useState<number>(5);

  // No need to check localStorage since we're setting userId explicitly
  // useEffect(() => {
  //   const storedUserId = localStorage.getItem('userId');
  //   if (storedUserId) {
  //     setUserId(parseInt(storedUserId, 10));
  //   }
  // }, []);

  const handleUserCreated = (newUserId: number) => {
    setUserId(newUserId);
  };

  const handleLogout = () => {
    // For now, we'll just show a message but keep the user logged in
    alert('Logout functionality is disabled. Using fixed user ID: 5');
    // localStorage.removeItem('userId');
    // setUserId(null);
  };

  return (
    <main className="min-h-screen bg-[#101012] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Orchestrator</h1>
            <p className="text-gray-400">Deploy and manage your applications with ease</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/create">
              <Button className="bg-red-500 hover:bg-red-600">
                Create Deployment
              </Button>
            </Link>
            {userId && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md"
              >
                User ID: {userId}
              </button>
            )}
          </div>
        </div>

        {/* Deployments List - Now full width */}
        <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800">
          <h2 className="text-2xl font-semibold mb-6">Your Deployments</h2>
          <DeploymentTable userId={userId} />
        </div>
      </div>
      <Toaster />
    </main>
  );
}