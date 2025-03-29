'use client';

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const NextjsServicePage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Next.js Deployment</h1>
      </div>

      <Card className="gradient-border card-shadow">
        <CardContent className="gradient-bg p-8 rounded-3xl">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Next.js Deployment</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Deploy your Next.js applications with ease. Configure your deployment settings and get your application up and running in minutes.
            </p>
            <p className="text-xl mb-8">Coming Soon</p>
            <Button className="gradient-bg text-foreground hover:opacity-90 px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl" disabled>
              Create Deployment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NextjsServicePage; 