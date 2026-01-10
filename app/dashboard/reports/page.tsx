'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, PlusCircle, Download, Calendar, AlertTriangle } from "lucide-react";

interface Consultation {
  id: string;
  symptoms: string;
  createdAt: { seconds: number };
  isEmergency?: boolean;
}

export default function ReportsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
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
      const response = await fetch(`/api/reports?userId=${userId}`);
      
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
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Consultation Reports</h1>
            <p className="text-sm text-slate-600">
              View your consultation history and medical guidance reports
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              <FileText className="mr-2 h-4 w-4" />
              Back to dashboard
            </Button>
            <Button onClick={() => router.push("/dashboard/consultation")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New consultation
            </Button>
          </div>
        </header>

        {isLoading ? (
          <Card>
            <div className="p-8 text-center text-sm text-slate-600">Loading your reports...</div>
          </Card>
        ) : consultations.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No reports yet</CardTitle>
              <CardDescription>
                Start your first consultation to generate a medical guidance report.
              </CardDescription>
            </CardHeader>
            <div className="px-6 pb-6">
              <Button onClick={() => router.push("/dashboard/consultation")}>
                Start consultation
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {consultations.map((consultation) => (
              <Card
                key={consultation.id}
                className="cursor-pointer transition-all duration-200 hover:shadow-lg"
                onClick={() => router.push(`/dashboard/reports/${consultation.id}`)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-slate-900 flex items-center">
                          <FileText className="mr-2 h-5 w-5 text-[#0F766E]" />
                          Consultation Report
                        </h3>
                        {consultation.isEmergency && (
                          <span className="flex items-center rounded-full bg-[#DC2626] px-2 py-0.5 text-xs font-medium text-white">
                            <AlertTriangle className="mr-1 h-3 w-3" />
                            Emergency
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-slate-500 mb-2">
                        <Calendar className="mr-1 h-4 w-4" />
                        {formatDate(consultation.createdAt.seconds)}
                      </div>
                      <p className="line-clamp-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                        {consultation.symptoms}
                      </p>
                    </div>
                    <svg
                      className="h-5 w-5 flex-shrink-0 text-slate-400 mt-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
