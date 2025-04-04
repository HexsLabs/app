"use client";

import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import { getDeployments } from "../../../lib/api";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { getProviderFromEnv } from "@/lib/utils";

interface Deployment {
  deploymentId: string;
  appUrl: string;
  createdAt?: string;
  provider?: string;
}

interface DeploymentTableProps {
  userId: string;
}

function DeploymentTable({ userId }: DeploymentTableProps) {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Get the provider from environment variable
  const envProvider = getProviderFromEnv();

  useEffect(() => {
    const fetchDeployments = async () => {
      try {
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
      <div className="flex justify-center items-center py-8 sm:py-12 text-muted-foreground">
        <div className="animate-pulse text-sm sm:text-base">
          Loading deployments...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 w-full overflow-hidden">
      {deployments.length === 0 ? (
        <div className="text-center py-12 sm:py-20 bg-secondary/10 rounded-xl border border-border/40 backdrop-blur-sm">
          <p className="text-base sm:text-lg text-muted-foreground">
            {envProvider ? (
              <>
                {" "}
                No active deployments found for provider:{" "}
                <span className="capitalize">{envProvider}</span>
              </>
            ) : (
              "No active deployments found"
            )}
          </p>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground/70">
            Create a new deployment to get started
          </p>
        </div>
      ) : (
        <div className="grid gap-4 w-full">
          {deployments.map((deployment, index) => (
            <div
              key={index}
              className="dashboard-card flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full overflow-hidden"
            >
              <div className="space-y-3 flex-grow min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-muted-foreground text-sm">ID:</span>
                  <Link
                    href={`/app/deployments/${deployment.deploymentId}`}
                    className="text-foreground hover:text-primary hover:underline font-medium truncate max-w-[180px] sm:max-w-[240px]"
                    title={deployment.deploymentId}
                  >
                    {deployment.deploymentId}
                  </Link>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-muted-foreground text-sm">URL:</span>
                  <a
                    href={deployment.appUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-primary hover:underline truncate max-w-[180px] sm:max-w-[240px] md:max-w-[300px] lg:max-w-md"
                    title={deployment.appUrl}
                  >
                    {deployment.appUrl}
                  </a>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-muted-foreground text-sm">
                    Created:
                  </span>
                  <span className="text-muted-foreground/90">
                    {formatDate(deployment.createdAt)}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 self-end md:self-center mt-2 md:mt-0">
                <Link
                  href={`/app/deployments/${deployment.deploymentId}`}
                  passHref
                  className="w-full sm:w-auto"
                >
                  <Button
                    size="sm"
                    variant="outline"
                    className="hover-effect px-5 w-full sm:w-auto"
                  >
                    View
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover-effect text-destructive hover:text-destructive px-5 w-full sm:w-auto"
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
    <div className="container mx-auto px-0 sm:px-6 py-6 sm:py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-12 gap-4 sm:gap-6">
        <div>
          <h1 className="section-title text-xl sm:text-2xl md:text-3xl">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage your deployments and applications
          </p>
        </div>
        <Link href="/app/services" className="w-full sm:w-auto">
          <Button
            size="default"
            variant="gradient"
            className="shadow-lg shadow-primary/10 hover-effect w-full sm:w-auto"
          >
            Create Deployment
          </Button>
        </Link>
      </div>

      <div className="subtle-glow mb-6 sm:mb-8">
        <div className="dashboard-card">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-foreground">
            Your Deployments
          </h2>
          {isLoading ? (
            <div className="flex justify-center items-center py-8 sm:py-12 text-muted-foreground">
              <div className="animate-pulse text-sm sm:text-base">
                Loading authentication...
              </div>
            </div>
          ) : user?.id ? (
            <DeploymentTable userId={user.id} />
          ) : (
            <div className="text-center py-12 sm:py-20 bg-secondary/10 rounded-xl border border-border/40 backdrop-blur-sm">
              <p className="text-base sm:text-lg text-muted-foreground">
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
