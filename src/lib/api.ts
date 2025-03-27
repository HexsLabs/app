import {
  DeployBackendRequest,
  DeployCustomJupyterRequest,
  DeployDefaultJupyterRequest,
  DeploymentResponse,
  GetDeploymentsRequest,
  GetDeploymentsResponse,
  Deployment,
  ServiceType,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3080';

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
      const error = await response.json();
      throw new Error(error.message || 'An error occurred');
    }

    return response.json();
  }

  // Jupyter Services
  async deployDefaultJupyter(data: DeployDefaultJupyterRequest): Promise<DeploymentResponse> {
    return this.request<DeploymentResponse>('/api/services/jupyter/deploy-default', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deployCustomJupyter(data: DeployCustomJupyterRequest): Promise<DeploymentResponse> {
    return this.request<DeploymentResponse>('/api/services/jupyter/deploy-custom', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Backend Services
  async deployBackend(data: DeployBackendRequest): Promise<DeploymentResponse> {
    return this.request<DeploymentResponse>('/api/services/backend/deploy', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Deployment Services
  async getUserDeployments(userId: number, type?: ServiceType): Promise<Deployment[]> {
    const response = await this.request<GetDeploymentsResponse>('/api/deployments/user', {
      method: 'POST',
      body: JSON.stringify({
        user: userId,
        type: type || null,
      } as GetDeploymentsRequest),
    });
    return response.deployments;
  }
}

export const api = new ApiService(); 