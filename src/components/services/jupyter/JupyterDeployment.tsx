import { useState } from 'react';
import { api } from '../../../lib/api';
import { DeployCustomJupyterRequest } from '../../../lib/types';

interface JupyterDeploymentProps {
  onDeploymentComplete?: () => void;
}

export default function JupyterDeployment({ onDeploymentComplete }: JupyterDeploymentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleDefaultDeploy = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      
      const response = await api.deployDefaultJupyter({ userId: 5 }); // TODO: REPLACE THIS WITH THE ACTUAL USER ID
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
    
    // TODO: REPLACE THIS WITH THE ACTUAL USER ID
    const data: DeployCustomJupyterRequest = {
      userId: 5, // Replace with actual user ID
      cpuUnits: Number(formData.get('cpuUnits')),
      memorySize: formData.get('memorySize') as string,
      storageSize: formData.get('storageSize') as string,
      duration: formData.get('duration') as string,
      image: formData.get('image') as string || undefined,
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
        
        {/* Default Deployment */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-zinc-200 mb-2">Quick Deploy</h3>
          <button
            onClick={handleDefaultDeploy}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Deploying...' : 'Deploy Default Instance'}
          </button>
        </div>

        {/* Custom Deployment Form */}
        <div>
          <h3 className="text-lg font-semibold text-zinc-200 mb-2">Custom Deploy</h3>
          <form onSubmit={handleCustomDeploy} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">CPU Units</label>
              <input
                type="number"
                name="cpuUnits"
                required
                min="1"
                className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Memory Size</label>
              <input
                type="text"
                name="memorySize"
                required
                placeholder="e.g., 2Gi"
                className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Storage Size</label>
              <input
                type="text"
                name="storageSize"
                required
                placeholder="e.g., 10Gi"
                className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Duration</label>
              <input
                type="text"
                name="duration"
                required
                placeholder="e.g., 1h"
                className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Custom Image (Optional)</label>
              <input
                type="text"
                name="image"
                placeholder="Docker image URL"
                className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

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