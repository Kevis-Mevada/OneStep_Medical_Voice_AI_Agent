'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, type User as FirebaseAuthUser } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Consultation {
  id: string;
  userEmail: string;
  symptoms: string;
  createdAt: { seconds: number };
  isEmergency?: boolean;
}

export default function AdminMonitoringPage() {
  const router = useRouter();
  const [user, setUser] = useState<FirebaseAuthUser | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        fetchConsultations(u.uid);
      }
    });
    return () => unsub();
  }, []);

  const fetchConsultations = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin?type=consultations&userId=${userId}`);
      
      if (!response.ok) {
        console.error("Failed to fetch consultations:", response.status);
        return;
      }
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Received non-JSON response from API");
        return;
      }
      
      const data = await response.json();
      setConsultations(data.consultations || []);
    } catch (error) {
      console.error("Error fetching consultations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (seconds: number) => {
    return new Date(seconds * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const emergencyConsultations = consultations.filter((c) => c.isEmergency);

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">AI Monitoring</h1>
            <p className="text-sm text-slate-600">
              Track AI consultations, emergency alerts, and usage patterns
            </p>
          </div>
          <Button variant="outline" onClick={() => router.push("/admin")}>
            Back to Admin
          </Button>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-[#0F766E]">
                {consultations.length}
              </CardTitle>
              <CardDescription>Total Consultations</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-[#DC2626]">
                {emergencyConsultations.length}
              </CardTitle>
              <CardDescription>Emergency Alerts Triggered</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {emergencyConsultations.length > 0 && (
          <Card className="border-[#DC2626]">
            <CardHeader>
              <CardTitle className="text-[#DC2626]">⚠️ Recent Emergency Alerts</CardTitle>
              <CardDescription>
                Consultations that triggered emergency detection
              </CardDescription>
            </CardHeader>
            <div className="space-y-3 px-6 pb-6">
              {emergencyConsultations.slice(0, 5).map((consultation) => (
                <div
                  key={consultation.id}
                  className="rounded-lg bg-[#FEE2E2] p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {consultation.userEmail}
                      </p>
                      <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                        {consultation.symptoms}
                      </p>
                      <p className="mt-2 text-xs text-slate-500">
                        {formatDate(consultation.createdAt.seconds)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Recent Consultations</CardTitle>
            <CardDescription>
              Latest AI consultations (anonymized symptoms displayed)
            </CardDescription>
          </CardHeader>
          {isLoading ? (
            <div className="p-8 text-center text-sm text-slate-600">Loading consultations...</div>
          ) : consultations.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-600">No consultations yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-3 text-left font-semibold text-slate-900">User</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-900">Symptoms</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-900">Date</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {consultations.slice(0, 20).map((consultation) => (
                    <tr key={consultation.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-6 py-4 text-slate-600">{consultation.userEmail}</td>
                      <td className="px-6 py-4 text-slate-600">
                        <p className="line-clamp-1">{consultation.symptoms}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {formatDate(consultation.createdAt.seconds)}
                      </td>
                      <td className="px-6 py-4">
                        {consultation.isEmergency ? (
                          <span className="rounded-full bg-[#DC2626] px-2 py-1 text-xs font-medium text-white">
                            Emergency
                          </span>
                        ) : (
                          <span className="rounded-full bg-[#16A34A] px-2 py-1 text-xs font-medium text-white">
                            Normal
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
