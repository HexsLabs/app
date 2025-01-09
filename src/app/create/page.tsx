'use client'

import React, { useState, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info } from 'lucide-react';

type Unit = 'Mi' | 'Gi';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
}

const CustomSlider: React.FC<SliderProps> = ({ value, onChange }) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleSliderClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const slider = sliderRef.current;
    if (!slider) return;

    const rect = slider.getBoundingClientRect();
    const position = (event.clientX - rect.left) / rect.width;
    const newValue = Math.min(Math.max(Math.round(position * 10) / 10, 0), 1);
    onChange(newValue);
  };

  const handleSliderDrag = () => {
    const handleMouseMove = (e: MouseEvent) => {
      const slider = sliderRef.current;
      if (!slider) return;

      const rect = slider.getBoundingClientRect();
      const position = (e.clientX - rect.left) / rect.width;
      const newValue = Math.min(Math.max(Math.round(position * 10) / 10, 0), 1);
      onChange(newValue);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div 
      ref={sliderRef}
      className="relative w-full h-2 bg-neutral-800 rounded-full cursor-pointer"
      onClick={handleSliderClick}
    >
      <div 
        className="absolute h-full bg-red-500 rounded-full transition-all" 
        style={{ width: `${value * 100}%` }}
      />
      <div 
        className="absolute top-1/2 w-4 h-4 -mt-2 -ml-2 bg-red-500 rounded-full border-2 border-neutral-900 cursor-grab active:cursor-grabbing transition-all"
        style={{ left: `${value * 100}%` }}
        onMouseDown={handleSliderDrag}
      />
    </div>
  );
};

const SDLBuilder: React.FC = () => {
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [cpuValue, setCpuValue] = useState<number>(87);
  const [isGpuEnabled, setIsGpuEnabled] = useState<boolean>(false);
  const [gpuValue, setGpuValue] = useState<number>(1);


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
    <div className="min-h-screen bg-[#0d0a08] text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-5xl font-semibold">SDL Builder</h1>
        <Button className="bg-red-500 hover:bg-red-600 text-white">
            Save
          </Button>
      </div>
      <div className="space-x-2 mb-4">
          <Button variant="outline" className="bg-neutral-800 text-white border-neutral-700">
            Deploy
          </Button>
          <Button variant="outline" className="bg-neutral-800 text-white border-neutral-700">
            Preview
          </Button>
          <Button variant="outline" className="bg-neutral-800 text-white border-neutral-700">
            Import
          </Button>
          <Button variant="outline" className="bg-neutral-800 text-white border-neutral-700">
            Reset
          </Button>

        </div>

      <Card className="bg-[#1d1817] border-neutral-800">
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <Label className="text-sm text-gray-400">Service Name</Label>
              <Info className="w-4 h-4 ml-2 text-gray-500" />
            </div>
            <Input 
              defaultValue="service-1"
              className="bg-[#161617] border-neutral-700 text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-16">
            <div className="space-y-6 ">
              <div className="bg-[#191412] px-4 py-4 rounded-lg">
                <div className="flex items-center gap-2 mb-4 ">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-gray-400">Docker Image / OS</Label>
                    <Info className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="flex items-center gap-2 ">
                    <Switch 
                      className="bg-neutral-800" 
                      checked={isPrivate}
                      onCheckedChange={setIsPrivate}
                    />
                    <span className="text-sm text-gray-400">Private</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-4 bg-neutral-900 border border-neutral-800 rounded-md p-2">
                  <img src="/docker-icon.svg" alt="Docker" className="w-6 h-6" />
                  <Input 
                    defaultValue="Example: mydockerimage:1.01"
                    className="bg-transparent border-0 text-blue-400 focus:ring-0"
                  />
                  <Button variant="ghost" className="p-1">
                    <Info className="w-4 h-4 text-gray-500" />
                  </Button>
                </div>

                {isPrivate && (
                  <>
                    <Label className="text-sm text-gray-400 block mb-2">Host</Label>
                    <Select defaultValue="docker">
                      <SelectTrigger className="bg-neutral-900 border-neutral-800 text-white mb-4">
                        <SelectValue placeholder="Docker Hub - docker.io" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="docker">Docker Hub - docker.io</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-gray-400 block mb-2">Username</Label>
                        <Input 
                          className="bg-neutral-900 border-neutral-800 text-white"
                          type="text"
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-gray-400 block mb-2">Password</Label>
                        <Input 
                          className="bg-neutral-900 border-neutral-800 text-white"
                          type="password"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-2 bg-[#191412] px-4 py-4 rounded-lg">
                <div className="flex items-center gap-2 ">
                  <div className="flex items-center">
                    <Label className="text-sm text-gray-400 flex items-center gap-2">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M4 4h16v16H4z" />
                        <path d="M9 9h6v6H9z" />
                      </svg>
                      CPU
                    </Label>
                    <Info className="w-4 h-4 ml-2 text-gray-500" />
                  </div>
                  <Input 
                    value={cpuValue}
                    onChange={(e) => setCpuValue(Number(e.target.value))}
                    className="bg-neutral-900 border-neutral-800 text-white w-20 h-8"
                    type="number"
                    min="0"
                    max="100"
                  />
                </div>
                <CustomSlider value={cpuValue / 100} onChange={(value) => setCpuValue(value * 100)} />
              </div>

              <div className="space-y-2 bg-[#191412] px-4 py-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <Label className="text-sm text-gray-400 flex items-center gap-2">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M4 4h16v16H4z" />
                        <path d="M8 8h8v8H8z" />
                        <path d="M12 6v12" />
                        <path d="M6 12h12" />
                      </svg>
                      GPU
                    </Label>
                    <Info className="w-4 h-4 ml-2 text-gray-500" />
                  </div>
                  <Switch className="bg-neutral-800" checked={isGpuEnabled} onCheckedChange={setIsGpuEnabled} />
                  {isGpuEnabled && (
                    <Input 
                      value={gpuValue}
                      onChange={(e) => setGpuValue(Number(e.target.value))}
                      className="bg-neutral-900 border-neutral-800 text-white w-20 h-8"
                      type="number"
                      min="0"
                      max="100"
                    />
                  )}
                </div>
                {isGpuEnabled && (
                  <CustomSlider value={gpuValue / 100} onChange={(value) => setGpuValue(value * 100)} />
                )}
                {isGpuEnabled && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-400 mb-2">Picking specific GPU models below, filters out providers that don&apos;t have those GPUs and may reduce the number of bids you receive.</p>
                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <Select defaultValue="">
                        <SelectTrigger className="bg-neutral-900 border-neutral-800 text-white h-8">
                          <SelectValue placeholder="Vendor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nvidia">NVIDIA</SelectItem>
                          <SelectItem value="amd">AMD</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select defaultValue="">
                        <SelectTrigger className="bg-neutral-900 border-neutral-800 text-white h-8">
                          <SelectValue placeholder="Model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rtx3080">RTX 3080</SelectItem>
                          <SelectItem value="rtx3090">RTX 3090</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Select defaultValue="">
                        <SelectTrigger className="bg-neutral-900 border-neutral-800 text-white h-8">
                          <SelectValue placeholder="Memory" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="8gb">8 GB</SelectItem>
                          <SelectItem value="16gb">16 GB</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select defaultValue="">
                        <SelectTrigger className="bg-neutral-900 border-neutral-800 text-white h-8">
                          <SelectValue placeholder="Interface" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pcie">PCIe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>

                <div className="bg-[#191412] px-4 py-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Label className="text-sm text-gray-400">Memory</Label>
                  <Info className="w-4 h-4 ml-2 text-gray-500" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Input 
                  value={values.memoryValue}
                  onChange={(e) => setValues({ ...values, memoryValue: Number(e.target.value) })}
                  className="bg-neutral-800 border-neutral-700 text-white w-24"
                  type="number"
                  />
                  <Select 
                  value={values.memoryUnit}
                  onValueChange={(value) => setValues({ ...values, memoryUnit: value as Unit })}
                  >
                  <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mi">Mi</SelectItem>
                    <SelectItem value="Gi">Gi</SelectItem>
                  </SelectContent>
                  </Select>
                </div>
                <CustomSlider 
                  value={values.memoryValue / 1024} 
                  onChange={(value) => setValues({ ...values, memoryValue: value * 1024 })} 
                />
                </div>

                <div className="bg-[#191412] px-4 py-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Label className="text-sm text-gray-400"> Storage</Label>
                  <Info className="w-4 h-4 ml-2 text-gray-500" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Input 
                  value={values.ephemeralValue}
                  onChange={(e) => setValues({ ...values, ephemeralValue: Number(e.target.value) })}
                  className="bg-neutral-800 border-neutral-700 text-white w-24"
                  type="number"
                  />
                  <Select 
                  value={values.ephemeralUnit}
                  onValueChange={(value) => setValues({ ...values, ephemeralUnit: value as Unit })}
                  >
                  <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mi">Mi</SelectItem>
                    <SelectItem value="Gi">Gi</SelectItem>
                  </SelectContent>
                  </Select>
                </div>
                <CustomSlider 
                  value={values.ephemeralValue / 1024} 
                  onChange={(value) => setValues({ ...values, ephemeralValue: value * 1024 })} 
                />
                </div>

            
            
              
            </div>

            <div className="space-y-6 ">
              <div className="bg-[#191412] px-4 py-4 rounded-lg">
                <div className="flex items-center justify-between mb-2 ">
                  <Label className="text-sm text-gray-400">Environment Variables</Label>
                  <Button variant="ghost" size="sm" className="text-red-500">
                    Edit
                  </Button>
                </div>
                <div className="text-sm text-gray-500">None</div>
              </div>

              <div className="bg-[#191412] px-4 py-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm text-gray-400">Commands</Label>
                  <Button variant="ghost" size="sm" className="text-red-500">
                    Edit
                  </Button>
                </div>
                <div className="text-sm text-gray-500">None</div>
              </div>

              <div className="bg-[#191412] px-4 py-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm text-gray-400">Expose</Label>
                  <Button variant="ghost" size="sm" className="text-red-500">
                    Edit
                  </Button>
                </div>
                <div className="text-sm text-gray-500 bg-[#161617]">
                  <div>Port: 80:80 (http)</div>
                  <div>Global: True</div>
                  <div>Accept: None</div>
                </div>
              </div>

         
              <div className="bg-[#191412] px-4 py-4 rounded-lg">
                <Label className="text-sm text-gray-400">Service Count</Label>
                <Input 
                  defaultValue="1"
                  className="bg-neutral-800 border-neutral-700 text-white"
                  type="number"
                />
              </div>

              <div className="bg-[#191412] px-4 py-4 rounded-lg">
                <Label className="text-sm text-gray-400">Token</Label>
                <Select defaultValue="AKT">
                  <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AKT">AKT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-[#191412] px-4 py-4 rounded-lg">
                <Label className="text-sm text-gray-400">Placement</Label>
                <div className="text-sm text-gray-500">
                  <div>Name: dcloud</div>
                  <div>Pricing: Max 0.1 AKT per block</div>
                  <div>Attributes: None</div>
                  <div>Signed by any of: None</div>
                  <div>Signed by all of: None</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SDLBuilder;