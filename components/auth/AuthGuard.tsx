'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, type User as FirebaseAuthUser } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserProfile } from "@/lib/firestore";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "unauthenticated" | "unverified" | "not-admin" | "ready">("loading");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: FirebaseAuthUser | null) => {
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

      // If admin access is required, check user role
      if (requireAdmin) {
        try {
          const profileResult = await getUserProfile(user.uid);
          if (!profileResult.success || !profileResult.profile) {
            setStatus("not-admin");
            router.replace("/");
            return;
          }
          
          // Type assertion to access role property
          const userProfile = profileResult.profile as any;
          if (userProfile.role !== "admin") {
            setStatus("not-admin");
            // Redirect to home or show unauthorized message
            router.replace("/");
            return;
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
          setStatus("not-admin");
          router.replace("/");
          return;
        }
      }

      setStatus("ready");
    });

    return () => unsubscribe();
  }, [router, requireAdmin]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">
        <div className="rounded-xl bg-white p-6 text-sm text-slate-600 shadow-sm ring-1 ring-slate-100">
          Checking your secure session...
        </div>
      </div>
    );
  }

  if (status === "not-admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">
        <div className="rounded-xl bg-white p-6 text-sm text-slate-600 shadow-sm ring-1 ring-slate-100">
          Unauthorized access. Admin privileges required.
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
