import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EmailConfirmedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="mb-6">
          <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="h-8 w-8 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold">Email Confirmed!</h1>
        <p className="text-gray-600">
          Your email address has been successfully verified. You can now sign in
          to your account.
        </p>

        <div className="mt-8">
          <Link href="/signin">
            <Button className="w-full">Sign In</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
