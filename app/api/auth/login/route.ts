import { NextRequest, NextResponse } from "next/server";
import { authenticate, createToken, COOKIE_NAME } from "@/lib/auth";
import { getAdminUser } from "@/lib/db";
import { checkRateLimit, resetRateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "local_client";
    
    // Check rate limit: max 5 failed attempts per 15 mins
    const limit = checkRateLimit(ip, 5, 15 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        {
          error: `Terlalu banyak percobaan gagal. Akses ditangguhkan selama ${Math.ceil(
            limit.retryAfterSec / 60
          )} menit demi keamanan.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { username, password, security_code, action } = body;
    const admin = getAdminUser();

    // Check action: verify security passcode step
    if (action === "verify_code") {
      if (!admin.security_code || security_code === admin.security_code) {
        return NextResponse.json({ success: true, message: "Kode keamanan valid" });
      }
      return NextResponse.json(
        { error: `Kode Akses Keamanan Salah. Sisa percobaan: ${limit.remaining}` },
        { status: 401 }
      );
    }

    // Full login validation
    if (admin.security_code && security_code !== admin.security_code) {
      return NextResponse.json(
        { error: "Kode Akses Keamanan tidak valid" },
        { status: 401 }
      );
    }

    if (username !== admin.username) {
      return NextResponse.json(
        { error: "Kredensial admin tidak valid" },
        { status: 401 }
      );
    }

    const isValid = await authenticate(password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Kredensial admin tidak valid" },
        { status: 401 }
      );
    }

    const token = createToken({ username: admin.username, role: "admin" });
    resetRateLimit(ip);

    const response = NextResponse.json({ success: true, message: "Login berhasil" });
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan server internal" },
      { status: 500 }
    );
  }
}
