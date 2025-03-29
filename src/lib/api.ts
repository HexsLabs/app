import { apiService } from './services/apiService';
import {
  DeploymentConfig,
  EnvironmentVars,
  Deployment,
  ServiceType,
  DeployBackendRequest,
  DeployCustomJupyterRequest,
  DeployDefaultJupyterRequest,
  DeploymentResponse,
  GetDeploymentsRequest,
  GetDeploymentsResponse,
  ProviderType,
} from './types';

// Re-export types
export type {
  DeploymentConfig,
  EnvironmentVars,
  Deployment,
  ServiceType,
  DeployBackendRequest,
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
export const getDeployments = (userId: number) => apiService.getUserDeployments(userId);
export const getDeploymentById = (deploymentId: number) => apiService.getDeploymentById(deploymentId);
export const getServiceInstances = (type: string) => apiService.getServiceInstances(type);
export const closeDeployment = (deploymentId: number) => apiService.closeDeployment(deploymentId);
export const getUserDeploymentsByType = (userId: number, type: string) => apiService.getUserDeploymentsByType(userId, type);
export const createDeployment = (userId: number, repoUrl: string, branchName: string, config: DeploymentConfig, env: EnvironmentVars) => 
  apiService.createDeployment(userId, repoUrl, branchName, config, env); 