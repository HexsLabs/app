"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, Check } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  CPU_CONSTRAINTS,
  MEMORY_CONSTRAINTS,
  DURATION_CONSTRAINTS,
  ENVIRONMENT_VARS_DEFAULT,
} from "@/constants/constrains";
import { toast } from "sonner";
import {
  createDeployment,
  DeploymentConfig,
  EnvironmentVars,
  ProviderType,
} from "@/lib/api";
import { deploymentOptions } from "./helpers";
import SourceControlSection from "@/components/services/backend/SourceControlSection";
import EnviromentVariableSection from "@/components/services/backend/EnviromentVariableSection";
import ResourceSettingSection from "@/components/services/backend/ResourceSettingSection";
import SDLBuilder from "@/components/services/backend";
import { ResourceValueOptions } from "./interface";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProviderFromEnv } from "@/lib/utils";

export default function BackendPage() {
  const { user, isLoading } = useAuth();
  const [selectedOption, setSelectedOption] = useState<"default" | "custom">(
    "default"
  );
  const [repoUrl, setRepoUrl] = useState<string>("");
  const [branchName, setBranchName] = useState<string>("main");

  const [portNumber, setPortNumber] = useState<number>(3000);

  const [envVarsJson, setEnvVarsJson] = useState<string>(
    ENVIRONMENT_VARS_DEFAULT
  );

  const defaultProvider = getProviderFromEnv();

  const [selectedProvider, setSelectedProvider] =
    useState<ProviderType>(defaultProvider);

  const router = useRouter();

  // const [buildCommand, setBuildCommand] = useState<string>("npm run build");
  // const [startCommand, setStartCommand] = useState<string>("npm start");
  // const [deploymentName, setDeploymentName] =
  // useState<string>("my-backend-service");

  const [values, setValues] = React.useState<ResourceValueOptions>({
    cpuValue: String(CPU_CONSTRAINTS.DEFAULT),
    memoryValue: MEMORY_CONSTRAINTS.DEFAULT_MI,
    memoryUnit: "Mi",
    ephemeralValue: 1,
    ephemeralUnit: "Gi",
    deploymentDuration: DURATION_CONSTRAINTS.DEFAULT_HOURS,
  });

  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const userId = user?.id;

    if (!userId) {
      toast.error("User ID not found");
      return;
    }

    try {
      const config: DeploymentConfig = {
        appPort: portNumber,
        deploymentDuration: `${values.deploymentDuration}h`,
        appCpuUnits: parseFloat(values.cpuValue),
        appMemorySize: `${values.memoryValue}${values.memoryUnit}`,
        appStorageSize: `${values.ephemeralValue}${values.ephemeralUnit}`,
      };

      let env: EnvironmentVars = {};
      try {
        env = JSON.parse(envVarsJson);
      } catch (error) {
        toast.warning(
          "Environment variables are not valid JSON. Using empty object."
        );
      }

      const response = await createDeployment(
        userId,
        repoUrl,
        branchName,
        config,
        env
      );

      toast.message("Deployment created successfully", {
        description: (
          <div className="mt-2 space-y-2">
            <p className="font-medium">
              Your deployment has been created successfully!
            </p>
            {response.appUrl && (
              <p className="text-sm">
                🌐 App URL:{" "}
                <a
                  href={response.appUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {response.appUrl}
                </a>
              </p>
            )}
            {response.deploymentId && (
              <p className="text-sm">🔑 Lease ID: {response.deploymentId}</p>
            )}
          </div>
        ),
      });
      router.push("/app/services/custom");
    } catch (error) {
      console.error("Error creating deployment:", error);
      toast.error("Failed to create deployment. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const renderAuthContent = (content: React.ReactNode) => {
    if (isLoading) {
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
        <div className="dashboard-card text-center py-8 sm:py-12">
          <p className="text-base sm:text-lg mb-4">
            Please sign in to create a deployment
          </p>
          <Button variant="outline" className="hover-effect mt-2">
            Sign In
          </Button>
        </div>
      );
    }

    return content;
  };

  const renderDeploymentOptions = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {deploymentOptions.map((option, index) => (
        <div
          key={index}
          className={`dashboard-card cursor-pointer subtle-glow transition-all duration-300 ${
            selectedOption === (index === 0 ? "default" : "custom")
              ? "border-primary/50 bg-primary/5"
              : ""
          }`}
          onClick={() => setSelectedOption(index === 0 ? "default" : "custom")}
        >
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="rounded-full p-2 sm:p-3 bg-secondary/30 text-primary">
              {option.icon}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base sm:text-lg font-medium">
                  {option.title}
                </h3>
                {option.free && (
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    free
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {option.description}
              </p>

              <div className="mt-3 sm:mt-4 space-y-1">
                {option.resources.map((resource, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground"
                  >
                    <Check size={14} className="text-primary flex-shrink-0" />
                    <span>{resource}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="self-center ml-1 sm:ml-0">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedOption === (index === 0 ? "default" : "custom")
                    ? "border-primary"
                    : "border-muted-foreground/40"
                }`}
              >
                {selectedOption === (index === 0 ? "default" : "custom") && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderStandardDeployment = () => (
    <div className="dashboard-card subtle-glow mb-6 sm:mb-8">
      <SourceControlSection
        repoUrl={repoUrl}
        setRepoUrl={setRepoUrl}
        branchName={branchName}
        setBranchName={setBranchName}
        portNumber={portNumber}
        setPortNumber={setPortNumber}
      />

      <EnviromentVariableSection
        envVarsJson={envVarsJson}
        setEnvVarsJson={setEnvVarsJson}
      />

      <div className="flex justify-end mt-6">
        <Button
          size="default"
          className="btn-primary shadow-lg shadow-primary/10 hover-effect w-full sm:w-auto"
          disabled={loading}
          onClick={handleSubmit}
        >
          <span>{loading ? "Deploying..." : "Deploy Service"}</span>
          {!loading && <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />}
        </Button>
      </div>
    </div>
  );

  const renderCustomDeployment = () => (
    <div className="dashboard-card subtle-glow mb-6 sm:mb-8">
      <Tabs defaultValue="basic" className="w-full">
        {/* <TabsList className="mb-6">
          <TabsTrigger value="basic">Basic Deployment</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Deployment</TabsTrigger>
        </TabsList> */}

        <TabsContent value="basic">
          <div className="space-y-4 sm:space-y-6">
            <ResourceSettingSection values={values} setValues={setValues} />

            <SourceControlSection
              repoUrl={repoUrl}
              setRepoUrl={setRepoUrl}
              branchName={branchName}
              setBranchName={setBranchName}
              portNumber={portNumber}
              setPortNumber={setPortNumber}
            />

            <EnviromentVariableSection
              envVarsJson={envVarsJson}
              setEnvVarsJson={setEnvVarsJson}
            />

            <div className="flex justify-end mt-6">
              <Button
                size="default"
                className="btn-primary shadow-lg shadow-primary/10 hover-effect w-full sm:w-auto"
                // disabled={!isJsonValid}
                // disabled={true}
                onClick={() => {
                  toast.message("Want to use custom deployment?", {
                    description:
                      "Contact us at contact@aquanode.io, or try our Standard deployment for free!",
                  });
                }}
              >
                <span>Deploy Service</span>
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="advanced">
          <div>
            <SDLBuilder />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div className="bg-background text-foreground py-6 sm:py-8">
      <div className="container mx-auto px-0 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 px-4 sm:px-0">
          <div>
            <h1 className="section-title text-xl sm:text-2xl md:text-3xl mb-2">
              Custom Service Deployment
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Deploy a custom service with your preferred configuration
            </p>
          </div>
        </div>

        <div className="px-4 sm:px-0">
          {renderAuthContent(
            <div>
              {renderDeploymentOptions()}

              <div className="mb-4 sm:mb-5">
                <label className="block text-xs font-medium mb-1">
                  Deployment Provider
                </label>
                <div className="w-full sm:w-1/3">
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
                          <SelectItem value="spheron">
                            Spheron Network
                          </SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedOption === "default"
                ? renderStandardDeployment()
                : renderCustomDeployment()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
