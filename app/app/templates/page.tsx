import React from "react";
import { TemplateGrid, templates } from "@/components/templates";

const Templates = () => {
  return (
    <section className="min-h-screen bg-background text-foreground py-6 sm:py-12">
      <div className="max-w-6xl mx-auto px-0 sm:px-6">
        <div className="px-4 sm:px-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
            Deployment Templates
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-8 sm:mb-12 max-w-3xl">
            Start with a pre-configured template to deploy your application
            faster. These templates provide you with a complete setup that you
            can customize to your needs.
          </p>
        </div>
        <div className="px-4 sm:px-0">
          <TemplateGrid templates={templates} />
        </div>
      </div>
    </section>
  );
};

export default Templates;
