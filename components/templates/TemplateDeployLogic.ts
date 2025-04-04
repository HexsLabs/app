import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { getProviderFromEnv } from "@/lib/utils";
import { apiService } from "@/services/apiService";
import { TemplateDetails } from "./TemplateDetailsCard";

export interface User {
  id: string;
}

interface UseTemplateDeployProps {
  templateDetails: TemplateDetails;
  user: User | null;
  isAuthLoading: boolean;
}

export function useTemplateDeploy({
  templateDetails,
  user,
  isAuthLoading,
}: UseTemplateDeployProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeploying, setIsDeploying] = useState(false);

  const handleDeploy = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to deploy a template.",
        variant: "destructive",
      });
      return;
    }

    setIsDeploying(true);
    try {
      const data = {
        userId: user.id,
        repoUrl: templateDetails["Repository URL"],
        branchName: templateDetails["Branch Name"],
        env: {},
        config: {
          appPort: Number(templateDetails["App Port"]),
          deploymentDuration: templateDetails["Deployment Duration"],
          appCpuUnits: Number(templateDetails["CPU Units"]),
          appMemorySize: templateDetails["Memory Size"],
          appStorageSize: templateDetails["Storage Size"],
          runCommands: templateDetails["Run Commands"] || "",
        },
        provider: getProviderFromEnv(),
      };

      const response = await apiService.deployDefaultBackend(data);

      toast({
        title: "Success",
        description: "Template deployed successfully!",
        variant: "default",
      });

      // Navigate to deployments page to see the new deployment
      router.push("/app/dashboard");
    } catch (error) {
      console.error("Error deploying template:", error);
      toast({
        title: "Error",
        description: "Failed to deploy template. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return {
    isDeploying,
    handleDeploy,
    isButtonDisabled: isAuthLoading || !user?.id || isDeploying,
  };
}
