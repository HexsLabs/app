"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { authService } from "@/lib/auth/authService";

export default function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset states
    setError(null);
    setSuccessMessage(null);

    // Validate input
    if (!email) {
      setError("Email is required");
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await authService.resetPassword({ email });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccessMessage(
        "Password reset instructions have been sent to your email"
      );
      // Clear form
      setEmail("");
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Reset Your Password</h1>
        <p className="text-gray-500 mt-2">
          Enter your email and we&apos;ll send you instructions to reset your
          password
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">
            {successMessage}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Sending instructions..." : "Send reset instructions"}
        </Button>
      </form>

      <div className="text-center text-sm">
        Remember your password?{" "}
        <a href="/signin" className="text-blue-600 hover:underline">
          Sign in
        </a>
      </div>
    </div>
  );
}
