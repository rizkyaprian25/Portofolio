import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getAdminUser, getAdminSecretPath, updateAdminSecurity } from "@/lib/db";

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = getAdminUser();
  return NextResponse.json({
    secret_path: getAdminSecretPath(),
    security_code: admin.security_code || "889900",
  });
}

export async function PUT(req: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { secret_path, security_code } = body;

    const updates: { secret_path?: string; security_code?: string } = {};

    if (secret_path !== undefined) {
      // Sanitize slug: alphanumeric, hyphens, underscores
      const cleaned = String(secret_path)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "");

      if (cleaned.length < 3) {
        return NextResponse.json(
          { error: "Kode URL rahasia minimal 3 karakter (huruf, angka, tanda hubung)" },
          { status: 400 }
        );
      }

      // Prevent using reserved words
      const reserved = ["login", "profile", "cv", "api", "dashboard"];
      if (reserved.includes(cleaned)) {
        return NextResponse.json(
          { error: `Kata '${cleaned}' tidak boleh digunakan sebagai kode URL rahasia` },
          { status: 400 }
        );
      }

      updates.secret_path = cleaned;
    }

    if (security_code !== undefined) {
      const cleanedCode = String(security_code).trim().replace(/\D/g, "");
      if (cleanedCode.length !== 6) {
        return NextResponse.json(
          { error: "Passcode keamanan harus berupa 6 digit angka" },
          { status: 400 }
        );
      }
      updates.security_code = cleanedCode;
    }

    updateAdminSecurity(updates);

    return NextResponse.json({
      success: true,
      message: "Pengaturan keamanan berhasil diperbarui",
      secret_path: getAdminSecretPath(),
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui pengaturan keamanan" },
      { status: 500 }
    );
  }
}
