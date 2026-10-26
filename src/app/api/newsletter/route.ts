import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/lib/db";
import { rateLimit, tooManyRequests } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  if (!rateLimit(req, "newsletter", 10, 60 * 60 * 1000))
    return NextResponse.json(tooManyRequests(), { status: 429 });
  const body = await req.json().catch(() => null);
  const email = String(body?.email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 422 });
  const data = await readData();
  if (data.subscribers.some((s) => s.email === email))
    return NextResponse.json({ ok: true, already: true });
  data.subscribers.push({ email, createdAt: new Date().toISOString() });
  await writeData(data);
  return NextResponse.json({ ok: true }, { status: 201 });
}
