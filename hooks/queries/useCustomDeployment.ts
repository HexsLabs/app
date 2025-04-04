import { useMutation } from "@tanstack/react-query";
import { DeploymentConfig, EnvironmentVars } from "@/services/types";
import { createDeployment } from "@/lib/reactQuery/apiWrappers";
import { useQueryClient } from "@tanstack/react-query";
import { deploymentKeys } from "./useDeployments";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CreateDeploymentParams {
  userId: string;
  repoUrl: string;
  branchName: string;
  config: DeploymentConfig;
  env: EnvironmentVars;
}

export function useCreateDeployment(redirectPath?: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({
      userId,
      repoUrl,
      branchName,
      config,
      env,
    }: CreateDeploymentParams) =>
      createDeployment(userId, repoUrl, branchName, config, env),
    onSuccess: (response) => {
      toast.success("Deployment created successfully", {
        description: `Your deployment has been created successfully. ${response.appUrl ? `App URL: ${response.appUrl}` : ""} ${response.deploymentId ? `Lease ID: ${response.deploymentId}` : ""}`,
      });

      // Invalidate and refetch deployments lists
      queryClient.invalidateQueries({ queryKey: deploymentKeys.lists() });

      // navigate if redirectPath is provided
      if (redirectPath) {
        router.push(redirectPath);
      }
    },
    onError: (error) => {
      toast.error("Failed to create deployment", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    },
  });
}
