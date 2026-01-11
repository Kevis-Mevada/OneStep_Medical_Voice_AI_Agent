import { NextResponse } from "next/server";
import { getAllUsersAdmin, getAllConsultationsAdmin, getConsultationStatsAdmin, getUserProfileAdmin } from "@/lib/firestore-admin";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const userId = searchParams.get("userId");

  // Verify admin role for all admin API calls
  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 });
  }
  
  const userResult = await getUserProfileAdmin(userId);
  if (!userResult.success || !userResult.profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  
  // Type assertion to access role property
  const userProfile = userResult.profile as any;
  if (userProfile.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  if (type === "users") {
    const result = await getAllUsersAdmin();
    if (!result.success) {
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
    return NextResponse.json({ users: result.users });
  }

  if (type === "consultations") {
    const result = await getAllConsultationsAdmin();
    if (!result.success) {
      return NextResponse.json({ error: "Failed to fetch consultations" }, { status: 500 });
    }
    return NextResponse.json({ consultations: result.consultations });
  }

  if (type === "stats") {
    const result = await getConsultationStatsAdmin();
    if (!result.success) {
      return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
    return NextResponse.json({ stats: result.stats });
  }

  return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });
}
