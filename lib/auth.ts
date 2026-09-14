import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { getAdminUser } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-warm-editorial-key-2024";
const COOKIE_NAME = "portfolio_admin_token";

export interface SessionPayload {
  username: string;
  role: string;
}

export function createToken(payload: SessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}

export async function authenticate(password: string): Promise<boolean> {
  const admin = getAdminUser();
  return bcrypt.compare(password, admin.password_hash);
}

export { COOKIE_NAME };
