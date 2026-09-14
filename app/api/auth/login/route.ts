import { NextRequest, NextResponse } from "next/server";
import { authenticate, createToken, COOKIE_NAME } from "@/lib/auth";
import { getAdminUser } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    const admin = getAdminUser();

    if (username !== admin.username) {
      return NextResponse.json(
        { error: "Username atau password salah" },
        { status: 401 }
      );
    }

    const isValid = await authenticate(password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Username atau password salah" },
        { status: 401 }
      );
    }

    const token = createToken({ username: admin.username, role: "admin" });

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
