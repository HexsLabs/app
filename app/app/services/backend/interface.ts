import { Unit } from "@/constants/constrains";

export interface DeploymentOption {
  title: string;
  description: string;
  icon: React.ReactNode;
  resources: string[];
  free?: boolean;
}

export interface ResourceValueOptions {
  cpuValue: string;
  memoryValue: number;
  memoryUnit: Unit;
  ephemeralValue: number;
  ephemeralUnit: Unit;
  deploymentDuration: number; // Now in hours
}
