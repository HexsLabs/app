'use client';

import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { useEffect, useState } from 'react';
import { getDeployments } from '../../../lib/api';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';

interface Deployment {
  deploymentId: string;
  appUrl: string;
  createdAt?: string;
}

interface DeploymentTableProps {
  userId: number;
}

function DeploymentTable({ userId }: DeploymentTableProps) {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDeployments = async () => {
      try {
        const response = await getDeployments(userId);
        setDeployments(response?.map(deployment => ({
          ...deployment,
          appUrl: deployment.appUrl || ''
        })) || []);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch deployments',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDeployments();
    const interval = setInterval(fetchDeployments, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [toast, userId]);

  // Format date safely
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (loading) {
    return <div className="text-center">Loading deployments...</div>;
  }

  if (deployments.length === 0) {
    return (
      <div className="text-center text-gray-400">
        No active deployments found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {deployments.map((deployment, index) => (
        <div 
          key={index}
          className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div className="space-y-2 flex-grow">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">ID:</span>
              <Link href={`/app/deployments/${deployment.deploymentId}`} className="text-foreground hover:text-foreground/80 hover:underline font-medium">
                {deployment.deploymentId}
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">URL:</span>
              <a
                href={deployment.appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-foreground/80 hover:underline truncate max-w-md"
                title={deployment.appUrl}
              >
                {deployment.appUrl}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Created:</span>
              <span>{formatDate(deployment.createdAt)}</span>
            </div>
          </div>
          <div className="flex gap-2 self-end md:self-center">
            <Link href={`/app/deployments/${deployment.deploymentId}`} passHref>
              <Button size="sm" variant="outline" className="hover-effect">
                View
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="hover-effect"
              onClick={() => {
                // TODO: Implement delete deployment
                toast({
                  title: 'Not implemented',
                  description: 'Delete deployment functionality coming soon',
                });
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-3 text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Manage your deployments and applications</p>
        </div>
        <Link href="/app/create">
          <Button size="lg" className="tracking-wide">
            Create Deployment
          </Button>
        </Link>
      </div>

      <div className="gradient-border card-shadow">
        <div className="gradient-bg p-8 rounded-3xl">
          <h2 className="text-2xl font-semibold mb-8 text-foreground">Your Deployments</h2>
          {/* NOTE THIS IS HARDCODED FOR NOW, WILL BE CHANGED TO THE ACTUAL USER ID */}
          <DeploymentTable userId={5} />
        </div>
      </div>
      <Toaster />
    </div>
  );
}
