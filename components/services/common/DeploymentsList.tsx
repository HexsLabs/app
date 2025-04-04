import React from "react";
import { Button } from "@/components/ui/button";
import { Deployment } from "@/services/types";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import Skeleton from "./Skeleton";

interface DeploymentsListProps {
  isLoading: boolean;
  error: string | null;
  deployments: Deployment[];
  isDeploymentActive: (createdAt: string, duration: string) => boolean;
  onDelete?: (deploymentId: string) => void;
  serviceName: string;
}

const DeploymentsList: React.FC<DeploymentsListProps> = ({
  isLoading,
  error,
  deployments,
  isDeploymentActive,
  onDelete,
  serviceName,
}) => {
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

  if (isLoading) {
    return renderSkeletonDeployments();
  }

  if (error) {
    return <p className="text-destructive">{error}</p>;
  }

  if (deployments.length === 0) {
    return (
      <div className="text-center py-20 bg-secondary/10 rounded-xl border border-border/40 backdrop-blur-sm">
        <p className="text-lg text-muted-foreground">No deployments found</p>
        <p className="mt-2 text-sm text-muted-foreground/70">
          Create a new instance to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {deployments.map((deployment) => (
        <div
          key={deployment.deploymentId}
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
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  isDeploymentActive(deployment.createdAt, deployment.duration)
                    ? "bg-green-500/10 text-green-500"
                    : "bg-red-500/10 text-red-500"
                }`}
              >
                {isDeploymentActive(deployment.createdAt, deployment.duration)
                  ? "Active"
                  : "Expired"}
              </span>
            </div>
            {deployment.appUrl && (
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
            )}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">Created:</span>
              <span className="text-muted-foreground/90">
                {formatDistanceToNow(new Date(deployment.createdAt))} ago
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">Resources:</span>
              <span className="text-muted-foreground/90">
                {deployment.cpu} CPU | {deployment.memory} RAM |{" "}
                {deployment.storage} Storage
              </span>
            </div>
          </div>
          <div className="flex gap-3 self-end md:self-center">
            {deployment.appUrl &&
              isDeploymentActive(deployment.createdAt, deployment.duration) && (
                <a
                  href={
                    serviceName === "JUPYTER"
                      ? `${deployment.appUrl}?token=password`
                      : deployment.appUrl
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm" className="hover-effect px-5">
                    Open {serviceName === "JUPYTER" ? "Notebook" : "App"}
                  </Button>
                </a>
              )}
            <Button
              variant="outline"
              size="sm"
              className="hover-effect text-destructive hover:text-destructive px-5"
              onClick={() => onDelete && onDelete(deployment.deploymentId)}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DeploymentsList;
