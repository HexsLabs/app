import React from 'react';
import Link from 'next/link';

const templates = [
  {
    name: 'Backend',
    description:
      'The backend is the server-side of an application that handles data processing, business logic, database interactions, and API communication to support frontend functionality.',
    icon: '/path-to-agoric-icon.png',
    url: '/templates/backend', 
  },
  {
    name: 'Next.js',
    description:
      'Next.js is a React framework that enables server-side rendering, static site generation, and optimized performance for building fast, scalable web applications.',
    icon: '/path-to-akash-icon.png',
    url: '/templates/next-js', 
  },
];

const Templates = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {templates.map((template, index) => (
        <Link key={index} href={template.url} passHref>
          <div className="bg-[#1a1b1e] rounded-xl p-6 cursor-pointer hover:bg-[#1a1b1e]/80 transition-colors relative overflow-hidden">
            {/* Grid pattern background */}
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full grid grid-cols-6 gap-[1px]">
                {[...Array(24)].map((_, i) => (
                  <div key={i} className="border-r border-t border-white/10" />
                ))}
              </div>
            </div>
            
    
       
            
              
              {/* Text */}
              <div className="space-y-1">
                <h3 className="text-white text-lg font-medium">{template.name}</h3>
                <p className="text-gray-400 text-sm">{template.description}</p>
              </div>
         
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Templates;