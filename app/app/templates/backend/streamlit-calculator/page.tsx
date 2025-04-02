"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiService } from '@/services/apiService';
import { DeployCustomBackendRequest, ProviderType } from '@/services/types';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/lib/auth/AuthContext';

const StreamlitCalculatorTemplate = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const from = searchParams.get('from') || '/app/templates';
    const { toast } = useToast();
    const { user, isLoading } = useAuth();

    const handleBack = () => {
        router.push(from);
    };

    const templateDetails = {
        "Repository URL": "https://github.com/Aquanodeio/templates.git",
        "Branch Name": "streamlit-example",
        "Run Commands": "pip3 install -r requirements.txt && streamlit run main.py",
        "App Port": "8501",
        "Deployment Duration": "1h",
        "CPU Units": "0.5",
        "Memory Size": "1Gi",
        "Storage Size": "3Gi",
    };

    const handleDeploy = async () => {
        if (!user?.id) {
            toast({
                title: "Authentication Required",
                description: "Please sign in to deploy a template.",
                variant: "destructive",
            });
            return;
        }

        try {
            const data = {
                userId: parseInt(user.id),
                repoUrl: templateDetails["Repository URL"],
                branchName: templateDetails["Branch Name"],
                env: {},
                config: {
                    appPort: Number(templateDetails["App Port"]),
                    deploymentDuration: templateDetails["Deployment Duration"],
                    appCpuUnits: Number(templateDetails["CPU Units"]),
                    appMemorySize: templateDetails["Memory Size"],
                    appStorageSize: templateDetails["Storage Size"],
                    runCommands: templateDetails["Run Commands"],
                },
                provider: "auto" as ProviderType,
            };

            console.log("Deploying Streamlit template with run commands:", templateDetails["Run Commands"]);

            const response = await apiService.deployDefaultBackend(data);
            
            toast({
                title: "Success",
                description: "Streamlit Calculator template deployed successfully!",
                variant: "default",
            });

            // Navigate to dashboard page to see the new deployment
            router.push("/app/dashboard");
        } catch (error) {
            console.error("Error deploying template:", error);
            toast({
                title: "Error",
                description: "Failed to deploy template. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleEditCustom = () => {
        // Store template details in localStorage
        localStorage.setItem('templatePreFill', JSON.stringify({
            repoUrl: templateDetails["Repository URL"],
            branchName: templateDetails["Branch Name"],
            appPort: templateDetails["App Port"],
            deploymentDuration: templateDetails["Deployment Duration"],
            appCpuUnits: templateDetails["CPU Units"],
            appMemorySize: templateDetails["Memory Size"],
            appStorageSize: templateDetails["Storage Size"],
            runCommands: templateDetails["Run Commands"],
        }));

        // Redirect to custom deployment page
        router.push("/app/services/backend");
    };

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
                    Streamlit Python Calculator Template
                </h1>
                <p className="text-muted-foreground">
                    Interactive calculator built with Python and Streamlit for a modern data-focused web interface.
                </p>
            </div>

            <div className="gradient-border card-shadow">
                <div className="gradient-bg p-6 rounded-3xl">
                    <div className="space-y-4">
                        {Object.entries(templateDetails).map(([key, value]) => (
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
                        <div className="pt-4 flex gap-4">
                            <Button size="lg" onClick={handleEditCustom} variant="outline" className="w-1/2">
                                Customize
                            </Button>
                            <Button 
                                size="lg" 
                                className="w-1/2" 
                                onClick={handleDeploy}
                                disabled={isLoading || !user?.id}
                            >
                                Deploy
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StreamlitCalculatorTemplate; 