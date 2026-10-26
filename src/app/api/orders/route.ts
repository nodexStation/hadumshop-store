import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { readData, writeData, isDemoMode } from "@/lib/db";
import { rateLimit, tooManyRequests } from "@/lib/rate-limit";
import { normalizePhone, maskPhone } from "@/lib/phone";
import type { Order, OrderItem } from "@/lib/types";

// Order numbers are random, not sequential: HDM-YYYYMMDD-<10 random hex>.
// Sequential IDs (…-0001, 0002, …) let anyone enumerate every order; a
// random suffix makes guessing an order number infeasible, and the phone
// check in GET below is a second layer on top of that.
function orderNumber(): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `HDM-${ymd}-${randomBytes(5).toString("hex").toUpperCase()}`;
}

// POST /api/orders — creates a genuine order record.
// SECURITY: every price, stock level and total is recomputed here from the
// server-side catalogue. Client-submitted prices are never trusted.
export async function POST(req: NextRequest) {
  if (!rateLimit(req, "orders", 20, 10 * 60 * 1000))
    return NextResponse.json(tooManyRequests(), { status: 429 });
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const { customer, items, paymentMethod } = body as {
    customer: Order["customer"];
    items: { productId: string; variantId?: string; quantity: number }[];
    paymentMethod: string;
  };

  // Validation
  if (!customer || typeof customer.name !== "string" || customer.name.trim().length < 3)
    return NextResponse.json({ error: "Please enter your full name." }, { status: 422 });
  const phone = String(customer.phone || "").replace(/[\s-]/g, "");
  if (!/^01[3-9]\d{8}$/.test(phone))
    return NextResponse.json({ error: "Enter a valid Bangladesh mobile number." }, { status: 422 });
  if (!customer.address || customer.address.trim().length < 8)
    return NextResponse.json({ error: "Please enter your full delivery address." }, { status: 422 });
  if (!customer.district || !customer.city || customer.city.trim().length < 2)
    return NextResponse.json({ error: "Please select your district and enter your city." }, { status: 422 });
  if (paymentMethod !== "cod")
    return NextResponse.json({ error: "Only Cash on Delivery is available right now." }, { status: 422 });
  if (!Array.isArray(items) || items.length === 0)
    return NextResponse.json({ error: "Your cart is empty." }, { status: 422 });

  const data = await readData();
  const orderItems: OrderItem[] = [];
  let subtotal = 0;

  for (const line of items) {
    const product = data.products.find((p) => p.id === line.productId);
    if (!product) return NextResponse.json({ error: "One item in your cart no longer exists." }, { status: 422 });
    const qty = Math.floor(Number(line.quantity));
    if (!qty || qty < 1) return NextResponse.json({ error: "Invalid quantity in cart." }, { status: 422 });
    let variantLabel: string | undefined;
    if (product.variants.length > 0) {
      const v = product.variants.find((x) => x.id === line.variantId);
      if (!v) return NextResponse.json({ error: `Please choose an option for ${product.name}.` }, { status: 422 });
      if (v.stock < qty) return NextResponse.json({ error: `${product.name} (${v.label}) has only ${v.stock} in stock.` }, { status: 422 });
      v.stock -= qty;
      variantLabel = v.label;
      product.stock = product.variants.reduce((s, x) => s + x.stock, 0);
    } else {
      if (product.stock < qty) return NextResponse.json({ error: `${product.name} has only ${product.stock} in stock.` }, { status: 422 });
      product.stock -= qty;
    }
    subtotal += product.price * qty;
    orderItems.push({ productId: product.id, name: product.name, variantLabel, price: product.price, quantity: qty });
  }

  const settings = data.settings;
  const freeAbove = settings.freeDeliveryAbove;
  const deliveryCharge = freeAbove && subtotal >= freeAbove
    ? 0
    : customer.district === "Dhaka" ? settings.deliveryInsideDhaka : settings.deliveryOutsideDhaka;

  const order: Order = {
    id: orderNumber(),
    items: orderItems,
    subtotal,
    deliveryCharge,
    total: subtotal + deliveryCharge,
    customer: { ...customer, phone },
    paymentMethod: "cod",
    status: "pending",
    demo: isDemoMode(),
    createdAt: new Date().toISOString(),
  };
  data.orders.unshift(order);
  await writeData(data);
  return NextResponse.json({ ok: true, orderId: order.id, total: order.total }, { status: 201 });
}

// GET /api/orders?id=HDM-...&phone=01XXXXXXXXX — order lookup.
// SECURITY: this used to return the full order (name, phone, address) to
// anyone who guessed a sequential order number. Now BOTH are required:
// a random, unguessable order number AND the buyer's own phone number.
// A missing/mismatched phone and a missing order all return the same
// generic 404, so nothing leaks about which orders exist. Even on a
// match, only a summary is returned — never the full name, street
// address, or full phone number. The full confirmation lives on the
// /order-success page, which applies the same phone check server-side.
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const phone = normalizePhone(req.nextUrl.searchParams.get("phone") || "");
  if (!id || !phone) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  const data = await readData();
  const order = data.orders.find((o) => o.id === id);
  if (!order || normalizePhone(order.customer.phone) !== phone)
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  return NextResponse.json({
    order: {
      id: order.id,
      items: order.items,
      subtotal: order.subtotal,
      deliveryCharge: order.deliveryCharge,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
      district: order.customer.district,
      city: order.customer.city,
      maskedPhone: maskPhone(order.customer.phone),
    },
  });
}
