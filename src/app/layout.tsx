'use client';

import { Inter } from "next/font/google";
import { usePathname } from 'next/navigation';
import "./globals.css";
import DesktopOnly from "@/components/DesktopOnly";
import Layout from "@/components/Layout";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-background`}>
        <DesktopOnly>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              {pathname.startsWith('/app') ? (
                <Layout>{children}</Layout>
              ) : (
                <div className="container mx-auto">
                  {children}
                </div>
              )}
            </main>
          </div>
        </DesktopOnly>
      </body>
    </html>
  );
}
