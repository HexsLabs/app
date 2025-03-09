"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const NextJS = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const from = searchParams.get("from") || "/app/templates";

    const handleBack = () => {
        router.push(from);
    };

    const items = [
        {
            key: "Repository URL",
            value: "https://github.com/example/backend-service",
        },
        {
            key: "Branch Name",
            value: "main",
        },
        {
            key: "App Port",
            value: "3000",
        },
        {
            key: "Deployment Duration",
            value: "1h",
        },
        {
            key: "CPU Units",
            value: "0.5",
        },
        {
            key: "Memory Size",
            value: "0.5Gi",
        },
        {
            key: "Storage Size",
            value: "0.5Gi",
        },
    ];

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
                    NextJS Template
                </h1>
                <p className="text-muted-foreground">
                    Configure and deploy your backend service
                </p>
            </div>

            <div className="gradient-border card-shadow">
                <div className="gradient-bg p-6 rounded-3xl">
                    <div className="space-y-4">
                        {items.map((item) => (
                            <div
                                key={item.key}
                                className="bg-secondary/20 p-4 rounded-xl"
                            >
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">
                                        {item.key}
                                    </span>
                                    <span className="text-foreground font-mono">
                                        {item.value}
                                    </span>
                                </div>
                            </div>
                        ))}
                        <div className="pt-4">
                            <Button size="lg" className="w-full">
                                Deploy Next.js
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NextJS;
