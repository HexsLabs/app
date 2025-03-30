"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FileText, Plus, Sparkles, Grid } from "lucide-react";

export const Sidebar = () => {
    const router = useRouter();
    return (
        <div className="h-screen bg-[#101012] flex flex-col space-y-4 p-4">
            <nav className="flex-1 flex flex-col justify-center gap-6">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-white hover:bg-black hover:text-white py-6 text-lg"
                    onClick={() => router.push("/app/services")}
                >
                    <Plus size={24} />
                    Deploy
                </Button>
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-white hover:bg-black hover:text-white py-6 text-lg"
                    onClick={() => router.push("/app/dashboard")}
                >
                    <Grid size={24} />
                    Dashboard
                </Button>

                {/* <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-white hover:bg-black hover:text-white py-6 text-lg"
                    onClick={() => router.push("/app/templates")}
                >
                    <FileText size={24} />
                    Templates
                </Button> */}

                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-white hover:bg-black hover:text-white py-6 text-lg"
                    onClick={() => router.push("/app/chatbot")}
                >
                    <Sparkles size={24} />
                    AI
                </Button>
            </nav>

            <div className="p-4">Github</div>
        </div>
    );
};
