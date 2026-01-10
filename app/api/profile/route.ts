import { NextResponse } from "next/server";
import { getUserProfileAdmin, updateUserProfileAdmin } from "@/lib/firestore-admin";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get("uid");

  if (!uid) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 });
  }

  const result = await getUserProfileAdmin(uid);

  if (!result.success) {
    return NextResponse.json(
      { error: "Profile not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ profile: result.profile });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { uid, displayName, photoURL } = body;

  if (!uid) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 });
  }

  const result = await updateUserProfileAdmin(uid, {
    displayName,
    photoURL,
  });

  if (!result.success) {
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
