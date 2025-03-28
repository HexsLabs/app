export interface DeploymentConfig {
  appPort: number;
  deploymentDuration: string;
  appCpuUnits: number;
  appMemorySize: string;
  appStorageSize: string;
}

export interface EnvironmentVars {
  [key: string]: string;
}

export interface Deployment {
  id: string;
  userId: number;
  repoUrl: string;
  branchName: string;
  config: DeploymentConfig;
  env: EnvironmentVars;
  status: string;
  appUrl?: string;
  monitorUrl?: string;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Get all deployments for a user
export async function getDeployments(userId: number): Promise<Deployment[]> {
  const response = await fetch(`${API_BASE_URL}/api/deployments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch deployments');
  }

  return response.json();
}

// Get deployment by ID
export async function getDeploymentById(deploymentId: string): Promise<Deployment> {
  const response = await fetch(`${API_BASE_URL}/api/deployments/${deploymentId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch deployment');
  }

  return response.json();
}

// Get service instances by type
export async function getServiceInstances(type: string): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/api/deployments/service-instances`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch service instances');
  }

  return response.json();
}

// Close a deployment
export async function closeDeployment(deploymentId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/deployments/close`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ deploymentId }),
  });

  if (!response.ok) {
    throw new Error('Failed to close deployment');
  }
}

// Get user deployments by type
export async function getUserDeploymentsByType(userId: number, type: string): Promise<Deployment[]> {
  const response = await fetch(`${API_BASE_URL}/api/deployments/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, type }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user deployments');
  }

  return response.json();
}

// Create a new deployment
export async function createDeployment(
  userId: number,
  repoUrl: string,
  branchName: string,
  config: DeploymentConfig,
  env: EnvironmentVars
): Promise<Deployment> {
  const response = await fetch(`${API_BASE_URL}/api/deployments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      repoUrl,
      branchName,
      config,
      env,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create deployment');
  }

  return response.json();
} 