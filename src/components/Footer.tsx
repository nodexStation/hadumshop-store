import Link from "next/link";
import { Instagram, Mail, MapPin } from "lucide-react";
import type { Category, StoreSettings } from "@/lib/types";

export default function Footer({ settings, categories }: { settings: StoreSettings; categories: Category[] }) {
  return (
    <footer className="bg-espresso text-cream mt-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <p className="font-display font-bold text-2xl tracking-wide">HADUM <span className="text-goldsoft text-base">হ্যাডাম</span></p>
          <p className="text-cream/70 mt-3 text-[15px]">Rooted in heritage. Designed for modern life. A premium lifestyle brand from Khulna, Bangladesh — heritage craft, minimal timeless design, honest prices.</p>
          <div className="flex gap-3 mt-5">
            <a href={settings.instagram} target="_blank" rel="noopener" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors"><Instagram size={18} /></a>
            <a href={`mailto:${settings.email}`} aria-label="Email" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors"><Mail size={18} /></a>
          </div>
        </div>
        <nav aria-label="Shop">
          <p className="font-semibold tracking-wide mb-4 text-goldsoft">SHOP</p>
          <ul className="space-y-2.5 text-cream/80 text-[15px]">
            <li><Link href="/shop" className="hover:text-white">Shop All</Link></li>
            {categories.map((c) => (
              <li key={c.id}><Link href={`/shop?category=${c.slug}`} className="hover:text-white">{c.name}</Link></li>
            ))}
            <li><Link href="/shop?sort=new" className="hover:text-white">New Arrivals</Link></li>
            <li><Link href="/shop?filter=bestsellers" className="hover:text-white">Best Sellers</Link></li>
          </ul>
        </nav>
        <nav aria-label="Help">
          <p className="font-semibold tracking-wide mb-4 text-goldsoft">HELP</p>
          <ul className="space-y-2.5 text-cream/80 text-[15px]">
            <li><Link href="/policies/shipping" className="hover:text-white">Shipping Policy</Link></li>
            <li><Link href="/policies/returns" className="hover:text-white">Returns &amp; Refunds</Link></li>
            <li><Link href="/policies/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/policies/terms" className="hover:text-white">Terms &amp; Conditions</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
          </ul>
        </nav>
        <div>
          <p className="font-semibold tracking-wide mb-4 text-goldsoft">CONTACT</p>
          <ul className="space-y-3 text-cream/80 text-[15px]">
            <li className="flex gap-2"><Instagram size={17} className="mt-0.5 shrink-0" /><a href={settings.instagram} target="_blank" rel="noopener" className="hover:text-white">@hadumshop on Instagram</a></li>
            <li className="flex gap-2"><Mail size={17} className="mt-0.5 shrink-0" /><a href={`mailto:${settings.email}`} className="hover:text-white">{settings.email}</a></li>
            <li className="flex gap-2"><MapPin size={17} className="mt-0.5 shrink-0" />Khulna, Bangladesh</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-5 flex flex-col sm:flex-row justify-between gap-2 text-[13px] text-cream/60">
          <p>© {new Date().getFullYear()} HADUM Shop. All rights reserved.</p>
          <p>Cash on Delivery available · bKash / Nagad / SSLCommerz coming when merchant accounts are ready</p>
        </div>
      </div>
    </footer>
  );
}
