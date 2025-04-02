import { apiService } from "../services/apiService";
import {
  DeploymentConfig,
  EnvironmentVars,
  Deployment,
  ServiceType,
  DeployCustomBackendRequest,
  DeployDefaultBackendRequest,
  DeployCustomJupyterRequest,
  DeployDefaultJupyterRequest,
  DeploymentResponse,
  GetDeploymentsRequest,
  GetDeploymentsResponse,
  ProviderType,
} from "../services/types";

// Re-export types
export type {
  DeploymentConfig,
  EnvironmentVars,
  Deployment,
  ServiceType,
  DeployCustomBackendRequest,
  DeployDefaultBackendRequest,
  DeployCustomJupyterRequest,
  DeployDefaultJupyterRequest,
  DeploymentResponse,
  GetDeploymentsRequest,
  GetDeploymentsResponse,
  ProviderType,
};

// Export the main API service
export const api = apiService;

// For backward compatibility with any code using the old function-based API
export const getDeployments = (userId: string, provider?: ProviderType) =>
  apiService.getUserDeployments(userId, undefined, provider);
export const getDeploymentById = (deploymentId: number) =>
  apiService.getDeploymentById(deploymentId);
export const getServiceInstances = (type: string) =>
  apiService.getServiceInstances(type);
export const closeDeployment = (deploymentId: number) =>
  apiService.closeDeployment(deploymentId);
export const getUserDeploymentsByType = (
  userId: string,
  type: string,
  provider?: ProviderType
) => apiService.getUserDeploymentsByType(userId, type, provider);
export const createDeployment = (
  userId: string,
  repoUrl: string,
  branchName: string,
  config: DeploymentConfig,
  env: EnvironmentVars
) => apiService.createDeployment(userId, repoUrl, branchName, config, env);
