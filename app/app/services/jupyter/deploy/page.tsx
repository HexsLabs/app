"use client";
import JupyterDeployment from "@/components/services/jupyter/JupyterDeployment";

export default function JupyterDeployPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <JupyterDeployment />
    </div>
  );
}
