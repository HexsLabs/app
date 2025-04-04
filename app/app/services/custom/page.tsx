"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "../../../../lib/api";
import { Deployment, ServiceType } from "@/services/types";
import { useAuth } from "@/lib/auth/AuthContext";
import { getProviderFromEnv } from "@/lib/utils";
import { useRouter } from "next/navigation";
import ServicePage from "@/components/services/common/ServicePage";
import { isDeploymentActive } from "@/lib/deployment/utils";

export default function BackendPage() {
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
        ServiceType.BACKEND,
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

  let currentRamUsage = currentRamUsageInMi + " Mi";
  if (currentRamUsageInMi > 1024) {
    currentRamUsage = (currentRamUsageInMi / 1024).toFixed(2) + " Gi";
  }

  const handleDelete = (deploymentId: string) => {
    // TODO: Implement delete deployment
    console.log(`Delete deployment ${deploymentId}`);
  };

  return (
    <ServicePage
      title="Custom Service Deployment"
      description="Deploy and manage your custom service instances"
      deployPath="/app/services/custom/deploy"
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
      serviceName="BACKEND"
      onDelete={handleDelete}
      router={router}
    />
  );
}
