"use client";

import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import { getDeployments } from "../../../lib/api";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { ProviderType } from "../../../services/types";
import { useAuth } from "@/lib/auth/AuthContext";

interface Deployment {
  deploymentId: string;
  appUrl: string;
  createdAt?: string;
  provider?: string;
}

interface DeploymentTableProps {
  userId: number;
}

function DeploymentTable({ userId }: DeploymentTableProps) {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Get the provider from environment variable
  const envProvider = process.env.NEXT_PUBLIC_PROVIDER_TO_USE as
    | ProviderType
    | undefined;

  useEffect(() => {
    const fetchDeployments = async () => {
      try {
        // If NEXT_PUBLIC_PROVIDER_TO_USE is set, only show deployments from that provider
        const response = await getDeployments(userId, envProvider);
        setDeployments(
          response?.map((deployment) => ({
            ...deployment,
            appUrl: deployment.appUrl || "",
          })) || []
        );
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch deployments",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDeployments();
    const interval = setInterval(fetchDeployments, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [toast, userId, envProvider]);

  // Format date safely
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return "Invalid date";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 text-muted-foreground">
        <div className="animate-pulse">Loading deployments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {deployments.length === 0 ? (
        <div className="text-center py-20 bg-secondary/10 rounded-xl border border-border/40 backdrop-blur-sm">
          <p className="text-lg text-muted-foreground">
            {envProvider
              ? `No active deployments found for provider: ${envProvider}`
              : "No active deployments found"}
          </p>
          <p className="mt-2 text-sm text-muted-foreground/70">
            Create a new deployment to get started
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {deployments.map((deployment, index) => (
            <div
              key={index}
              className="dashboard-card flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="space-y-3 flex-grow">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">ID:</span>
                  <Link
                    href={`/app/deployments/${deployment.deploymentId}`}
                    className="text-foreground hover:text-primary hover:underline font-medium"
                  >
                    {deployment.deploymentId}
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">URL:</span>
                  <a
                    href={deployment.appUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-primary hover:underline truncate max-w-md"
                    title={deployment.appUrl}
                  >
                    {deployment.appUrl}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">
                    Created:
                  </span>
                  <span className="text-muted-foreground/90">
                    {formatDate(deployment.createdAt)}
                  </span>
                </div>
              </div>
              <div className="flex gap-3 self-end md:self-center">
                <Link
                  href={`/app/deployments/${deployment.deploymentId}`}
                  passHref
                >
                  <Button
                    size="sm"
                    variant="outline"
                    className="hover-effect px-5"
                  >
                    View
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover-effect text-destructive hover:text-destructive px-5"
                  onClick={() => {
                    // TODO: Implement delete deployment
                    toast({
                      title: "Not implemented",
                      description:
                        "Delete deployment functionality coming soon",
                    });
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  
  return (
    <div className="container mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="section-title">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your deployments and applications
          </p>
        </div>
        <Link href="/app/services">
          <Button
            size="lg"
            variant="gradient"
            className="shadow-lg shadow-primary/10 hover-effect"
          >
            Create Deployment
          </Button>
        </Link>
      </div>

      <div className="subtle-glow mb-8">
        <div className="dashboard-card">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">
            Your Deployments
          </h2>
          {isLoading ? (
            <div className="flex justify-center items-center py-12 text-muted-foreground">
              <div className="animate-pulse">Loading authentication...</div>
            </div>
          ) : user?.id ? (
            <DeploymentTable userId={parseInt(user.id)} />
          ) : (
            <div className="text-center py-20 bg-secondary/10 rounded-xl border border-border/40 backdrop-blur-sm">
              <p className="text-lg text-muted-foreground">
                Please sign in to view your deployments
              </p>
            </div>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
}
