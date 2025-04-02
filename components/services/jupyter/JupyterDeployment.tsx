import { useState } from 'react';
import { api } from '../../../lib/api';
import { DeployCustomJupyterRequest, ProviderType } from '../../../services/types';
import { useAuth } from '@/lib/auth/AuthContext';

interface JupyterDeploymentProps {
  onDeploymentComplete?: () => void;
}

export default function JupyterDeployment({ onDeploymentComplete }: JupyterDeploymentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<ProviderType>(
    (process.env.NEXT_PUBLIC_PROVIDER_TO_USE as ProviderType) || 'auto'
  );
  const { user } = useAuth();

  if (!user?.id) {
    return (
      <div className="p-6 bg-zinc-800/50 rounded-lg text-center">
        <p className="text-zinc-400">You must be logged in to deploy Jupyter notebooks</p>
      </div>
    );
  }

  const userId = parseInt(user.id);

  const handleDefaultDeploy = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      
      const response = await api.deployDefaultJupyter({ 
        userId: userId,
        provider: selectedProvider
      });
      setSuccess(response.status);
      onDeploymentComplete?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deploy Jupyter notebook');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomDeploy = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Get raw values
    const memorySize = formData.get('memorySize') as string;
    const storageSize = formData.get('storageSize') as string;
    const duration = formData.get('duration') as string;

    // Validate duration format and range
    const durationValue = parseInt(duration);
    const durationUnit = duration.slice(-1);
    const durationInMinutes = durationUnit === 'h' ? durationValue * 60 : durationValue;

    if (durationInMinutes < 60 || durationInMinutes > 720) {
      setError('Duration must be between 1h and 12h');
      return;
    }

    // Add Gi suffix if not present
    const formatSize = (size: string) => {
      const numericValue = size.replace(/[^0-9]/g, '');
      return `${numericValue}Gi`;
    };

    const data: DeployCustomJupyterRequest = {
      userId: userId,
      cpuUnits: Number(formData.get('cpuUnits')),
      memorySize: formatSize(memorySize),
      storageSize: formatSize(storageSize),
      duration: duration,
      image: formData.get('image') as string || undefined,
      provider: selectedProvider
    };

    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      
      const response = await api.deployCustomJupyter(data);
      setSuccess(response.status);
      onDeploymentComplete?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deploy custom Jupyter notebook');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-zinc-800/50 rounded-lg">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Deploy Instance</h2>
        
        {process.env.NEXT_PUBLIC_PROVIDER_TO_USE && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-zinc-300 mb-1">Provider</label>
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value as ProviderType)}
            className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="AUTO">Auto (Default)</option>
            <option value={process.env.NEXT_PUBLIC_PROVIDER_TO_USE}>
              {process.env.NEXT_PUBLIC_PROVIDER_TO_USE}
            </option>
          </select>
        </div>
        )}
        {/* Default Deployment */}
        <div className="mb-12 p-6 border border-zinc-700 rounded-lg">
          <h3 className="text-xl font-semibold text-zinc-200 mb-3">Quick Deploy</h3>
          <div className="mb-6 space-y-2">
            <p className="text-sm text-zinc-400">Pre-configured instance with:</p>
            <ul className="text-sm text-zinc-400 list-disc list-inside">
              <li>CPU: 1 units</li>
              <li>Memory: 1Gi</li>
              <li>Storage: 5Gi</li>
            </ul>
          </div>
          <button
            onClick={handleDefaultDeploy}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Deploying...' : 'Deploy Default Instance'}
          </button>
        </div>

        {/* Custom Deployment Form */}
        <div className="p-6 border border-zinc-700 rounded-lg">
          <h3 className="text-xl font-semibold text-zinc-200 mb-4">Custom Deploy</h3>
          <p className="text-sm text-zinc-400 mb-6">Configure your own instance specifications</p>
          <form onSubmit={handleCustomDeploy} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">CPU Units</label>
              <input
                type="number"
                name="cpuUnits"
                required
                min="1"
                placeholder="Enter CPU units"
                className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Memory Size (Gi)</label>
              <input
                type="number"
                name="memorySize"
                required
                min="1"
                placeholder="e.g., 2"
                className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Storage Size (Gi)</label>
              <input
                type="number"
                name="storageSize"
                required
                min="1"
                placeholder="e.g., 10"
                className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Duration (1h to 12h)</label>
              <input
                type="text"
                name="duration"
                required
                pattern="^([1-9]h|1[0-2]h)$"
                placeholder="e.g., 1h or 12h"
                title="Enter duration between 1h to 12h"
                className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Custom Image (Optional)</label>
              <input
                type="text"
                name="image"
                placeholder="Docker image URL"
                className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div> */}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Deploying...' : 'Deploy Custom Instance'}
            </button>
          </form>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mt-4 p-3 bg-red-900/50 text-red-200 rounded border border-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 p-3 bg-green-900/50 text-green-200 rounded border border-green-700">
            {success}
          </div>
        )}
      </div>
    </div>
  );
}