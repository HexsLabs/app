import React from "react";
import Skeleton from "./Skeleton";

interface DeploymentStatsProps {
  isLoading: boolean;
  activeInstances: number;
  totalDeployments: number;
  currentCpuUsage: number;
  currentRamUsage: string;
}

const DeploymentStats: React.FC<DeploymentStatsProps> = ({
  isLoading,
  activeInstances,
  totalDeployments,
  currentCpuUsage,
  currentRamUsage,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="dashboard-card subtle-glow">
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-10 w-16" />
          </div>
        ))}
      </div>
    );
  }

  return (
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
            {currentCpuUsage} CPU | {currentRamUsage} RAM
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeploymentStats;
