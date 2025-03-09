'use client';

import { useState, useRef } from "react";
import { Paperclip, ArrowUp } from "lucide-react";
import Templates from "@/components/templates";

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

    setMessages([
      ...messages,
      { text: input, sender: "user" },
    ]);
    setInput("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground pt-12">
      <div className="flex-1 px-6 py-12 md:px-8 space-y-12">
        <h1 className="text-4xl font-bold text-center">
          What can I help you ship?
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
                    onChange={(e) => setInput(e.target.value)}
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
            <h2 className="text-3xl font-semibold">Starter Templates</h2>
          </div>
          <Templates />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface; 