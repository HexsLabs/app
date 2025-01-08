'use client'
import React, { useState, useRef } from 'react';
import { Paperclip, ArrowUp } from 'lucide-react';
import TemplateShowcase from '@/components/TemplateShowcase';
import Templates from '../templates/page';

const ChatInterface = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ sender: string, text: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Simulate an AI response (replace with real API call)
  const sendPrompt = async () => {
    if (!input.trim()) return; // Prevent sending empty prompts

    // Append user's message to the chat
    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);

    // Clear input field
    setInput('');

    // Simulate the AI response after 1 second (replace this with your API call)
    setTimeout(() => {
      const aiResponse = { sender: 'ai', text: `This is a simulated response for: "${userMessage.text}"` };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      console.log('Selected file:', selectedFile);
      // You can add file handling logic here, such as sending the file to the server or displaying it in the chat
    }
  };

  // Handle the Paperclip button click to trigger the file input
  const handlePaperclipClick = () => {
    fileInputRef.current?.click();
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
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
            <div key={index} className={`p-3 rounded-xl ${message.sender === 'user' ? 'bg-blue-600 text-right' : 'bg-gray-700 text-left'}`}>
              <p>{message.text}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-[#101012] to-[#0c0d0e] rounded-xl p-4">
            <div className="flex items-center gap-2">
           
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            
              <button
                onClick={handlePaperclipClick}
                className="p-1.5 rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-800"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}  
                placeholder="Enter a prompt..."
                className="flex-1 bg-transparent text-sm focus:outline-none placeholder-gray-500"
              />
              <button
                onClick={sendPrompt}  
                className="p-1.5 rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-800"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        
      
        <div className="mr-20">
          <div className="flex justify-between items-center mb-6 ">
            <h2 className="text-xl font-semibold ">Starter Templates</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ">
            <TemplateShowcase />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
