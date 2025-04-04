import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDeployments,
  getDeploymentById,
  closeDeployment,
  deployDefaultBackend,
  deployCustomBackend,
  getUserDeploymentsByType,
} from "@/lib/reactQuery/apiWrappers";
import {
  ServiceType,
  ProviderType,
  Deployment,
  DeployDefaultBackendRequest,
  DeployCustomBackendRequest,
  DeploymentResponse,
} from "@/services/types";

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
    onSuccess: () => {
      // Invalidate and refetch deployments lists
      queryClient.invalidateQueries({ queryKey: deploymentKeys.lists() });
    },
  });
}

// Deploy default backend (mutation)
export function useDeployDefaultBackend() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deployDefaultBackend,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deploymentKeys.lists() });
    },
  });
}

// Deploy custom backend (mutation)
export function useDeployCustomBackend() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deployCustomBackend,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deploymentKeys.lists() });
    },
  });
}
