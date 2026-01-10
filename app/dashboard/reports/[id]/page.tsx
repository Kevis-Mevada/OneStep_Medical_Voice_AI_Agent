'use client';

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";

interface ConsultationDetail {
  id: string;
  gender?: string;
  age?: string;
  height?: string;
  weight?: string;
  conditions?: string;
  symptoms: string;
  aiResponse: string;
  report: string;
  createdAt: { seconds: number };
  isEmergency?: boolean;
}

export default function ReportDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [consultation, setConsultation] = useState<ConsultationDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u && params.id) {
        fetchConsultation(u.uid, params.id as string);
      }
    });
    return () => unsub();
  }, [params.id]);

  const fetchConsultation = async (userId: string, consultationId: string) => {
    try {
      const response = await fetch(`/api/reports/${consultationId}?userId=${userId}`);
      
      if (!response.ok) {
        console.error("Failed to fetch consultation:", response.status);
        return;
      }
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Received non-JSON response from API");
        return;
      }
      
      const data = await response.json();
      setConsultation(data.consultation);
    } catch (error) {
      console.error("Error fetching consultation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user || !params.id) return;
    if (!confirm("Are you sure you want to delete this report?")) return;

    try {
      const response = await fetch(`/api/reports/${params.id}?userId=${user.uid}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/dashboard/reports");
      }
    } catch (error) {
      console.error("Error deleting consultation:", error);
    }
  };

  const generatePDFReport = async () => {
    if (!consultation) return;
    
    try {
      // Dynamically import jsPDF and html2canvas
      const jsPDF = (await import('jspdf')).default;
      const html2canvas = (await import('html2canvas')).default;
      
      if (!reportRef.current) {
        console.error('Report container not found');
        return;
      }
      
      // Create a temporary container for the report content
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = reportRef.current.innerHTML;
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.width = '210mm'; // A4 width
      tempContainer.style.padding = '20mm';
      tempContainer.style.background = 'white';
      tempContainer.style.color = 'black';
      tempContainer.style.fontFamily = 'Arial, sans-serif';
      
      document.body.appendChild(tempContainer);
      
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: 'white',
      });
      
      document.body.removeChild(tempContainer);
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210 - 20; // A4 width minus margins
      const pageHeight = 297 - 20; // A4 height minus margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;
      
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      const fileName = `Consultation_Report_${consultation.id}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF report. Please try again.');
    }
  };

  const printReport = () => {
    if (!consultation) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print the report');
      return;
    }
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Consultation Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #0F766E; padding-bottom: 10px; }
          .section { margin: 20px 0; }
          .section-title { font-weight: bold; font-size: 16px; color: #0F766E; margin-bottom: 8px; }
          .emergency { background-color: #FEE2E2; border: 1px solid #DC2626; padding: 10px; border-radius: 4px; }
          .disclaimer { background-color: #FEF3C7; padding: 10px; border-radius: 4px; margin-top: 20px; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Medical Consultation Report</h1>
          <p>Date: ${formatDate(consultation.createdAt.seconds)}</p>
          <p>Report ID: ${consultation.id}</p>
        </div>
        
        ${consultation.isEmergency ? `
        <div class="emergency">
          <h3>⚠️ Emergency Alert</h3>
          <p>This consultation flagged potential emergency symptoms. Please seek immediate medical attention if you haven't already done so.</p>
        </div>
        ` : ''}
        
        ${(consultation.gender || consultation.age || consultation.height || consultation.weight || consultation.conditions) ? `
        <div class="section">
          <div class="section-title">Patient Context</div>
          <div>
            ${consultation.gender ? `<div><strong>Gender:</strong> ${consultation.gender}</div>` : ''}
            ${consultation.age ? `<div><strong>Age:</strong> ${consultation.age}</div>` : ''}
            ${consultation.height ? `<div><strong>Height:</strong> ${consultation.height}</div>` : ''}
            ${consultation.weight ? `<div><strong>Weight:</strong> ${consultation.weight}</div>` : ''}
            ${consultation.conditions ? `<div><strong>Known conditions:</strong> ${consultation.conditions}</div>` : ''}
          </div>
        </div>
        ` : ''}
        
        <div class="section">
          <div class="section-title">Reported Symptoms</div>
          <div>${consultation.symptoms.replace(/\n/g, '<br>')}</div>
        </div>
        
        <div class="section">
          <div class="section-title">AI Guidance</div>
          <div>${consultation.aiResponse.replace(/\n/g, '<br>')}</div>
        </div>
        
        <div class="section">
          <div class="section-title">Medical Report</div>
          <div>${consultation.report.replace(/\n/g, '<br>')}</div>
        </div>
        
        <div class="disclaimer">
          <div class="section-title">Medical Disclaimer</div>
          <p>This information is for general educational purposes only and does not constitute medical diagnosis, treatment, or professional medical advice. Always consult a licensed healthcare provider for medical concerns.</p>
        </div>
        
        <div class="footer">
          Generated by Medical Voice AI Assistant
        </div>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] px-4 py-10">
        <div className="mx-auto flex w-full max-w-4xl">
          <Card className="w-full">
            <div className="p-8 text-center text-sm text-slate-600">Loading report...</div>
          </Card>
        </div>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] px-4 py-10">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Report not found</CardTitle>
              <CardDescription>
                This consultation report could not be found or you don&apos;t have access to it.
              </CardDescription>
            </CardHeader>
            <div className="px-6 pb-6">
              <Button onClick={() => router.push("/dashboard/reports")}>
                Back to reports
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Consultation Report</h1>
            <p className="text-sm text-slate-600">
              {formatDate(consultation.createdAt.seconds)}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.push("/dashboard/reports")}>
              Back to reports
            </Button>
            <Button variant="outline" onClick={printReport}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button onClick={generatePDFReport}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </header>

        <div ref={reportRef} className="space-y-6">


        {consultation.isEmergency && (
          <Card className="border-[#DC2626] bg-[#FEE2E2]">
            <div className="p-6">
              <h3 className="font-semibold text-[#DC2626]">⚠️ Emergency Alert</h3>
              <p className="mt-1 text-sm text-[#991B1B]">
                This consultation flagged potential emergency symptoms. Please seek immediate medical
                attention if you haven&apos;t already done so.
              </p>
            </div>
          </Card>
        )}

        {(consultation.gender || consultation.age || consultation.height || consultation.weight || consultation.conditions) && (
          <Card>
            <CardHeader>
              <CardTitle>Patient Context</CardTitle>
            </CardHeader>
            <div className="grid gap-3 px-6 pb-6 text-sm md:grid-cols-2">
              {consultation.gender && (
                <div>
                  <span className="font-medium text-slate-900">Gender:</span>{" "}
                  <span className="text-slate-600">{consultation.gender}</span>
                </div>
              )}
              {consultation.age && (
                <div>
                  <span className="font-medium text-slate-900">Age:</span>{" "}
                  <span className="text-slate-600">{consultation.age}</span>
                </div>
              )}
              {consultation.height && (
                <div>
                  <span className="font-medium text-slate-900">Height:</span>{" "}
                  <span className="text-slate-600">{consultation.height}</span>
                </div>
              )}
              {consultation.weight && (
                <div>
                  <span className="font-medium text-slate-900">Weight:</span>{" "}
                  <span className="text-slate-600">{consultation.weight}</span>
                </div>
              )}
              {consultation.conditions && (
                <div className="md:col-span-2">
                  <span className="font-medium text-slate-900">Known conditions:</span>{" "}
                  <span className="text-slate-600">{consultation.conditions}</span>
                </div>
              )}
            </div>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Reported Symptoms</CardTitle>
          </CardHeader>
          <div className="px-6 pb-6">
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
              {consultation.symptoms}
            </p>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Guidance</CardTitle>
            <CardDescription>
              General health information based on your symptoms (non-diagnostic)
            </CardDescription>
          </CardHeader>
          <div className="px-6 pb-6">
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
              {consultation.aiResponse}
            </p>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Medical Report</CardTitle>
            <CardDescription>
              Structured summary you can share with your doctor
            </CardDescription>
          </CardHeader>
          <div className="px-6 pb-6">
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
              {consultation.report}
            </p>
          </div>
        </Card>

        <Card className="bg-[#FEF3C7]">
          <div className="p-6 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">⚕️ Medical Disclaimer</p>
            <p className="mt-1">
              This information is for general educational purposes only and does not constitute medical
              diagnosis, treatment, or professional medical advice. Always consult a licensed healthcare
              provider for medical concerns.
            </p>
          </div>
        </Card>
        </div>
      </div>
    </div>
  );
}
