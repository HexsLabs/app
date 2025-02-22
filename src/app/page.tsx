'use client';

import { useState } from 'react';
import { DeploymentForm } from '@/components/DeploymentForm';
import { DeploymentTable } from '@/components/DeploymentTable';
import { Toaster } from '@/components/ui/toaster';

export default function Home() {
  const [showDeployForm, setShowDeployForm] = useState(false);

  return (
    <main className="min-h-screen bg-[#101012] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Orchestrator</h1>
          <p className="text-gray-400">Deploy and manage your applications with ease</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Deployment Form */}
          <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800">
            <h2 className="text-2xl font-semibold mb-6">Create Deployment</h2>
            <DeploymentForm />
          </div>

          {/* Deployments List */}
          <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800">
            <h2 className="text-2xl font-semibold mb-6">Active Deployments</h2>
            <DeploymentTable />
          </div>
        </div>
      </div>
      <Toaster />
    </main>
  );
}