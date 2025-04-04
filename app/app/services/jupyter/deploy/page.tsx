"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { DeployCustomJupyterRequest, ProviderType } from "@/services/types";
import { useAuth } from "@/lib/auth/AuthContext";
import { getProviderFromEnv } from "@/lib/utils";
import DeploymentOptionCard from "@/components/services/common/DeploymentOptionCard";
import { Layers, Server } from "lucide-react";

import {
  CPU_CONSTRAINTS,
  MEMORY_CONSTRAINTS,
  DURATION_CONSTRAINTS,
} from "@/constants/constrains";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ResourceSettingSection from "@/components/services/backend/ResourceSettingSection";
import { ResourceValueOptions } from "../../backend/deploy/interface";
import { useRouter } from "next/navigation";

export default function JupyterDeployment() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] =
    useState<ProviderType>(getProviderFromEnv());
  const { user } = useAuth();
  const [selectedOption, setSelectedOption] = useState<"default" | "custom">(
    "default"
  );
  const router = useRouter();
  function onDeploymentComplete() {
    router.push("/app/services/jupyter");
  }

  // Resource settings for custom deployment
  const [values, setValues] = useState<ResourceValueOptions>({
    cpuValue: String(CPU_CONSTRAINTS.DEFAULT),
    memoryValue: MEMORY_CONSTRAINTS.DEFAULT_MI,
    memoryUnit: "Mi",
    ephemeralValue: 5,
    ephemeralUnit: "Gi",
    deploymentDuration: DURATION_CONSTRAINTS.DEFAULT_HOURS,
  });
  const userId = user?.id;

  if (!userId) {
    return (
      <div className="dashboard-card text-center py-12">
        <p className="text-lg mb-4">
          Please sign in to deploy Jupyter notebooks
        </p>
        <Button variant="outline" className="hover-effect mt-2">
          Sign In
        </Button>
      </div>
    );
  }

  const handleDefaultDeploy = async () => {
    try {
      setIsLoading(true);

      const response = await api.deployDefaultJupyter({
        provider: selectedProvider,
      });

      toast.success("Jupyter notebook deployed successfully", {
        description: "Your default Jupyter instance has been created.",
      });

      onDeploymentComplete();
    } catch (err) {
      toast.error("Deployment failed", {
        description:
          err instanceof Error
            ? err.message
            : "Failed to deploy Jupyter notebook",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomDeploy = async () => {
    try {
      setIsLoading(true);

      // Calculate the duration
      const duration = `${values.deploymentDuration}h`;

      // Format memory and storage size
      const memorySize = `${values.memoryValue}${values.memoryUnit}`;
      const storageSize = `${values.ephemeralValue}${values.ephemeralUnit}`;

      const data: DeployCustomJupyterRequest = {
        cpuUnits: Number(values.cpuValue),
        memorySize: memorySize,
        storageSize: storageSize,
        duration: duration,
        provider: selectedProvider,
      };

      const response = await api.deployCustomJupyter(data);

      toast.success("Jupyter notebook deployed successfully", {
        description: "Your custom Jupyter instance has been created.",
      });

      onDeploymentComplete();
    } catch (err) {
      toast.error("Deployment failed", {
        description:
          err instanceof Error
            ? err.message
            : "Failed to deploy custom Jupyter notebook",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const defaultProvider = getProviderFromEnv();

  const deploymentOptions = [
    {
      title: "Default Deployment",
      description: "Quick deployment with standard resources",
      resources: ["CPU: 1 unit", "Memory: 1Gi", "Storage: 5Gi", "Duration: 1h"],
      free: true,
      icon: <Server className="h-5 w-5" />,
    },
    {
      title: "Custom Deployment",
      description: "Configure your own resources",
      resources: [
        "Customizable CPU",
        "Adjustable memory",
        "Configurable storage",
        "Flexible duration",
      ],
      free: false,
      icon: <Layers className="h-5 w-5" />,
    },
  ];

  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="section-title mb-2">Deploy Jupyter Notebook</h1>
            <p className="text-muted-foreground">
              Create a new Jupyter notebook instance with your preferred
              configuration
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {deploymentOptions.map((option, index) => (
            <DeploymentOptionCard
              key={index}
              title={option.title}
              description={option.description}
              resources={option.resources}
              selected={selectedOption === (index === 0 ? "default" : "custom")}
              onClick={() =>
                setSelectedOption(index === 0 ? "default" : "custom")
              }
              free={option.free}
              icon={option.icon}
            />
          ))}
        </div>

        <div className="dashboard-card subtle-glow mb-8">
          {/* Provider Selection (Common for both default and custom) */}
          <div className="mb-5">
            <label className="block text-xs font-medium mb-1">
              Deployment Provider
            </label>
            <div className="sm:w-1/3">
              <Select
                value={selectedProvider}
                onValueChange={(value) =>
                  setSelectedProvider(value as ProviderType)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a provider" />
                </SelectTrigger>
                <SelectContent>
                  {defaultProvider ? (
                    <SelectItem value={defaultProvider}>
                      {defaultProvider.charAt(0).toUpperCase() +
                        defaultProvider.slice(1)}{" "}
                      Network
                    </SelectItem>
                  ) : (
                    <>
                      <SelectItem value="auto">Auto (Default)</SelectItem>
                      <SelectItem value="akash">Akash Network</SelectItem>
                      <SelectItem value="spheron">Spheron Network</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedOption === "default" ? (
            <div className="space-y-4">
              <div className="dashboard-card mb-8">
                <h3 className="text-lg font-medium mb-4">Quick Deploy</h3>

                {/* <p className="text-muted-foreground mb-4">
                  Deploy with our recommended standard configuration:
                </p> */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                  <div className="p-3 rounded-lg bg-secondary/5 border border-border/30">
                    <p className="text-xs text-muted-foreground mb-1">CPU</p>
                    <p className="text-lg font-medium">1 Unit</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/5 border border-border/30">
                    <p className="text-xs text-muted-foreground mb-1">Memory</p>
                    <p className="text-lg font-medium">1 Gi</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/5 border border-border/30">
                    <p className="text-xs text-muted-foreground mb-1">
                      Storage
                    </p>
                    <p className="text-lg font-medium">5 Gi</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/5 border border-border/30">
                    <p className="text-xs text-muted-foreground mb-1">
                      Duration
                    </p>
                    <p className="text-lg font-medium">1 Hours</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  className="btn-primary shadow-lg shadow-primary/10 hover-effect"
                  onClick={handleDefaultDeploy}
                  disabled={isLoading}
                >
                  {isLoading ? "Deploying..." : "Deploy Default Instance"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <ResourceSettingSection values={values} setValues={setValues} />

              <div className="flex justify-end mt-5">
                <Button
                  className="btn-primary shadow-lg shadow-primary/10 hover-effect"
                  onClick={handleCustomDeploy}
                  disabled={isLoading}
                >
                  {isLoading ? "Deploying..." : "Deploy Custom Instance"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
