import React from "react";
import Link from "next/link";

const templates = [
  {
    name: "Backend",
    description:
      "The backend is the server-side of an application that handles data processing, business logic, database interactions, and API communication to support frontend functionality.",
    url: "/app/templates/backend?from=/app/templates",
  },
  {
    name: "Next.js",
    description:
      "Next.js is a React framework that enables server-side rendering, static site generation, and optimized performance for building fast, scalable web applications.",
    url: "/app/templates/nextjs?from=/app/templates",
  },
];

const Templates = () => {
  return (
    <section className="min-h-screen bg-background text-foreground py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="section-title text-center">Find your Template</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
          Jumpstart your app development with our pre-built solutions.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.map((template, index) => (
            <Link key={index} href={template.url} className="block group">
              <div className="dashboard-card subtle-glow">
                <div className="flex flex-col h-full">
                  <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors duration-300">
                    {template.name}
                  </h3>
                  <p className="text-muted-foreground">
                    {template.description}
                  </p>
                  <div className="mt-6 text-right">
                    <span className="text-primary font-medium group-hover:translate-x-1 inline-flex transition-transform duration-300">
                      Use template →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Templates;
