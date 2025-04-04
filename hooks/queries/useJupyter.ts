import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deployDefaultJupyter,
  deployCustomJupyter,
} from "@/lib/reactQuery/apiWrappers";
import { deploymentKeys } from "./useDeployments";
import { toast } from "sonner";

export function useDeployDefaultJupyter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deployDefaultJupyter,
    onSuccess: (response) => {
      toast.success("Jupyter notebook deployed successfully", {
        description: "Your default Jupyter instance has been created.",
      });

      // Invalidate and refetch deployments lists
      queryClient.invalidateQueries({ queryKey: deploymentKeys.lists() });
    },
    onError: (error) => {
      toast.error("Failed to deploy Jupyter notebook", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    },
  });
}

export function useDeployCustomJupyter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deployCustomJupyter,
    onSuccess: (response) => {
      toast.success("Custom Jupyter notebook deployed successfully", {
        description: "Your custom Jupyter instance has been created.",
      });

      queryClient.invalidateQueries({ queryKey: deploymentKeys.lists() });
    },
    onError: (error) => {
      toast.error("Failed to deploy custom Jupyter notebook", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    },
  });
}
