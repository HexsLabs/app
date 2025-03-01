'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getDeploymentInfo, DeploymentInfo } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';

export default function DeploymentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [deployment, setDeployment] = useState<DeploymentInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeploymentInfo = async () => {
      if (!params.id) {
        router.push('/');
        return;
      }

      try {
        const response = await getDeploymentInfo(params.id as string);
        setDeployment(response.deployment);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch deployment information',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDeploymentInfo();
  }, [params.id, router, toast]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#101012] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading deployment information...</div>
        </div>
      </main>
    );
  }

  if (!deployment) {
    return (
      <main className="min-h-screen bg-[#101012] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Deployment Not Found</h1>
            <Button onClick={() => router.push('/')}>Back to Home</Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#101012] text-white">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          onClick={() => router.push('/')}
          className="mb-6"
        >
          Back to Home
        </Button>

        <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800">
          <h1 className="text-3xl font-bold mb-6">Deployment Details</h1>
          
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Deployment ID</h2>
              <p className="text-gray-400">{deployment.id}</p>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold">App URL</h2>
              <a
                href={deployment.appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                {deployment.appUrl}
              </a>
            </div>
            
            {deployment.monitorUrl && (
              <div>
                <h2 className="text-lg font-semibold">Monitor URL</h2>
                <a
                  href={deployment.monitorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  {deployment.monitorUrl}
                </a>
              </div>
            )}
            
            <div>
              <h2 className="text-lg font-semibold">API Key</h2>
              <p className="text-gray-400 font-mono">{deployment.apiKey}</p>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold">User ID</h2>
              <p className="text-gray-400">{deployment.user}</p>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </main>
  );
} 