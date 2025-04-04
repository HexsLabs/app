import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { Deployment } from "@/services/types";
import DeploymentStats from "./DeploymentStats";
import DeploymentsList from "./DeploymentsList";
import ServiceSidebar from "./ServiceSidebar";

interface ServicePageProps {
  title: string;
  description: string;
  deployPath: string;
  user: any;
  isLoading: boolean;
  authLoading: boolean;
  error: string | null;
  deployments: Deployment[];
  isDeploymentActive: (createdAt: string, duration: string) => boolean;
  fetchDeployments: () => void;
  activeInstances: number;
  totalDeployments: number;
  currentCpuUsage: number;
  currentRamUsage: number;
  serviceName: string;
  onDelete?: (deploymentId: string) => void;
  router: any;
}

const ServicePage: React.FC<ServicePageProps> = ({
  title,
  description,
  deployPath,
  user,
  isLoading,
  authLoading,
  error,
  deployments,
  isDeploymentActive,
  fetchDeployments,
  activeInstances,
  totalDeployments,
  currentCpuUsage,
  currentRamUsage,
  serviceName,
  onDelete,
  router,
}) => {
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

  return (
    <div className="bg-background text-foreground py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="section-title mb-2">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <Button
            size="lg"
            variant="gradient"
            className="shadow-lg shadow-primary/10 hover-effect"
            onClick={() => router.push(deployPath)}
          >
            <span>Create Instance</span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {renderAuthContent(
          <div>
            {/* Stats Overview */}
            <DeploymentStats
              isLoading={isLoading}
              activeInstances={activeInstances}
              totalDeployments={totalDeployments}
              currentCpuUsage={currentCpuUsage}
              currentRamUsage={currentRamUsage}
            />

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Deployments List */}
              <div className="lg:col-span-2">
                <div className="dashboard-card subtle-glow">
                  <h2 className="text-2xl font-semibold mb-6 text-foreground">
                    Your Deployments
                  </h2>

                  <DeploymentsList
                    isLoading={isLoading}
                    error={error}
                    deployments={deployments}
                    isDeploymentActive={isDeploymentActive}
                    onDelete={onDelete}
                    serviceName={serviceName}
                  />
                </div>
              </div>

              {/* Sidebar */}
              <ServiceSidebar
                deployments={deployments}
                onRefresh={fetchDeployments}
                onCreateNew={() => router.push(deployPath)}
                isDeploymentActive={isDeploymentActive}
                serviceName={serviceName}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicePage;
