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
export interface DeployDefaultBackendRequest {
    userId: number;
    repoUrl?: string;
    branchName?: string;
    env?: Record<string, string>;
    config: {
        appPort: number;
        deploymentDuration?: string;
        appCpuUnits?: number;
        appMemorySize?: string;
        appStorageSize?: string;
        runCommands?: string;
    };
    provider?: ProviderType;
}

export interface DeployCustomBackendRequest {
  userId: number;
  repoUrl?: string;
  branchName?: string;
  env?: Record<string, string>;
  config: DeploymentConfig;
  provider?: ProviderType;
}

// Common Services Types
export interface DeploymentConfig {
    appPort: number;
    deploymentMode?: string;
    deploymentDuration: string;
    appCpuUnits: number;
    appMemorySize: string;
    appStorageSize: string;
    image?: string | null;
    runCommands?: string;
}

export interface EnvironmentVars {
  [key: string]: string;
}

export interface DeploymentResponse {
  status: string;
  deploymentId?: string;
  url?: string;
}

export type ProviderType = "auto" | "akash" | "spheron";

export enum ServiceType {
  JUPYTER = "JUPYTER",
  BACKEND = "BACKEND",
}

export interface Deployment {
  deploymentId: string;
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
  user: string;
  type?: ServiceType | null;
  provider?: ProviderType | null;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

export interface ChatResponse {
  text: string;
  error?: string;
}
