import { NextResponse } from "next/server";
import { getConsultationByIdAdmin, deleteConsultationAdmin } from "@/lib/firestore-admin";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 });
  }

  const result = await getConsultationByIdAdmin(params.id, userId);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error || "Failed to fetch consultation" },
      { status: result.error === "Unauthorized access" ? 403 : 404 }
    );
  }

  return NextResponse.json({ consultation: result.consultation });
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 });
  }

  const result = await deleteConsultationAdmin(params.id, userId);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error || "Failed to delete consultation" },
      { status: result.error === "Unauthorized access" ? 403 : 404 }
    );
  }

  return NextResponse.json({ success: true });
}
