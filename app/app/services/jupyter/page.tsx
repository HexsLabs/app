"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "../../../../lib/api";
import { Deployment, ServiceType } from "@/services/types";
import { useAuth } from "@/lib/auth/AuthContext";
import { getProviderFromEnv } from "@/lib/utils";
import { useRouter } from "next/navigation";
import ServicePage from "@/components/services/common/ServicePage";

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

  const currentRamUsageInMi = activeDeployments.reduce((acc, curr) => {
    const memory = curr.memory;

    if (memory.includes("Mi")) {
      return acc + parseInt(memory.split("Mi")[0]);
    } else if (memory.includes("Gi")) {
      return acc + parseInt(memory.split("Gi")[0]) * 1024;
    } else {
      return acc + parseInt(memory);
    }
  }, 0);

  const currentRamUsage =
    currentRamUsageInMi > 1024
      ? (currentRamUsageInMi / 1024).toFixed(2) + " Gi"
      : currentRamUsageInMi + " Mi";

  const handleDelete = (deploymentId: string) => {
    // TODO: Implement delete deployment
    console.log(`Delete deployment ${deploymentId}`);
  };

  return (
    <ServicePage
      title="Jupyter Notebook Deployment"
      description="Deploy and manage your Jupyter notebook instances"
      deployPath="/app/services/jupyter/deploy"
      user={user}
      isLoading={isLoading}
      authLoading={authLoading}
      error={error}
      deployments={deployments}
      isDeploymentActive={isDeploymentActive}
      fetchDeployments={fetchDeployments}
      activeInstances={activeInstances}
      totalDeployments={totalDeployments}
      currentCpuUsage={currentCpuUsage}
      currentRamUsage={currentRamUsage}
      serviceName="JUPYTER"
      onDelete={handleDelete}
      router={router}
    />
  );
}
