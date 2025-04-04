import React from "react";
import { Button } from "@/components/ui/button";
import { Deployment } from "@/services/types";
import { formatDistanceToNow } from "date-fns";

interface ServiceSidebarProps {
  deployments: Deployment[];
  onRefresh: () => void;
  onCreateNew: () => void;
  isDeploymentActive: (createdAt: string, duration: string) => boolean;
  serviceName: string;
}

const ServiceSidebar: React.FC<ServiceSidebarProps> = ({
  deployments,
  onRefresh,
  onCreateNew,
  isDeploymentActive,
  serviceName,
}) => {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="dashboard-card subtle-glow">
        <h3 className="text-lg font-medium text-foreground mb-4">
          Quick Actions
        </h3>
        <div className="space-y-3">
          <Button
            onClick={onRefresh}
            className="w-full hover-effect"
            variant="outline"
          >
            Refresh Deployments
          </Button>
          <Button
            className="w-full hover-effect"
            variant="outline"
            onClick={onCreateNew}
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
          <p className="text-muted-foreground text-sm">No recent activity</p>
        ) : (
          <div className="space-y-4">
            {deployments.slice(0, 3).map((deployment) => (
              <div
                key={deployment.deploymentId}
                className="border-b border-border/40 pb-3 last:border-0"
              >
                <div className="flex items-center justify-between">
                  <p className="text-foreground">
                    {serviceName} {deployment.deploymentId}
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
                  {formatDistanceToNow(new Date(deployment.createdAt))} ago
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceSidebar;
