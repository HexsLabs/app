import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3080';

export interface DeploymentConfig {
  userAppImage: string;
  appPort: number;
}

export interface EnvironmentVars {
  REPO_URL?: string;
  BRANCH_NAME?: string;
  [key: string]: string | undefined;
}

export interface DeploymentResponse {
  message: string;
  appUrl: string;
  apiKey: string;
  leaseId: string;
}

export interface UserDeploymentsResponse {
  userId: number;
  deployments: Array<{
    id: string;
    app_url: string;
    monitor_url: string;
    is_active: boolean;
    created_at: string;
  }>;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createDeployment = async (
  config: DeploymentConfig,
  envVars?: EnvironmentVars,
  userId?: number
) => {
  try {
    const response = await api.post<DeploymentResponse>('/deployments/create', {
      user: userId || 2, // Default user ID if not provided
      config,
      envVars,
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to create deployment');
  }
};

export const getUserDeployments = async (address: string) => {
  try {
    const response = await api.post<UserDeploymentsResponse>('/users/deployments', {
      address,
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user deployments');
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