"use client";

import { useState, useRef, useEffect } from "react";
import { Paperclip, ArrowUp, Bot, User } from "lucide-react";
import React from "react";
import Link from "next/link";

interface Message {
  text: string;
  sender: "user" | "bot";
}

const ChatInterface = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I'm your AI assistant. How can I help you deploy your application today?",
      sender: "bot",
    },
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handlePaperclipClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Handle file upload logic
    const files = event.target.files;
    if (files && files.length > 0) {
      setMessages([
        ...messages,
        {
          text: `File attached: ${files[0].name}`,
          sender: "user",
        },
      ]);

      // Simulate bot response
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: `I've received your file "${files[0].name}". What would you like to do with it?`,
            sender: "bot",
          },
        ]);
      }, 1000);
    }
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

    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "I'm analyzing your request...",
        "That's a great question! Let me help you with that.",
        "I can help you deploy that. Would you like to use a template?",
        "Let me guide you through the process of setting that up.",
        "I understand what you're looking for. Let's get started!",
      ];

      const randomResponse =
        botResponses[Math.floor(Math.random() * botResponses.length)];

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: randomResponse,
          sender: "bot",
        },
      ]);
    }, 1000);
  };

  // Auto scroll to the bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 px-6 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="py-6">
          <h1 className="section-title text-center mb-2">AI Assistant</h1>
          <p className="text-center text-muted-foreground max-w-lg mx-auto">
            Chat with our AI to quickly deploy your applications or get help
            with any questions
          </p>
        </div>

        {/* Chat messages area */}
        <div className="flex-1 overflow-y-auto mb-6 rounded-xl bg-secondary/5 border border-border/20 p-4 shadow-sm">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <Bot size={16} />
                  </div>
                )}

                <div
                  className={`p-3 rounded-xl max-w-[80%] ${
                    message.sender === "user"
                      ? "bg-primary/10 text-foreground"
                      : "bg-secondary/20 text-foreground"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>

                {message.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-secondary/40 flex items-center justify-center text-foreground/80">
                    <User size={16} />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="max-w-3xl mx-auto w-full mb-6">
          <div className="border border-border/30 bg-secondary/10 rounded-xl p-1 shadow-sm backdrop-blur-sm hover:border-primary/20 transition-colors duration-300">
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

              <button
                onClick={handlePaperclipClick}
                className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <div className="flex-1">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="w-full bg-transparent text-foreground focus:outline-none placeholder-muted-foreground py-2 px-1 rounded-md"
                />
              </div>

              <button
                onClick={sendPrompt}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  input.trim()
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "text-muted-foreground bg-secondary/30 cursor-not-allowed"
                }`}
                disabled={!input.trim()}
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Templates section */}
        <div className="max-w-5xl mx-auto w-full mb-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Quick Templates
            </h2>
            <p className="text-sm text-muted-foreground">
              Start with a template to deploy faster
            </p>
          </div>
          <Templates />
        </div>
      </div>
    </div>
  );
};

const templates = [
  {
    name: "Custom Deployment",
    description:
      "Use this for deploying servers, APIs, and other backend services that handle data processing, business logic, and database interactions to support your applications.",
    url: "/app/templates/backend?from=/app/chatbot",
  },
  {
    name: "Next.js",
    description:
      "Next.js is a React framework that enables server-side rendering, static site generation, and optimized performance for building fast, scalable web applications.",
    url: "/app/templates/nextjs?from=/app/chatbot",
  },
];

const Templates = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {templates.map((template, index) => (
        <Link key={index} href={template.url} className="block group">
          <div className="dashboard-card subtle-glow h-full">
            <div className="flex flex-col h-full">
              <h3 className="text-base font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                {template.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {template.description}
              </p>
              <div className="mt-3 text-right">
                <span className="text-sm text-primary font-medium group-hover:translate-x-1 inline-flex transition-transform duration-300">
                  Use template →
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ChatInterface;
