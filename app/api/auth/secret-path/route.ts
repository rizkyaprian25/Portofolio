import { NextResponse } from "next/server";
import { getAdminSecretPath } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const secretPath = getAdminSecretPath();
  return NextResponse.json({ secret_path: secretPath });
}
