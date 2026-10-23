import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { readData } from "@/lib/db";
import { formatBDT } from "@/lib/format";

export const metadata: Metadata = { title: "Order Confirmed", robots: { index: false } };
export const dynamic = "force-dynamic";

async function Confirmation({ id }: { id: string }) {
  const data = await readData();
  const order = data.orders.find((o) => o.id === id);
  if (!order) {
    return (
      <div className="text-center">
        <h1 className="font-display text-3xl font-semibold">Order not found</h1>
        <p className="text-warmgrey mt-2">We couldn't find an order with number {id}.</p>
        <Link href="/shop" className="inline-block mt-6 bg-espresso text-cream px-7 py-3.5 rounded-full font-semibold hover:bg-golddeep">Back to shop</Link>
      </div>
    );
  }
  return (
    <div className="bg-white border border-linen rounded-[2rem] p-8 text-left">
      <div className="text-center">
        <CheckCircle2 className="mx-auto text-gold" size={52} />
        <h1 className="font-display text-3xl font-semibold mt-4">Thank you, {order.customer.name.split(" ")[0]}!</h1>
        <p className="text-warmgrey mt-2">Your order is confirmed. Please keep your order number safe.</p>
        <p className="inline-block bg-band rounded-full px-5 py-2 font-bold tracking-wide mt-4">Order #{order.id}</p>
      </div>
      <ul className="mt-7 space-y-2.5 text-[15px]">
        {order.items.map((i, idx) => (
          <li key={idx} className="flex justify-between gap-3"><span>{i.name} {i.variantLabel && <span className="text-warmgrey">({i.variantLabel})</span>} × {i.quantity}</span><strong>{formatBDT(i.price * i.quantity)}</strong></li>
        ))}
      </ul>
      <div className="border-t border-linen mt-5 pt-4 space-y-2 text-[15px]">
        <p className="flex justify-between"><span className="text-warmgrey">Subtotal</span><strong>{formatBDT(order.subtotal)}</strong></p>
        <p className="flex justify-between"><span className="text-warmgrey">Delivery</span><strong>{order.deliveryCharge === 0 ? "Free" : formatBDT(order.deliveryCharge)}</strong></p>
        <p className="flex justify-between text-lg"><span className="font-semibold">Pay on delivery (COD)</span><strong className="text-golddeep">{formatBDT(order.total)}</strong></p>
      </div>
      <p className="text-[15px] text-espresso/75 mt-5">Deliver to: {order.customer.address}, {order.customer.city}, {order.customer.district} · Phone: {order.customer.phone}</p>
      <p className="text-[15px] text-espresso/75 mt-2">Questions about your order? DM us on <a className="underline font-medium" href="https://www.instagram.com/hadumshop/" target="_blank" rel="noopener">Instagram @hadumshop</a> with your order number.</p>
      <div className="text-center mt-7">
        <Link href="/shop" className="inline-block bg-espresso text-cream px-7 py-3.5 rounded-full font-semibold hover:bg-golddeep">Continue shopping</Link>
      </div>
    </div>
  );
}

export default async function OrderSuccessPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <Suspense fallback={<p>Loading order…</p>}>
        <Confirmation id={id || ""} />
      </Suspense>
    </div>
  );
}
