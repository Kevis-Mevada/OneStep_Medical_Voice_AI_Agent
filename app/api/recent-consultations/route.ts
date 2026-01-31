import { NextRequest, NextResponse } from "next/server";
import { getUserRecentConsultations } from "@/lib/firestore-admin";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get the user ID from query parameters for now
    // TODO: Implement proper authentication
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Get recent consultations
    const result = await getUserRecentConsultations(userId, 3);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to fetch consultations" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      consultations: result.consultations
    });
  } catch (error: any) {
    console.error("Get recent consultations error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch consultations" },
      { status: 500 }
    );
  }
}