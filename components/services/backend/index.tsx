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
          <TabsTrigger value="advanced" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Advanced (SDL Builder)
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="quick" className="gradient-border card-shadow">
          <div className="gradient-bg p-8 rounded-3xl">
            <h2 className="text-2xl font-semibold mb-6">Create Quick Deployment</h2>
            <DeploymentForm userId={5} />
          </div>
        </TabsContent>
        
        <TabsContent value="advanced">
          <Card className="gradient-border card-shadow">
            <CardContent className="gradient-bg p-8 rounded-3xl">
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-6">
                  {/* Docker Image Section */}
                  <div className="bg-secondary/20 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-muted-foreground">Docker Image / OS</Label>
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={values.isPrivate} onCheckedChange={(checked) => setValues({...values, isPrivate: checked})} />
                        <span className="text-sm text-muted-foreground">Private</span>
                      </div>
                    </div>
                    
                    <Input 
                      placeholder="Example: mydockerimage:1.01"
                      className="bg-secondary/30 border-0 mb-4"
                    />

                    {values.isPrivate && (
                      <div className="space-y-4">
                        <Select defaultValue="docker">
                          <SelectTrigger className="bg-secondary/30 border-0">
                            <SelectValue placeholder="Docker Hub - docker.io" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="docker">Docker Hub - docker.io</SelectItem>
                          </SelectContent>
                        </Select>

                        <div className="grid grid-cols-2 gap-4">
                          <Input placeholder="Username" className="bg-secondary/30 border-0" />
                          <Input type="password" placeholder="Password" className="bg-secondary/30 border-0" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Resources Section */}
                  <div className="space-y-6">
                    {/* CPU */}
                    <div className="bg-secondary/20 p-6 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Label className="text-sm text-muted-foreground">CPU</Label>
                          <Info className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <Input 
                          value={values.cpuValue}
                          onChange={(e) => setValues({...values, cpuValue: Number(e.target.value)})}
                          className="w-20 bg-secondary/30 border-0"
                          type="number"
                        />
                      </div>
                      <CustomSlider 
                        value={values.cpuValue / 100}
                        onChange={(value) => setValues({...values, cpuValue: value * 100})}
                      />
                    </div>

                    {/* Memory */}
                    <div className="bg-secondary/20 p-6 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <Label className="text-sm text-muted-foreground">Memory</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            value={values.memoryValue}
                            onChange={(e) => setValues({...values, memoryValue: Number(e.target.value)})}
                            className="w-24 bg-secondary/30 border-0"
                            type="number"
                          />
                          <Select 
                            value={values.memoryUnit}
                            onValueChange={(value: Unit) => setValues({...values, memoryUnit: value})}
                          >
                            <SelectTrigger className="w-20 bg-secondary/30 border-0">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Mi">Mi</SelectItem>
                              <SelectItem value="Gi">Gi</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <CustomSlider 
                        value={values.memoryValue / 1024}
                        onChange={(value) => setValues({...values, memoryValue: value * 1024})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Configuration Sections */}
                  <div className="bg-secondary/20 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-sm text-muted-foreground">Environment Variables</Label>
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                        Edit
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">None</p>
                  </div>

                  <div className="bg-secondary/20 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-sm text-muted-foreground">Commands</Label>
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                        Edit
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">None</p>
                  </div>

                  <div className="bg-secondary/20 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-sm text-muted-foreground">Expose</Label>
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                        Edit
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Port: 80:80 (http)</p>
                      <p>Global: True</p>
                      <p>Accept: None</p>
                    </div>
                  </div>

                  <div className="bg-secondary/20 p-6 rounded-xl">
                    <Label className="text-sm text-muted-foreground block mb-4">Service Count</Label>
                    <Input 
                      defaultValue="1"
                      className="bg-secondary/30 border-0"
                      type="number"
                    />
                  </div>

                  <div className="bg-secondary/20 p-6 rounded-xl">
                    <Label className="text-sm text-muted-foreground block mb-4">Token</Label>
                    <Select defaultValue="AKT">
                      <SelectTrigger className="bg-secondary/30 border-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AKT">AKT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <Button className="gradient-bg text-foreground hover:opacity-90 px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
                  Create Deployment
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  );
};

export default SDLBuilder; 