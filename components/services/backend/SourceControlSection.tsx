"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GitBranch } from "lucide-react";
import { Unit } from "@/constants/constrains";
interface State {
  isPrivate: boolean;
  cpuValue: string;
  isGpuEnabled: boolean;
  gpuValue: number;
  memoryValue: number;
  memoryUnit: Unit;
  ephemeralValue: number;
  ephemeralUnit: Unit;
  deploymentDuration: number; // Now in hours
}

interface SourceControlSectionProps {
  repoUrl: string;
  setRepoUrl: (url: string) => void;
  branchName: string;
  setBranchName: (name: string) => void;
  portNumber: number;
  setPortNumber: (number: number) => void;
}

export function SourceControlSection({
  repoUrl,
  setRepoUrl,
  branchName,
  setBranchName,
  portNumber,
  setPortNumber,
}: SourceControlSectionProps) {
  return (
    <div className="dashboard-card mb-8">
      <h3 className="text-lg font-medium mb-4">Source Control</h3>
      <div className="space-y-6">
        <div>
          <Label
            htmlFor="repo-url"
            className="text-sm text-muted-foreground mb-1 block"
          >
            Repository URL
          </Label>
          <Input
            id="repo-url"
            placeholder="https://github.com/username/repository"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            className="bg-secondary/10 border-border/30 focus:border-primary/50"
          />
          <p className="text-xs text-muted-foreground mt-1">
            URL to your Git repository (GitHub, GitLab, Bitbucket, etc.)
          </p>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <Label
              htmlFor="branch"
              className="text-sm text-muted-foreground mb-1 block"
            >
              Branch
            </Label>
            <div className="relative">
              <GitBranch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="branch"
                placeholder="main"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                className="bg-secondary/10 border-border/30 focus:border-primary/50 pl-10"
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="port"
              className="text-sm text-muted-foreground mb-1 block"
            >
              Port
            </Label>
            <Input
              id="port"
              type="number"
              placeholder="3000"
              value={portNumber}
              onChange={(e) => setPortNumber(parseInt(e.target.value))}
              className="bg-secondary/10 border-border/30 focus:border-primary/50 max-w-xs"
            />
            <p className="text-xs text-muted-foreground mt-1">
              The port your application will listen on
            </p>
          </div>

          {/* <div className="flex-1">
         <Label
           htmlFor="deployment-name"
           className="text-sm text-muted-foreground mb-1 block"
         >
           Deployment Name
         </Label>
         <Input
           id="deployment-name"
           placeholder="my-backend-service"
           value={deploymentName}
           onChange={(e) => setDeploymentName(e.target.value)}
           className="bg-secondary/10 border-border/30 focus:border-primary/50"
         />
       </div> */}
        </div>
      </div>
    </div>
  );
}

export default SourceControlSection;
