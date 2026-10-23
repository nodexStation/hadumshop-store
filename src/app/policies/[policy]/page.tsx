import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { readData } from "@/lib/db";
import { formatBDT } from "@/lib/format";

export const dynamic = "force-dynamic";

const TITLES: Record<string, string> = {
  shipping: "Shipping Policy",
  returns: "Returns & Refund Policy",
  privacy: "Privacy Policy",
  terms: "Terms & Conditions",
};

export async function generateMetadata({ params }: { params: Promise<{ policy: string }> }): Promise<Metadata> {
  const { policy } = await params;
  return { title: TITLES[policy] || "Policy" };
}

export default async function PolicyPage({ params }: { params: Promise<{ policy: string }> }) {
  const { policy } = await params;
  if (!TITLES[policy]) notFound();
  const data = await readData();
  const s = data.settings;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
      <h1 className="font-display text-4xl font-semibold">{TITLES[policy]}</h1>
      <p className="text-warmgrey text-sm mt-2">Last updated: October 2026 · Owner-editable — review with your own terms before scaling.</p>
      <div className="mt-8 space-y-5 text-espresso/80 leading-relaxed text-[16px]">
        {policy === "shipping" && <>
          <p>We deliver across Bangladesh. Orders are prepared with care after confirmation and handed to our delivery partner.</p>
          <h2 className="font-display text-2xl font-semibold text-espresso pt-2">Delivery charges</h2>
          <p>Inside Dhaka: <strong>{formatBDT(s.deliveryInsideDhaka)}</strong> · Outside Dhaka: <strong>{formatBDT(s.deliveryOutsideDhaka)}</strong>. {s.freeDeliveryAbove ? <>Delivery is free on orders of {formatBDT(s.freeDeliveryAbove)} or more.</> : null} The exact charge for your order is always shown at checkout before you confirm — no surprises.</p>
          <h2 className="font-display text-2xl font-semibold text-espresso pt-2">Payment</h2>
          <p>Cash on Delivery: you pay the full amount (product + delivery) in cash when your order arrives.</p>
          <h2 className="font-display text-2xl font-semibold text-espresso pt-2">Delivery time</h2>
          <p>We confirm an estimated delivery window personally with every order. If anything changes, we message you — we never leave an order silent.</p>
        </>}
        {policy === "returns" && <>
          <p>We want every HADUM piece to feel right. If it doesn't, here's exactly how returns work.</p>
          <h2 className="font-display text-2xl font-semibold text-espresso pt-2">What can be returned</h2>
          <p>Unused items in their original condition and packaging, reported to us within 7 days of delivery. For hygiene and safety, personal-use items that have been used cannot be returned unless they arrived damaged or defective.</p>
          <h2 className="font-display text-2xl font-semibold text-espresso pt-2">Damaged or wrong item</h2>
          <p>If your order arrives damaged, defective, or different from what you ordered, message us on Instagram with your order number and a photo within 48 hours — we will replace it or refund you in full, including delivery.</p>
          <h2 className="font-display text-2xl font-semibold text-espresso pt-2">How refunds are paid</h2>
          <p>Approved refunds are returned through the same channel agreed with you when the return is confirmed, after we receive the item back. Cash-on-delivery refunds are settled by bank transfer or mobile banking as agreed in our chat.</p>
        </>}
        {policy === "privacy" && <>
          <p>Your privacy matters. This page explains, in plain language, what HADUM Shop collects and why.</p>
          <h2 className="font-display text-2xl font-semibold text-espresso pt-2">What we collect</h2>
          <p>Order details you give at checkout (name, phone, address, district, city, notes) — used only to deliver your order and contact you about it. If you subscribe to our newsletter, your email address — used only for HADUM news you consented to receive.</p>
          <h2 className="font-display text-2xl font-semibold text-espresso pt-2">What we never do</h2>
          <p>We never sell your personal information. We never store card or mobile-banking credentials — Cash on Delivery means we never see them.</p>
          <h2 className="font-display text-2xl font-semibold text-espresso pt-2">Your choices</h2>
          <p>Unsubscribe from the newsletter anytime. To see or delete your order data, message us on Instagram or email {s.email} with your order number.</p>
        </>}
        {policy === "terms" && <>
          <p>By shopping at HADUM Shop you agree to these simple terms.</p>
          <h2 className="font-display text-2xl font-semibold text-espresso pt-2">Products &amp; prices</h2>
          <p>All prices are in Bangladeshi taka (৳) and are confirmed on our server when you order — the total on your confirmation page is the total you pay on delivery, including the delivery charge shown at checkout. If a pricing error ever occurs, we will contact you before dispatch and you may cancel free of charge.</p>
          <h2 className="font-display text-2xl font-semibold text-espresso pt-2">Orders</h2>
          <p>An order is confirmed when you receive an order number on the confirmation page. We may call or message to verify large or unusual orders. Stock is limited — if an item sells out after your order, we will tell you immediately and offer a replacement or a full cancellation.</p>
          <h2 className="font-display text-2xl font-semibold text-espresso pt-2">Contact</h2>
          <p>Questions about these terms: Instagram @hadumshop or {s.email}.</p>
        </>}
      </div>
    </div>
  );
}
