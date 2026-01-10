'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, FileText, Settings, Activity } from "lucide-react";
import Image from "next/image";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-white px-4 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        {/* Welcome Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-slate-900">Welcome back{user?.displayName ? `, ${user.displayName}` : ''}!</h1>
          <p className="text-slate-600">
            {user?.email} • Your personal AI health assistant is ready
          </p>
        </div>

        {/* Main Action Card - Start Live Consultation */}
        <Card className="overflow-hidden border-2 border-[#0F766E] bg-gradient-to-br from-[#F0FDFA] to-white">
          <div className="flex flex-col gap-6 p-8 md:flex-row md:items-center">
            <div className="relative h-32 w-32 flex-shrink-0">
              <Image
                src="/Agent.jpeg"
                alt="AI Health Assistant"
                fill
                className="rounded-full object-cover shadow-lg"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-slate-900">Start Live AI Consultation</h2>
              <p className="mt-2 text-slate-700">
                Have a real-time voice conversation with your AI health assistant. Discuss symptoms, get wellness
                guidance, and receive a detailed health report—all through natural voice interaction.
              </p>
              <div className="mt-6">
                <Button
                  onClick={() => router.push("/dashboard/live-consultation")}
                  className="bg-[#0F766E] hover:bg-[#0D6560] px-6 py-3 text-base"
                >
                  <Mic className="mr-2 h-5 w-5" />
                  Start Voice Consultation
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="cursor-pointer transition-shadow hover:shadow-lg" onClick={() => router.push("/dashboard/reports")}>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#DBEAFE]">
                <FileText className="h-6 w-6 text-[#2563EB]" />
              </div>
              <CardTitle>View Reports</CardTitle>
              <CardDescription>
                Access your consultation history and health guidance reports
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer transition-shadow hover:shadow-lg" onClick={() => router.push("/dashboard/settings")}>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#F3E8FF]">
                <Settings className="h-6 w-6 text-[#9333EA]" />
              </div>
              <CardTitle>Settings</CardTitle>
              <CardDescription>
                Manage your profile, preferences, and account settings
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#FEE2E2]">
                <Activity className="h-6 w-6 text-[#DC2626]" />
              </div>
              <CardTitle>Health Summary</CardTitle>
              <CardDescription>
                Track your consultation activity and wellness journey
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Safety Notice */}
        <Card className="border-[#F59E0B] bg-[#FFFBEB]">
          <CardHeader>
            <CardTitle className="text-[#D97706]">⚕️ Medical Safety Notice</CardTitle>
            <CardDescription className="text-slate-700">
              This AI assistant provides <strong>general health information only</strong>. It does not diagnose
              conditions, prescribe treatments, or replace professional medical advice. Always consult with licensed
              healthcare providers for medical decisions. In case of emergency, call emergency services immediately.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
