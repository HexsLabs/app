import { useState } from 'react';
import { api } from '../lib/api';
import { DeployBackendRequest, DeploymentConfig, ProviderType } from '../lib/types';

export default function BackendDeployment() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [envVars, setEnvVars] = useState<{ key: string; value: string }[]>([{ key: '', value: '' }]);

  const handleDeploy = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Build environment variables object
    const env: Record<string, string> = {};
    envVars.forEach(({ key, value }) => {
      if (key && value) {
        env[key] = value;
      }
    });

    const config: DeploymentConfig = {
      appPort: Number(formData.get('appPort')),
      deploymentMode: formData.get('deploymentMode') as string || undefined,
      deploymentDuration: formData.get('deploymentDuration') as string,
      appCpuUnits: Number(formData.get('appCpuUnits')),
      appMemorySize: formData.get('appMemorySize') as string,
      appStorageSize: formData.get('appStorageSize') as string,
      image: formData.get('image') as string,
    };

    const data: DeployBackendRequest = {
      userId: 1, // Replace with actual user ID
      repoUrl: formData.get('repoUrl') as string || undefined,
      branchName: formData.get('branchName') as string || undefined,
      env: Object.keys(env).length > 0 ? env : undefined,
      config,
      provider: formData.get('provider') as ProviderType || undefined,
    };

    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      
      const response = await api.deployBackend(data);
      setSuccess(`${response.status} - ${response.url ? `Deployed at ${response.url}` : ''}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deploy backend service');
    } finally {
      setIsLoading(false);
    }
  };

  const addEnvVar = () => {
    setEnvVars([...envVars, { key: '', value: '' }]);
  };

  const updateEnvVar = (index: number, field: 'key' | 'value', value: string) => {
    const newEnvVars = [...envVars];
    newEnvVars[index][field] = value;
    setEnvVars(newEnvVars);
  };

  const removeEnvVar = (index: number) => {
    setEnvVars(envVars.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow">
      <div>
        <h2 className="text-2xl font-bold mb-4">Deploy Backend Service</h2>
        
        <form onSubmit={handleDeploy} className="space-y-4">
          {/* Repository Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Repository Information</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Repository URL (Optional)</label>
              <input
                type="text"
                name="repoUrl"
                placeholder="https://github.com/username/repo"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Branch Name</label>
              <input
                type="text"
                name="branchName"
                placeholder="main"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>

          {/* Deployment Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Deployment Configuration</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Application Port</label>
              <input
                type="number"
                name="appPort"
                required
                min="1"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Deployment Mode (Optional)</label>
              <input
                type="text"
                name="deploymentMode"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Deployment Duration</label>
              <input
                type="text"
                name="deploymentDuration"
                required
                placeholder="e.g., 1h"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">CPU Units</label>
              <input
                type="number"
                name="appCpuUnits"
                required
                min="1"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Memory Size</label>
              <input
                type="text"
                name="appMemorySize"
                required
                placeholder="e.g., 2Gi"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Storage Size</label>
              <input
                type="text"
                name="appStorageSize"
                required
                placeholder="e.g., 10Gi"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Docker Image</label>
              <input
                type="text"
                name="image"
                required
                placeholder="e.g., nginx:latest"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>

          {/* Environment Variables */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Environment Variables</h3>
            {envVars.map((envVar, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={envVar.key}
                  onChange={(e) => updateEnvVar(index, 'key', e.target.value)}
                  placeholder="Key"
                  className="flex-1 px-3 py-2 border rounded"
                />
                <input
                  type="text"
                  value={envVar.value}
                  onChange={(e) => updateEnvVar(index, 'value', e.target.value)}
                  placeholder="Value"
                  className="flex-1 px-3 py-2 border rounded"
                />
                <button
                  type="button"
                  onClick={() => removeEnvVar(index)}
                  className="px-3 py-2 text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addEnvVar}
              className="text-blue-500 hover:text-blue-700"
            >
              + Add Environment Variable
            </button>
          </div>

          {/* Provider Selection */}
          <div>
            <label className="block text-sm font-medium mb-1">Provider</label>
            <select
              name="provider"
              className="w-full px-3 py-2 border rounded"
            >
              <option value="AUTO">Auto</option>
              <option value="AKASH">Akash</option>
              <option value="SPHERON">Spheron</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {isLoading ? 'Deploying...' : 'Deploy Backend Service'}
          </button>
        </form>

        {/* Status Messages */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
            {success}
          </div>
        )}
      </div>
    </div>
  );
} 