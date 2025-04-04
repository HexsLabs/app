import { useMutation } from "@tanstack/react-query";
import {
  DeploymentConfig,
  EnvironmentVars,
  ProviderType,
  Deployment,
} from "@/services/types";
import { createDeployment } from "@/lib/reactQuery/apiWrappers";
import { useQueryClient } from "@tanstack/react-query";
import { deploymentKeys } from "./useDeployments";

interface CreateDeploymentParams {
  userId: string;
  repoUrl: string;
  branchName: string;
  config: DeploymentConfig;
  env: EnvironmentVars;
}

export function useCreateDeployment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      repoUrl,
      branchName,
      config,
      env,
    }: CreateDeploymentParams) =>
      createDeployment(userId, repoUrl, branchName, config, env),
    onSuccess: () => {
      // Invalidate and refetch deployments lists
      queryClient.invalidateQueries({ queryKey: deploymentKeys.lists() });
    },
  });
}
