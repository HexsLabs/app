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
      <div className="flex items-center mb-4 sm:mb-6">
        <Button
          variant="outline"
          onClick={onBackClick}
          className="hover-effect flex items-center gap-2 text-sm sm:text-base"
          size="sm"
        >
          <ArrowLeft size={16} />
          Back
        </Button>
      </div>

      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 text-foreground">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {description}
        </p>
      </div>
    </>
  );
}
