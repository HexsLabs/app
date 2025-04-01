// components/Layout.tsx
"use client";
import React, { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onMobileMenuToggle={toggleMobileMenu} />
      <div className="flex flex-1">
        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar container */}
        <Sidebar isMobileOpen={mobileMenuOpen} />

        {/* Main content - with left margin to accommodate fixed sidebar */}
        <main className="flex-1 ml-0 md:ml-60 overflow-auto">
          <div className="h-full p-4">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
