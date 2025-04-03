"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { FileText, Plus, Sparkles, Grid } from "lucide-react";
import Link from "next/link";
import { templates } from "@/components/templates";

interface SidebarProps {
  isMobileOpen?: boolean;
}

export const Sidebar = ({ isMobileOpen }: SidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div
      className={`fixed h-[calc(100vh-4rem)] w-60 bg-secondary/30 backdrop-blur-sm border-r border-border/30 flex flex-col p-4 overflow-y-auto z-40 transition-transform duration-300 md:translate-x-0 ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <nav className="flex-1 flex flex-col gap-2 mt-6">
        <Button
          variant="ghost"
          className={`w-full justify-start gap-3 ${
            pathname?.includes("/app/services")
              ? "text-primary bg-primary/10"
              : "text-muted-foreground"
          } hover:text-primary hover:bg-primary/10 py-4 rounded-xl group`}
          onClick={() => router.push("/app/services")}
        >
          <Plus
            size={20}
            className={`${
              pathname?.includes("/app/services")
                ? "text-primary"
                : "text-muted-foreground"
            } group-hover:text-primary transition-colors`}
          />
          <span>Deploy</span>
        </Button>
        <Button
          variant="ghost"
          className={`w-full justify-start gap-3 ${
            pathname?.includes("/app/dashboard")
              ? "text-primary bg-primary/10"
              : "text-muted-foreground"
          } hover:text-primary hover:bg-primary/10 py-4 rounded-xl group`}
          onClick={() => router.push("/app/dashboard")}
        >
          <Grid
            size={20}
            className={`${
              pathname?.includes("/app/dashboard")
                ? "text-primary"
                : "text-muted-foreground"
            } group-hover:text-primary transition-colors`}
          />
          <span>Dashboard</span>
        </Button>

        <Button
          variant="ghost"
          className={`w-full justify-start gap-3 ${
            pathname?.includes("/app/templates")
              ? "text-primary bg-primary/10"
              : "text-muted-foreground"
          } hover:text-primary hover:bg-primary/10 py-4 rounded-xl group`}
          onClick={() => router.push("/app/templates")}
        >
          <FileText
            size={20}
            className={`${
              pathname?.includes("/app/templates")
                ? "text-primary"
                : "text-muted-foreground"
            } group-hover:text-primary transition-colors`}
          />
          <span>Templates</span>
        </Button>

        <Button
          variant="ghost"
          className={`w-full justify-start gap-3 ${
            pathname?.includes("/app/chatbot")
              ? "text-primary bg-primary/10"
              : "text-muted-foreground"
          } hover:text-primary hover:bg-primary/10 py-4 rounded-xl group`}
          onClick={() => router.push("/app/chatbot")}
        >
          <Sparkles
            size={20}
            className={`${
              pathname?.includes("/app/chatbot")
                ? "text-primary"
                : "text-muted-foreground"
            } group-hover:text-primary transition-colors`}
          />
          <span>AI Assistant</span>
        </Button>
      </nav>

      {/* Templates Section */}
      <div className="mt-4 mb-auto border-t border-border/30 pt-4">
        <h3 className="text-sm font-medium mb-3 text-muted-foreground">Templates</h3>
        <div className="space-y-2">
          {templates.map((template, index) => (
            <Link 
              key={index} 
              href={template.url}
              className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1.5 px-2 rounded hover:bg-primary/5"
            >
              {template.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-border/30 text-muted-foreground/70 text-sm flex items-center">
        <a
          href="https://github.com/Aquanodeio"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-primary transition-colors px-2 py-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-github"
          >
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
            <path d="M9 18c-4.51 2-5-2-7-2"></path>
          </svg>
          GitHub
        </a>
      </div>
    </div>
  );
};
