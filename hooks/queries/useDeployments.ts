import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDeployments,
  getDeploymentById,
  closeDeployment,
  deployDefaultBackend,
  deployCustomBackend,
  getUserDeploymentsByType,
} from "@/lib/reactQuery/apiWrappers";
import { ServiceType, ProviderType } from "@/services/types";
import { toast } from "sonner";

// Query key factory
export const deploymentKeys = {
  all: ["deployments"] as const,
  lists: () => [...deploymentKeys.all, "list"] as const,
  list: (filters: {
    user: string;
    type?: ServiceType;
    provider?: ProviderType;
  }) => [...deploymentKeys.lists(), filters] as const,
  details: () => [...deploymentKeys.all, "detail"] as const,
  detail: (id: number) => [...deploymentKeys.details(), id] as const,
};

// Get all deployments for a user
export function useDeployments(
  user: string,
  type?: ServiceType,
  provider?: ProviderType
) {
  return useQuery({
    queryKey: deploymentKeys.list({ user, type, provider }),
    queryFn: () => getDeployments(user, type, provider),
    enabled: !!user,
  });
}

// Get deployments by type
export function useDeploymentsByType(
  userId: string,
  type: string,
  provider?: ProviderType
) {
  return useQuery({
    queryKey: [...deploymentKeys.lists(), { userId, type, provider }],
    queryFn: () => getUserDeploymentsByType(userId, type, provider),
    enabled: !!userId && !!type,
  });
}

// Get a single deployment by ID
export function useDeployment(deploymentId: number) {
  return useQuery({
    queryKey: deploymentKeys.detail(deploymentId),
    queryFn: () => getDeploymentById(deploymentId),
    enabled: !!deploymentId,
  });
}

// Close a deployment (mutation)
export function useCloseDeployment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: closeDeployment,
    onSuccess: (_, deploymentId) => {
      toast.success("Deployment closed successfully");

      // Invalidate and refetch deployments lists
      queryClient.invalidateQueries({ queryKey: deploymentKeys.lists() });

      // invalidate the specific deployment detail if it exists in cache
      queryClient.invalidateQueries({
        queryKey: deploymentKeys.detail(deploymentId),
      });
    },
    onError: (error) => {
      toast.error("Failed to close deployment", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    },
  });
}

// Deploy default backend (mutation)
export function useDeployDefaultBackend() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deployDefaultBackend,
    onSuccess: (response) => {
      toast.success("Backend deployed successfully", {
        description: "Your default backend has been created.",
      });

      // Invalidate and refetch deployments lists
      queryClient.invalidateQueries({ queryKey: deploymentKeys.lists() });
    },
    onError: (error) => {
      toast.error("Failed to deploy backend", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    },
  });
}

// Deploy custom backend (mutation)
export function useDeployCustomBackend() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deployCustomBackend,
    onSuccess: (response) => {
      toast.success("Custom backend deployed successfully", {
        description: "Your custom backend has been created.",
      });

      // Invalidate and refetch deployments lists
      queryClient.invalidateQueries({ queryKey: deploymentKeys.lists() });
    },
    onError: (error) => {
      toast.error("Failed to deploy custom backend", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    },
  });
}
