"use client";

import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";
import DesktopOnly from "@/components/DesktopOnly";
import Layout from "@/components/Layout";
import Navbar from "@/components/Navbar";
import { WagmiProvider } from "wagmi";
import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { baseSepolia } from "viem/chains";
import { useState, useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

const wagmiConfig = createConfig({
    chains: [baseSepolia],
    connectors: [injected()],
    transports: {
        [baseSepolia.id]: http(),
    },
});

const queryClient = new QueryClient();

const demoAppInfo = {
    appName: "Hexs",
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
                    {mounted ? children : null}
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

    return (
        <html lang="en" className="dark">
            <body className={`${inter.className} min-h-screen bg-background`}>
                <Providers>
                    <DesktopOnly>
                        <div className="flex flex-col min-h-screen">
                            <Navbar />
                            <main className="flex-1">
                                {pathname.startsWith("/app") ? (
                                    <Layout>{children}</Layout>
                                ) : (
                                    <div className="container mx-auto">
                                        {children}
                                    </div>
                                )}
                            </main>
                        </div>
                    </DesktopOnly>
                </Providers>
            </body>
        </html>
    );
}
