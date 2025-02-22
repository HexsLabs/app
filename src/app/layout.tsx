import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import DesktopOnly from "@/components/DesktopOnly";
import Layout from "@/components/Layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Orchestrator",
  description: "Deploy and manage your applications with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <DesktopOnly> <Layout>{children}</Layout></DesktopOnly>
      </body>
    </html>
  );
}
