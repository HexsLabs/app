"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Cloud,
  Zap,
  Shield,
  LineChart,
  ArrowDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
// Add type declaration for particlesJS
declare global {
  interface Window {
    particlesJS: any;
  }
}

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const router = useRouter();
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove);

    // Initialize particles
    initParticles();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const initParticles = () => {
    // This function will be called during client-side hydration
    if (
      typeof window !== "undefined" &&
      !document.getElementById("particles-js")
    ) {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js";
      script.async = true;
      script.onload = () => {
        if (window.particlesJS) {
          window.particlesJS("particles-js", {
            particles: {
              number: { value: 80, density: { enable: true, value_area: 800 } },
              color: { value: "#ffffff" },
              opacity: { value: 0.1, random: false },
              size: { value: 3, random: true },
              line_linked: {
                enable: true,
                distance: 150,
                color: "#ffffff",
                opacity: 0.1,
                width: 1,
              },
              move: {
                enable: true,
                speed: 1,
                direction: "none",
                random: true,
                out_mode: "out",
              },
            },
            interactivity: {
              detect_on: "canvas",
              events: {
                onhover: { enable: true, mode: "repulse" },
                onclick: { enable: true, mode: "push" },
                resize: true,
              },
            },
            retina_detect: true,
          });
        }
      };
      document.body.appendChild(script);
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative bg-[#030014] overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] right-0 w-[500px] h-[500px] bg-[#4F46E5]/30 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-10%] left-0 w-[600px] h-[600px] bg-[#0EA5E9]/20 blur-[100px] rounded-full" />
      <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-[#EC4899]/20 blur-[100px] rounded-full animate-pulse" />

      {/* Mouse follower glow effect */}
      <div
        className="hidden lg:block glow-cursor absolute pointer-events-none z-0 blur-[80px]"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.6) 0%, rgba(79,70,229,0.2) 40%, rgba(0,0,0,0) 70%)",
          transform: "translate(-50%, -50%)",
          opacity: 0.6,
          transition: "left 0.2s ease-out, top 0.2s ease-out",
        }}
      />

      {/* 3D Sphere Background */}
      <div className="absolute inset-0 sphere-container hidden md:block">
        <div className="sphere">
          <div className="sphere-layer"></div>
          <div className="sphere-layer"></div>
          <div className="sphere-layer"></div>
          <div className="sphere-layer"></div>
        </div>
      </div>

      {/* Particles container */}
      <div id="particles-js" className="fixed inset-0 z-0 opacity-50" />

      {/* Grid pattern overlay */}
      <div
        className="fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Navbar */}
      <nav className="relative z-10 py-4 md:py-6 px-4 md:px-12 flex justify-between items-center backdrop-blur-sm bg-black/10 border-b border-white/10">
        <div className="font-bold text-xl md:text-2xl text-white">Aquanode</div>
        <Link href="/app/dashboard">
          <Button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-4 md:px-5 py-1.5 md:py-2 text-sm md:text-base rounded-full">
            Dashboard
          </Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative py-16 md:py-32 md:pb-16 px-4 z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl mx-auto relative z-1000"
        >
          <div className="inline-block mb-4 md:mb-6 px-4 md:px-6 py-1.5 md:py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full border border-indigo-500/30 shadow-[0_0_15px_rgba(79,70,229,0.3)]">
            <span className="text-xs md:text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center">
              <span className="mr-2 bg-indigo-500/80 p-1 rounded-full">
                <Zap className="h-2 w-2 md:h-3 md:w-3 text-white" />
              </span>
              Deployment Made Simple
            </span>
          </div>

          <h1 className="text-4xl md:text-7xl font-bold mb-4 md:mb-6 leading-tight">
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
              Deploy Your Apps
            </span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-300 to-white">
              with Confidence
            </span>
            <div className="absolute left-1/2 transform -translate-x-1/2 mt-2">
              <div className="w-32 md:w-40 h-1 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 blur-sm" />
              <div className="w-16 md:w-20 h-1 mx-auto rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500" />
            </div>
          </h1>

          <motion.p
            className="text-base md:text-xl text-zinc-400 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Experience seamless deployment with our powerful platform. Deploy,
            manage, and scale your applications with enterprise-grade
            reliability.
          </motion.p>

          {/* Interactive Code Snippet */}
          {/* <div className="hidden md:block relative mx-auto max-w-lg mb-10 group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 blur-md opacity-30 group-hover:opacity-40 transition-opacity rounded-xl" />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="relative bg-black/80 backdrop-blur-sm rounded-xl p-4 border border-white/10 overflow-hidden text-left font-mono text-sm"
            >
              <div className="flex items-center mb-3">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="text-zinc-500 text-xs ml-3">Terminal</div>
              </div>
              <div className="text-zinc-300">
                <span className="text-green-400">$</span>{" "}
                <span className="text-zinc-500">npm</span> install aquanode
                <br />
                <span className="text-cyan-400">Installing packages...</span>
                <br />
                <span className="text-green-400">✓</span> Successfully
                installed!
                <br />
                <span className="text-green-400">$</span>{" "}
                <span className="text-zinc-500">npx</span> aquanode deploy
                <br />
                <div className="typing-animation">
                  <span className="text-cyan-400">
                    Deploying application to cloud...{" "}
                  </span>
                  <span className="blinking-cursor">|</span>
                </div>
              </div>
            </motion.div>
          </div> */}

          <motion.div
            className="flex flex-col sm:flex-row gap-4 md:gap-5 justify-center mb-10 relative z-[100]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Link href="/app/dashboard">
              <Button
                onClick={() => router.push("/app/dashboard")}
                className="relative overflow-hidden group w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white px-6 md:px-8 py-4 md:py-6 text-base md:text-lg rounded-xl shadow-[0_5px_15px_rgba(79,70,229,0.4)]"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center justify-center">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
            <Link href="#features">
              <Button
                variant="outline"
                className="w-full sm:w-auto backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10 text-white px-6 md:px-8 py-4 md:py-6 text-base md:text-lg rounded-xl"
              >
                Learn More
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="mt-10 md:mt-16 text-xs md:text-sm text-zinc-500 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Start building your next great project with Aquanode
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="ml-3"
            >
              <ArrowDown className="h-3 w-3 md:h-4 md:w-4" />
            </motion.div>
          </motion.div>

          {/* Orbit Element */}
          <div className="hidden md:block absolute top-1/2 right-24 transform -translate-y-1/2">
            <div className="orbit-container">
              <div className="orbit">
                <div className="satellite satellite-1"></div>
                <div className="satellite satellite-2"></div>
                <div className="satellite satellite-3"></div>
              </div>
            </div>
          </div>

          {/* Floating 3D elements */}
          <div className="hidden md:block">
            <div
              className="absolute top-1/3 right-[5%] w-20 h-20 bg-indigo-500/30 rounded-2xl blur-sm animate-float"
              style={{ animationDelay: "0s", animationDuration: "8s" }}
            />
            <div
              className="absolute top-2/3 left-[10%] w-12 h-12 bg-cyan-500/20 rounded-full blur-sm animate-float"
              style={{ animationDelay: "1s", animationDuration: "6s" }}
            />
            <div
              className="absolute bottom-1/4 right-[15%] w-16 h-16 bg-purple-500/20 rounded-xl rotate-45 blur-sm animate-float"
              style={{ animationDelay: "2s", animationDuration: "10s" }}
            />
          </div>

          {/* 3D Perspective Elements */}
          <div
            className="absolute w-full h-full max-w-7xl mx-auto inset-0 opacity-20 hidden lg:block perspective-container overflow-hidden"
            style={{
              transform: `perspective(1000px) rotateX(${scrollY * 0.02}deg) rotateY(${scrollY * 0.01}deg)`,
            }}
          >
            <div
              className="absolute left-[10%] top-[20%] w-32 h-32 border border-indigo-500/30 rounded-xl transform rotate-12 backdrop-blur-sm"
              style={{
                transform: `translateZ(${50 + scrollY * 0.1}px) rotateY(${scrollY * 0.05}deg)`,
              }}
            />
            <div
              className="absolute right-[20%] top-[30%] w-24 h-24 border border-cyan-500/30 rounded-full transform"
              style={{
                transform: `translateZ(${100 + scrollY * 0.2}px) rotateX(${scrollY * 0.05}deg)`,
              }}
            />
            <div
              className="absolute left-[25%] bottom-[20%] w-40 h-40 border border-purple-500/20 rounded-lg transform rotate-45"
              style={{
                transform: `translateZ(${75 + scrollY * 0.15}px) rotateZ(${scrollY * 0.02}deg)`,
              }}
            />
          </div>
        </motion.div>

        {/* Animated light ring effect */}
        <div className="absolute bottom-[-150px] left-1/2 transform -translate-x-1/2 w-[500px] md:w-[800px] h-[500px] md:h-[800px] border border-white/5 rounded-full" />
        <div className="absolute bottom-[-100px] left-1/2 transform -translate-x-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] border border-white/5 rounded-full" />
        <div className="absolute bottom-[-50px] left-1/2 transform -translate-x-1/2 w-[200px] md:w-[400px] h-[200px] md:h-[400px] border border-white/5 rounded-full" />
      </section>

      {/* Tech logos ticker */}
      {/* <div className="relative py-10 overflow-hidden bg-gradient-to-r from-black/40 via-indigo-950/20 to-black/40 backdrop-blur-sm border-y border-white/5 z-10">
        <div className="flex justify-center items-center text-zinc-500 text-sm mb-4">
          TRUSTED BY DEVELOPERS WORLDWIDE
        </div>
        <div className="flex animate-marquee">
          {Array(10)
            .fill("")
            .map((_, i) => (
              <div key={i} className="flex space-x-16 mx-8">
                <div className="text-zinc-600 font-mono">vercel</div>
                <div className="text-zinc-600 font-mono">docker</div>
                <div className="text-zinc-600 font-mono">aws</div>
                <div className="text-zinc-600 font-mono">cloudflare</div>
                <div className="text-zinc-600 font-mono">github</div>
                <div className="text-zinc-600 font-mono">kubernetes</div>
              </div>
            ))}
        </div>
      </div> */}

      {/* Features Section */}
      <section id="features" className="relative py-20 md:py-32 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-3 py-1 mb-4 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 rounded-full text-xs md:text-sm text-indigo-400 font-medium border border-indigo-500/20">
              Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
              Why Choose Aquanode
            </h2>
            <p className="text-sm md:text-base text-zinc-400 max-w-2xl mx-auto">
              Everything you need for modern application deployment
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {[
              {
                icon: <Cloud className="h-8 w-8" />,
                title: "Cloud Native",
                description:
                  "Built for modern cloud infrastructure with support for containers and microservices",
                gradient: "from-blue-600 to-indigo-600",
                delay: 0,
              },
              {
                icon: <Zap className="h-8 w-8" />,
                title: "Instant Deployment",
                description:
                  "Deploy your applications in seconds with our optimized deployment pipeline",
                gradient: "from-amber-500 to-orange-600",
                delay: 0.2,
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Crypto Support",
                description: "Pay for deployments directly with crypto",
                gradient: "from-emerald-500 to-green-600",
                delay: 0.4,
              },
              {
                icon: <LineChart className="h-8 w-8" />,
                title: "Advanced Analytics",
                description:
                  "Real-time monitoring and insights into your application's performance",
                gradient: "from-purple-600 to-indigo-600",
                delay: 0.6,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: feature.delay, duration: 0.6 }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative h-full border backdrop-blur-md bg-black/30 border-white/10 rounded-2xl overflow-hidden group-hover:border-indigo-500/50 transition-colors duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/20" />
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative p-5 md:p-8">
                    <div
                      className={`inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl mb-4 md:mb-6 bg-gradient-to-r ${feature.gradient} text-white shadow-lg`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm md:text-base text-zinc-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 md:py-32 overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 to-black/50" />
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        <div className="absolute w-96 h-96 top-12 left-1/4 bg-indigo-600/30 rounded-full blur-[120px]" />

        <motion.div
          className="relative max-w-4xl mx-auto text-center px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* <div className="inline-block mb-6 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
            <span className="text-sm text-zinc-300">
              Join 10,000+ developers
            </span>
          </div> */}
          <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-300 to-white">
            Ready to Get Started?
          </h2>
          <p className="text-base md:text-xl text-zinc-400 mb-8 md:mb-10">
            Join the next generation of cloud deployment with Aquanode
          </p>
          <Link href="/app/dashboard">
            <Button className="relative overflow-hidden group bg-white hover:bg-zinc-100 text-black px-6 md:px-8 py-4 md:py-6 text-base md:text-lg rounded-xl shadow-[0_0_30px_rgba(79,70,229,0.5)]">
              <span className="absolute inset-0 w-0 group-hover:w-full bg-gradient-to-r from-indigo-500 to-cyan-500 opacity-20 transition-all duration-500" />
              <span className="relative flex items-center font-semibold">
                Start Deploying Now
                <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </Link>

          {/* 3D geometric shapes */}
          <div className="hidden md:block">
            <div className="absolute bottom-20 left-10 w-24 h-24 border border-white/20 rounded-full" />
            <div className="absolute top-20 right-10 w-32 h-32 border border-white/10 rounded-xl rotate-12" />
            <div className="absolute -bottom-10 right-1/4 w-40 h-40 border border-indigo-500/20 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 md:py-16 border-t border-zinc-800 z-10 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-glow-line" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80" />

        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row justify-between mb-10 md:mb-12">
            <div className="mb-10 md:mb-0">
              <div className="text-xl md:text-2xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                Aquanode
              </div>
              <p className="text-sm md:text-base text-zinc-500 max-w-xs">
                Modern cloud deployment platform for developers and enterprises
              </p>

              <div className="mt-4 md:mt-6 flex space-x-4">
                <a
                  href="https://github.com/Aquanodeio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-zinc-800 hover:bg-indigo-600 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="https://x.com/aquanodeio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-zinc-800 hover:bg-blue-600 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
              <div className="group">
                <h3 className="text-sm md:text-base font-bold mb-3 md:mb-4 text-white group-hover:text-indigo-400 transition-colors">
                  Product
                </h3>
                <ul className="space-y-2 md:space-y-3 text-zinc-400">
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors inline-flex items-center group-hover:text-indigo-400 text-sm md:text-base"
                    >
                      Documentation
                      <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors inline-flex items-center group-hover:text-indigo-400 text-sm md:text-base"
                    >
                      Status
                      <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="group">
                <h3 className="text-sm md:text-base font-bold mb-3 md:mb-4 text-white group-hover:text-indigo-400 transition-colors">
                  Support
                </h3>
                <ul className="space-y-2 md:space-y-3 text-zinc-400">
                  <li>
                    <Link
                      href="mailto:contact@aquanode.io"
                      className="hover:text-white transition-colors inline-flex items-center group-hover:text-indigo-400 text-sm md:text-base"
                    >
                      Contact
                      <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://github.com/Aquanodeio"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors inline-flex items-center group-hover:text-indigo-400 text-sm md:text-base"
                    >
                      GitHub
                      <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="group">
                <h3 className="text-sm md:text-base font-bold mb-3 md:mb-4 text-white group-hover:text-indigo-400 transition-colors">
                  Legal
                </h3>
                <ul className="space-y-2 md:space-y-3 text-zinc-400">
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors inline-flex items-center group-hover:text-indigo-400 text-sm md:text-base"
                    >
                      Terms
                      <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors inline-flex items-center group-hover:text-indigo-400 text-sm md:text-base"
                    >
                      Privacy
                      <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-6 md:pt-8 border-t border-zinc-800/50 text-center text-xs md:text-sm text-zinc-600">
            <div className="flex items-center justify-center mb-2">
              <span className="inline-block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 h-1 w-12 md:w-16 rounded-full animate-gradient"></span>
            </div>
            <p>
              &copy; {new Date().getFullYear()} Aquanode. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Add CSS for animations */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes glow-line {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes rotate3d {
          0% {
            transform: rotateX(0deg) rotateY(0deg);
          }
          100% {
            transform: rotateX(360deg) rotateY(360deg);
          }
        }

        .animate-float {
          animation: float 10s ease-in-out infinite;
        }

        .animate-marquee {
          animation: marquee 30s linear infinite;
        }

        .animate-glow-line {
          animation: glow-line 2s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .sphere-container {
          perspective: 1200px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: -1;
        }

        .sphere {
          position: relative;
          width: 600px;
          height: 600px;
          transform-style: preserve-3d;
          animation: rotate3d 40s linear infinite;
        }

        @media (max-width: 768px) {
          .sphere {
            width: 300px;
            height: 300px;
          }

          body {
            overflow-x: hidden;
          }

          html,
          body {
            max-width: 100%;
          }
        }

        .sphere-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 1px solid rgba(79, 70, 229, 0.1);
          box-shadow: 0 0 50px rgba(79, 70, 229, 0.1);
          transform-style: preserve-3d;
        }

        .sphere-layer:nth-child(1) {
          transform: rotateX(0deg) rotateY(0deg);
        }

        .sphere-layer:nth-child(2) {
          transform: rotateX(30deg) rotateY(20deg);
        }

        .sphere-layer:nth-child(3) {
          transform: rotateX(60deg) rotateY(40deg);
        }

        .sphere-layer:nth-child(4) {
          transform: rotateX(90deg) rotateY(60deg);
        }

        @keyframes typing {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }

        .typing-animation {
          display: inline-block;
          white-space: nowrap;
          overflow: hidden;
          animation: typing 3s steps(40) infinite;
        }

        .blinking-cursor {
          animation: blink 1s step-end infinite;
        }

        /* Orbit animation */
        .orbit-container {
          position: relative;
          width: 150px;
          height: 150px;
        }

        .orbit {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 50%;
          animation: rotate3d 20s linear infinite;
        }

        .satellite {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(99, 102, 241, 0.8);
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.8);
        }

        .satellite-1 {
          top: 0;
          left: 50%;
          transform: translateX(-50%);
        }

        .satellite-2 {
          bottom: 30%;
          right: 0;
        }

        .satellite-3 {
          bottom: 30%;
          left: 0;
        }
      `}</style>
    </div>
  );
}
