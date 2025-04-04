import { apiService } from "@/services/apiService";
import {
  DeployCustomBackendRequest,
  DeployDefaultBackendRequest,
  DeployCustomJupyterRequest,
  DeployDefaultJupyterRequest,
  DeploymentResponse,
  Deployment,
  ServiceType,
  ProviderType,
  ChatRequest,
  ChatResponse,
  DeploymentConfig,
  EnvironmentVars,
} from "@/services/types";

// User endpoints
export const getUserProfile = async () => {
  return apiService.request<any>("/api/user/profile");
};

export const updateUserProfile = async (data: any) => {
  return apiService.request<any>("/api/user/profile", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Deployment endpoints
export const getDeployments = async (
  user: string,
  type?: ServiceType,
  provider?: ProviderType
): Promise<Deployment[]> => {
  return apiService.getUserDeployments(user, type, provider);
};

export const getUserDeploymentsByType = async (
  userId: string,
  type: string,
  provider?: ProviderType
): Promise<Deployment[]> => {
  return apiService.getUserDeploymentsByType(userId, type, provider);
};

export const getDeploymentById = async (
  deploymentId: number
): Promise<Deployment> => {
  return apiService.getDeploymentById(deploymentId);
};

export const closeDeployment = async (deploymentId: number): Promise<void> => {
  return apiService.closeDeployment(deploymentId);
};

// Create a new deployment
export const createDeployment = async (
  userId: string,
  repoUrl: string,
  branchName: string,
  config: DeploymentConfig,
  env: EnvironmentVars
): Promise<Deployment> => {
  return apiService.createDeployment(userId, repoUrl, branchName, config, env);
};

// Backend services
export const deployDefaultBackend = async (
  data: DeployDefaultBackendRequest
): Promise<DeploymentResponse> => {
  return apiService.deployDefaultBackend(data);
};

export const deployCustomBackend = async (
  data: DeployCustomBackendRequest
): Promise<DeploymentResponse> => {
  return apiService.deployCustomBackend(data);
};

// Jupyter services
export const deployDefaultJupyter = async (
  data: DeployDefaultJupyterRequest
): Promise<DeploymentResponse> => {
  return apiService.deployDefaultJupyter(data);
};

export const deployCustomJupyter = async (
  data: DeployCustomJupyterRequest
): Promise<DeploymentResponse> => {
  return apiService.deployCustomJupyter(data);
};

// Chat endpoints
export const sendChatMessage = async (
  request: ChatRequest,
  onStream?: (text: string) => void
): Promise<ChatResponse> => {
  return apiService.sendChatMessage(request, onStream);
};

