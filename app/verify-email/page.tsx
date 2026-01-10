'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { resendVerificationEmail } from "@/lib/email-actions";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "unverified" | "verified">("checking");
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: any) => {
      if (user?.emailVerified) {
        setStatus("verified");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else if (user) {
        setStatus("unverified");
      } else {
        // No user signed in, redirect to login
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleResendEmail = async () => {
    setIsResending(true);
    setResendMessage(null);
    setResendError(null);

    const result = await resendVerificationEmail();

    if (result.success) {
      setResendMessage(result.message || "Verification email sent! Please check your inbox.");
    } else {
      setResendError(result.error || "Failed to resend email. Please try again.");
    }

    setIsResending(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Email verification required</CardTitle>
          <CardDescription>
            We&apos;ve sent a verification link to your email. Please verify your email before using the assistant.
          </CardDescription>
        </CardHeader>
        <div className="space-y-4">
          {status === "checking" && (
            <p className="text-sm text-slate-600">Checking your verification status...</p>
          )}
          {status === "verified" && (
            <p className="text-sm text-[#16A34A] font-medium">
              ✓ Email verified! Redirecting to dashboard...
            </p>
          )}
          {status === "unverified" && (
            <>
              <p className="text-sm text-slate-600">
                We&apos;ve sent a verification link to your email. Please check your inbox and spam folder, then click
                the link to verify your account.
              </p>
              <p className="text-sm text-slate-600">
                After verifying, you can return here and refresh the page, or simply log in again.
              </p>

              {resendMessage && <p className="text-sm text-[#16A34A]">{resendMessage}</p>}
              {resendError && <p className="text-sm text-[#DC2626]">{resendError}</p>}

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResendEmail}
                  disabled={isResending}
                >
                  {isResending ? "Sending..." : "Resend verification email"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => window.location.reload()}
                >
                  I&apos;ve verified, refresh page
                </Button>
              </div>
            </>
          )}

          <Button
            type="button"
            fullWidth
            variant="outline"
            onClick={() => router.push("/login")}
          >
            Back to login
          </Button>

          <p className="mt-4 text-xs text-slate-500">
            This assistant provides general health information only. It does not diagnose conditions or replace a
            licensed medical professional.
          </p>
        </div>
      </Card>
    </div>
  );
}
