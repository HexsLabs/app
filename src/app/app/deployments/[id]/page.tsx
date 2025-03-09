'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';

export default function DeploymentDetailsPage() {
  const params = useParams();
  const router = useRouter();

  // Mock deployment data
  const deployment = {
    id: params.id,
    appUrl: 'https://example.com',
    monitorUrl: 'https://monitor.example.com',
    apiKey: 'sk-123456789',
    user: '5',
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 py-12">
        <Button
          variant="outline"
          onClick={() => router.push('/')}
          className="mb-8 hover-effect"
        >
          Back to Home
        </Button>

        <div className="gradient-border card-shadow">
          <div className="gradient-bg p-8 rounded-3xl">
            <h1 className="text-3xl font-bold mb-8">Deployment Details</h1>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">Deployment ID</h2>
                <p className="text-muted-foreground">{deployment.id}</p>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold mb-2">App URL</h2>
                <a
                  href={deployment.appUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-muted-foreground transition-colors"
                >
                  {deployment.appUrl}
                </a>
              </div>
              
              {deployment.monitorUrl && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">Monitor URL</h2>
                  <a
                    href={deployment.monitorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-muted-foreground transition-colors"
                  >
                    {deployment.monitorUrl}
                  </a>
                </div>
              )}
              
              <div>
                <h2 className="text-lg font-semibold mb-2">API Key</h2>
                <p className="text-muted-foreground font-mono">{deployment.apiKey}</p>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold mb-2">User ID</h2>
                <p className="text-muted-foreground">{deployment.user}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </main>
  );
} 