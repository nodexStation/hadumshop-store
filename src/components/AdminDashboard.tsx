"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Package, Settings as SettingsIcon, ShoppingCart, Star, Trash2 } from "lucide-react";
import type { Order, Product, StoreData, StoreSettings } from "@/lib/types";
import { formatBDT } from "@/lib/format";

type Tab = "overview" | "products" | "orders" | "settings";

const emptyProduct: Product = {
  id: "", slug: "", name: "", categorySlug: "apparel", price: 0, compareAtPrice: null,
  description: "", images: [], variants: [], stock: 10, featured: false, bestSeller: false,
  isNew: true, demo: false, createdAt: "",
};

export default function AdminDashboard({ data }: { data: StoreData }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [editing, setEditing] = useState<Product | null>(null);
  const [settings, setSettings] = useState<StoreSettings>(data.settings);
  const [msg, setMsg] = useState("");
  const [tName, setTName] = useState(""); const [tText, setTText] = useState("");

  const sales = useMemo(() => data.orders.filter((o) => o.status !== "cancelled"), [data.orders]);
  const revenue = sales.reduce((s, o) => s + o.total, 0);
  const pending = data.orders.filter((o) => o.status === "pending").length;

  async function api(body: unknown, method = "PUT") {
    const res = await fetch("/api/admin", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(j.error || "Request failed");
    return j;
  }
  function note(t: string) { setMsg(t); setTimeout(() => setMsg(""), 3500); }

  async function saveProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    try { await api({ kind: "product", product: editing }); note("Product saved."); setEditing(null); router.refresh(); }
    catch (err) { note(err instanceof Error ? err.message : "Save failed"); }
  }
  async function deleteProduct(id: string, name: string) {
    if (!confirm(`Delete "${name}" permanently?`)) return;
    const res = await fetch(`/api/admin?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (res.ok) { note("Product deleted."); router.refresh(); } else note("Delete failed.");
  }
  async function setStatus(id: string, status: Order["status"]) {
    try { await api({ kind: "order-status", id, status }); note(`Order ${id} → ${status}`); router.refresh(); }
    catch { note("Status update failed."); }
  }
  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    try { await api({ kind: "settings", settings }); note("Settings saved."); router.refresh(); }
    catch { note("Settings save failed."); }
  }
  async function addTestimonial(e: React.FormEvent) {
    e.preventDefault();
    try { await api({ kind: "testimonial", testimonial: { name: tName, text: tText, verified: true } }); note("Verified testimonial added — it now shows on the homepage."); setTName(""); setTText(""); router.refresh(); }
    catch { note("Could not add testimonial."); }
  }
  async function uploadImage(file: File, apply: (url: string) => void) {
    const fd = new FormData(); fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const j = await res.json().catch(() => ({}));
    if (res.ok) { apply(j.url); note("Image uploaded."); } else note(j.error || "Upload failed.");
  }
  async function logout() {
    await fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "logout" }) });
    router.refresh();
  }

  const input = "w-full rounded-xl border border-linen bg-white px-3.5 py-2.5 outline-none focus:border-gold text-[15px]";
  const label = "font-semibold text-[13px] tracking-wide block mb-1";
  const tabBtn = (t: Tab, icon: React.ReactNode, text: string) => (
    <button onClick={() => setTab(t)} className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm ${tab === t ? "bg-espresso text-cream" : "bg-white border border-linen hover:border-gold"}`}>{icon} {text}</button>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-4xl font-semibold">Admin Dashboard</h1>
        <button onClick={logout} className="inline-flex items-center gap-2 font-semibold text-red-700 hover:text-red-900"><LogOut size={17} /> Log out</button>
      </div>
      {msg && <p className="mt-4 bg-band border border-linen rounded-full px-4 py-2 inline-block text-sm font-medium" role="status">{msg}</p>}

      <div className="flex flex-wrap gap-2 mt-6">
        {tabBtn("overview", <LayoutDashboard size={16} />, "Overview")}
        {tabBtn("products", <Package size={16} />, `Products (${data.products.length})`)}
        {tabBtn("orders", <ShoppingCart size={16} />, `Orders (${data.orders.length})`)}
        {tabBtn("settings", <SettingsIcon size={16} />, "Settings")}
      </div>

      {tab === "overview" && (
        <div className="mt-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              ["Total revenue (excl. cancelled)", formatBDT(revenue)],
              ["Orders", String(data.orders.length)],
              ["Pending orders", String(pending)],
              ["Products live", String(data.products.length)],
              ["Newsletter subscribers", String(data.subscribers.length)],
              ["Demo products still live", String(data.products.filter((p) => p.demo).length)],
              ["Out of stock", String(data.products.filter((p) => p.stock <= 0).length)],
              ["Testimonials shown", String(data.testimonials.length)],
            ].map(([k, v]) => (
              <div key={k} className="bg-white border border-linen rounded-3xl p-5">
                <p className="text-warmgrey text-sm">{k}</p>
                <p className="font-display text-3xl font-semibold mt-1.5">{v}</p>
              </div>
            ))}
          </div>
          <div className="bg-white border border-linen rounded-3xl p-6 mt-6">
            <h2 className="font-display text-2xl font-semibold">Latest orders</h2>
            {data.orders.length === 0 ? <p className="text-warmgrey mt-3">No orders yet — they will appear here the moment a customer checks out.</p> : (
              <ul className="mt-4 space-y-2.5 text-[15px]">
                {data.orders.slice(0, 5).map((o) => (
                  <li key={o.id} className="flex flex-wrap justify-between gap-2 border-b border-linen/70 pb-2.5">
                    <span><strong>{o.id}</strong> · {o.customer.name} · {o.customer.district}</span>
                    <span className="font-semibold">{formatBDT(o.total)} · <span className="capitalize text-golddeep">{o.status}</span></span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <form onSubmit={addTestimonial} className="bg-white border border-linen rounded-3xl p-6 mt-6">
            <h2 className="font-display text-2xl font-semibold inline-flex items-center gap-2"><Star size={20} className="text-golddeep" /> Add a verified testimonial</h2>
            <p className="text-warmgrey text-sm mt-1">Only add real customer feedback you have permission to publish. It appears on the homepage immediately.</p>
            <div className="grid sm:grid-cols-[220px_1fr_auto] gap-3 mt-4">
              <input className={input} placeholder="Customer name" value={tName} onChange={(e) => setTName(e.target.value)} required />
              <input className={input} placeholder="What they said…" value={tText} onChange={(e) => setTText(e.target.value)} required />
              <button className="bg-espresso text-cream rounded-full px-6 font-semibold hover:bg-golddeep">Add</button>
            </div>
          </form>
        </div>
      )}

      {tab === "products" && (
        <div className="mt-8">
          {!editing ? (
            <>
              <button onClick={() => setEditing({ ...emptyProduct, categorySlug: data.categories[0]?.slug || "" })} className="bg-espresso text-cream px-6 py-3 rounded-full font-semibold hover:bg-golddeep">+ Add new product</button>
              <div className="grid gap-3 mt-5">
                {data.products.map((p) => (
                  <div key={p.id} className="bg-white border border-linen rounded-2xl px-5 py-4 flex flex-wrap items-center gap-3">
                    <div className="flex-1 min-w-[200px]">
                      <p className="font-semibold">{p.name} {p.demo && <span className="text-[11px] bg-espresso text-cream px-2 py-0.5 rounded-full ml-1">DEMO</span>}</p>
                      <p className="text-sm text-warmgrey">{p.categorySlug} · stock {p.stock} · {p.featured ? "Featured · " : ""}{p.bestSeller ? "Best seller · " : ""}{p.isNew ? "New" : ""}</p>
                    </div>
                    <p className="font-bold text-golddeep">{formatBDT(p.price)}</p>
                    <button onClick={() => setEditing(p)} className="border border-espresso px-4 py-2 rounded-full font-semibold text-sm hover:border-golddeep hover:text-golddeep">Edit</button>
                    <button onClick={() => deleteProduct(p.id, p.name)} className="text-red-700 p-2" aria-label={`Delete ${p.name}`}><Trash2 size={18} /></button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <form onSubmit={saveProduct} className="bg-white border border-linen rounded-3xl p-6 grid sm:grid-cols-2 gap-4">
              <h2 className="font-display text-2xl font-semibold sm:col-span-2">{editing.id ? "Edit product" : "New product"}</h2>
              <div><label className={label}>Name *</label><input className={input} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} required /></div>
              <div><label className={label}>Category</label>
                <select className={input} value={editing.categorySlug} onChange={(e) => setEditing({ ...editing, categorySlug: e.target.value })}>
                  {data.categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
                </select></div>
              <div><label className={label}>Price (৳) *</label><input className={input} type="number" min={0} value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} required /></div>
              <div><label className={label}>Original price (৳, optional)</label><input className={input} type="number" min={0} value={editing.compareAtPrice ?? ""} onChange={(e) => setEditing({ ...editing, compareAtPrice: e.target.value ? Number(e.target.value) : null })} /></div>
              <div><label className={label}>Total stock</label><input className={input} type="number" min={0} value={editing.stock} onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })} /></div>
              <div><label className={label}>Slug (auto if blank)</label><input className={input} value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} placeholder="auto-from-name" /></div>
              <div className="sm:col-span-2"><label className={label}>Description</label><textarea className={input} rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
              <div className="sm:col-span-2"><label className={label}>Image URLs (comma separated) — or upload</label>
                <input className={input} value={editing.images.join(", ")} onChange={(e) => setEditing({ ...editing, images: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} placeholder="/demo/product.svg, https://…" />
                <input type="file" accept="image/*" className="mt-2 text-sm" aria-label="Upload product image"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f, (url) => setEditing((cur) => cur ? { ...cur, images: [url, ...cur.images] } : cur)); }} /></div>
              <div className="sm:col-span-2"><label className={label}>Variants — one per line as "Size: M | 8" (label | stock)</label>
                <textarea className={input} rows={3} value={editing.variants.map((v) => `${v.label} | ${v.stock}`).join("\n")}
                  onChange={(e) => setEditing({ ...editing, variants: e.target.value.split("\n").filter((l) => l.trim()).map((l, i) => { const [lb, st] = l.split("|"); return { id: editing.variants[i]?.id || `v${Date.now()}${i}`, label: (lb || "").trim(), stock: Number((st || "0").trim()) || 0 }; }) })} placeholder={"Size: M | 8\nSize: L | 5"} /></div>
              <div className="sm:col-span-2 flex flex-wrap gap-5 text-[15px] font-medium">
                <label className="flex gap-2 items-center"><input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} className="accent-[#a67c2e]" /> Featured</label>
                <label className="flex gap-2 items-center"><input type="checkbox" checked={editing.bestSeller} onChange={(e) => setEditing({ ...editing, bestSeller: e.target.checked })} className="accent-[#a67c2e]" /> Best seller (owner-marked)</label>
                <label className="flex gap-2 items-center"><input type="checkbox" checked={editing.isNew} onChange={(e) => setEditing({ ...editing, isNew: e.target.checked })} className="accent-[#a67c2e]" /> New arrival</label>
                <label className="flex gap-2 items-center"><input type="checkbox" checked={editing.demo} onChange={(e) => setEditing({ ...editing, demo: e.target.checked })} className="accent-[#a67c2e]" /> Demo product</label>
              </div>
              <div className="sm:col-span-2 flex gap-3">
                <button className="bg-espresso text-cream px-7 py-3 rounded-full font-semibold hover:bg-golddeep">Save product</button>
                <button type="button" onClick={() => setEditing(null)} className="border border-linen px-7 py-3 rounded-full font-semibold">Cancel</button>
              </div>
            </form>
          )}
        </div>
      )}

      {tab === "orders" && (
        <div className="mt-8 grid gap-4">
          {data.orders.length === 0 && <p className="text-warmgrey">No orders yet.</p>}
          {data.orders.map((o) => (
            <div key={o.id} className="bg-white border border-linen rounded-3xl p-5">
              <div className="flex flex-wrap justify-between gap-3">
                <p><strong>{o.id}</strong> · {new Date(o.createdAt).toLocaleString("en-GB", { timeZone: "Asia/Dhaka" })} · COD {o.demo && <span className="text-[11px] bg-band border border-linen px-2 py-0.5 rounded-full ml-1">demo-mode order</span>}</p>
                <p className="font-bold text-golddeep">{formatBDT(o.total)}</p>
              </div>
              <p className="text-[15px] mt-2">{o.items.map((i) => `${i.name}${i.variantLabel ? ` (${i.variantLabel})` : ""} × ${i.quantity}`).join(", ")}</p>
              <p className="text-[15px] text-espresso/75 mt-1">{o.customer.name} · {o.customer.phone} · {o.customer.address}, {o.customer.city}, {o.customer.district}{o.customer.notes ? ` · Note: ${o.customer.notes}` : ""}</p>
              <p className="text-sm text-warmgrey mt-1">Subtotal {formatBDT(o.subtotal)} + delivery {formatBDT(o.deliveryCharge)}</p>
              <label className="inline-flex items-center gap-2 mt-3 font-semibold text-sm">Status
                <select value={o.status} onChange={(e) => setStatus(o.id, e.target.value as Order["status"])} className="rounded-full border border-linen px-3.5 py-2 bg-white capitalize">
                  {["pending", "confirmed", "shipped", "delivered", "cancelled"].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
            </div>
          ))}
        </div>
      )}

      {tab === "settings" && (
        <form onSubmit={saveSettings} className="mt-8 bg-white border border-linen rounded-3xl p-6 grid sm:grid-cols-2 gap-4 max-w-4xl">
          <h2 className="font-display text-2xl font-semibold sm:col-span-2">Store settings</h2>
          <div className="sm:col-span-2"><label className={label}>Announcement bar</label><input className={input} value={settings.announcement} onChange={(e) => setSettings({ ...settings, announcement: e.target.value })} /></div>
          <div className="sm:col-span-2"><label className={label}>Hero headline</label><input className={input} value={settings.heroHeadline} onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })} /></div>
          <div className="sm:col-span-2"><label className={label}>Hero subtext</label><textarea className={input} rows={2} value={settings.heroSubtext} onChange={(e) => setSettings({ ...settings, heroSubtext: e.target.value })} /></div>
          <div><label className={label}>Promo banner title</label><input className={input} value={settings.promoTitle} onChange={(e) => setSettings({ ...settings, promoTitle: e.target.value })} /></div>
          <div><label className={label}>Promo CTA text</label><input className={input} value={settings.promoCta} onChange={(e) => setSettings({ ...settings, promoCta: e.target.value })} /></div>
          <div className="sm:col-span-2"><label className={label}>Promo banner text</label><input className={input} value={settings.promoText} onChange={(e) => setSettings({ ...settings, promoText: e.target.value })} /></div>
          <div><label className={label}>Delivery — inside Dhaka (৳)</label><input className={input} type="number" min={0} value={settings.deliveryInsideDhaka} onChange={(e) => setSettings({ ...settings, deliveryInsideDhaka: Number(e.target.value) })} /></div>
          <div><label className={label}>Delivery — outside Dhaka (৳)</label><input className={input} type="number" min={0} value={settings.deliveryOutsideDhaka} onChange={(e) => setSettings({ ...settings, deliveryOutsideDhaka: Number(e.target.value) })} /></div>
          <div><label className={label}>Free delivery above (৳, blank = off)</label><input className={input} type="number" min={0} value={settings.freeDeliveryAbove ?? ""} onChange={(e) => setSettings({ ...settings, freeDeliveryAbove: e.target.value ? Number(e.target.value) : null })} /></div>
          <div><label className={label}>Contact email</label><input className={input} value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} /></div>
          <div className="sm:col-span-2"><label className={label}>Instagram URL</label><input className={input} value={settings.instagram} onChange={(e) => setSettings({ ...settings, instagram: e.target.value })} /></div>
          <div className="sm:col-span-2"><button className="bg-espresso text-cream px-7 py-3 rounded-full font-semibold hover:bg-golddeep">Save settings</button></div>
        </form>
      )}
    </div>
  );
}
