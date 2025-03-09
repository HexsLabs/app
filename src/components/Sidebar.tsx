"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FileText, Plus, Sparkles, Grid } from "lucide-react";

export const Sidebar = () => {
    const router = useRouter();
    return (
        <div className="h-screen bg-[#101012] flex flex-col space-y-4 p-4">
            <nav className="flex-1 flex flex-col justify-center gap-4">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-white hover:bg-black hover:text-white"
                    onClick={() => router.push("/app/create")}
                >
                    <Plus />
                    Create
                </Button>

                <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-white hover:bg-black hover:text-white"
                    onClick={() => router.push("/app/dashboard")}
                >
                    <Grid />
                    Dashboard
                </Button>

                <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-white hover:bg-black hover:text-white"
                    onClick={() => router.push("/app/templates")}
                >
                    <FileText />
                    Templates
                </Button>

                <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-white hover:bg-black hover:text-white"
                    onClick={() => router.push("/app/chatbot")}
                >
                    <Sparkles />
                    AI
                </Button>
            </nav>

            <div className="p-4">Github</div>
        </div>
    );
};
