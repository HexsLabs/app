'use client';

import { useCallback, useEffect, useState } from 'react';
import JupyterDeployment from '@/components/services/jupyter/JupyterDeployment';
import { api } from '../../../../lib/api';
import { Deployment, ServiceType, ProviderType } from '../../../../services/types';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/lib/auth/AuthContext';

export default function JupyterPage() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading: authLoading } = useAuth();


  const fetchDeployments = useCallback(async () => {
    if (!user?.id) {
      setError('Please sign in to view deployments');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const envProvider = process.env.NEXT_PUBLIC_PROVIDER_TO_USE as ProviderType || 'auto';
      const data = await api.getUserDeployments(user.id, ServiceType.JUPYTER, envProvider);
      // Ensure data is an array before setting it
      setDeployments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch deployments');
      setDeployments([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!authLoading) {
      fetchDeployments();
    }
  }, [authLoading, fetchDeployments]);

  const isDeploymentActive = (createdAt: string, duration: string): boolean => {
    const createdAtDate = new Date(createdAt);
    let durationSeconds = 0;
    
    if (duration.endsWith('h')) {
      durationSeconds = parseInt(duration) * 3600;
    } else if (duration.endsWith('m')) {
      durationSeconds = parseInt(duration) * 60;  
    } else if (duration.endsWith('s')) {
      durationSeconds = parseInt(duration);
    } else {
      durationSeconds = parseInt(duration) || 0;
    }
    const endTime = new Date(createdAtDate.getTime() + durationSeconds * 1000);
    const now = new Date();
    return endTime.getTime() > now.getTime();
  };

  const getStatusColor = (url: string | null, createdAt: string, duration: string) => {
    if (url && isDeploymentActive(createdAt, duration)) {
      return 'text-green-400';
    }
    if (!isDeploymentActive(createdAt, duration)) {
      return 'text-red-400';
    }
    return 'text-yellow-400';
  };

  // Calculate stats for active deployments only
  const activeDeployments = Array.isArray(deployments) ? 
    deployments.filter(d => d.appUrl !== null && isDeploymentActive(d.createdAt, d.duration)) : [];
  const activeInstances = activeDeployments.length;
  const totalDeployments = deployments.length;
  const currentCpuUsage = activeDeployments.reduce((acc, curr) => acc + curr.cpu, 0);
  const currentRamUsage = activeDeployments.reduce((acc, curr) => acc + parseInt(curr.memory), 0);

  return (
    <div className="min-h-screen bg-zinc-900/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Jupyter Notebook Deployment</h1>
          <p className="mt-2 text-zinc-400">Deploy and manage your Jupyter notebook instances</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-zinc-800/50 rounded-lg p-6">
            <h3 className="text-sm font-medium text-zinc-400">Active Instances</h3>
            <p className="mt-2 text-3xl font-semibold text-white">{activeInstances}</p>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-6">
            <h3 className="text-sm font-medium text-zinc-400">Total Deployments</h3>
            <p className="mt-2 text-3xl font-semibold text-white">{totalDeployments}</p>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-6">
            <h3 className="text-sm font-medium text-zinc-400">Current Resource Usage</h3>
            <div className="mt-2">
              <p className="text-xl font-semibold text-white">{currentCpuUsage} CPU</p>
              <p className="text-xl font-semibold text-white">{currentRamUsage} GB RAM</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Deployment Form */}
          <div className="lg:col-span-2">
            {authLoading ? (
              <div className="bg-zinc-800/50 rounded-lg p-6 text-center">
                <p className="text-zinc-400">Loading authentication...</p>
              </div>
            ) : user?.id ? (
              <JupyterDeployment onDeploymentComplete={fetchDeployments} />
            ) : (
              <div className="bg-zinc-800/50 rounded-lg p-6 text-center">
                <p className="text-zinc-400">Please sign in to deploy Jupyter notebooks</p>
              </div>
            )}

            {/* Deployments List */}
            <div className="mt-8 bg-zinc-800/50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">Recent Deployments</h3>
              {authLoading ? (
                <p className="text-zinc-400">Loading authentication...</p>
              ) : !user?.id ? (
                <p className="text-zinc-400">Please sign in to view deployments</p>
              ) : isLoading ? (
                <p className="text-zinc-400">Loading deployments...</p>
              ) : error ? (
                <p className="text-red-400">{error}</p>
              ) : deployments.length === 0 ? (
                <p className="text-zinc-400">No deployments found</p>
              ) : (
                <div className="space-y-4">
                  {deployments.map((deployment) => (
                    <div
                      key={deployment.deploymentId}
                      className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-700"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-white font-medium">
                            Instance {deployment.deploymentId}
                          </h4>
                          <p className={`text-sm ${getStatusColor(deployment.appUrl, deployment.createdAt, deployment.duration)}`}>
                            {isDeploymentActive(deployment.createdAt, deployment.duration) ? 'Running' : 'Closed'}
                          </p>
                          <p className="text-sm text-zinc-400 mt-1">
                            Created {formatDistanceToNow(new Date(deployment.createdAt))} ago
                          </p>
                        </div>
                        {deployment.appUrl && (
                          // TODO add unique token logic here, instead of hardcoding the password
                          <a
                            href={`${deployment.appUrl}?token=password`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-sm"
                          >
                            Open Notebook
                          </a>
                        )}
                      </div>
                      <div className="mt-2 text-sm text-zinc-400">
                        <p>
                          CPU: {deployment.cpu} units | Memory: {deployment.memory} | Storage: {deployment.storage}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-zinc-800/50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={fetchDeployments}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Refresh Deployments
                </button>
              </div>
            </div>

            {/* Resource Limits */}
            <div className="bg-zinc-800/50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">Resource Limits</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-zinc-400 mb-1">
                    <span>CPU Usage</span>
                    <span>{currentCpuUsage}/20 cores</span>
                  </div>
                  <div className="h-2 bg-zinc-700 rounded">
                    <div
                      className="h-full bg-blue-600 rounded"
                      style={{ width: `${Math.min((currentCpuUsage / 4) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-zinc-400 mb-1">
                    <span>Active Instances</span>
                    <span>{activeInstances}/20</span>
                  </div>
                  <div className="h-2 bg-zinc-700 rounded">
                    <div
                      className="h-full bg-blue-600 rounded"
                      style={{ width: `${(activeInstances / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-zinc-800/50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {deployments.slice(0, 3).map((deployment) => (
                  <div key={deployment.deploymentId} className="text-sm">
                    <p className="text-zinc-300">
                      Instance {deployment.deploymentId} {deployment.appUrl ? 'running' : 'pending'}
                    </p>
                    <p className="text-zinc-500">
                      {formatDistanceToNow(new Date(deployment.createdAt))} ago
                    </p>
                  </div>
                ))}
                {deployments.length === 0 && (
                  <p className="text-zinc-400 text-sm">No recent activity</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 