import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Tidak ada file yang diunggah" }, { status: 400 });
    }

    // Strict MIME-Type validation and extension whitelist
    const MIME_EXTENSION_MAP: Record<string, string> = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp",
      "application/pdf": ".pdf",
    };

    const safeExt = MIME_EXTENSION_MAP[file.type];
    if (!safeExt) {
      return NextResponse.json(
        { error: "Tipe file tidak didukung (hanya JPG, PNG, WEBP, dan PDF)" },
        { status: 400 }
      );
    }

    const maxSizeBytes = file.type === "application/pdf" ? 5 * 1024 * 1024 : 3 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return NextResponse.json(
        { error: `Ukuran file melebihi batas (maks ${file.type === "application/pdf" ? "5MB" : "3MB"})` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${safeExt}`;
    const filePath = path.join(uploadDir, safeName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${safeName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
    });
  } catch {
    return NextResponse.json({ error: "Gagal memproses upload file" }, { status: 500 });
  }
}
