'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "unauthenticated" | "unverified" | "ready">("loading");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (!user) {
        setStatus("unauthenticated");
        router.replace("/login");
        return;
      }

      if (!user.emailVerified) {
        setStatus("unverified");
        router.replace("/verify-email");
        return;
      }

      setStatus("ready");
    });

    return () => unsubscribe();
  }, [router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">
        <div className="rounded-xl bg-white p-6 text-sm text-slate-600 shadow-sm ring-1 ring-slate-100">
          Checking your secure session...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
