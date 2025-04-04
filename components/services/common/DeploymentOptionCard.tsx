import React, { ReactNode } from "react";
import { Check } from "lucide-react";

interface DeploymentOptionCardProps {
  title: string;
  description: string;
  resources: string[];
  selected: boolean;
  onClick: () => void;
  free?: boolean;
  icon: ReactNode;
}

export default function DeploymentOptionCard({
  title,
  description,
  resources,
  selected,
  onClick,
  free = false,
  icon,
}: DeploymentOptionCardProps) {
  return (
    <div
      className={`dashboard-card cursor-pointer subtle-glow transition-all duration-300 ${
        selected ? "border-primary/50 bg-primary/5" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className="rounded-full p-3 bg-secondary/30 text-primary">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">{title}</h3>
            {free && (
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                free
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>

          {/* <div className="mt-4 space-y-1">
            {resources.map((resource, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Check size={14} className="text-primary" />
                <span>{resource}</span>
              </div>
            ))}
          </div> */}
        </div>

        <div className="self-center">
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              selected ? "border-primary" : "border-muted-foreground/40"
            }`}
          >
            {selected && (
              <div className="w-2.5 h-2.5 rounded-full bg-primary" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
