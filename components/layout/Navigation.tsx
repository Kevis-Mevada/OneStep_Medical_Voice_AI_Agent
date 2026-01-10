'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";

export function Navigation() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.jpeg"
            alt="Onestep Medical Voice AI"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <span className="text-lg font-semibold text-slate-900">
            Onestep Medical AI
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-[#0F766E]"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-[#0F766E]"
          >
            About
          </Link>

          {!isLoading && (
            <>
              {user ? (
                <div className="flex items-center gap-4">
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium text-slate-600 transition-colors hover:text-[#0F766E]"
                  >
                    Dashboard
                  </Link>
                  <div className="relative">
                    <button
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="flex items-center gap-2 rounded-full bg-[#F8FAFC] p-2 transition-colors hover:bg-slate-200"
                      title={user.email ?? "User"}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0F766E] text-sm font-medium text-white">
                        {user.displayName
                          ? user.displayName.charAt(0).toUpperCase()
                          : user.email?.charAt(0).toUpperCase() ?? "U"}
                      </div>
                    </button>
                    {isMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-slate-100">
                        <div className="border-b border-slate-100 px-4 py-3">
                          <p className="text-xs text-slate-500">Signed in as</p>
                          <p className="truncate text-sm font-medium text-slate-900">
                            {user.email}
                          </p>
                        </div>
                        <div className="py-2">
                          <Link
                            href="/dashboard/settings"
                            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Settings
                          </Link>
                          <button
                            onClick={handleSignOut}
                            className="w-full px-4 py-2 text-left text-sm text-[#DC2626] hover:bg-slate-50"
                          >
                            Sign out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/login"
                    className="text-sm font-medium text-slate-600 transition-colors hover:text-[#0F766E]"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-full bg-[#0F766E] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0b5b55]"
                  >
                    Get started
                  </Link>
                </div>
              )}
            </>
          )}
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Toggle menu"
        >
          <span className="h-0.5 w-6 bg-slate-900"></span>
          <span className="h-0.5 w-6 bg-slate-900"></span>
          <span className="h-0.5 w-6 bg-slate-900"></span>
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-slate-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-slate-600"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-slate-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="text-sm font-medium text-slate-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-left text-sm font-medium text-[#DC2626]"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium text-[#0F766E]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
