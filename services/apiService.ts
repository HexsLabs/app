import { getProviderFromEnv } from "@/lib/utils";
import {
  DeployCustomBackendRequest,
  DeployDefaultBackendRequest,
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
  ChatRequest,
  ChatResponse,
  ChatMessage,
} from "./types";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3080";

// User response interface
interface UserResponse {
  message: string;
  user: number;
}

class ApiService {
  private accessToken: string | null = null;

  public setAccessToken(token: string | null) {
    console.log("setting accessToken", token);
    this.accessToken = token;
  }

  public async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    console.log("accessToken", this.accessToken);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(this.accessToken && {
          Authorization: `Bearer ${this.accessToken}`,
        }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "An unknown error occurred" }));
      throw new Error(error.message || "An error occurred");
    }

    return response.json();
  }

  // User Management
  async createUser(address: string): Promise<UserResponse> {
    return this.request<UserResponse>("/api/user/register", {
      method: "POST",
      body: JSON.stringify({ address }),
    });
  }

  // Jupyter Services
  async deployDefaultJupyter(
    data: DeployDefaultJupyterRequest
  ): Promise<DeploymentResponse> {
    return this.request<DeploymentResponse>(
      "/api/services/jupyter/deploy-default",
      {
        method: "POST",
        body: JSON.stringify({
          ...data,
        }),
      }
    );
  }

  async deployCustomJupyter(
    data: DeployCustomJupyterRequest
  ): Promise<DeploymentResponse> {
    return this.request<DeploymentResponse>(
      "/api/services/jupyter/deploy-custom",
      {
        method: "POST",
        body: JSON.stringify({
          ...data,
        }),
      }
    );
  }

  // Backend Services
  async deployDefaultBackend(
    data: DeployDefaultBackendRequest
  ): Promise<DeploymentResponse> {
    return this.request<DeploymentResponse>(
      "/api/services/backend/deploy-default",
      {
        method: "POST",
        body: JSON.stringify({
          ...data,
        }),
      }
    );
  }

  // Backend Services
  async deployCustomBackend(
    data: DeployCustomBackendRequest
  ): Promise<DeploymentResponse> {
    return this.request<DeploymentResponse>(
      "/api/services/backend/deploy-custom",
      {
        method: "POST",
        body: JSON.stringify({
          ...data,
        }),
      }
    );
  }

  // Create a new deployment
  async createDeployment(
    user: string,
    repoUrl: string,
    branchName: string,
    config: DeploymentConfig,
    env: EnvironmentVars
  ): Promise<Deployment> {
    return this.request<Deployment>("/api/services/backend/deploy-custom", {
      method: "POST",
      body: JSON.stringify({
        repoUrl,
        branchName,
        config,
        env,
        provider: getProviderFromEnv(),
      }),
    });
  }

  // Deployment Services
  async getUserDeployments(
    user: string,
    type?: ServiceType,
    provider?: ProviderType
  ): Promise<Deployment[]> {
    return this.request<GetDeploymentsResponse>("/api/deployments/user", {
      method: "POST",
      body: JSON.stringify({
        user,
        type: type || null,
        provider: provider || null,
      } as GetDeploymentsRequest),
    }).then((response) => {
      return response.deployments;
    });
  }

  // Get deployment by ID
  async getDeploymentById(deploymentId: number): Promise<Deployment> {
    return this.request<Deployment>(`/api/deployments/${deploymentId}`);
  }

  // Get service instances by type
  async getServiceInstances(type: string): Promise<any[]> {
    return this.request<any[]>("/api/deployments/service-instances", {
      method: "POST",
      body: JSON.stringify({ type }),
    });
  }

  // Close a deployment
  async closeDeployment(deploymentId: number): Promise<void> {
    return this.request<void>("/api/deployments/close", {
      method: "POST",
      body: JSON.stringify({ deploymentId }),
    });
  }

  // Get user deployments by type
  async getUserDeploymentsByType(
    userId: string,
    type: string,
    provider?: ProviderType
  ): Promise<Deployment[]> {
    return this.request<Deployment[]>("/api/deployments/user", {
      method: "POST",
      body: JSON.stringify({
        userId,
        type,
        provider: provider || null,
      }),
    });
  }

  // AI Chat Services
  async sendChatMessage(
    request: ChatRequest,
    onStream?: (text: string) => void
  ): Promise<ChatResponse> {
    if (onStream) {
      // Streaming request
      const response = await fetch(`${API_BASE_URL}/api/ai/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(this.accessToken && {
            Authorization: `Bearer ${this.accessToken}`,
          }),
        },
        body: JSON.stringify({
          ...request,
          stream: true,
        }),
      });

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ message: "An unknown error occurred" }));
        throw new Error(error.message || "An error occurred");
      }

      if (!response.body) {
        throw new Error("Response body is null");
      }

      // Process the stream using the ReadableStream API
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accumulatedText = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          // Decode the chunk and add to buffer
          buffer += decoder.decode(value, { stream: true });
          
          // Process complete lines in the buffer
          const lines = buffer.split('\n');
          // Keep the last potentially incomplete line in the buffer
          buffer = lines.pop() || '';
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.substring(6).trim();
              
              if (data === '[DONE]') {
                return { text: accumulatedText };
              }
              
              // Skip empty data
              if (!data) {
                continue;
              }
              
              try {
                // Ensure we're parsing valid JSON
                const parsed = JSON.parse(data);
                if (parsed.choices && 
                    parsed.choices[0]) {
                  const deltaContent = parsed.choices[0]?.delta?.content || '';
                  if (deltaContent) {
                    accumulatedText += deltaContent;
                    onStream(deltaContent);
                  }
                }
              } catch (e) {
                console.error('Error parsing SSE data:', e, data);
                // Continue processing other chunks instead of breaking
                continue;
              }
            }
          }
        }
      } catch (error) {
        console.error('Stream reading error:', error);
        throw error;
      } finally {
        reader.releaseLock();
      }

      return { text: accumulatedText };
    } else {
      // Non-streaming request
      return this.request<ChatResponse>("/api/ai/chat/completions", {
        method: "POST",
        body: JSON.stringify({
          ...request,
          stream: false,
        }),
      });
    }
  }

  async getChatHistory(): Promise<ChatMessage[]> {
    // Since the backend doesn't have a history endpoint yet,
    // we'll return an empty array for now
    return [];
  }

  async clearChatHistory(): Promise<void> {
    // Since the backend doesn't have a clear history endpoint yet,
    // we'll do nothing for now
    return;
  }
}

export const apiService = new ApiService();
