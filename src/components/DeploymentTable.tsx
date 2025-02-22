'use client';

import { useEffect, useState } from 'react';
import { getDeploymentStatuses } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface Deployment {
  id: string;
  appUrl: string;
  monitorUrl: string;
  load: number;
  lastUpdated: number;
}

export function DeploymentTable() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDeployments = async () => {
      try {
        const response = await getDeploymentStatuses();
        setDeployments(Object.values(response.deployments || {}));
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
  }, [toast]);

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
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-800">
            <th className="text-left py-2 px-4">ID</th>
            <th className="text-left py-2 px-4">App URL</th>
            <th className="text-left py-2 px-4">Monitor URL</th>
            <th className="text-left py-2 px-4">Load</th>
            <th className="text-left py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {deployments.map((deployment) => (
            <tr key={deployment.id} className="border-b border-zinc-800">
              <td className="py-2 px-4">{deployment.id}</td>
              <td className="py-2 px-4">
                <a
                  href={deployment.appUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  {deployment.appUrl}
                </a>
              </td>
              <td className="py-2 px-4">
                {deployment.monitorUrl && (
                  <a
                    href={deployment.monitorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {deployment.monitorUrl}
                  </a>
                )}
              </td>
              <td className="py-2 px-4">{deployment.load}%</td>
              <td className="py-2 px-4">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
