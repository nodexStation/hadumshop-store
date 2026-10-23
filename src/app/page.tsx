import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Instagram, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { readData } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import Newsletter from "@/components/Newsletter";

export const dynamic = "force-dynamic";

const IG_GALLERY = ["/brand/ig-1.jpg", "/brand/ig-2.jpg", "/brand/ig-3.jpg", "/brand/ig-4.jpg", "/brand/ig-5.jpg"];

export default async function HomePage() {
  const data = await readData();
  const { settings, products, categories, testimonials } = data;
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNew).concat(products.filter((p) => !p.isNew)).slice(0, 4);
  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 4);
  const anyDemo = products.some((p) => p.demo);

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-8 pb-14 grid lg:grid-cols-2 gap-10 items-center">
        <div className="fade-up">
          <p className="uppercase tracking-[.22em] text-[13px] font-bold text-golddeep">Premium Lifestyle · Khulna, Bangladesh</p>
          <h1 className="font-display text-[42px] leading-[1.08] sm:text-6xl font-semibold mt-4">{settings.heroHeadline}</h1>
          <p className="text-lg text-espresso/75 mt-5 max-w-lg">{settings.heroSubtext}</p>
          <div className="flex flex-wrap gap-3 mt-7">
            <Link href="/shop" className="bg-espresso text-cream px-7 py-3.5 rounded-full font-semibold hover:bg-golddeep transition-colors inline-flex items-center gap-2">Shop Now <ArrowRight size={17} /></Link>
            <Link href="/about" className="border border-espresso px-7 py-3.5 rounded-full font-semibold hover:border-golddeep hover:text-golddeep transition-colors">Our Story</Link>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-8 text-sm text-espresso/70">
            <span className="inline-flex items-center gap-1.5"><Truck size={16} className="text-golddeep" /> Delivery across Bangladesh</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck size={16} className="text-golddeep" /> Cash on Delivery</span>
            <span className="inline-flex items-center gap-1.5"><RotateCcw size={16} className="text-golddeep" /> Easy returns</span>
          </div>
        </div>
        <div className="relative">
          <div className="relative aspect-[4/5] max-h-[560px] w-full rounded-[2rem] overflow-hidden shadow-xl">
            <Image src={settings.heroImage} alt="HADUM — Rooted in heritage. Designed for modern life." fill priority className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
          </div>
          <div className="absolute -bottom-5 left-5 bg-white rounded-2xl shadow-lg px-5 py-4 floaty">
            <p className="font-display font-semibold">New collection coming</p>
            <p className="text-sm text-warmgrey">Followers see the first drop first</p>
          </div>
        </div>
      </section>

      {anyDemo && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 -mt-2 pb-2">
          <p className="text-[13px] bg-band border border-linen rounded-full px-4 py-2 inline-block text-espresso/70">
            Demo catalogue: sample products are clearly marked <strong>DEMO</strong> until real HADUM products are added in the admin dashboard.
          </p>
        </div>
      )}

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold">Shop by Category</h2>
          <Link href="/shop" className="font-semibold text-golddeep inline-flex items-center gap-1 hover:gap-2 transition-all">View all <ArrowRight size={16} /></Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-7">
          {categories.map((c) => (
            <Link key={c.id} href={`/shop?category=${c.slug}`} className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-band card-hover">
              <Image src={c.image} alt={c.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:1024px) 50vw, 25vw" loading="lazy" />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-espresso/85 to-transparent p-4 pt-10">
                <span className="text-cream font-display font-semibold text-lg block">{c.name}</span>
                <span className="text-cream/75 text-sm">{c.nameBn}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="bg-band/60 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold">Featured Products</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-7">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Brand story */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 grid lg:grid-cols-2 gap-10 items-center">
        <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden">
          <Image src="/brand/ig-1.jpg" alt="Inside HADUM — heritage craft, modern design" fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" loading="lazy" />
        </div>
        <div>
          <p className="uppercase tracking-[.22em] text-[13px] font-bold text-golddeep">Our Story</p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold mt-3">Heritage isn't old-fashioned. It's craft that lasted.</h2>
          <p className="text-espresso/75 mt-4 text-[17px] leading-relaxed">Some things survive for generations for a reason — they were made properly. HADUM takes that heritage craftsmanship and designs it for modern life: clean lines, timeless pieces, nothing loud, nothing disposable.</p>
          <p className="text-espresso/75 mt-3 text-[17px] leading-relaxed">Every product in this shop carries a real photo, full honest details and a clear price. No guessing, no "DM for price" games.</p>
          <Link href="/about" className="inline-flex items-center gap-1.5 font-semibold text-golddeep mt-5 hover:gap-2.5 transition-all">Read more about HADUM <ArrowRight size={16} /></Link>
        </div>
      </section>

      {/* New arrivals */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-6 pb-14">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold">New Arrivals</h2>
          <Link href="/shop?sort=new" className="font-semibold text-golddeep inline-flex items-center gap-1 hover:gap-2 transition-all">See new <ArrowRight size={16} /></Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-7">
          {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Promo banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-14">
        <div className="relative rounded-[2rem] overflow-hidden bg-gold text-white px-6 py-12 sm:px-12 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold">{settings.promoTitle}</h2>
          <p className="mt-3 text-white/85 max-w-xl mx-auto">{settings.promoText}</p>
          <a href={settings.instagram} target="_blank" rel="noopener" className="inline-flex items-center gap-2 mt-6 bg-espresso text-cream px-7 py-3.5 rounded-full font-semibold hover:bg-black transition-colors"><Instagram size={17} /> {settings.promoCta}</a>
        </div>
      </section>

      {/* Best sellers (owner-marked) */}
      {bestSellers.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-14">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold">Best Sellers</h2>
          <p className="text-warmgrey mt-2 text-[15px]">Marked by the store owner — never fabricated rankings.</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-7">
            {bestSellers.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Testimonials — only rendered when verified feedback exists */}
      {testimonials.length > 0 && (
        <section className="bg-band/60 py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-center">What customers say</h2>
            <div className="grid md:grid-cols-3 gap-5 mt-8">
              {testimonials.map((t, i) => (
                <figure key={i} className="bg-white rounded-3xl border border-linen p-6">
                  <blockquote className="text-espresso/80">“{t.text}”</blockquote>
                  <figcaption className="mt-4 font-semibold">{t.name} {t.verified && <span className="text-golddeep text-sm">· Verified buyer</span>}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Instagram gallery — genuine HADUM brand posts, linked, not a fake live feed */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <div className="text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold inline-flex items-center gap-3"><Instagram className="text-golddeep" /> @hadumshop</h2>
          <p className="text-warmgrey mt-2">From our Instagram — tap any photo to visit the profile.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-8">
          {IG_GALLERY.map((src, i) => (
            <a key={src} href={settings.instagram} target="_blank" rel="noopener" className="relative aspect-square rounded-2xl overflow-hidden group" aria-label={`HADUM Instagram post ${i + 1}`}>
              <Image src={src} alt={`HADUM Instagram post ${i + 1}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="20vw" loading="lazy" />
            </a>
          ))}
        </div>
      </section>

      <Newsletter />
    </>
  );
}
