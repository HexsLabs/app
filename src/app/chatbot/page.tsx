"use client";
import React, { useState, useRef } from "react";
import { Paperclip, ArrowUp } from "lucide-react";
import Templates from "@/components/templates";

const ChatInterface = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const sendPrompt = async () => {
    if (!input.trim()) return; 

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    setInput("");

    
    setTimeout(() => {
      const aiResponse = {
        sender: "ai",
        text: `This is a simulated response for: "${userMessage.text}"`,
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

 
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      console.log("Selected file:", selectedFile);
    }
  };

  
  const handlePaperclipClick = () => {
    fileInputRef.current?.click();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendPrompt();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0c0d0e] text-white pt-12">
      <div className="flex-1 px-4 py-8 md:px-8 space-y-8">
        <h1 className="text-4xl font-bold text-center text-white">
          What can I help you ship?
        </h1>
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-3 rounded-xl ${
                message.sender === "user"
                  ? "bg-blue-600 text-right"
                  : "bg-gray-700 text-left"
              }`}
            >
              <p>{message.text}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
  <div className="p-[1px] bg-gradient-to-r from-[#FFFFFF] to-[#000000] rounded-3xl">
    <div className="bg-gradient-to-r from-[#101012] to-[#0c0d0e] rounded-3xl p-2">
      <div className="flex items-center gap-2 p-1 rounded-md">
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
          className=""
        />

        <button
          onClick={handlePaperclipClick}
          className="p-1.5 rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-800"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <div className="flex-1 relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter a prompt..."
            className="w-full bg-transparent text-sm focus:outline-none placeholder-gray-500 p-2 rounded-md"
          />
        </div>

        <button
          onClick={sendPrompt}
          className="p-1.5 rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-800"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</div>


        <div className="ml-72 space-y-4">
          <div className="flex justify-between items-center mb-6 ">
            <h2 className="text-3xl font-semibold ml-52">Starter Templates</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 ml-20">
            <Templates />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
