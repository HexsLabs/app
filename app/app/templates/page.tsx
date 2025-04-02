import React from "react";
import { TemplateGrid, templates } from "@/components/templates";

const Templates = () => {
  return (
    <section className="min-h-screen bg-background text-foreground py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-4">Deployment Templates</h1>
        <p className="text-muted-foreground mb-12 max-w-3xl">
          Start with a pre-configured template to deploy your application faster. These templates provide
          you with a complete setup that you can customize to your needs.
        </p>
        <TemplateGrid templates={templates} />
      </div>
    </section>
  );
};

export default Templates;
