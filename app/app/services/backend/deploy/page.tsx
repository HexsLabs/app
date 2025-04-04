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
import { createDeployment, DeploymentConfig, EnvironmentVars } from "@/lib/api";
import { deploymentOptions } from "./helpers";
import SourceControlSection from "@/components/services/backend/SourceControlSection";
import EnviromentVariableSection from "@/components/services/backend/EnviromentVariableSection";
import ResourceSettingSection from "@/components/services/backend/ResourceSettingSection";
import SDLBuilder from "@/components/services/backend";
import { ResourceValueOptions } from "./interface";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        <div className="p-8 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
          <p className="text-muted-foreground">Loading authentication...</p>
        </div>
      );
    }

    if (!user?.id) {
      return (
        <div className="dashboard-card text-center py-12">
          <p className="text-lg mb-4">Please sign in to create a deployment</p>
          <Button variant="outline" className="hover-effect mt-2">
            Sign In
          </Button>
        </div>
      );
    }

    return content;
  };

  const renderDeploymentOptions = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
          <div className="flex items-start gap-4">
            <div className="rounded-full p-3 bg-secondary/30 text-primary">
              {option.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">{option.title}</h3>
                {option.free && (
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    free
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {option.description}
              </p>

              <div className="mt-4 space-y-1">
                {option.resources.map((resource, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <Check size={14} className="text-primary" />
                    <span>{resource}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="self-center">
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
    <div className="dashboard-card subtle-glow mb-8">
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
          size="lg"
          className="btn-primary shadow-lg shadow-primary/10 hover-effect"
          disabled={loading}
          onClick={handleSubmit}
        >
          <span>Deploy Backend</span>
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );

  const renderCustomDeployment = () => (
    <div className="dashboard-card subtle-glow mb-8">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="basic">Basic Deployment</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Deployment</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <div className="space-y-6">
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
    <div className="bg-background text-foreground py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="section-title mb-2">Create Backend Deployment</h1>
            <p className="text-muted-foreground">
              Deploy a backend service with your preferred configuration
            </p>
          </div>
        </div>

        {renderAuthContent(
          <div>
            {renderDeploymentOptions()}

            {selectedOption === "default"
              ? renderStandardDeployment()
              : renderCustomDeployment()}
          </div>
        )}
      </div>
    </div>
  );
}
