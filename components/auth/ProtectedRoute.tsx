"use client";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { useRouter, usePathname } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if the user is loaded (not in loading state) and not authenticated
    if (!isLoading && !user) {
      // Redirect to login page with a return url
      router.push(`/signin?returnUrl=${encodeURIComponent(pathname)}`);
    }
  }, [user, isLoading, router, pathname]);

  // Show loading or nothing while checking authentication
  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If user is authenticated, render children
  return <>{children}</>;
}
