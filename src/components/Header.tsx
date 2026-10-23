"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { StoreSettings } from "@/lib/types";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop All" },
  { href: "/shop?sort=new", label: "New Arrivals" },
  { href: "/shop?filter=bestsellers", label: "Best Sellers" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export default function Header({ settings }: { settings: StoreSettings }) {
  const { count, wishlist } = useCart();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearchOpen(false);
    setOpen(false);
    router.push(`/shop?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-espresso text-cream text-center text-[13px] py-2 px-4 font-medium tracking-wide">
        {settings.announcement}
      </div>
      <div className="bg-cream/95 backdrop-blur border-b border-linen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between gap-3 py-3">
          <button className="lg:hidden p-2 -ml-2" aria-label="Open menu" onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link href="/" className="flex items-center gap-2.5" aria-label="Hadum Shop — home">
            <span className="w-10 h-10 rounded-xl bg-espresso text-goldsoft font-display font-bold text-xl flex items-center justify-center">H</span>
            <span className="font-display font-bold text-[22px] tracking-wide leading-none">
              HADUM <span className="block text-[11px] font-body font-semibold tracking-[.28em] text-golddeep">SHOP · হ্যাডাম</span>
            </span>
          </Link>
          <nav className="hidden lg:flex items-center gap-7 text-[15px] font-medium" aria-label="Main">
            {NAV.map((n) => (
              <Link key={n.label} href={n.href} className="hover:text-golddeep transition-colors">{n.label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-1 sm:gap-2">
            <button className="p-2 hover:text-golddeep" aria-label="Search" onClick={() => setSearchOpen(!searchOpen)}><Search size={21} /></button>
            <Link href="/admin" className="p-2 hover:text-golddeep hidden sm:block" aria-label="Account"><User size={21} /></Link>
            <Link href="/shop?wishlist=1" className="p-2 hover:text-golddeep relative" aria-label="Wishlist">
              <Heart size={21} />
              {wishlist.length > 0 && <span className="absolute -top-0.5 -right-0.5 bg-gold text-white text-[10px] font-bold w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center">{wishlist.length}</span>}
            </Link>
            <Link href="/cart" className="p-2 hover:text-golddeep relative" aria-label="Cart">
              <ShoppingBag size={21} />
              {count > 0 && <span className="absolute -top-0.5 -right-0.5 bg-gold text-white text-[10px] font-bold min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center">{count}</span>}
            </Link>
          </div>
        </div>
        {searchOpen && (
          <form onSubmit={submitSearch} className="mx-auto max-w-7xl px-4 sm:px-6 pb-3 fade-up">
            <div className="flex gap-2">
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" aria-label="Search products"
                className="flex-1 rounded-full border border-linen bg-white px-5 py-2.5 outline-none focus:border-gold" />
              <button className="rounded-full bg-espresso text-cream px-5 py-2.5 font-semibold hover:bg-golddeep transition-colors">Search</button>
            </div>
          </form>
        )}
        {open && (
          <nav className="lg:hidden border-t border-linen px-4 py-3 flex flex-col gap-1 bg-cream fade-up" aria-label="Mobile">
            {NAV.map((n) => (
              <Link key={n.label} href={n.href} onClick={() => setOpen(false)} className="py-2.5 px-2 rounded-lg font-medium hover:bg-band">{n.label}</Link>
            ))}
            <Link href="/cart" onClick={() => setOpen(false)} className="py-2.5 px-2 rounded-lg font-semibold text-golddeep">Cart ({count})</Link>
          </nav>
        )}
      </div>
    </header>
  );
}
