import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface TemplateHeaderProps {
  title: string;
  description: string;
  onBackClick: () => void;
}

export default function TemplateHeader({
  title,
  description,
  onBackClick,
}: TemplateHeaderProps) {
  return (
    <>
      <div className="flex items-center mb-6">
        <Button
          variant="outline"
          onClick={onBackClick}
          className="hover-effect flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-foreground">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </>
  );
}
