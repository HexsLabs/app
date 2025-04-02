"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getDeploymentById, closeDeployment, Deployment } from '../../../../lib/api';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Copy, ExternalLink } from 'lucide-react';

export default function DeploymentDetailsPage() {
    const params = useParams();
    const { toast } = useToast();
    const [deployment, setDeployment] = useState<Deployment | null>(null);
    const [loading, setLoading] = useState(true);
    const [closing, setClosing] = useState(false);

    useEffect(() => {
        fetchDeployment();
    }, []);

    const fetchDeployment = async () => {
        try {
            const data = await getDeploymentById(Number(params.id));
            setDeployment(data);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to fetch deployment details',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = async () => {
        if (!deployment) return;
        
        setClosing(true);
        try {
            await closeDeployment(Number(deployment.deploymentId));
            toast({
                title: 'Success',
                description: 'Deployment closed successfully',
            });
            fetchDeployment(); // Refresh deployment data
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to close deployment',
                variant: 'destructive',
            });
        } finally {
            setClosing(false);
        }
    };

    const copyToClipboard = async (text: string, label: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast({
                title: 'Copied!',
                description: `${label} copied to clipboard`,
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to copy to clipboard',
                variant: 'destructive',
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background text-foreground p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 w-64 bg-secondary/20 rounded"></div>
                    <div className="h-32 bg-secondary/20 rounded"></div>
                    <div className="h-32 bg-secondary/20 rounded"></div>
                </div>
            </div>
        );
    }

    if (!deployment) {
        return (
            <div className="min-h-screen bg-background text-foreground p-6">
                <h1 className="text-4xl font-bold mb-8">Deployment Not Found</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Deployment Details</h1>
                <Button 
                    variant="destructive" 
                    onClick={handleClose}
                    disabled={closing}
                >
                    {closing ? 'Closing...' : 'Close Deployment'}
                </Button>
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <div className="bg-secondary/20 p-6 rounded-xl hover:bg-secondary/30 transition-colors">
                            <span className="text-sm text-muted-foreground block mb-1">
                                Status
                            </span>
                            <span className="text-foreground font-semibold">
                                Active
                            </span>
                        </div>

                        {deployment.appUrl && (
                            <div className="bg-secondary/20 p-6 rounded-xl hover:bg-secondary/30 transition-colors">
                                <div className="flex justify-between items-center">
                                    <div className="max-w-[calc(100%-50px)] overflow-hidden">
                                        <span className="text-sm text-muted-foreground block mb-1">
                                            App URL
                                        </span>
                                        <a
                                            href={deployment.appUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-foreground font-mono hover:text-primary transition-colors inline-flex items-center gap-2 truncate"
                                        >
                                            <span className="truncate">{deployment.appUrl}</span>
                                            <ExternalLink size={16} className="flex-shrink-0" />
                                        </a>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => copyToClipboard(deployment.appUrl!, 'App URL')}
                                        className="hover:bg-secondary/30 flex-shrink-0"
                                    >
                                        <Copy size={18} />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="bg-secondary/20 p-6 rounded-xl">
                            <h2 className="text-lg font-semibold mb-4">Configuration</h2>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-sm text-muted-foreground block">Provider</span>
                                    <span className="text-foreground capitalize">{deployment.provider}</span>
                                </div>
                                <div>
                                    <span className="text-sm text-muted-foreground block">CPU</span>
                                    <span className="text-foreground">{deployment.cpu} units</span>
                                </div>
                                <div>
                                    <span className="text-sm text-muted-foreground block">Memory</span>
                                    <span className="text-foreground">{deployment.memory}</span>
                                </div>
                                <div>
                                    <span className="text-sm text-muted-foreground block">Storage</span>
                                    <span className="text-foreground">{deployment.storage}</span>
                                </div>
                                <div>
                                    <span className="text-sm text-muted-foreground block">Duration</span>
                                    <span className="text-foreground">{deployment.duration}</span>
                                </div>
                                <div>
                                    <span className="text-sm text-muted-foreground block">Deployment ID</span>
                                    <span className="text-foreground">{deployment.deploymentId}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-secondary/20 p-6 rounded-xl">
                            <h2 className="text-lg font-semibold mb-4">Timestamps</h2>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-sm text-muted-foreground block">Created</span>
                                    <span className="text-foreground">
                                        {new Date(deployment.createdAt).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
