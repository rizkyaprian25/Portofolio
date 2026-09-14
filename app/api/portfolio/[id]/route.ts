import { NextRequest, NextResponse } from "next/server";
import { getPortfolioItemById, updatePortfolioItem, deletePortfolioItem } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const item = getPortfolioItemById(params.id);
  if (!item) {
    return NextResponse.json({ error: "Proyek tidak ditemukan" }, { status: 404 });
  }
  return NextResponse.json(item);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const updated = updatePortfolioItem(params.id, data);
    if (!updated) {
      return NextResponse.json({ error: "Proyek tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Gagal memperbarui proyek" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deleted = deletePortfolioItem(params.id);
  if (!deleted) {
    return NextResponse.json({ error: "Proyek tidak ditemukan" }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: "Proyek berhasil dihapus" });
}
