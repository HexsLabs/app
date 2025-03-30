import {
  DeployBackendRequest,
  DeployCustomJupyterRequest,
  DeployDefaultJupyterRequest,
  DeploymentResponse,
  GetDeploymentsRequest,
  GetDeploymentsResponse,
  Deployment,
  ServiceType,
  EnvironmentVars,
  DeploymentConfig,
  ProviderType,
} from '../types';

console.log("provider to use", process.env.NEXT_PUBLIC_PROVIDER_TO_USE);
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3080';

// User response interface
interface UserResponse {
  message: string;
  user: number;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
      throw new Error(error.message || 'An error occurred');
    }

    return response.json();
  }

  // User Management
  async createUser(address: string): Promise<UserResponse> {
    return this.request<UserResponse>('/api/user/register', {
      method: 'POST',
      body: JSON.stringify({ address }),
    });
  }

  // Jupyter Services
  async deployDefaultJupyter(data: DeployDefaultJupyterRequest): Promise<DeploymentResponse> {
    return this.request<DeploymentResponse>('/api/services/jupyter/deploy-default', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
      }),
    });
  }

  async deployCustomJupyter(data: DeployCustomJupyterRequest): Promise<DeploymentResponse> {
    return this.request<DeploymentResponse>('/api/services/jupyter/deploy-custom', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
      }),
    });
  }

  // Backend Services
  async deployBackend(data: DeployBackendRequest): Promise<DeploymentResponse> {
    return this.request<DeploymentResponse>('/api/services/backend/deploy', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
      }),
    });
  }

  // Create a new deployment
  async createDeployment(
    user: number,
    repoUrl: string,
    branchName: string,
    config: DeploymentConfig,
    env: EnvironmentVars
  ): Promise<Deployment> {
    return this.request<Deployment>('/api/deployments/create', {
      method: 'POST',
      body: JSON.stringify({
        user,
        repoUrl,
        branchName,
        config,
        env,
        provider: process.env.NEXT_PUBLIC_PROVIDER_TO_USE as ProviderType || 'auto',
      }),
    });
  }

  // Deployment Services
  async getUserDeployments(user: number, type?: ServiceType): Promise<Deployment[]> {
    return this.request<GetDeploymentsResponse>('/api/deployments/user', {
      method: 'POST', 
      body: JSON.stringify({
        user,
        type: type || null,
      } as GetDeploymentsRequest),
    }).then(response => {
      return response.deployments;
    });
  }

  // Get deployment by ID
  async getDeploymentById(deploymentId: number): Promise<Deployment> {
    return this.request<Deployment>(`/api/deployments/${deploymentId}`);
  }

  // Get service instances by type
  async getServiceInstances(type: string): Promise<any[]> {
    return this.request<any[]>('/api/deployments/service-instances', {
      method: 'POST',
      body: JSON.stringify({ type }),
    });
  }

  // Close a deployment
  async closeDeployment(deploymentId: number): Promise<void> {
    return this.request<void>('/api/deployments/close', {
      method: 'POST',
      body: JSON.stringify({ deploymentId }),
    });
  }

  // Get user deployments by type
  async getUserDeploymentsByType(userId: number, type: string): Promise<Deployment[]> {
    return this.request<Deployment[]>('/api/deployments/user', {
      method: 'POST',
      body: JSON.stringify({ userId, type }),
    });
  }
}

export const apiService = new ApiService(); 