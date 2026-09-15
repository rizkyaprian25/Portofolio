import { NextRequest, NextResponse } from "next/server";
import { getPortfolioItems, createPortfolioItem } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  const items = getPortfolioItems();
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    if (!data.judul || !data.slug) {
      return NextResponse.json({ error: "Judul dan slug wajib diisi" }, { status: 400 });
    }

    const newItem = createPortfolioItem({
      judul: data.judul,
      slug: data.slug,
      deskripsi_singkat: data.deskripsi_singkat || "",
      deskripsi_lengkap: data.deskripsi_lengkap || "",
      mediaType: data.mediaType || "photo",
      gambar: data.gambar || [],
      videoUrl: data.videoUrl || "",
      teknologi: data.teknologi || [],
      link_repo: data.link_repo || "",
      featured: Boolean(data.featured),
      urutan: Number(data.urutan) || 1,
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Gagal membuat proyek" }, { status: 500 });
  }
}
