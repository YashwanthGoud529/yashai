import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "gemini_ai_fallback_secret_key_2026";
const TOKEN_NAME = "gemini_auth_token";

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export async function getAuthUser(request) {
  try {
    // Check Authorization header first
    const authHeader = request?.headers?.get("authorization");
    let token = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }

    // Fallback to cookie
    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get(TOKEN_NAME)?.value;
    }

    if (!token) return null;

    return verifyToken(token);
  } catch (e) {
    return null;
  }
}

export const AUTH_COOKIE_OPTIONS = {
  name: TOKEN_NAME,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 30 * 24 * 60 * 60, // 30 days
  path: "/",
};
