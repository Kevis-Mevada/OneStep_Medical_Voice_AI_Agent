import { NextResponse } from "next/server";
import { runMedicalChat } from "@/lib/groq";
import { MEDICAL_REPORT_PROMPT } from "@/lib/ai-prompts";
import { saveConsultationAdmin } from "@/lib/firestore-admin";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { gender, age, height, weight, conditions, symptoms, userId, userEmail } = body as {
      gender?: string;
      age?: string;
      height?: string;
      weight?: string;
      conditions?: string;
      symptoms: string;
      userId: string;
      userEmail: string;
    };

    if (!userId || !userEmail) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    if (!symptoms || !symptoms.trim()) {
      return NextResponse.json({ error: "Symptoms are required" }, { status: 400 });
    }

  const contextLines: string[] = [];
  if (gender) contextLines.push(`Gender: ${gender}`);
  if (age) contextLines.push(`Age: ${age}`);
  if (height) contextLines.push(`Height: ${height}`);
  if (weight) contextLines.push(`Weight: ${weight}`);
  if (conditions) contextLines.push(`Known conditions: ${conditions}`);

  const contextText = contextLines.length ? contextLines.join("\n") : "(No additional context provided)";

  const userMessage = `Here is the non-emergency health consultation context and symptom description.

${contextText}

Symptoms (in the user's own words):
${symptoms}`;

  const message = await runMedicalChat([
    {
      role: "user",
      content: userMessage,
    },
  ]);

  // Check for emergency keywords in the response
  const emergencyKeywords = [
    "emergency",
    "urgent",
    "immediately",
    "911",
    "hospital",
    "seek medical attention",
  ];
  const isEmergency = emergencyKeywords.some((keyword) =>
    message.toLowerCase().includes(keyword)
  );

  const reportPrompt = `${MEDICAL_REPORT_PROMPT}

Here is the user information and symptoms you should base the report on:

${contextText}

Symptoms:
${symptoms}`;

  const report = await runMedicalChat([
    {
      role: "user",
      content: reportPrompt,
    },
  ]);

  // Save to Firestore using Admin SDK (server-side)
  const saveResult = await saveConsultationAdmin({
    userId,
    userEmail,
    gender,
    age,
    height,
    weight,
    conditions,
    symptoms,
    aiResponse: message,
    report,
    isEmergency,
  });

  if (!saveResult.success) {
    console.error("Failed to save consultation:", saveResult.error);
  }

  // Automatically send report via email
  try {
    console.log("Attempting to send report email to:", userEmail);
    console.log("Using NEXT_PUBLIC_APP_URL:", process.env.NEXT_PUBLIC_APP_URL);
    
    const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/send-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userEmail,
        report,
        symptoms,
        userContext: { gender, age, height, weight, conditions }
      })
    });

    console.log("Email API response status:", emailResponse.status);
    const emailResult = await emailResponse.json();
    console.log("Email API response:", emailResult);
    
    if (!emailResult.success) {
      console.error("Failed to send report email:", emailResult.error);
    } else {
      console.log("✅ Report email sent successfully");
    }
  } catch (emailError) {
    console.error("Error sending report email:", emailError);
  }

    return NextResponse.json({
      message,
      report,
      isEmergency,
      consultationId: saveResult.id,
    });
  } catch (error: any) {
    console.error("Consultation API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process consultation" },
      { status: 500 }
    );
  }
}