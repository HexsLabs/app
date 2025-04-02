"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info, Loader2, GitBranch, Server, Settings2, ArrowRight, Code, Package, Check } from 'lucide-react';
import { DeploymentForm } from '@/components/DeploymentForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/lib/auth/AuthContext';
import Link from "next/link";
import { CPU_CONSTRAINTS, MEMORY_CONSTRAINTS, DURATION_CONSTRAINTS, ENVIRONMENT_VARS_DEFAULT, Unit } from "@/constants/constrains";
import { toast } from "sonner";
import { createDeployment, DeploymentConfig, EnvironmentVars } from "@/lib/api";

interface State {
  isPrivate: boolean;
  cpuValue: string;
  isGpuEnabled: boolean;
  gpuValue: number;
  memoryValue: number;
  memoryUnit: Unit;
  ephemeralValue: number;
  ephemeralUnit: Unit;
  deploymentDuration: number; // Now in hours
}

interface DeploymentOption {
  title: string;
  description: string;
  icon: React.ReactNode;
  resources: string[];
  recommended?: boolean;
}

const SDLBuilder: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [selectedOption, setSelectedOption] = useState<"default" | "custom">(
    "default"
  );
  const [repoUrl, setRepoUrl] = useState<string>("");
  const [branchName, setBranchName] = useState<string>("main");
  const [buildCommand, setBuildCommand] = useState<string>("npm run build");
  const [startCommand, setStartCommand] = useState<string>("npm start");
  const [portNumber, setPortNumber] = useState<number>(3000);
  const [deploymentName, setDeploymentName] =
    useState<string>("my-backend-service");

  // Environment variables state
  const [envVarsJson, setEnvVarsJson] = useState<string>(
    ENVIRONMENT_VARS_DEFAULT
  );
  const [isJsonValid, setIsJsonValid] = useState<boolean>(true);
  const [envVarsError, setEnvVarsError] = useState<string>("");

  const [values, setValues] = React.useState<State>({
    isPrivate: false,
    cpuValue: String(CPU_CONSTRAINTS.DEFAULT),
    isGpuEnabled: false,
    gpuValue: 1,
    memoryValue: MEMORY_CONSTRAINTS.DEFAULT_MI,
    memoryUnit: "Mi",
    ephemeralValue: 1,
    ephemeralUnit: "Gi",
    deploymentDuration: DURATION_CONSTRAINTS.DEFAULT_HOURS,
  });

  // Validation states
  const [cpuError, setCpuError] = useState<string>("");
  const [memoryError, setMemoryError] = useState<string>("");
  const [durationError, setDurationError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  // Validate JSON input
  const validateEnvJson = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);

      if (
        typeof parsed !== "object" ||
        parsed === null ||
        Array.isArray(parsed)
      ) {
        setIsJsonValid(false);
        setEnvVarsError("Environment variables must be a valid JSON object");
        return false;
      }

      // Check that all values are strings
      const allValuesAreStrings = Object.values(parsed).every(
        (value) => typeof value === "string"
      );
      if (!allValuesAreStrings) {
        setIsJsonValid(false);
        setEnvVarsError("All environment variable values must be strings");
        return false;
      }

      setIsJsonValid(true);
      setEnvVarsError("");
      return true;
    } catch (error) {
      setIsJsonValid(false);
      setEnvVarsError("Invalid JSON format");
      return false;
    }
  };

  // Format the JSON input
  const formatEnvJson = () => {
    try {
      const parsed = JSON.parse(envVarsJson);
      const formatted = JSON.stringify(parsed, null, 2);
      setEnvVarsJson(formatted);
      validateEnvJson(formatted);
    } catch (error) {
      // If can't parse, keep as is
    }
  };

  const deploymentOptions: DeploymentOption[] = [
    {
      title: "Standard Deployment",
      description:
        "Quick deployment with preset configuration for most backend services",
      icon: <Server className="h-6 w-6 text-primary" />,
      resources: ["0.5 CPU", "512Mi Memory", "1Gi Storage"],
      recommended: true,
    },
    {
      title: "Custom Deployment",
      description:
        "Fine-tune all deployment settings for specific requirements",
      icon: <Settings2 className="h-6 w-6 text-primary" />,
      resources: ["Custom Resources", "Advanced Configuration", "Full Control"],
    },
  ];

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
        appCpuUnits: parseInt(values.cpuValue),
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
                {option.recommended && (
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    Recommended
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

  const renderSourceControl = () => (
    <div className="dashboard-card mb-8">
      <h3 className="text-lg font-medium mb-4">Source Control</h3>
      <div className="space-y-6">
        <div>
          <Label
            htmlFor="repo-url"
            className="text-sm text-muted-foreground mb-1 block"
          >
            Repository URL
          </Label>
          <Input
            id="repo-url"
            placeholder="https://github.com/username/repository"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            className="bg-secondary/10 border-border/30 focus:border-primary/50"
          />
          <p className="text-xs text-muted-foreground mt-1">
            URL to your Git repository (GitHub, GitLab, Bitbucket, etc.)
          </p>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <Label
              htmlFor="branch"
              className="text-sm text-muted-foreground mb-1 block"
            >
              Branch
            </Label>
            <div className="relative">
              <GitBranch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="branch"
                placeholder="main"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                className="bg-secondary/10 border-border/30 focus:border-primary/50 pl-10"
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="port"
              className="text-sm text-muted-foreground mb-1 block"
            >
              Port
            </Label>
            <Input
              id="port"
              type="number"
              placeholder="3000"
              value={portNumber}
              onChange={(e) => setPortNumber(parseInt(e.target.value))}
              className="bg-secondary/10 border-border/30 focus:border-primary/50 max-w-xs"
            />
            <p className="text-xs text-muted-foreground mt-1">
              The port your application will listen on
            </p>
          </div>

          {/* <div className="flex-1">
            <Label
              htmlFor="deployment-name"
              className="text-sm text-muted-foreground mb-1 block"
            >
              Deployment Name
            </Label>
            <Input
              id="deployment-name"
              placeholder="my-backend-service"
              value={deploymentName}
              onChange={(e) => setDeploymentName(e.target.value)}
              className="bg-secondary/10 border-border/30 focus:border-primary/50"
            />
          </div> */}
        </div>
      </div>
    </div>
  );

  const renderEnvironmentVariables = () => (
    <div className="dashboard-card mb-8">
      <h3 className="text-lg font-medium mb-4">Environment Variables</h3>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Define environment variables for your deployment as a JSON object.
        </p>

        <div className="relative">
          <div
            className={`absolute right-2 top-2 flex gap-2 ${
              isJsonValid ? "text-green-500" : "text-red-500"
            }`}
          >
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 text-xs hover:bg-secondary/20"
              onClick={formatEnvJson}
            >
              Format JSON
            </Button>
          </div>

          <div className="border rounded-md bg-secondary/10 border-border/30 overflow-hidden font-mono">
            <textarea
              value={envVarsJson}
              onChange={(e) => {
                setEnvVarsJson(e.target.value);
                validateEnvJson(e.target.value);
              }}
              className={`w-full h-40 p-3 bg-transparent resize-none focus:outline-none text-sm ${
                isJsonValid ? "text-foreground" : "text-red-400"
              }`}
              placeholder={ENVIRONMENT_VARS_DEFAULT}
            />
          </div>

          {!isJsonValid && (
            <p className="text-xs text-red-400 mt-1">{envVarsError}</p>
          )}

          <div className="mt-2 text-xs text-muted-foreground">
            <p>Examples:</p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>
                <code className="bg-secondary/20 px-1 py-0.5 rounded">
                  "PORT": "3000"
                </code>{" "}
                - Server port
              </li>
              <li>
                <code className="bg-secondary/20 px-1 py-0.5 rounded">
                  "DATABASE_URL": "postgresql://user:password@localhost:5432/db"
                </code>{" "}
                - Database connection
              </li>
              <li>
                <code className="bg-secondary/20 px-1 py-0.5 rounded">
                  "API_KEY": "your-api-key"
                </code>{" "}
                - External service credentials
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBuildSettings = () => (
    <div className="dashboard-card mb-8">
      <h3 className="text-lg font-medium mb-4">Build & Runtime Settings</h3>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label
              htmlFor="build-command"
              className="text-sm text-muted-foreground mb-1 block"
            >
              Build Command
            </Label>
            <div className="relative">
              <Code className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="build-command"
                placeholder="npm run build"
                value={buildCommand}
                onChange={(e) => setBuildCommand(e.target.value)}
                className="bg-secondary/10 border-border/30 focus:border-primary/50 pl-10"
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="start-command"
              className="text-sm text-muted-foreground mb-1 block"
            >
              Start Command
            </Label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="start-command"
                placeholder="npm start"
                value={startCommand}
                onChange={(e) => setStartCommand(e.target.value)}
                className="bg-secondary/10 border-border/30 focus:border-primary/50 pl-10"
              />
            </div>
          </div>
        </div>

        {/* <div>
          <Label
            htmlFor="port"
            className="text-sm text-muted-foreground mb-1 block"
          >
            Port
          </Label>
          <Input
            id="port"
            type="number"
            placeholder="3000"
            value={portNumber}
            onChange={(e) => setPortNumber(parseInt(e.target.value))}
            className="bg-secondary/10 border-border/30 focus:border-primary/50 max-w-xs"
          />
          <p className="text-xs text-muted-foreground mt-1">
            The port your application will listen on
          </p>
        </div> */}
      </div>
    </div>
  );

  // Validate CPU input
  const validateCpu = (value: number) => {
    if (isNaN(value) || value === null) {
      setCpuError("CPU value is required");
      return false;
    } else if (value < CPU_CONSTRAINTS.MIN) {
      setCpuError(`CPU must be at least ${CPU_CONSTRAINTS.MIN} cores`);
      return false;
    } else if (value > CPU_CONSTRAINTS.MAX) {
      setCpuError(`CPU cannot exceed ${CPU_CONSTRAINTS.MAX} cores`);
      return false;
    }
    setCpuError("");
    return true;
  };

  // Validate Memory input
  const validateMemory = (value: number, unit: Unit) => {
    if (isNaN(value) || value === null) {
      setMemoryError("Memory value is required");
      return false;
    }

    const valueInGi = unit === "Mi" ? value / 1024 : value;
    if (valueInGi > MEMORY_CONSTRAINTS.MAX_GI) {
      setMemoryError(`Memory cannot exceed ${MEMORY_CONSTRAINTS.MAX_GI}Gi`);
      return false;
    }

    const minValue =
      unit === "Mi" ? MEMORY_CONSTRAINTS.MIN_MI : MEMORY_CONSTRAINTS.MIN_GI;
    if (value < minValue) {
      setMemoryError(`Memory must be at least ${minValue}${unit}`);
      return false;
    }

    setMemoryError("");
    return true;
  };

  // Validate Duration input
  const validateDuration = (hours: number) => {
    if (isNaN(hours) || hours === null) {
      setDurationError("Duration value is required");
      return false;
    } else if (hours < DURATION_CONSTRAINTS.MIN_HOURS) {
      setDurationError(
        `Duration must be at least ${DURATION_CONSTRAINTS.MIN_HOURS} hour`
      );
      return false;
    } else if (hours > DURATION_CONSTRAINTS.MAX_HOURS) {
      setDurationError(
        `Duration cannot exceed ${DURATION_CONSTRAINTS.MAX_HOURS} hours (${
          DURATION_CONSTRAINTS.MAX_HOURS / 24
        } days)`
      );
      return false;
    }
    setDurationError("");
    return true;
  };

  const renderResourceSettings = () => (
    <div className="dashboard-card mb-8">
      <h3 className="text-lg font-medium mb-4">Resource Settings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div>
          <Label htmlFor="cpu-value" className="text-sm font-medium mb-2 block">
            CPU Allocation
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="cpu-value"
              value={values.cpuValue}
              onChange={(e) => {
                const inputValue = e.target.value;

                const value = parseFloat(inputValue);
                if (
                  inputValue == "0." ||
                  inputValue == "0" ||
                  inputValue == ""
                ) {
                  setValues({ ...values, cpuValue: inputValue });
                  setCpuError("");
                  return;
                }

                console.log(value, inputValue);
                if (!isNaN(value)) {
                  setValues({ ...values, cpuValue: inputValue });
                  validateCpu(value);
                }
              }}
              onBlur={(e) => {
                // On blur, validate and format the number properly
                const value = parseFloat(e.target.value);
                if (isNaN(value) || value === 0) {
                  setValues({
                    ...values,
                    cpuValue: String(CPU_CONSTRAINTS.MIN),
                  });
                  setCpuError("");
                } else {
                  // Format to one decimal place when leaving the field
                  const formattedValue = parseFloat(value.toFixed(1));
                  setValues({ ...values, cpuValue: String(formattedValue) });
                  validateCpu(formattedValue);
                }
              }}
              className={`w-full h-10 text-sm bg-secondary/10 border-border/30 ${
                cpuError ? "border-red-400" : ""
              }`}
              type="text"
              placeholder={CPU_CONSTRAINTS.MIN.toString()}
            />
            <div className="bg-secondary/20 px-3 py-2 rounded-md text-sm whitespace-nowrap">
              cores
            </div>
          </div>
          {cpuError ? (
            <p className="text-xs text-red-400 mt-1.5">{cpuError}</p>
          ) : (
            <p className="text-xs text-muted-foreground mt-1.5">
              Range: {CPU_CONSTRAINTS.MIN} to {CPU_CONSTRAINTS.MAX} cores
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="memory-value"
            className="text-sm font-medium mb-2 block"
          >
            Memory Allocation
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="memory-value"
              value={values.memoryValue === 0 ? "" : values.memoryValue}
              onChange={(e) => {
                const inputValue = e.target.value;

                // Special handling for decimal inputs (only for Gi)
                if (
                  values.memoryUnit === "Gi" &&
                  (/^0\.$/.test(inputValue) || /^0\.\d*$/.test(inputValue))
                ) {
                  // Don't validate yet, just update the display value
                  const parsedValue = parseFloat(inputValue) || 0;
                  setValues({ ...values, memoryValue: parsedValue });
                  // Clear error if it's a valid decimal pattern
                  if (/^0\.\d+$/.test(inputValue) && parsedValue > 0) {
                    setMemoryError("");
                  }
                  return;
                }

                // Handle empty input
                if (inputValue === "") {
                  setValues({ ...values, memoryValue: 0 });
                  setMemoryError("Memory value is required");
                  return;
                }

                // Handle normal numbers
                const value = Number(inputValue);
                if (!isNaN(value)) {
                  setValues({ ...values, memoryValue: value });
                  validateMemory(value, values.memoryUnit);
                }
              }}
              onBlur={() => {
                // If empty on blur, set to min value
                if (values.memoryValue === 0) {
                  const minValue =
                    values.memoryUnit === "Mi"
                      ? MEMORY_CONSTRAINTS.MIN_MI
                      : MEMORY_CONSTRAINTS.MIN_GI;
                  setValues({ ...values, memoryValue: minValue });
                  setMemoryError("");
                }
              }}
              className={`w-full h-10 text-sm bg-secondary/10 border-border/30 ${
                memoryError ? "border-red-400" : ""
              }`}
              type="text"
              placeholder={
                values.memoryUnit === "Mi"
                  ? MEMORY_CONSTRAINTS.MIN_MI.toString()
                  : MEMORY_CONSTRAINTS.MIN_GI.toString()
              }
            />
            <Select
              value={values.memoryUnit}
              onValueChange={(value: Unit) => {
                // Convert value when switching units
                if (value === "Mi" && values.memoryUnit === "Gi") {
                  const newValue = Math.round(values.memoryValue * 1024);
                  setValues({
                    ...values,
                    memoryUnit: value,
                    memoryValue: newValue,
                  });
                  validateMemory(newValue, value);
                } else if (value === "Gi" && values.memoryUnit === "Mi") {
                  const newValue = parseFloat(
                    (values.memoryValue / 1024).toFixed(2)
                  );
                  setValues({
                    ...values,
                    memoryUnit: value,
                    memoryValue: newValue,
                  });
                  validateMemory(newValue, value);
                } else {
                  setValues({ ...values, memoryUnit: value });
                }
              }}
            >
              <SelectTrigger className="w-24 h-10 text-sm bg-secondary/10 border-border/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mi">Mi</SelectItem>
                <SelectItem value="Gi">Gi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {memoryError ? (
            <p className="text-xs text-red-400 mt-1.5">{memoryError}</p>
          ) : (
            <p className="text-xs text-muted-foreground mt-1.5">
              Max: {MEMORY_CONSTRAINTS.MAX_GI}Gi (
              {values.memoryUnit === "Mi"
                ? `${MEMORY_CONSTRAINTS.MAX_MI}Mi`
                : `${MEMORY_CONSTRAINTS.MAX_GI}Gi`}
              )
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <Label
            htmlFor="deployment-duration"
            className="text-sm font-medium mb-2 block"
          >
            Deployment Duration
          </Label>
          <div className="flex items-center gap-3">
            <div className="flex-1 grid grid-cols-4 gap-3">
              {DURATION_CONSTRAINTS.QUICK_SELECTIONS.map((hours) => (
                <button
                  key={hours}
                  type="button"
                  onClick={() => {
                    setValues({ ...values, deploymentDuration: hours });
                    validateDuration(hours);
                  }}
                  className={`flex items-center justify-center py-2 px-2 rounded-md border transition-all ${
                    values.deploymentDuration === hours
                      ? "bg-primary/10 border-primary/40 text-primary font-medium"
                      : "bg-secondary/10 border-border/30 hover:bg-secondary/20"
                  }`}
                >
                  {hours === 1
                    ? "1 hour"
                    : hours === 24
                    ? "1 day"
                    : hours === 72
                    ? "3 days"
                    : "7 days"}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 w-40">
              <Input
                id="deployment-duration"
                value={
                  values.deploymentDuration === 0
                    ? ""
                    : values.deploymentDuration
                }
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (inputValue === "") {
                    setValues({ ...values, deploymentDuration: 0 });
                    setDurationError("Duration value is required");
                  } else {
                    const value = parseInt(inputValue);
                    if (!isNaN(value)) {
                      setValues({ ...values, deploymentDuration: value });
                      validateDuration(value);
                    }
                  }
                }}
                onBlur={() => {
                  // If empty on blur, set to min value
                  if (values.deploymentDuration === 0) {
                    setValues({
                      ...values,
                      deploymentDuration: DURATION_CONSTRAINTS.MIN_HOURS,
                    });
                    setDurationError("");
                  }
                }}
                className={`flex-1 h-10 text-sm bg-secondary/10 border-border/30 ${
                  durationError ? "border-red-400" : ""
                }`}
                type="text"
                placeholder={DURATION_CONSTRAINTS.MIN_HOURS.toString()}
              />
              <div className="bg-secondary/20 px-3 py-2 rounded-md text-sm whitespace-nowrap">
                hours
              </div>
            </div>
          </div>
          {durationError ? (
            <p className="text-xs text-red-400 mt-1.5">{durationError}</p>
          ) : (
            <p className="text-xs text-muted-foreground mt-1.5">
              Range: {DURATION_CONSTRAINTS.MIN_HOURS} hour to{" "}
              {DURATION_CONSTRAINTS.MAX_HOURS / 24} days (
              {DURATION_CONSTRAINTS.MAX_HOURS} hours)
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStandardDeployment = () => (
    <>
      {renderSourceControl()}
      {renderEnvironmentVariables()}
      {/* {renderBuildSettings()} */}

      <div className="flex justify-end">
        <Button
          size="lg"
          className="btn-primary shadow-lg shadow-primary/10 hover-effect"
          disabled={!isJsonValid}
          onClick={handleSubmit}
        >
          <span>Deploy Backend</span>
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </>
  );

  const renderCustomDeployment = () => (
    <>
      {renderSourceControl()}
      {renderEnvironmentVariables()}
      {/* {renderBuildSettings()} */}
      {renderResourceSettings()}

      {/* <div className="bg-secondary/10 p-6 rounded-xl mb-8 flex items-center gap-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Info className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium mb-1">
            Advanced Configuration Available
          </h4>
          <p className="text-sm text-muted-foreground">
            You can further customize environment variables, commands, and more
            after creating this deployment.
          </p>
        </div>
      </div> */}

      <div className="flex justify-end">
        <Button
          size="lg"
          className="btn-primary shadow-lg shadow-primary/10 hover-effect"
          // disabled={!isJsonValid}
          // disabled={true}
          onClick={() => {
            console.log("clicked");
            toast(
              "To avail this feature please contact at contact@aquanode.io"
            );
          }}
        >
          <span>Deploy Custom Backend</span>
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </>
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

            <div className="dashboard-card subtle-glow mb-8">
              {selectedOption === "default"
                ? renderStandardDeployment()
                : renderCustomDeployment()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SDLBuilder;
