import { useState } from 'react';
import { createDeployment, DeploymentConfig, EnvironmentVars } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

export function DeploymentForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    userAppImage: string;
    appPort: string;
    repoUrl: string;
    branchName: string;
  }>({
    userAppImage: 'ghcr.io/akash-network/awesome-akash/consolecicd:v1',
    appPort: '3000',
    repoUrl: '',
    branchName: 'main',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const config: DeploymentConfig = {
        userAppImage: formData.userAppImage,
        appPort: parseInt(formData.appPort),
      };

      const envVars: EnvironmentVars = {
        REPO_URL: formData.repoUrl,
        BRANCH_NAME: formData.branchName,
      };

      const response = await createDeployment(config, envVars);
      
      toast({
        title: 'Success!',
        description: `Deployment created. App URL: ${response.appUrl}`,
      });

      // Reset form
      setFormData({
        userAppImage: 'ghcr.io/akash-network/awesome-akash/consolecicd:v1',
        appPort: '3000',
        repoUrl: '',
        branchName: 'main',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create deployment',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
      {/* TODO REMOVE THIS OPTION ENTIRELY */}
        {/* <div>
          <Label htmlFor="userAppImage">Docker Image</Label>
          <Input
            id="userAppImage"
            value={formData.userAppImage}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, userAppImage: e.target.value }))
            }
            placeholder="Enter Docker image URL"
            className="mt-1"
          />
        </div> */}

        <div>
          <Label htmlFor="appPort">App Port</Label>
          <Input
            id="appPort"
            type="number"
            value={formData.appPort}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, appPort: e.target.value }))
            }
            placeholder="Enter app port"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="repoUrl">Repository URL</Label>
          <Input
            id="repoUrl"
            value={formData.repoUrl}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, repoUrl: e.target.value }))
            }
            placeholder="Enter repository URL"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="branchName">Branch Name</Label>
          <Input
            id="branchName"
            value={formData.branchName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, branchName: e.target.value }))
            }
            placeholder="Enter branch name"
            className="mt-1"
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Creating Deployment...' : 'Create Deployment'}
      </Button>
    </form>
  );
} 