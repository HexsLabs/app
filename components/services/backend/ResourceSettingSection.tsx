"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CPU_CONSTRAINTS,
  MEMORY_CONSTRAINTS,
  DURATION_CONSTRAINTS,
  Unit,
} from "@/constants/constrains";
import { useState } from "react";
import { ResourceValueOptions } from "@/app/app/services/backend/interface";

interface ResourceSettingSectionProps {
  values: ResourceValueOptions;
  setValues: (values: ResourceValueOptions) => void;
}

export default function ResourceSettingSection({
  values,
  setValues,
}: ResourceSettingSectionProps) {
  const [cpuError, setCpuError] = useState("");
  const [memoryError, setMemoryError] = useState("");
  const [durationError, setDurationError] = useState("");

  const validateMemory = (value: number, unit: Unit) => {
    if (isNaN(value) || value === null) {
      setMemoryError("Memory value is required");
      return false;
    }

    const valueInGi = unit === "Mi" ? value / 1024 : value;
    if (valueInGi > MEMORY_CONSTRAINTS.MAX_GI) {
      setMemoryError(`Memory cannot exceed ${MEMORY_CONSTRAINTS.MAX_GI}Gi`);
      return false;
    }

    const minValue =
      unit === "Mi" ? MEMORY_CONSTRAINTS.MIN_MI : MEMORY_CONSTRAINTS.MIN_GI;
    if (value < minValue) {
      setMemoryError(`Memory must be at least ${minValue}${unit}`);
      return false;
    }

    setMemoryError("");
    return true;
  };

  const validateCpu = (value: number) => {
    if (isNaN(value) || value === null) {
      setCpuError("CPU value is required");
      return false;
    } else if (value < CPU_CONSTRAINTS.MIN) {
      setCpuError(`CPU must be at least ${CPU_CONSTRAINTS.MIN} cores`);
      return false;
    } else if (value > CPU_CONSTRAINTS.MAX) {
      setCpuError(`CPU cannot exceed ${CPU_CONSTRAINTS.MAX} cores`);
      return false;
    }
    setCpuError("");
    return true;
  };

  const validateDuration = (hours: number) => {
    if (isNaN(hours) || hours === null) {
      setDurationError("Duration value is required");
      return false;
    } else if (hours < DURATION_CONSTRAINTS.MIN_HOURS) {
      setDurationError(
        `Duration must be at least ${DURATION_CONSTRAINTS.MIN_HOURS} hour`
      );
      return false;
    } else if (hours > DURATION_CONSTRAINTS.MAX_HOURS) {
      setDurationError(
        `Duration cannot exceed ${DURATION_CONSTRAINTS.MAX_HOURS} hours (${
          DURATION_CONSTRAINTS.MAX_HOURS / 24
        } days)`
      );
      return false;
    }
    setDurationError("");
    return true;
  };

  return (
    <div className="dashboard-card mb-8">
      <h3 className="text-lg font-medium mb-4">Resource Settings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div>
          <Label htmlFor="cpu-value" className="text-sm font-medium mb-2 block">
            CPU Allocation
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="cpu-value"
              value={values.cpuValue}
              onChange={(e) => {
                const inputValue = e.target.value;

                const value = parseFloat(inputValue);
                if (
                  inputValue == "0." ||
                  inputValue == "0" ||
                  inputValue == ""
                ) {
                  setValues({ ...values, cpuValue: inputValue });
                  setCpuError("");
                  return;
                }

                console.log(value, inputValue);
                if (!isNaN(value)) {
                  setValues({ ...values, cpuValue: inputValue });
                  validateCpu(value);
                }
              }}
              onBlur={(e) => {
                // On blur, validate and format the number properly
                const value = parseFloat(e.target.value);
                if (isNaN(value) || value === 0) {
                  setValues({
                    ...values,
                    cpuValue: String(CPU_CONSTRAINTS.MIN),
                  });
                  setCpuError("");
                } else {
                  // Format to one decimal place when leaving the field
                  const formattedValue = parseFloat(value.toFixed(1));
                  setValues({ ...values, cpuValue: String(formattedValue) });
                  validateCpu(formattedValue);
                }
              }}
              className={`w-full h-10 text-sm bg-secondary/10 border-border/30 ${
                cpuError ? "border-red-400" : ""
              }`}
              type="text"
              placeholder={CPU_CONSTRAINTS.MIN.toString()}
            />
            <div className="bg-secondary/20 px-3 py-2 rounded-md text-sm whitespace-nowrap">
              cores
            </div>
          </div>
          {cpuError ? (
            <p className="text-xs text-red-400 mt-1.5">{cpuError}</p>
          ) : (
            <p className="text-xs text-muted-foreground mt-1.5">
              Range: {CPU_CONSTRAINTS.MIN} to {CPU_CONSTRAINTS.MAX} cores
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="memory-value"
            className="text-sm font-medium mb-2 block"
          >
            Memory Allocation
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="memory-value"
              value={values.memoryValue === 0 ? "" : values.memoryValue}
              onChange={(e) => {
                const inputValue = e.target.value;

                // Special handling for decimal inputs (only for Gi)
                if (
                  values.memoryUnit === "Gi" &&
                  (/^0\.$/.test(inputValue) || /^0\.\d*$/.test(inputValue))
                ) {
                  // Don't validate yet, just update the display value
                  const parsedValue = parseFloat(inputValue) || 0;
                  setValues({ ...values, memoryValue: parsedValue });
                  // Clear error if it's a valid decimal pattern
                  if (/^0\.\d+$/.test(inputValue) && parsedValue > 0) {
                    setMemoryError("");
                  }
                  return;
                }

                // Handle empty input
                if (inputValue === "") {
                  setValues({ ...values, memoryValue: 0 });
                  setMemoryError("Memory value is required");
                  return;
                }

                // Handle normal numbers
                const value = Number(inputValue);
                if (!isNaN(value)) {
                  setValues({ ...values, memoryValue: value });
                  validateMemory(value, values.memoryUnit);
                }
              }}
              onBlur={() => {
                // If empty on blur, set to min value
                if (values.memoryValue === 0) {
                  const minValue =
                    values.memoryUnit === "Mi"
                      ? MEMORY_CONSTRAINTS.MIN_MI
                      : MEMORY_CONSTRAINTS.MIN_GI;
                  setValues({ ...values, memoryValue: minValue });
                  setMemoryError("");
                }
              }}
              className={`w-full h-10 text-sm bg-secondary/10 border-border/30 ${
                memoryError ? "border-red-400" : ""
              }`}
              type="text"
              placeholder={
                values.memoryUnit === "Mi"
                  ? MEMORY_CONSTRAINTS.MIN_MI.toString()
                  : MEMORY_CONSTRAINTS.MIN_GI.toString()
              }
            />
            <Select
              value={values.memoryUnit}
              onValueChange={(value: Unit) => {
                // Convert value when switching units
                if (value === "Mi" && values.memoryUnit === "Gi") {
                  const newValue = Math.round(values.memoryValue * 1024);
                  setValues({
                    ...values,
                    memoryUnit: value,
                    memoryValue: newValue,
                  });
                  validateMemory(newValue, value);
                } else if (value === "Gi" && values.memoryUnit === "Mi") {
                  const newValue = parseFloat(
                    (values.memoryValue / 1024).toFixed(2)
                  );
                  setValues({
                    ...values,
                    memoryUnit: value,
                    memoryValue: newValue,
                  });
                  validateMemory(newValue, value);
                } else {
                  setValues({ ...values, memoryUnit: value });
                }
              }}
            >
              <SelectTrigger className="w-24 h-10 text-sm bg-secondary/10 border-border/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mi">Mi</SelectItem>
                <SelectItem value="Gi">Gi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {memoryError ? (
            <p className="text-xs text-red-400 mt-1.5">{memoryError}</p>
          ) : (
            <p className="text-xs text-muted-foreground mt-1.5">
              Max: {MEMORY_CONSTRAINTS.MAX_GI}Gi (
              {values.memoryUnit === "Mi"
                ? `${MEMORY_CONSTRAINTS.MAX_MI}Mi`
                : `${MEMORY_CONSTRAINTS.MAX_GI}Gi`}
              )
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <Label
            htmlFor="deployment-duration"
            className="text-sm font-medium mb-2 block"
          >
            Deployment Duration
          </Label>
          <div className="flex items-center gap-3">
            <div className="flex-1 grid grid-cols-4 gap-3">
              {DURATION_CONSTRAINTS.QUICK_SELECTIONS.map((hours) => (
                <button
                  key={hours}
                  type="button"
                  onClick={() => {
                    setValues({ ...values, deploymentDuration: hours });
                    validateDuration(hours);
                  }}
                  className={`flex items-center justify-center py-2 px-2 rounded-md border transition-all ${
                    values.deploymentDuration === hours
                      ? "bg-primary/10 border-primary/40 text-primary font-medium"
                      : "bg-secondary/10 border-border/30 hover:bg-secondary/20"
                  }`}
                >
                  {hours === 1
                    ? "1 hour"
                    : hours === 24
                    ? "1 day"
                    : hours === 72
                    ? "3 days"
                    : "7 days"}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 w-40">
              <Input
                id="deployment-duration"
                value={
                  values.deploymentDuration === 0
                    ? ""
                    : values.deploymentDuration
                }
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (inputValue === "") {
                    setValues({ ...values, deploymentDuration: 0 });
                    setDurationError("Duration value is required");
                  } else {
                    const value = parseFloat(inputValue);
                    if (!isNaN(value)) {
                      setValues({ ...values, deploymentDuration: value });
                      validateDuration(value);
                    }
                  }
                }}
                onBlur={() => {
                  // If empty on blur, set to min value
                  if (values.deploymentDuration === 0) {
                    setValues({
                      ...values,
                      deploymentDuration: DURATION_CONSTRAINTS.MIN_HOURS,
                    });
                    setDurationError("");
                  }
                }}
                className={`flex-1 h-10 text-sm bg-secondary/10 border-border/30 ${
                  durationError ? "border-red-400" : ""
                }`}
                type="text"
                placeholder={DURATION_CONSTRAINTS.MIN_HOURS.toString()}
              />
              <div className="bg-secondary/20 px-3 py-2 rounded-md text-sm whitespace-nowrap">
                hours
              </div>
            </div>
          </div>
          {durationError ? (
            <p className="text-xs text-red-400 mt-1.5">{durationError}</p>
          ) : (
            <p className="text-xs text-muted-foreground mt-1.5">
              Range: {DURATION_CONSTRAINTS.MIN_HOURS} hour to{" "}
              {DURATION_CONSTRAINTS.MAX_HOURS / 24} days (
              {DURATION_CONSTRAINTS.MAX_HOURS} hours)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
