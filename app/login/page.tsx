'use client';

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const googleProvider = new GoogleAuthProvider();

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      setIsLoading(true);
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const user = credential.user;

      if (!user.emailVerified) {
        router.push("/verify-email");
        return;
      }

      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Unable to log in. Please check your details and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Sign-in timeout')), 30000)
      );
      
      const credential = await Promise.race([
        signInWithPopup(auth, googleProvider),
        timeoutPromise
      ]) as any;
      
      const user = credential.user;

      // Google accounts are automatically verified
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      
      // Handle popup closed by user (most common case)
      if (err?.code === "auth/popup-closed-by-user") {
        setError("Sign-in window was closed. Please click the button again to continue.");
      } else if (err?.code === "auth/cancelled-popup-request") {
        // User closed popup or opened another one - silently ignore
        setError(null);
      } else if (err?.message?.includes('timeout')) {
        setError("Sign-in took too long. Please try again.");
      } else if (err?.code === "auth/network-request-failed") {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError(err?.message ?? "Unable to sign in with Google. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>
            Log in to continue your health guidance sessions.
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
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-[#DC2626]">{error}</p>}

          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? "Signing in..." : "Log in"}
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">Or continue with</span>
            </div>
          </div>
          
          <p className="text-xs text-center text-slate-500 mb-2">
            Tip: Keep the sign-in window open until you complete the process
          </p>

          <Button
            type="button"
            variant="outline"
            fullWidth
            disabled={isLoading}
            onClick={handleGoogleSignIn}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </Button>

          <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
            <button
              type="button"
              onClick={() => router.push("/register")}
              className="text-[#2563EB] hover:underline"
            >
              Create account
            </button>
            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="text-[#2563EB] hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            This assistant provides general health information only. It does not diagnose conditions or replace a licensed medical professional.
          </p>
        </form>
      </Card>
    </div>
  );
}
