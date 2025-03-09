'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { DeploymentTable } from '@/components/DeploymentTable';

export default function Dashboard() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-3 text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Manage your deployments and applications</p>
        </div>
        <Link href="/create">
          <Button className="gradient-bg hover-effect text-foreground">
            Create Deployment
          </Button>
        </Link>
      </div>

      <div className="gradient-border card-shadow">
        <div className="gradient-bg p-8 rounded-3xl">
          <h2 className="text-2xl font-semibold mb-8 text-foreground">Your Deployments</h2>
          <DeploymentTable userId={5} />
        </div>
      </div>
      <Toaster />
    </div>
  );
} 