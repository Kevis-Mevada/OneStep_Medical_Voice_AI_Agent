'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, type User as FirebaseAuthUser } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Stats {
  totalConsultations: number;
  totalUsers: number;
  emergencyCount: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<FirebaseAuthUser | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        fetchStats(u.uid);
      }
    });
    return () => unsub();
  }, []);

  const fetchStats = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin?type=stats&userId=${userId}`);
      
      if (!response.ok) {
        console.error("Failed to fetch stats:", response.status);
        return;
      }
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Received non-JSON response from API");
        return;
      }
      
      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header>
          <h1 className="text-2xl font-semibold text-slate-900">Admin Dashboard</h1>
          <p className="text-sm text-slate-600 mt-2">
            Monitor platform usage, user activity, and AI consultations
          </p>
        </header>

        {isLoading ? (
          <Card>
            <div className="p-8 text-center text-sm text-slate-600">Loading statistics...</div>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-[#0F766E]">
                    {stats?.totalUsers ?? 0}
                  </CardTitle>
                  <CardDescription>Total Users</CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-[#2563EB]">
                    {stats?.totalConsultations ?? 0}
                  </CardTitle>
                  <CardDescription>Total Consultations</CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-[#DC2626]">
                    {stats?.emergencyCount ?? 0}
                  </CardTitle>
                  <CardDescription>Emergency Alerts</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="cursor-pointer transition-shadow hover:shadow-md"
                    onClick={() => router.push("/admin/users")}>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    View and manage registered users, access levels, and account status
                  </CardDescription>
                </CardHeader>
                <div className="px-6 pb-6">
                  <Button variant="outline">Manage Users →</Button>
                </div>
              </Card>

              <Card className="cursor-pointer transition-shadow hover:shadow-md"
                    onClick={() => router.push("/admin/monitoring")}>
                <CardHeader>
                  <CardTitle>AI Monitoring</CardTitle>
                  <CardDescription>
                    Track AI usage, emergency triggers, and consultation quality metrics
                  </CardDescription>
                </CardHeader>
                <div className="px-6 pb-6">
                  <Button variant="outline">View Monitoring →</Button>
                </div>
              </Card>
            </div>

            <Card className="bg-[#FEF3C7]">
              <div className="p-6">
                <h3 className="font-semibold text-slate-900">⚠️ Admin Notice</h3>
                <p className="mt-1 text-sm text-slate-700">
                  All user data is protected under strict privacy guidelines. Only access user information
                  when necessary for platform maintenance and security. Anonymize data when possible.
                </p>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}