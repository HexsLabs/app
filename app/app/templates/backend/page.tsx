"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiService } from '@/services/apiService';
import { DeployDefaultBackendRequest } from '@/services/types';

const Backend = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const from = searchParams.get('from') || '/app/templates';

    const handleBack = () => {
        router.push(from);
    };

    const items = {
        "Repository URL": "https://github.com/Aquanodeio/templates/tree/main/backend-js",
        "Branch Name": "main",
        "App Port": "3000",
        "Deployment Duration": "1h",
        "CPU Units": "0.5",
        "Memory Size": "0.5Gi",
        "Storage Size": "0.5Gi",
    };

    async function deployBackend() {
        const data: DeployDefaultBackendRequest = {
          userId: 1,
          repoUrl: items["Repository URL"],
          branchName: items["Branch Name"],
          env: {},
          config: {
            appPort: Number(items["App Port"]),
          },
        };
        const response = await apiService.deployDefaultBackend(data);
      }
      

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex items-center mb-6">
                <Button
                    variant="outline"
                    onClick={handleBack}
                    className="hover-effect flex items-center gap-2"
                >
                    <ArrowLeft size={16} />
                    Back
                </Button>
            </div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 text-foreground">
                    Backend Template
                </h1>
                <p className="text-muted-foreground">
                    Configure and deploy your backend service
                </p>
            </div>

            <div className="gradient-border card-shadow">
                <div className="gradient-bg p-6 rounded-3xl">
                    <div className="space-y-4">
                        {Object.entries(items).map(([key, value]) => (
                            <div
                                key={key}
                                className="bg-secondary/20 p-4 rounded-xl"
                            >
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">
                                        {key}
                                    </span>
                                    <span className="text-foreground font-mono">
                                        {value}
                                    </span>
                                </div>
                            </div>
                        ))}
                        <div className="pt-4">
                            <Button size="lg" className="w-full">
                                Deploy Backend
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Backend;
