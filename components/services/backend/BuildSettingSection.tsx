"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Code, Package } from "lucide-react";

interface BuildSettingSectionProps {
  buildCommand: string;
  setBuildCommand: (command: string) => void;
  startCommand: string;
  setStartCommand: (command: string) => void;
  portNumber: number;
  setPortNumber: (number: number) => void;
}

export default function BuildSettingSection({
  buildCommand,
  setBuildCommand,
  startCommand,
  setStartCommand,
  portNumber,
  setPortNumber,
}: BuildSettingSectionProps) {
  return (
    <div className="dashboard-card mb-8">
      <h3 className="text-lg font-medium mb-4">Build & Runtime Settings</h3>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label
              htmlFor="build-command"
              className="text-sm text-muted-foreground mb-1 block"
            >
              Build Command
            </Label>
            <div className="relative">
              <Code className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="build-command"
                placeholder="npm run build"
                value={buildCommand}
                onChange={(e) => setBuildCommand(e.target.value)}
                className="bg-secondary/10 border-border/30 focus:border-primary/50 pl-10"
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="start-command"
              className="text-sm text-muted-foreground mb-1 block"
            >
              Start Command
            </Label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="start-command"
                placeholder="npm start"
                value={startCommand}
                onChange={(e) => setStartCommand(e.target.value)}
                className="bg-secondary/10 border-border/30 focus:border-primary/50 pl-10"
              />
            </div>
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
      </div>
    </div>
  );
}
