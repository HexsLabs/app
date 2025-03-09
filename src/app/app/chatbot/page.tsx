"use client";

import { useState, useRef } from "react";
import { Paperclip, ArrowUp } from "lucide-react";
import React from "react";
import Link from "next/link";

interface Message {
    text: string;
    sender: "user" | "bot";
}

const ChatInterface = () => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePaperclipClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Handle file upload logic
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            sendPrompt();
        }
    };

    const sendPrompt = () => {
        if (!input.trim()) return;

        setMessages([...messages, { text: input, sender: "user" }]);
        setInput("");
    };

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground pt-12">
            <div className="flex-1 px-6 py-12 md:px-8 space-y-12">
                <h1 className="text-4xl font-bold text-center">
                    How can I assist you deploy?
                </h1>

                <div className="max-w-3xl mx-auto space-y-6">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`p-4 rounded-2xl ${
                                message.sender === "user"
                                    ? "gradient-bg text-right"
                                    : "bg-secondary text-left"
                            }`}
                        >
                            <p className="text-foreground">{message.text}</p>
                        </div>
                    ))}
                </div>

                <div className="max-w-3xl mx-auto">
                    <div className="gradient-border">
                        <div className="gradient-bg p-3">
                            <div className="flex items-center gap-3">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: "none" }}
                                    onChange={handleFileChange}
                                />

                                <button
                                    onClick={handlePaperclipClick}
                                    className="p-2 rounded-md text-muted-foreground hover-effect"
                                >
                                    <Paperclip className="w-5 h-5" />
                                </button>

                                <div className="flex-1">
                                    <input
                                        value={input}
                                        onChange={(e) =>
                                            setInput(e.target.value)
                                        }
                                        onKeyDown={handleKeyPress}
                                        placeholder="Enter a prompt..."
                                        className="w-full bg-transparent text-foreground focus:outline-none placeholder-muted-foreground p-2 rounded-md"
                                    />
                                </div>

                                <button
                                    onClick={sendPrompt}
                                    className="p-2 rounded-md text-muted-foreground hover-effect"
                                >
                                    <ArrowUp className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto mt-16">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-semibold">
                            Starter Templates
                        </h2>
                    </div>
                    <Templates />
                </div>
            </div>
        </div>
    );
};

const templates = [
    {
        name: "Backend",
        description:
            "The backend is the server-side of an application that handles data processing, business logic, database interactions, and API communication to support frontend functionality.",
        icon: "/path-to-agoric-icon.png",
        url: "/app/templates/backend?from=/app/chatbot",
    },
    {
        name: "Next.js",
        description:
            "Next.js is a React framework that enables server-side rendering, static site generation, and optimized performance for building fast, scalable web applications.",
        icon: "/path-to-akash-icon.png",
        url: "/app/templates/nextjs?from=/app/chatbot",
    },
];

const Templates = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map((template, index) => (
                <Link key={index} href={template.url} passHref>
                    <div className="group relative">
                        {/* Gradient border container */}
                        <div className="absolute inset-0 rounded-xl gradient-bg blur-sm opacity-50 group-hover:opacity-100 transition-opacity"></div>
                        
                        {/* Main card content */}
                        <div className="relative gradient-bg rounded-xl p-6 transition-all duration-300 hover:scale-[1.02]">
                            {/* Grid pattern background */}
                            <div className="absolute inset-0 rounded-xl opacity-[0.07]">
                                <div className="w-full h-full grid grid-cols-8 gap-[1px]">
                                    {[...Array(32)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="border-r border-t border-white/20"
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="space-y-3 relative z-10">
                                <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                                    {template.name}
                                </h3>
                                <p className="text-[15px] text-gray-300/90 leading-relaxed">
                                    {template.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default ChatInterface;
