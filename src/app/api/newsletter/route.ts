import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/lib/db";

export async function POST(req: NextRequest) {
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
