import { DeploymentOption } from "./interface";
import { Server, Settings2 } from "lucide-react";

export const deploymentOptions: DeploymentOption[] = [
  {
    title: "Standard Deployment",
    description:
      "Quick deployment with preset configuration for most backend services",
    icon: <Server className="h-6 w-6 text-primary" />,
    resources: ["0.5 CPU", "512Mi Memory", "1Gi Storage"],
    recommended: true,
  },
  {
    title: "Custom Deployment",
    description: "Fine-tune all deployment settings for specific requirements",
    icon: <Settings2 className="h-6 w-6 text-primary" />,
    resources: ["Custom Resources", "Advanced Configuration", "Full Control"],
  },
];
