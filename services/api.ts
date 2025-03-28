import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3080';

export interface DeploymentConfig {
  appPort: number;
  deploymentDuration: string;
  appCpuUnits: number;
  appMemorySize: string;
  appStorageSize: string;
}

export interface EnvironmentVars {
  [key: string]: string | undefined;
}

export interface DeploymentResponse {
  message: string;
  appUrl: string;
  leaseId: string;
}

export interface DeploymentInfo {
  id: string;
  appUrl: string;
  monitorUrl: string;
  apiKey: string;
  user: number;
}

export interface UserDeploymentsResponse {
  userId: number;
  deployments: Array<{
    id: string;
    appUrl: string;
    createdAt: string;
  }>;
}

export interface UserResponse {
  user: number;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log errors for debugging
const logError = (error: any, context: string) => {
  console.error(`API Error (${context}):`, error);
  if (error.response) {
    console.error('Response data:', error.response.data);
    console.error('Response status:', error.response.status);
  }
};

export const createUser = async (address: string) => {
  try {
    const response = await api.post<UserResponse>('/users/address', {
      address,
    });
    return response.data;
  } catch (error) {
    logError(error, 'createUser');
    throw new Error('Failed to create user');
  }
};

export const createDeployment = async (
  userId: number,
  repoUrl: string,
  branchName: string = 'main',
  config: DeploymentConfig,
  env?: EnvironmentVars
) => {
  try {
    console.log('Creating deployment with:', { userId, repoUrl, branchName, config, env });
    const response = await api.post<DeploymentResponse>('/api/deployments/create', {
      user: userId,
      repoUrl,
      branchName,
      env,
      config,
    });
    console.log('Deployment created:', response.data);
    return response.data;
  } catch (error) {
    logError(error, 'createDeployment');
    throw new Error('Failed to create deployment');
  }
};

export const getUserDeployments = async (userId: number) => {
  try {
    console.log('Fetching deployments for user:', userId);
    const response = await api.post<UserDeploymentsResponse>('/api/deployments/user', {
      user: userId,
    });
    console.log('User deployments:', response.data);
    return response.data;
  } catch (error) {
    logError(error, 'getUserDeployments');
    // Return empty deployments array on error to prevent UI crashes
    return { userId, deployments: [] };
  }
};

export const getDeploymentInfo = async (leaseId: string) => {
  try {
    console.log('Fetching deployment info for:', leaseId);
    const response = await api.get<{ message: string, deployment: DeploymentInfo }>(`/deployments/info/${leaseId}`);
    console.log('Deployment info:', response.data);
    return response.data;
  } catch (error) {
    logError(error, 'getDeploymentInfo');
    throw new Error('Failed to fetch deployment info');
  }
};

export const getDeploymentStatus = async (leaseId: string) => {
  try {
    const response = await api.get(`/deployments/info/${leaseId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch deployment status');
  }
};

export const getDeploymentStatuses = async () => {
  try {
    const response = await api.get('/deployments/status');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch deployment statuses');
  }
}; 