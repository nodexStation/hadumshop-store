// Tiny in-memory rate limiter for public / admin-login endpoints.
// No paid service, no secret required. NOTE: on Vercel serverless each
// instance keeps its own counters, so this is best-effort throttling
// (it stops casual floods and credential stuffing from one source, it is
// not a distributed abuse shield). Limits are deliberately generous so
// legitimate buyers and the admin are never blocked by normal use.
import type { NextRequest } from "next/server";

type Bucket = number[];
const buckets = new Map<string, Bucket>();

export function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

/** Returns true when the call is within budget; false when it must be throttled. */
export function rateLimit(req: NextRequest, scope: string, limit: number, windowMs: number): boolean {
  const key = `${scope}:${clientIp(req)}`;
  const now = Date.now();
  const hits = (buckets.get(key) || []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return false;
  }
  hits.push(now);
  buckets.set(key, hits);
  // Bound memory: drop buckets that have gone quiet.
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (v.length === 0 || now - v[v.length - 1] > windowMs) buckets.delete(k);
  }
  return true;
}

export function tooManyRequests() {
  return { error: "Too many requests. Please wait a few minutes and try again." };
}
