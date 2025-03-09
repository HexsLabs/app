import React from 'react';
import Link from 'next/link';

const templates = [
  {
    name: 'Backend',
    description:
      'The backend is the server-side of an application that handles data processing, business logic, database interactions, and API communication to support frontend functionality.',
    url: '/templates/backend',
  },
  {
    name: 'Next.js',
    description:
      'Next.js is a React framework that enables server-side rendering, static site generation, and optimized performance for building fast, scalable web applications.',
    url: '/templates/next-js',
  },
];

const Templates = () => {
  return (
    <section className="min-h-screen bg-background text-foreground py-16">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold mb-6 text-center">Find your Template</h2>
        <p className="text-center text-lg mb-12 text-muted-foreground">
          Jumpstart your app development <br /> process with our pre-built solutions.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {templates.map((template, index) => (
            <Link key={index} href={template.url} className="block">
              <div className="gradient-border card-shadow">
                <div className="gradient-bg p-8 rounded-3xl hover-effect">
                  <h3 className="text-2xl font-semibold mb-4">{template.name}</h3>
                  <p className="text-muted-foreground">{template.description}</p>
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