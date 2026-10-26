import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

// Server-side admin auth. The password lives ONLY in the ADMIN_PASSWORD env
// var and the session key ONLY in ADMIN_SESSION_SECRET (never in code).
// FAIL-CLOSED: if either env var is missing, every login and every session
// check fails. There is deliberately NO demo password and NO dev secret
// fallback — a misconfigured deployment locks admin out instead of
// letting anyone in with a publicly known default.
const COOKIE = "hadum_admin";

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD) && Boolean(process.env.ADMIN_SESSION_SECRET);
}

export function checkPassword(input: string): boolean {
  const stored = process.env.ADMIN_PASSWORD;
  if (!stored || !input || !process.env.ADMIN_SESSION_SECRET) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(stored);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function signSession(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("Admin session is not configured.");
  const payload = `admin:${Date.now()}`;
  const sig = createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifySession(value: string | undefined): boolean {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!value || !secret) return false;
  const [payload, sig] = value.split(".");
  if (!payload || !sig) return false;
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  try {
    return sig.length === expected.length && timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySession(store.get(COOKIE)?.value);
}

export async function setAdminCookie(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, signSession(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearAdminCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}
