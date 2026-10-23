import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "HADUM Shop — a premium lifestyle brand from Khulna, Bangladesh. Rooted in heritage, designed for modern life.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
      <p className="uppercase tracking-[.22em] text-[13px] font-bold text-golddeep">About HADUM</p>
      <h1 className="font-display text-4xl sm:text-5xl font-semibold mt-3">Rooted in heritage.<br />Designed for modern life.</h1>
      <div className="relative aspect-[16/9] rounded-[2rem] overflow-hidden mt-9">
        <Image src="/brand/hero-brand.jpg" alt="HADUM brand" fill className="object-cover" sizes="100vw" priority />
      </div>
      <div className="prose-lg mt-10 space-y-5 text-espresso/80 text-[17px] leading-relaxed">
        <p>HADUM (হ্যাডাম) is a premium lifestyle brand from Khulna, Bangladesh. Our belief is simple: heritage isn't old-fashioned — it's craftsmanship that has lasted for generations, and it deserves to be designed for the way we live today.</p>
        <p>We make minimal, timeless pieces with honest materials and a clean finish. No shortcuts, no loud trends, nothing disposable. Every product in this shop shows a real photo, full honest details and a clear price — because you should never have to guess, or message just to ask "price?"</p>
        <p>We launched on Instagram, paused, and returned properly: an organized shop with regular drops, easy Cash on Delivery ordering, and a team that replies personally. This website is the next step of that promise.</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-4 mt-10">
        {[
          ["Heritage Craft", "Craftsmanship that has lasted generations — care passed down, not mass-produced shortcuts."],
          ["Modern Design", "Minimal, timeless design for modern life — pieces that still look right years from now."],
          ["Premium & Honest", "Honest materials, clean finishing, clear prices on everything."],
        ].map(([t, d]) => (
          <div key={t} className="bg-white border border-linen rounded-3xl p-6">
            <h2 className="font-display text-xl font-semibold">{t}</h2>
            <p className="text-espresso/70 mt-2 text-[15px]">{d}</p>
          </div>
        ))}
      </div>
      <div className="text-center mt-12">
        <Link href="/shop" className="bg-espresso text-cream px-8 py-4 rounded-full font-semibold inline-block hover:bg-golddeep">Shop the collection</Link>
        <p className="mt-4 text-warmgrey">Follow our journey on <a href="https://www.instagram.com/hadumshop/" target="_blank" rel="noopener" className="underline font-medium text-espresso">Instagram @hadumshop</a></p>
      </div>
    </div>
  );
}
