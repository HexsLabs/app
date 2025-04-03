"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Info, Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/lib/auth/AuthContext";

interface SliderProps {
    value: number;
    onChange: (value: number) => void;
}

type Unit = "Mi" | "Gi";

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
        <div
            className="relative w-full h-2 bg-secondary rounded-full cursor-pointer"
            onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const position = (e.clientX - rect.left) / rect.width;
                onChange(Math.min(Math.max(position, 0), 1));
            }}
        >
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
    const { user, isLoading } = useAuth();
    const [values, setValues] = React.useState<State>({
        isPrivate: false,
        cpuValue: 87,
        isGpuEnabled: false,
        gpuValue: 1,
        memoryValue: 512,
        memoryUnit: "Mi",
        ephemeralValue: 1,
        ephemeralUnit: "Gi",
        isPersistentEnabled: false,
        persistentValue: 10,
        persistentUnit: "Gi",
        persistentName: "data",
        persistentType: "ssd",
        persistentMount: "/mnt/data",
        persistentReadOnly: false,
    });

    const renderAuthContent = (content: React.ReactNode) => {
        if (isLoading) {
            return (
                <div className="p-8 flex flex-col items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin mb-4" />
                    <p>Loading authentication...</p>
                </div>
            );
        }

        if (!user?.id) {
            return (
                <div className="p-4 bg-secondary/20 rounded-lg text-center">
                    <p>Please sign in to create a deployment</p>
                </div>
            );
        }

        return content;
    };

    return (
        <div className="dashboard-card subtle-glow mb-8">
            <div className="p-6">
                {renderAuthContent(
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                {/* Docker Image Section */}
                                <div className="bg-secondary/10 p-6 rounded-xl">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <Label className="text-sm">Docker Image / OS</Label>
                                            <Info className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={values.isPrivate}
                                                onCheckedChange={(checked) =>
                                                    setValues({
                                                        ...values,
                                                        isPrivate: checked,
                                                    })
                                                }
                                            />
                                            <span className="text-sm text-muted-foreground">Private</span>
                                        </div>
                                    </div>

                                    <Input
                                        placeholder="Example: mydockerimage:1.01"
                                        className="bg-secondary/5 border-secondary/20 mb-4"
                                    />

                                    {values.isPrivate && (
                                        <div className="space-y-4">
                                            <Select defaultValue="docker">
                                                <SelectTrigger className="bg-secondary/5 border-secondary/20">
                                                    <SelectValue placeholder="Docker Hub - docker.io" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="docker">
                                                        Docker Hub -
                                                        docker.io
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>

                                            <div className="grid grid-cols-2 gap-4">
                                                <Input
                                                    placeholder="Username"
                                                    className="bg-secondary/5 border-secondary/20"
                                                />
                                                <Input
                                                    type="password"
                                                    placeholder="Password"
                                                    className="bg-secondary/5 border-secondary/20"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Resources Section */}
                                <div className="space-y-6">
                                    {/* CPU */}
                                    <div className="bg-secondary/10 p-6 rounded-xl">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <Label className="text-sm">CPU</Label>
                                                <Info className="w-4 h-4 text-muted-foreground" />
                                            </div>
                                            <Input
                                                value={values.cpuValue}
                                                onChange={(e) =>
                                                    setValues({
                                                        ...values,
                                                        cpuValue: Number(
                                                            e.target.value
                                                        ),
                                                    })
                                                }
                                                className="w-20 bg-secondary/5 border-secondary/20"
                                                type="number"
                                            />
                                        </div>
                                        <CustomSlider
                                            value={values.cpuValue / 100}
                                            onChange={(value) =>
                                                setValues({
                                                    ...values,
                                                    cpuValue: value * 100,
                                                })
                                            }
                                        />
                                    </div>

                                    {/* Memory */}
                                    <div className="bg-secondary/10 p-6 rounded-xl">
                                        <div className="flex items-center justify-between mb-4">
                                            <Label className="text-sm">Memory</Label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    value={
                                                        values.memoryValue
                                                    }
                                                    onChange={(e) =>
                                                        setValues({
                                                            ...values,
                                                            memoryValue:
                                                                Number(
                                                                    e.target
                                                                        .value
                                                                ),
                                                        })
                                                    }
                                                    className="w-24 bg-secondary/5 border-secondary/20"
                                                    type="number"
                                                />
                                                <Select
                                                    value={
                                                        values.memoryUnit
                                                    }
                                                    onValueChange={(
                                                        value: Unit
                                                    ) =>
                                                        setValues({
                                                            ...values,
                                                            memoryUnit:
                                                                value,
                                                        })
                                                    }
                                                >
                                                    <SelectTrigger className="w-20 bg-secondary/5 border-secondary/20">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Mi">
                                                            Mi
                                                        </SelectItem>
                                                        <SelectItem value="Gi">
                                                            Gi
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <CustomSlider
                                            value={
                                                values.memoryValue / 1024
                                            }
                                            onChange={(value) =>
                                                setValues({
                                                    ...values,
                                                    memoryValue:
                                                        value * 1024,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Configuration Sections */}
                                <div className="bg-secondary/10 p-6 rounded-xl">
                                    <div className="flex items-center justify-between mb-4">
                                        <Label className="text-sm">Environment Variables</Label>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-primary hover:text-primary/80"
                                        >
                                            Edit
                                        </Button>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        None
                                    </p>
                                </div>

                                <div className="bg-secondary/10 p-6 rounded-xl">
                                    <div className="flex items-center justify-between mb-4">
                                        <Label className="text-sm">Commands</Label>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-primary hover:text-primary/80"
                                        >
                                            Edit
                                        </Button>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        None
                                    </p>
                                </div>

                                <div className="bg-secondary/10 p-6 rounded-xl">
                                    <div className="flex items-center justify-between mb-4">
                                        <Label className="text-sm">Expose</Label>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-primary hover:text-primary/80"
                                        >
                                            Edit
                                        </Button>
                                    </div>
                                    <div className="text-sm text-muted-foreground space-y-1">
                                        <p>Port: 80:80 (http)</p>
                                        <p>Global: True</p>
                                        <p>Accept: None</p>
                                    </div>
                                </div>

                                <div className="bg-secondary/10 p-6 rounded-xl">
                                    <Label className="text-sm block mb-4">Service Count</Label>
                                    <Input
                                        defaultValue="1"
                                        className="bg-secondary/5 border-secondary/20"
                                        type="number"
                                    />
                                </div>

                                <div className="bg-secondary/10 p-6 rounded-xl">
                                    <Label className="text-sm block mb-4">Token</Label>
                                    <Select defaultValue="AKT">
                                        <SelectTrigger className="bg-secondary/5 border-secondary/20">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="AKT">
                                                AKT
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <Button 
                                size="lg"
                                className="btn-primary shadow-lg shadow-primary/10 hover-effect"
                            >
                                Create Deployment
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SDLBuilder;
