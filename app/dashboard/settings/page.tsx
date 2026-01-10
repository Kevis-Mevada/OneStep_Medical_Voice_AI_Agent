'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, updateProfile, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u?.displayName) {
        setDisplayName(u.displayName);
      }
    });
    return () => unsub();
  }, []);

  const handleUpdateProfile = async () => {
    if (!user) return;

    setIsLoading(true);
    setMessage(null);
    setError(null);

    try {
      await updateProfile(user, { displayName });
      setMessage("Profile updated successfully!");
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (err: any) {
      console.error(err);
      setError("Failed to sign out");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-10">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <header>
          <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
          <p className="text-sm text-slate-600">
            Manage your account preferences and profile information
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your display name and other profile details
            </CardDescription>
          </CardHeader>
          <div className="space-y-4 px-6 pb-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user?.email ?? ""}
                disabled
                className="bg-slate-50"
              />
              <p className="text-xs text-slate-500">
                Email cannot be changed. Contact support if you need to update it.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>

            {message && <p className="text-sm text-[#16A34A]">{message}</p>}
            {error && <p className="text-sm text-[#DC2626]">{error}</p>}

            <Button
              onClick={handleUpdateProfile}
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Save changes"}
            </Button>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
            <CardDescription>
              Manage your account security and access
            </CardDescription>
          </CardHeader>
          <div className="space-y-3 px-6 pb-6">
            <Button
              variant="outline"
              fullWidth
              onClick={() => router.push("/dashboard")}
            >
              Back to Dashboard
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        </Card>

        <Card className="border-[#DC2626]">
          <CardHeader>
            <CardTitle className="text-[#DC2626]">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible actions that affect your account
            </CardDescription>
          </CardHeader>
          <div className="px-6 pb-6">
            <p className="mb-4 text-sm text-slate-600">
              Once you delete your account, all your consultation data will be permanently removed.
              This action cannot be undone.
            </p>
            <Button
              variant="danger"
              onClick={() => alert("Account deletion will be implemented with proper confirmation flow")}
            >
              Delete Account
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
