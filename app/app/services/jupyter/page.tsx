"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, Check } from "lucide-react";
import { api } from "../../../../lib/api";
import { Deployment, ServiceType } from "../../../../services/types";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/lib/auth/AuthContext";
import { getProviderFromEnv } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Let's create a simple Skeleton component
const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-secondary/40 rounded ${className}`}></div>
);

export default function JupyterPage() {
  const router = useRouter();
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading: authLoading } = useAuth();

  const fetchDeployments = useCallback(async () => {
    if (!user?.id) {
      setError("Please sign in to view deployments");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const envProvider = getProviderFromEnv();
      const data = await api.getUserDeployments(
        user.id,
        ServiceType.JUPYTER,
        envProvider
      );
      // Ensure data is an array before setting it
      setDeployments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch deployments"
      );
      setDeployments([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!authLoading) {
      fetchDeployments();
    }
  }, [authLoading, fetchDeployments]);

  const isDeploymentActive = (createdAt: string, duration: string): boolean => {
    const createdAtDate = new Date(createdAt);
    let durationSeconds = 0;

    if (duration.endsWith("h")) {
      durationSeconds = parseInt(duration) * 3600;
    } else if (duration.endsWith("m")) {
      durationSeconds = parseInt(duration) * 60;
    } else if (duration.endsWith("s")) {
      durationSeconds = parseInt(duration);
    } else {
      durationSeconds = parseInt(duration) || 0;
    }
    const endTime = new Date(createdAtDate.getTime() + durationSeconds * 1000);
    const now = new Date();
    return endTime.getTime() > now.getTime();
  };

  // Calculate stats for active deployments only
  const activeDeployments = Array.isArray(deployments)
    ? deployments.filter(
        (d) => d.appUrl !== null && isDeploymentActive(d.createdAt, d.duration)
      )
    : [];
  const activeInstances = activeDeployments.length;
  const totalDeployments = deployments.length;
  const currentCpuUsage = activeDeployments.reduce(
    (acc, curr) => acc + curr.cpu,
    0
  );
  const currentRamUsage = activeDeployments.reduce(
    (acc, curr) => acc + parseInt(curr.memory),
    0
  );

  const renderAuthContent = (content: React.ReactNode) => {
    if (authLoading) {
      return (
        <div className="p-8 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
          <p className="text-muted-foreground">Loading authentication...</p>
        </div>
      );
    }

    if (!user?.id) {
      return (
        <div className="dashboard-card text-center py-12">
          <p className="text-lg mb-4">
            Please sign in to view your deployments
          </p>
          <Button variant="outline" className="hover-effect mt-2">
            Sign In
          </Button>
        </div>
      );
    }

    return content;
  };

  const renderSkeletonStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="dashboard-card subtle-glow">
          <Skeleton className="h-4 w-24 mb-3" />
          <Skeleton className="h-10 w-16" />
        </div>
      ))}
    </div>
  );

  const renderSkeletonDeployments = () => (
    <div className="grid gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="dashboard-card flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div className="space-y-3 flex-grow">
            <Skeleton className="h-5 w-full max-w-[300px]" />
            <Skeleton className="h-5 w-full max-w-[250px]" />
            <Skeleton className="h-5 w-full max-w-[200px]" />
          </div>
          <div className="flex gap-3 self-end md:self-center">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-background text-foreground py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="section-title mb-2">Jupyter Notebook Deployment</h1>
            <p className="text-muted-foreground">
              Deploy and manage your Jupyter notebook instances
            </p>
          </div>
          <Button
            size="lg"
            variant="gradient"
            className="shadow-lg shadow-primary/10 hover-effect"
            onClick={() => router.push("/app/services/jupyter/deploy")}
          >
            <span>Create Instance</span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {renderAuthContent(
          <div>
            {/* Stats Overview */}
            {isLoading ? (
              renderSkeletonStats()
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="dashboard-card subtle-glow">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Active Instances
                  </h3>
                  <p className="text-3xl font-semibold text-foreground">
                    {activeInstances}
                  </p>
                </div>
                <div className="dashboard-card subtle-glow">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Total Deployments
                  </h3>
                  <p className="text-3xl font-semibold text-foreground">
                    {totalDeployments}
                  </p>
                </div>
                <div className="dashboard-card subtle-glow">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Current Resource Usage
                  </h3>
                  <div>
                    <p className="text-xl font-semibold text-foreground">
                      {currentCpuUsage} CPU | {currentRamUsage} GB RAM
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Deployments List */}
              <div className="lg:col-span-2">
                <div className="dashboard-card subtle-glow">
                  <h2 className="text-2xl font-semibold mb-6 text-foreground">
                    Your Deployments
                  </h2>

                  {isLoading ? (
                    renderSkeletonDeployments()
                  ) : error ? (
                    <p className="text-destructive">{error}</p>
                  ) : deployments.length === 0 ? (
                    <div className="text-center py-20 bg-secondary/10 rounded-xl border border-border/40 backdrop-blur-sm">
                      <p className="text-lg text-muted-foreground">
                        No deployments found
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground/70">
                        Create a new instance to get started
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {deployments.map((deployment) => (
                        <div
                          key={deployment.deploymentId}
                          className="dashboard-card flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                        >
                          <div className="space-y-3 flex-grow">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground text-sm">
                                ID:
                              </span>
                              <Link
                                href={`/app/deployments/${deployment.deploymentId}`}
                                className="text-foreground hover:text-primary hover:underline font-medium"
                              >
                                {deployment.deploymentId}
                              </Link>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  isDeploymentActive(
                                    deployment.createdAt,
                                    deployment.duration
                                  )
                                    ? "bg-green-500/10 text-green-500"
                                    : "bg-red-500/10 text-red-500"
                                }`}
                              >
                                {isDeploymentActive(
                                  deployment.createdAt,
                                  deployment.duration
                                )
                                  ? "Active"
                                  : "Expired"}
                              </span>
                            </div>
                            {deployment.appUrl && (
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground text-sm">
                                  URL:
                                </span>
                                <a
                                  href={`${deployment.appUrl}?token=password`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-foreground hover:text-primary hover:underline truncate max-w-md"
                                  title={deployment.appUrl}
                                >
                                  {deployment.appUrl}
                                </a>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground text-sm">
                                Created:
                              </span>
                              <span className="text-muted-foreground/90">
                                {formatDistanceToNow(
                                  new Date(deployment.createdAt)
                                )}{" "}
                                ago
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground text-sm">
                                Resources:
                              </span>
                              <span className="text-muted-foreground/90">
                                {deployment.cpu} CPU | {deployment.memory} RAM |{" "}
                                {deployment.storage} Storage
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-3 self-end md:self-center">
                            {deployment.appUrl &&
                              isDeploymentActive(
                                deployment.createdAt,
                                deployment.duration
                              ) && (
                                <a
                                  href={`${deployment.appUrl}?token=password`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Button
                                    size="sm"
                                    className="hover-effect px-5"
                                  >
                                    Open Notebook
                                  </Button>
                                </a>
                              )}
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover-effect text-destructive hover:text-destructive px-5"
                              onClick={() => {
                                // TODO: Implement delete deployment
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
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="dashboard-card subtle-glow">
                  <h3 className="text-lg font-medium text-foreground mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <Button
                      onClick={fetchDeployments}
                      className="w-full hover-effect"
                      variant="outline"
                    >
                      Refresh Deployments
                    </Button>
                    <Button
                      className="w-full hover-effect"
                      variant="outline"
                      onClick={() =>
                        router.push("/app/services/jupyter/deploy")
                      }
                    >
                      Create New Instance
                    </Button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="dashboard-card subtle-glow">
                  <h3 className="text-lg font-medium text-foreground mb-4">
                    Recent Activity
                  </h3>
                  {deployments.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      No recent activity
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {deployments.slice(0, 3).map((deployment) => (
                        <div
                          key={deployment.deploymentId}
                          className="border-b border-border/40 pb-3 last:border-0"
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-foreground">
                              Instance {deployment.deploymentId}
                            </p>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                isDeploymentActive(
                                  deployment.createdAt,
                                  deployment.duration
                                )
                                  ? "bg-green-500/10 text-green-500"
                                  : "bg-red-500/10 text-red-500"
                              }`}
                            >
                              {isDeploymentActive(
                                deployment.createdAt,
                                deployment.duration
                              )
                                ? "Active"
                                : "Expired"}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-sm">
                            {formatDistanceToNow(
                              new Date(deployment.createdAt)
                            )}{" "}
                            ago
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
