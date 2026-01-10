import { NextResponse } from "next/server";
import { getUserConsultationsAdmin } from "@/lib/firestore-admin";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 });
  }

  try {
    const result = await getUserConsultationsAdmin(userId);

    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to fetch reports" },
        { status: 500 }
      );
    }

    return NextResponse.json({ consultations: result.consultations });
  } catch (error: any) {
    console.error("API Error in /api/reports:", error);
    return NextResponse.json(
      { 
        error: error.message || "Internal server error",
        hint: "Check if Firebase Admin SDK is configured properly"
      },
      { status: 500 }
    );
  }
}
