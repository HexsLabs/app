import React from 'react';
import Link from 'next/link';

const services = [
  {
    name: 'Backend',
    description:
      'The backend is the server-side of an application that handles data processing, business logic, database interactions, and API communication to support frontend functionality.',
    url: '/app/services/backend',
    icon: '🖥️',
  },
  {
    name: 'Jupyter',
    description:
      'Jupyter Notebooks provide an interactive computing environment for creating and sharing documents containing live code, equations, visualizations, and narrative text.',
    url: '/app/services/jupyter',
    icon: '📊',
  },
];

const ServicesPage = () => {
  return (
    <section className="min-h-screen bg-background text-foreground py-16">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold mb-6 text-center">Available Services</h2>
        <p className="text-center text-lg mb-12 text-muted-foreground">
          Select a service to deploy and manage your applications
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Link key={index} href={service.url} className="block">
              <div className="gradient-border card-shadow h-full">
                <div className="gradient-bg p-8 rounded-3xl hover-effect h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    <span className="text-4xl mr-3">{service.icon}</span>
                    <h3 className="text-2xl font-semibold">{service.name}</h3>
                  </div>
                  <p className="text-muted-foreground flex-grow">{service.description}</p>
                  <div className="mt-6 text-right">
                    <span className="text-primary font-medium">Deploy now →</span>
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

export default ServicesPage; 