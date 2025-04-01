"use client";

import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";
import DesktopOnly from "@/components/DesktopOnly";
import Layout from "@/components/Layout";
import Navbar from "@/components/Navbar";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RainbowKitProvider,
  darkTheme,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { baseSepolia } from "viem/chains";
import { useState, useEffect } from "react";
import {
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { AuthProvider } from "@/lib/auth/AuthContext";

const inter = Inter({ subsets: ["latin"] });

const wagmiConfig = getDefaultConfig({
  appName: "Aquanode",
  projectId: "YOUR_PROJECT_ID",
  chains: [baseSepolia],
  wallets: [
    {
      groupName: "Popular",
      wallets: [metaMaskWallet, coinbaseWallet, walletConnectWallet],
    },
  ],
});

const queryClient = new QueryClient();

const demoAppInfo = {
  appName: "Aquanode",
};

function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme()}
          initialChain={baseSepolia}
          appInfo={demoAppInfo}
        >
          <AuthProvider>{mounted && children}</AuthProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Routes that need the navbar but aren't part of the /app section
  const routesWithNavbar = ["/signin", "/signup", "/reset-password"];
  const needsNavbar = routesWithNavbar.some((route) =>
    pathname.startsWith(route)
  );

  // Routes that don't need the navbar (home page has its own header)
  const isHomePage = pathname === "/";

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-background`}>
        <Providers>
          <DesktopOnly>
            <div className="flex flex-col min-h-screen">
              {/* Show Navbar only on auth pages */}
              {needsNavbar && <Navbar />}

              <main className="flex-1">
                {pathname.startsWith("/app") ? (
                  <Layout>{children}</Layout>
                ) : (
                  <div className="container mx-auto">{children}</div>
                )}
              </main>
            </div>
          </DesktopOnly>
        </Providers>
      </body>
    </html>
  );
}
