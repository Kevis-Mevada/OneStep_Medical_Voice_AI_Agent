import { NextRequest, NextResponse } from "next/server";
import { getUserRecentConsultations } from "@/lib/firestore-admin";
import { auth } from "@/lib/firebase";
import { getAuth } from "firebase-admin/auth";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    // Verify the Firebase token
    const decodedToken = await getAuth().verifyIdToken(token);
    const userId = decodedToken.uid;

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