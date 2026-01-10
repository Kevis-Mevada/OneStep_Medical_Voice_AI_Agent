'use client';

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { sendPasswordReset } from "@/lib/email-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!email || !email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setIsLoading(true);
      const result = await sendPasswordReset(email);
      
      if (result.success) {
        setMessage(
          result.message || 
          "If an account exists for this email, a password reset link has been sent. Please check your inbox and spam folder."
        );
      } else {
        setError(result.error || "Unable to send reset email. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
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
            Enter your email to receive a secure password reset link.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-[#DC2626]">{error}</p>}
          {message && <p className="text-sm text-[#16A34A]">{message}</p>}

          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? "Sending link..." : "Send reset link"}
          </Button>

          <p className="mt-2 text-center text-sm text-slate-600">
            Remembered your password?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="font-medium text-[#2563EB] hover:underline"
            >
              Back to login
            </button>
          </p>

          <p className="mt-4 text-xs text-slate-500">
            Your email is used only for secure account access. No health details are sent over email.
          </p>
        </form>
      </Card>
    </div>
  );
}
