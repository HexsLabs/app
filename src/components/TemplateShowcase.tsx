'use client';
import React from 'react';
import { ArrowUpRight, ChartLine } from 'lucide-react';

interface Template {
  title: string;
  description: string;
  icon?: string;
  bgPattern?: boolean;
  chart?: boolean;
}

const TemplateCard = ({ template }: { template: Template }) => (
  <div className="group relative bg-[#12141A] rounded-xl overflow-hidden hover:ring-1 hover:ring-gray-700 transition-all">
    <div className="aspect-[2/1] relative">
      {template.bgPattern ? (
        <div className="absolute inset-0">
          <div className="absolute inset-0 grid grid-cols-8 grid-rows-4 gap-[1px] opacity-20">
            {Array.from({ length: 32 }).map((_, i) => (
              <div key={i} className="bg-gray-700" />
            ))}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold bg-white text-black w-10 h-10 rounded-full flex items-center justify-center">
              {template.icon}
            </span>
          </div>
        </div>
      ) : template.chart ? (
        <div className="w-full h-full flex items-center justify-center">
          <ChartLine className="w-12 h-12 text-gray-600" />
        </div>
      ) : (
        <div className="w-full h-full bg-[#12141A] flex items-center justify-center">
          <div className="w-3/4 h-3/4 bg-gray-800/50 rounded-lg" />
        </div>
      )}
    </div>

    <div className="p-4">
      <h3 className="text-sm font-medium text-white mb-1">{template.title}</h3>
      <p className="text-sm text-gray-400">{template.description}</p>
    </div>

    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
      <ArrowUpRight className="w-5 h-5 text-gray-400" />
    </div>
  </div>
);

const TemplateShowcase = () => {
  const templates = [
    {
      title: 'Next.js + shadcn/ui',
      description: 'Next.js + Tailwind CSS + shadcn/ui.',
      icon: 'N',
      bgPattern: true,
    },
    {
      title: 'Next.js + Forms',
      description: 'Server actions and Zod validation.',
      preview: true,
    },
  ];

  return (
    <div className="flex justify-center items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
        {templates.map((template, index) => (
          <TemplateCard key={index} template={template} />
        ))}
      </div>
    </div>
  );
};

export default TemplateShowcase;
