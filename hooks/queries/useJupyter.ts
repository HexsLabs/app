import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deployDefaultJupyter,
  deployCustomJupyter,
} from "@/lib/reactQuery/apiWrappers";
import { deploymentKeys } from "./useDeployments";

export function useDeployDefaultJupyter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deployDefaultJupyter,
    onSuccess: () => {
      // Invalidate and refetch deployments lists
      queryClient.invalidateQueries({ queryKey: deploymentKeys.lists() });
    },
  });
}

export function useDeployCustomJupyter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deployCustomJupyter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deploymentKeys.lists() });
    },
  });
}
