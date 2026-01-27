'use client';

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleInitiateReset = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!email) {
      setError("Email is required to initiate password reset.");
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          action: 'initiate-reset'
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
      } else {
        setError(data.error || "Failed to initiate password reset. Please try again.");
      }
    } catch (err: any) {
      console.error("Reset password error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset your password</CardTitle>
          <CardDescription>
            Enter your email to receive instructions to reset your password.
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleInitiateReset} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email-display">Email</Label>
            <Input
              id="email-display"
              type="email"
              value={email}
              readOnly
              disabled
            />
          </div>

          {error && <p className="text-sm text-[#DC2626]">{error}</p>}
          {message && <p className="text-sm text-[#16A34A]">{message}</p>}

          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? "Processing..." : "Send Reset Instructions"}
          </Button>

          <p className="mt-2 text-center text-sm text-slate-600">
            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="font-medium text-[#2563EB] hover:underline"
            >
              Back to forgot password
            </button>
          </p>
        </form>

        <p className="mt-4 text-xs text-slate-500 px-6 pb-6">
          You will receive a password reset link in your email. This link will be sent securely from Firebase.
        </p>
      </Card>
    </div>
  );
}
