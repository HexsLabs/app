"use client";

import { useState, useRef, useEffect } from "react";
import { Paperclip, ArrowUp, Bot, User } from "lucide-react";
import { apiService } from "@/services/apiService";
import { ChatMessage } from "@/services/types";
import { useToast } from "@/components/ui/use-toast";

const ChatInterface = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI assistant. How can I help you deploy your application today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const history = await apiService.getChatHistory();
      if (history.length > 0) {
        setMessages(history);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load chat history",
        variant: "destructive",
      });
    }
  };

  const handlePaperclipClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const userMessage: ChatMessage = {
        role: "user",
        content: `File attached: ${files[0].name}`,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, userMessage]);
      // TODO: Implement file upload functionality
      toast({
        title: "File Upload",
        description: "File upload functionality coming soon!",
      });
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendPrompt();
    }
  };

  const sendPrompt = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Create a temporary assistant message that will be updated
    const tempAssistantMessage: ChatMessage = {
      role: "assistant",
      content: "",
      timestamp: new Date().toISOString(),
    };
    
    // Add the assistant message to the state
    setMessages(prev => [...prev, tempAssistantMessage]);
    
    try {
      // Create a local reference to track content to avoid state closure issues
      let currentContent = "";
      
      await apiService.sendChatMessage(
        {
          messages: [...messages, userMessage],
        },
        (chunk) => {
          // Accumulate content locally to avoid state closure issues
          currentContent += chunk;
          
          // Update the last message with the complete content so far
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage.role === "assistant") {
              // Replace the content entirely instead of appending
              lastMessage.content = currentContent;
            }
            return newMessages;
          });
        }
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      
      // Remove the assistant message if there was an error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

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
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <Bot size={16} />
                  </div>
                )}

                <div
                  className={`p-3 rounded-xl max-w-[80%] ${
                    message.role === "user"
                      ? "bg-primary/10 text-foreground"
                      : "bg-secondary/20 text-foreground"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {new Date(message.timestamp || "").toLocaleTimeString()}
                  </span>
                </div>

                {message.role === "user" && (
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
                disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>

              <button
                onClick={sendPrompt}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  input.trim() && !isLoading
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "text-muted-foreground bg-secondary/30 cursor-not-allowed"
                }`}
                disabled={!input.trim() || isLoading}
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
