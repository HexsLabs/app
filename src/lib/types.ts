// Jupyter Service Types
export interface DeployDefaultJupyterRequest {
  userId: number;
  provider?: ProviderType;
}

export interface DeployCustomJupyterRequest {
  userId: number;
  cpuUnits: number;
  memorySize: string;
  storageSize: string;
  duration: string;
  image?: string;
  provider?: ProviderType;
}

// Backend Service Types
export interface DeploymentConfig {
  appPort: number;
  deploymentMode?: string;
  deploymentDuration: string;
  appCpuUnits: number;
  appMemorySize: string;
  appStorageSize: string;
  image?: string | null;
}

export interface EnvironmentVars {
  [key: string]: string;
}

export interface DeployBackendRequest {
  userId: number;
  repoUrl?: string;
  branchName?: string;
  env?: Record<string, string>;
  config: DeploymentConfig;
  provider?: ProviderType;
}

export interface DeploymentResponse {
  status: string;
  deploymentId?: string;
  url?: string;
}

export type ProviderType = 'AUTO' | 'AKASH' | 'SPHERON';

// Deployment Types
export enum ServiceType {
  JUPYTER = 'JUPYTER',
  BACKEND = 'BACKEND'
}

export interface Deployment {
  /** @deprecated Use id instead */
  leaseId?: number | null;
  id: string;
  appUrl: string | null;
  createdAt: string;
  provider: string;
  serviceType: string;
  image: string;
  cpu: number;
  memory: string;
  storage: string;
  duration: string;
}

export interface GetDeploymentsResponse {
  userId: number;
  deployments: Deployment[];
}

export interface GetDeploymentsRequest {
  user: number;
  type?: ServiceType | null;
} 