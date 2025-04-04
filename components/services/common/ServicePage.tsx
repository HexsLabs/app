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
        <div className="p-4 sm:p-8 flex flex-col items-center justify-center">
          <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin mb-4 text-primary" />
          <p className="text-muted-foreground text-sm sm:text-base">
            Loading authentication...
          </p>
        </div>
      );
    }

    if (!user?.id) {
      return (
        <div className="dashboard-card text-center py-8 sm:py-12 px-4 sm:px-6">
          <p className="text-base sm:text-lg mb-4">
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
    <div className="bg-background text-foreground py-4 sm:py-8">
      <div className="container mx-auto px-0 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="section-title text-xl sm:text-2xl md:text-3xl mb-2">
              {title}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              {description}
            </p>
          </div>
          <Button
            size="default"
            variant="gradient"
            className="shadow-lg shadow-primary/10 hover-effect w-full sm:w-auto"
            onClick={() => router.push(deployPath)}
          >
            <span>Create Instance</span>
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>

        {renderAuthContent(
          <div className="w-full overflow-hidden">
            {/* Stats Overview */}
            <DeploymentStats
              isLoading={isLoading}
              activeInstances={activeInstances}
              totalDeployments={totalDeployments}
              currentCpuUsage={currentCpuUsage}
              currentRamUsage={currentRamUsage}
            />

            {/* Main Content */}
            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-4">
              {/* Mobile: Sidebar on top for small screens */}
              <div className="block md:hidden">
                <ServiceSidebar
                  deployments={deployments}
                  onRefresh={fetchDeployments}
                  onCreateNew={() => router.push(deployPath)}
                  isDeploymentActive={isDeploymentActive}
                  serviceName={serviceName}
                />
              </div>

              {/* Deployments List */}
              <div className="md:col-span-3 w-full overflow-x-auto">
                <div className="dashboard-card subtle-glow min-w-full">
                  <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-foreground">
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

              {/* Desktop: Sidebar on right for larger screens */}
              <div className="hidden md:block md:col-span-1">
                <ServiceSidebar
                  deployments={deployments}
                  onRefresh={fetchDeployments}
                  onCreateNew={() => router.push(deployPath)}
                  isDeploymentActive={isDeploymentActive}
                  serviceName={serviceName}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicePage;
