"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Banknote, Lock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatBDT } from "@/lib/format";
import type { StoreSettings } from "@/lib/types";

const DISTRICTS = ["Dhaka", "Khulna", "Chattogram", "Rajshahi", "Sylhet", "Barishal", "Rangpur", "Mymensingh", "Cumilla", "Narayanganj", "Gazipur", "Other"];

export default function CheckoutClient({ settings }: { settings: StoreSettings }) {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", address: "", district: "Dhaka", city: "", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);
  const [serverError, setServerError] = useState("");

  const delivery = useMemo(() => {
    if (settings.freeDeliveryAbove && subtotal >= settings.freeDeliveryAbove) return 0;
    return form.district === "Dhaka" ? settings.deliveryInsideDhaka : settings.deliveryOutsideDhaka;
  }, [form.district, subtotal, settings]);
  const total = subtotal + (items.length ? delivery : 0);

  function set(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })); }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 3) e.name = "Please enter your full name.";
    if (!/^01[3-9]\d{8}$/.test(form.phone.replace(/[\s-]/g, ""))) e.phone = "Enter a valid Bangladesh mobile number (e.g. 01712345678).";
    if (form.address.trim().length < 8) e.address = "Please enter your full delivery address.";
    if (!form.district) e.district = "Select your district.";
    if (form.city.trim().length < 2) e.city = "Enter your city / area.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function placeOrder(ev: React.FormEvent) {
    ev.preventDefault();
    setServerError("");
    if (!validate()) return;
    setPlacing(true);
    const res = await fetch("/api/orders", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: { ...form, phone: form.phone.replace(/[\s-]/g, "") },
        items: items.map((i) => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity })),
        paymentMethod: "cod",
      }),
    });
    const j = await res.json().catch(() => ({}));
    setPlacing(false);
    if (res.ok && j.orderId) {
      clear();
      router.push(`/order-success?id=${encodeURIComponent(j.orderId)}`);
    } else {
      setServerError(j.error || "Could not place the order. Please check your cart and try again.");
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-semibold">Nothing to check out yet</h1>
        <p className="text-warmgrey mt-2">Your cart is empty — add something beautiful first.</p>
        <Link href="/shop" className="inline-block mt-6 bg-espresso text-cream px-7 py-3.5 rounded-full font-semibold hover:bg-golddeep">Go to shop</Link>
      </div>
    );
  }

  const field = "w-full rounded-2xl border border-linen bg-white px-4 py-3 outline-none focus:border-gold";
  const label = "font-semibold text-sm tracking-wide block mb-1.5";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <h1 className="font-display text-4xl font-semibold inline-flex items-center gap-3">Checkout <Lock size={22} className="text-golddeep" /></h1>
      <form onSubmit={placeOrder} className="grid lg:grid-cols-[1fr_380px] gap-8 mt-8" noValidate={false}>
        <div className="space-y-6">
          <section className="bg-white border border-linen rounded-3xl p-6">
            <h2 className="font-display text-2xl font-semibold mb-5">Delivery details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className={label} htmlFor="co-name">Full name *</label><input id="co-name" className={field} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your full name" autoComplete="name" />{errors.name && <p className="text-red-700 text-sm mt-1">{errors.name}</p>}</div>
              <div><label className={label} htmlFor="co-phone">Mobile number (BD) *</label><input id="co-phone" className={field} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="01712345678" inputMode="tel" autoComplete="tel" />{errors.phone && <p className="text-red-700 text-sm mt-1">{errors.phone}</p>}</div>
              <div className="sm:col-span-2"><label className={label} htmlFor="co-address">Full delivery address *</label><textarea id="co-address" className={field} rows={2} value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="House, road, area…" autoComplete="street-address" />{errors.address && <p className="text-red-700 text-sm mt-1">{errors.address}</p>}</div>
              <div><label className={label} htmlFor="co-district">District *</label>
                <select id="co-district" className={field} value={form.district} onChange={(e) => set("district", e.target.value)}>
                  {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>{errors.district && <p className="text-red-700 text-sm mt-1">{errors.district}</p>}</div>
              <div><label className={label} htmlFor="co-city">City / Area *</label><input id="co-city" className={field} value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="e.g. Mirpur, Dhaka" />{errors.city && <p className="text-red-700 text-sm mt-1">{errors.city}</p>}</div>
              <div className="sm:col-span-2"><label className={label} htmlFor="co-notes">Delivery instructions (optional)</label><input id="co-notes" className={field} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Anything the delivery person should know" /></div>
            </div>
          </section>
          <section className="bg-white border border-linen rounded-3xl p-6">
            <h2 className="font-display text-2xl font-semibold mb-4">Payment method</h2>
            <label className="flex gap-3 border-2 border-gold rounded-2xl px-4 py-4 cursor-pointer bg-band/50">
              <input type="radio" name="pay" checked readOnly className="mt-1 accent-[#a67c2e]" />
              <span>
                <span className="font-semibold flex items-center gap-2"><Banknote size={18} className="text-golddeep" /> Cash on Delivery (COD)</span>
                <span className="text-sm text-warmgrey block mt-0.5">Pay in cash when your order arrives. Available now.</span>
              </span>
            </label>
            <div className="grid sm:grid-cols-3 gap-3 mt-3 text-sm">
              {["bKash", "Nagad", "SSLCommerz"].map((m) => (
                <div key={m} className="border border-linen rounded-2xl px-4 py-3.5 opacity-55">
                  <p className="font-semibold">{m}</p>
                  <p className="text-warmgrey text-[13px]">Coming soon — merchant account not yet configured.</p>
                </div>
              ))}
            </div>
          </section>
        </div>
        <aside className="bg-white border border-linen rounded-3xl p-6 self-start lg:sticky lg:top-32">
          <h2 className="font-display text-2xl font-semibold">Order summary</h2>
          <ul className="mt-4 space-y-3 text-[15px]">
            {items.map((i) => (
              <li key={i.productId + (i.variantId || "")} className="flex justify-between gap-3">
                <span>{i.name} {i.variantLabel && <span className="text-warmgrey">({i.variantLabel})</span>} × {i.quantity}</span>
                <strong className="whitespace-nowrap">{formatBDT(i.price * i.quantity)}</strong>
              </li>
            ))}
          </ul>
          <div className="border-t border-linen mt-4 pt-4 space-y-2 text-[15px]">
            <p className="flex justify-between"><span className="text-warmgrey">Subtotal</span><strong>{formatBDT(subtotal)}</strong></p>
            <p className="flex justify-between"><span className="text-warmgrey">Delivery ({form.district === "Dhaka" ? "inside Dhaka" : "outside Dhaka"})</span><strong>{delivery === 0 ? "Free" : formatBDT(delivery)}</strong></p>
            <p className="flex justify-between text-lg border-t border-linen pt-3"><span className="font-semibold">Total to pay on delivery</span><strong className="text-golddeep">{formatBDT(total)}</strong></p>
          </div>
          {serverError && <p className="text-red-700 text-sm mt-3" role="alert">{serverError}</p>}
          <button disabled={placing} className="w-full bg-espresso text-cream rounded-full py-4 font-semibold mt-5 hover:bg-golddeep disabled:opacity-50">
            {placing ? "Placing order…" : "Confirm Order — COD"}
          </button>
          <p className="text-[13px] text-warmgrey mt-3 text-center">By confirming you agree to our <Link href="/policies/terms" className="underline">terms</Link>. Prices are verified on our server before your order is created.</p>
        </aside>
      </form>
    </div>
  );
}
