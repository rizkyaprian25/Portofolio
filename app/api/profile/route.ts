import { NextRequest, NextResponse } from "next/server";
import { getProfile, updateProfile } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  const profile = getProfile();
  return NextResponse.json(profile);
}

export async function PUT(req: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const updated = updateProfile(data);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Gagal memperbarui profil" }, { status: 500 });
  }
}
