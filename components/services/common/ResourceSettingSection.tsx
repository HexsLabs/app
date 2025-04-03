import React from "react";
import {
  CPU_CONSTRAINTS,
  MEMORY_CONSTRAINTS,
  DURATION_CONSTRAINTS,
} from "@/constants/constrains";

export interface ResourceValueOptions {
  cpuValue: string;
  memoryValue: string | number;
  memoryUnit: string;
  ephemeralValue: number;
  ephemeralUnit: string;
  deploymentDuration: number;
}

interface ResourceSettingSectionProps {
  values: ResourceValueOptions;
  setValues: React.Dispatch<React.SetStateAction<ResourceValueOptions>>;
}

export default function ResourceSettingSection({
  values,
  setValues,
}: ResourceSettingSectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium mb-1">Resource Settings</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            CPU Units
          </label>
          <select
            className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            onChange={(e) =>
              setValues({
                ...values,
                cpuValue: e.target.value,
              })
            }
            value={values.cpuValue}
          >
            <option value={String(CPU_CONSTRAINTS.MIN)}>
              {CPU_CONSTRAINTS.MIN} CPU
            </option>
            <option value={String(CPU_CONSTRAINTS.DEFAULT)}>
              {CPU_CONSTRAINTS.DEFAULT} CPU (Default)
            </option>
            <option value={String(CPU_CONSTRAINTS.MAX)}>
              {CPU_CONSTRAINTS.MAX} CPU
            </option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Memory
          </label>
          <div className="flex">
            <input
              type="number"
              className="flex h-9 w-full rounded-l-md border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              min={MEMORY_CONSTRAINTS.MIN_MI}
              max={MEMORY_CONSTRAINTS.MAX_MI}
              value={values.memoryValue}
              onChange={(e) =>
                setValues({
                  ...values,
                  memoryValue: e.target.value,
                })
              }
            />
            <select
              className="h-9 rounded-r-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              value={values.memoryUnit}
              onChange={(e) =>
                setValues({
                  ...values,
                  memoryUnit: e.target.value,
                })
              }
            >
              <option value="Mi">Mi</option>
              <option value="Gi">Gi</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Storage
          </label>
          <div className="flex">
            <input
              type="number"
              className="flex h-9 w-full rounded-l-md border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              min="1"
              max="100"
              value={values.ephemeralValue}
              onChange={(e) =>
                setValues({
                  ...values,
                  ephemeralValue: Number(e.target.value),
                })
              }
            />
            <select
              className="h-9 rounded-r-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              value={values.ephemeralUnit}
              onChange={(e) =>
                setValues({
                  ...values,
                  ephemeralUnit: e.target.value,
                })
              }
            >
              <option value="Mi">Mi</option>
              <option value="Gi">Gi</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Deployment Duration
          </label>
          <select
            className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={values.deploymentDuration}
            onChange={(e) =>
              setValues({
                ...values,
                deploymentDuration: Number(e.target.value),
              })
            }
          >
            <option value={DURATION_CONSTRAINTS.MIN_HOURS}>
              {DURATION_CONSTRAINTS.MIN_HOURS}h (Minimum)
            </option>
            <option value={DURATION_CONSTRAINTS.DEFAULT_HOURS}>
              {DURATION_CONSTRAINTS.DEFAULT_HOURS}h (Default)
            </option>
            <option value={DURATION_CONSTRAINTS.MAX_HOURS}>
              {DURATION_CONSTRAINTS.MAX_HOURS}h (Maximum)
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}
