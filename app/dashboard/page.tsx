"use client";

import { useAuth } from "@/lib/auth/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      router.push("/signin");
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user?.email}</h2>
          <p className="text-muted-foreground">
            This is a protected dashboard page. Only authenticated users can
            access this page.
          </p>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Your Account</h3>
            <div className="space-y-2">
              <div className="flex justify-between p-3 bg-muted rounded-md">
                <span>Email</span>
                <span className="font-medium">{user?.email}</span>
              </div>
              <div className="flex justify-between p-3 bg-muted rounded-md">
                <span>User ID</span>
                <span className="font-medium">{user?.id}</span>
              </div>
              <div className="flex justify-between p-3 bg-muted rounded-md">
                <span>Last Sign In</span>
                <span className="font-medium">
                  {user?.last_sign_in_at
                    ? new Date(user.last_sign_in_at).toLocaleString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
