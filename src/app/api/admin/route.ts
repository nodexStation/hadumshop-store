import { NextRequest, NextResponse } from "next/server";
import { checkPassword, setAdminCookie, clearAdminCookie, isAdmin, isAdminConfigured } from "@/lib/auth";
import { rateLimit, tooManyRequests } from "@/lib/rate-limit";
import { readData, writeData, newId, slugify } from "@/lib/db";
import type { OrderStatus, Product, StoreSettings } from "@/lib/types";

async function guard() {
  return (await isAdmin()) ? null : NextResponse.json({ error: "Unauthorized. Please log in as admin." }, { status: 401 });
}

// Login / logout
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (body.action === "logout") { await clearAdminCookie(); return NextResponse.json({ ok: true }); }
  // Fail closed before any password check: no env vars, no login at all.
  if (!isAdminConfigured())
    return NextResponse.json({ error: "Admin login is not configured." }, { status: 503 });
  if (!rateLimit(req, "admin-login", 10, 15 * 60 * 1000))
    return NextResponse.json(tooManyRequests(), { status: 429 });
  if (typeof body.password === "string" && checkPassword(body.password)) {
    await setAdminCookie();
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Wrong password." }, { status: 401 });
}

// Product create/update/delete + order status + settings — one guarded endpoint
export async function PUT(req: NextRequest) {
  const denied = await guard(); if (denied) return denied;
  const body = await req.json().catch(() => null);
  if (!body?.kind) return NextResponse.json({ error: "Missing kind." }, { status: 400 });
  const data = await readData();

  if (body.kind === "product") {
    const p = body.product as Product;
    if (!p.name || typeof p.price !== "number" || p.price < 0)
      return NextResponse.json({ error: "Product needs a name and a valid price." }, { status: 422 });
    p.slug = p.slug ? slugify(p.slug) : slugify(p.name);
    if (p.id) {
      const idx = data.products.findIndex((x) => x.id === p.id);
      if (idx < 0) return NextResponse.json({ error: "Product not found." }, { status: 404 });
      data.products[idx] = { ...data.products[idx], ...p };
    } else {
      p.id = newId("prod");
      p.createdAt = new Date().toISOString();
      if (data.products.some((x) => x.slug === p.slug)) p.slug = `${p.slug}-${p.id.slice(-4)}`;
      data.products.unshift(p);
    }
    await writeData(data);
    return NextResponse.json({ ok: true, product: p });
  }

  if (body.kind === "order-status") {
    const order = data.orders.find((o) => o.id === body.id);
    const valid: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    if (!valid.includes(body.status)) return NextResponse.json({ error: "Invalid status." }, { status: 422 });
    order.status = body.status as OrderStatus;
    await writeData(data);
    return NextResponse.json({ ok: true });
  }

  if (body.kind === "settings") {
    const s = body.settings as StoreSettings;
    data.settings = { ...data.settings, ...s,
      deliveryInsideDhaka: Math.max(0, Number(s.deliveryInsideDhaka) || 0),
      deliveryOutsideDhaka: Math.max(0, Number(s.deliveryOutsideDhaka) || 0) };
    await writeData(data);
    return NextResponse.json({ ok: true });
  }

  if (body.kind === "testimonial") {
    const t = body.testimonial as { name: string; text: string; verified: boolean };
    if (!t.name || !t.text) return NextResponse.json({ error: "Name and text required." }, { status: 422 });
    data.testimonials.push({ name: t.name, text: t.text, verified: !!t.verified });
    await writeData(data);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown kind." }, { status: 400 });
}

export async function DELETE(req: NextRequest) {
  const denied = await guard(); if (denied) return denied;
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
  const data = await readData();
  const before = data.products.length;
  data.products = data.products.filter((p) => p.id !== id);
  if (data.products.length === before) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  await writeData(data);
  return NextResponse.json({ ok: true });
}
