import { NextRequest, NextResponse } from "next/server";
import { getCv, updateCv } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  const cv = getCv();
  return NextResponse.json(cv);
}

export async function PUT(req: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const updated = updateCv(data);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Gagal memperbarui data CV" }, { status: 500 });
  }
}
