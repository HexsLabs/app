'use client';

import { useEffect, useState } from 'react';
import { getUserDeployments } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';

interface Deployment {
  id: string;
  appUrl: string;
  createdAt?: string;
}

interface DeploymentTableProps {
  userId: number;
}

export function DeploymentTable({ userId }: DeploymentTableProps) {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDeployments = async () => {
      try {
        const response = await getUserDeployments(userId);
        setDeployments(response.deployments || []);
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
      {deployments.map((deployment) => (
        <div 
          key={deployment.id} 
          className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div className="space-y-2 flex-grow">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">ID:</span>
              <Link href={`/deployments/${deployment.id}`} className="text-blue-400 hover:underline font-medium">
                {deployment.id}
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">URL:</span>
              <a
                href={deployment.appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline truncate max-w-md"
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
            <Link href={`/deployments/${deployment.id}`} passHref>
              <Button size="sm" variant="outline">
                View
              </Button>
            </Link>
            <Button
              variant="destructive"
              size="sm"
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
