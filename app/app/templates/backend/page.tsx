"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const Backend = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const from = searchParams.get('from') || '/app/templates';

    const handleBack = () => {
        router.push(from);
    };
      
    const templateOptions = [
        {
            name: "Express.js Calculator",
            description: "Express.js Server with HTML rendered frontend",
            url: "/app/templates/backend/express-calculator?from=/app/templates/backend",
        },
        {
            name: "Streamlit Python Calculator",
            description: "Interactive calculator built with Python and Streamlit",
            url: "/app/templates/backend/streamlit-calculator?from=/app/templates/backend",
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
                    Backend Templates
                </h1>
                <p className="text-muted-foreground">
                    Choose from our available templates to quickly deploy your application
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {templateOptions.map((template, index) => (
                    <Link key={index} href={template.url} className="block group">
                        <div className="dashboard-card subtle-glow">
                            <div className="flex flex-col h-full">
                                <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors duration-300">
                                    {template.name}
                                </h3>
                                <p className="text-muted-foreground">
                                    {template.description}
                                </p>
                                <div className="mt-6 text-right">
                                    <span className="text-primary font-medium group-hover:translate-x-1 inline-flex transition-transform duration-300">
                                        Use template →
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Backend;
