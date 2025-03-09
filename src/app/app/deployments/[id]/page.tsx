"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { ArrowLeft, Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function DeploymentDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();

    // Mock deployment data
    const deployment = {
        id: params.id,
        appUrl: "https://example.com",
        monitorUrl: "https://monitor.example.com",
        apiKey: "sk-123456789",
        user: "5",
        status: "active", // Added status field
    };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Copied!",
            description: `${label} has been copied to clipboard`,
            duration: 2000,
        });
    };

    return (
        <main className="container mx-auto px-6 py-8">
            <div className="flex items-center mb-8">
                <Button
                    variant="outline"
                    onClick={() => router.push("/app/dashboard")}
                    className="hover-effect flex items-center gap-2"
                >
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </Button>
            </div>

            <div className="mb-12">
                <div className="flex items-center gap-3 mb-3">
                    <h1 className="text-4xl font-bold text-foreground">
                        Deployment Details
                    </h1>
                    <div className={`px-3 py-1 rounded-full text-sm ${deployment.status === 'active' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                        {deployment.status}
                    </div>
                </div>
                <p className="text-muted-foreground">
                    View and manage your deployment configuration
                </p>
            </div>

            <div className="gradient-border card-shadow">
                <div className="gradient-bg p-8 rounded-3xl space-y-6">
                    <div className="bg-secondary/20 p-6 rounded-xl hover:bg-secondary/30 transition-colors">
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="text-sm text-muted-foreground block mb-1">
                                    Deployment ID
                                </span>
                                <span className="text-foreground font-mono">
                                    {deployment.id}
                                </span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard(deployment.id as string, 'Deployment ID')}
                                className="hover:bg-secondary/30"
                            >
                                <Copy size={18} />
                            </Button>
                        </div>
                    </div>

                    <div className="bg-secondary/20 p-6 rounded-xl hover:bg-secondary/30 transition-colors">
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="text-sm text-muted-foreground block mb-1">
                                    App URL
                                </span>
                                <a
                                    href={deployment.appUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-foreground font-mono hover:text-primary transition-colors inline-flex items-center gap-2"
                                >
                                    {deployment.appUrl}
                                    <ExternalLink size={16} />
                                </a>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard(deployment.appUrl, 'App URL')}
                                className="hover:bg-secondary/30"
                            >
                                <Copy size={18} />
                            </Button>
                        </div>
                    </div>

                    {deployment.monitorUrl && (
                        <div className="bg-secondary/20 p-6 rounded-xl hover:bg-secondary/30 transition-colors">
                            <div className="flex justify-between items-center">
                                <div>
                                    <span className="text-sm text-muted-foreground block mb-1">
                                        Monitor URL
                                    </span>
                                    <a
                                        href={deployment.monitorUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-foreground font-mono hover:text-primary transition-colors inline-flex items-center gap-2"
                                    >
                                        {deployment.monitorUrl}
                                        <ExternalLink size={16} />
                                    </a>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => copyToClipboard(deployment.monitorUrl, 'Monitor URL')}
                                    className="hover:bg-secondary/30"
                                >
                                    <Copy size={18} />
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="bg-secondary/20 p-6 rounded-xl hover:bg-secondary/30 transition-colors">
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="text-sm text-muted-foreground block mb-1">
                                    API Key
                                </span>
                                <span className="text-foreground font-mono">
                                    {deployment.apiKey}
                                </span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard(deployment.apiKey, 'API Key')}
                                className="hover:bg-secondary/30"
                            >
                                <Copy size={18} />
                            </Button>
                        </div>
                    </div>

                    <div className="bg-secondary/20 p-6 rounded-xl hover:bg-secondary/30 transition-colors">
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="text-sm text-muted-foreground block mb-1">
                                    User ID
                                </span>
                                <span className="text-foreground font-mono">
                                    {deployment.user}
                                </span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard(deployment.user, 'User ID')}
                                className="hover:bg-secondary/30"
                            >
                                <Copy size={18} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster />
        </main>
    );
}
