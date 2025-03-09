'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Cloud, Zap, Shield, LineChart } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="text-center max-w-5xl mx-auto">
          <div className="inline-block mb-4 px-4 py-1.5 bg-gradient-to-r from-zinc-500/10 to-zinc-300/10 rounded-full">
            <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-white">
              Deployment Made Simple
            </span>
          </div>
          <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-300">
            Deploy Your Apps with Confidence
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience seamless deployment with our powerful platform. Deploy, manage, and scale your applications with enterprise-grade reliability.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/app/dashboard">
              <Button className="bg-gradient-to-r from-zinc-50 to-white text-black hover:from-white hover:to-zinc-50 px-8 py-6 text-lg">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" className="px-8 py-6 text-lg border-zinc-700 hover:bg-zinc-800">
                Learn More
              </Button>
            </Link>
          </div>
          <div className="mt-12 text-sm text-muted-foreground">
            Start building your next great project with Hexs
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Hexs</h2>
            <p className="text-muted-foreground">Everything you need for modern application deployment</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {[
              {
                icon: <Cloud className="h-8 w-8" />,
                title: "Cloud Native",
                description: "Built for modern cloud infrastructure with support for containers and microservices"
              },
              {
                icon: <Zap className="h-8 w-8" />,
                title: "Instant Deployment",
                description: "Deploy your applications in seconds with our optimized deployment pipeline"
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Enterprise Security",
                description: "Bank-grade security with encrypted communications and automated backups"
              },
              {
                icon: <LineChart className="h-8 w-8" />,
                title: "Advanced Analytics",
                description: "Real-time monitoring and insights into your application's performance"
              }
            ].map((feature, index) => (
              <div key={index} className="border border-zinc-800 bg-zinc-900/50 rounded-xl hover:bg-zinc-900/70 transition-colors">
                <div className="p-8">
                  <div className="mb-4 text-zinc-100">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join the next generation of cloud deployment with Hexs
          </p>
          <Link href="/app/dashboard">
            <Button className="bg-gradient-to-r from-zinc-50 to-white text-black hover:from-white hover:to-zinc-50 px-8 py-6 text-lg">
              Start Deploying Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/docs">Documentation</Link></li>
                <li><Link href="/status">Status</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="https://github.com/your-org/hexs" target="_blank" rel="noopener noreferrer">GitHub</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/terms">Terms</Link></li>
                <li><Link href="/privacy">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-zinc-800 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Hexs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 