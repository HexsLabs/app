'use client';

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info } from 'lucide-react';
import { DeploymentForm } from '@/components/DeploymentForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
}

type Unit = 'Mi' | 'Gi';

interface State {
  isPrivate: boolean;
  cpuValue: number;
  isGpuEnabled: boolean;
  gpuValue: number;
  memoryValue: number;
  memoryUnit: Unit;
  ephemeralValue: number;
  ephemeralUnit: Unit;
  isPersistentEnabled: boolean;
  persistentValue: number;
  persistentUnit: Unit;
  persistentName: string;
  persistentType: string;
  persistentMount: string;
  persistentReadOnly: boolean;
}

const CustomSlider: React.FC<SliderProps> = ({ value, onChange }) => {
  return (
    <div className="relative w-full h-2 bg-secondary rounded-full cursor-pointer" onClick={(e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const position = (e.clientX - rect.left) / rect.width;
      onChange(Math.min(Math.max(position, 0), 1));
    }}>
      <div 
        className="absolute h-full bg-primary rounded-full transition-all" 
        style={{ width: `${value * 100}%` }}
      />
      <div 
        className="absolute top-1/2 w-4 h-4 -mt-2 -ml-2 bg-primary rounded-full border-2 border-background cursor-grab active:cursor-grabbing transition-all"
        style={{ left: `${value * 100}%` }}
      />
    </div>
  );
};

const SDLBuilder: React.FC = () => {
  const [values, setValues] = React.useState<State>({
    isPrivate: false,
    cpuValue: 87,
    isGpuEnabled: false,
    gpuValue: 1,
    memoryValue: 512,
    memoryUnit: 'Mi',
    ephemeralValue: 1,
    ephemeralUnit: 'Gi',
    isPersistentEnabled: false,
    persistentValue: 10,
    persistentUnit: 'Gi',
    persistentName: 'data',
    persistentType: 'ssd',
    persistentMount: '/mnt/data',
    persistentReadOnly: false
  });

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Create Deployment</h1>
      </div>

      <Tabs defaultValue="quick" className="w-full mb-8">
        <TabsList className="mb-6 bg-secondary">
          <TabsTrigger value="quick" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Quick Deployment
          </TabsTrigger>
          {/* <TabsTrigger value="advanced" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Advanced (SDL Builder)
          </TabsTrigger> */}
        </TabsList>
        
        <TabsContent value="quick" className="gradient-border card-shadow">
          <div className="gradient-bg p-8 rounded-3xl">
            <h2 className="text-2xl font-semibold mb-6">Create Quick Deployment</h2>
            <DeploymentForm userId={5} />
          </div>
        </TabsContent>
      
      </Tabs>
      <Toaster />
    </div>
  );
};

export default SDLBuilder; 