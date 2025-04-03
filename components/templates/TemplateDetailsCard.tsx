import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface TemplateDetails {
  [key: string]: string;
}

interface TemplateDetailsCardProps {
  templateDetails: TemplateDetails;
  isDeploying: boolean;
  onDeploy: () => void;
  disabled?: boolean;
}

export default function TemplateDetailsCard({
  templateDetails,
  isDeploying,
  onDeploy,
  disabled = false,
}: TemplateDetailsCardProps) {
  return (
    <div className="dashboard-card subtle-glow">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Configuration</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {Object.entries(templateDetails).map(([key, value]) => (
            <div
              key={key}
              className="p-4 rounded-lg bg-secondary/5 border border-border/30"
            >
              <p className="text-xs text-muted-foreground mb-1">{key}</p>
              <p className="text-sm font-medium font-mono break-all">{value}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <Button
            size="lg"
            className="btn-primary shadow-lg shadow-primary/10 hover-effect"
            onClick={onDeploy}
            disabled={disabled || isDeploying}
          >
            {isDeploying ? (
              <span className="animate-pulse">Deploying...</span>
            ) : (
              <>
                Deploy Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
