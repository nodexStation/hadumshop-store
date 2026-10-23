import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { readData } from "@/lib/db";
import { formatBDT } from "@/lib/format";
import ProductCard from "@/components/ProductCard";
import ProductBuy from "@/components/ProductBuy";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await readData();
  const p = data.products.find((x) => x.slug === slug);
  if (!p) return { title: "Product not found" };
  return {
    title: p.name,
    description: p.description.slice(0, 155),
    openGraph: { title: `${p.name} | HADUM Shop`, description: p.description.slice(0, 155), images: [p.images[0]] },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await readData();
  const product = data.products.find((x) => x.slug === slug);
  if (!product) notFound();
  const category = data.categories.find((c) => c.slug === product.categorySlug);
  const related = data.products.filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, 4);
  const discount = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    category: category?.name,
    offers: {
      "@type": "Offer",
      priceCurrency: "BDT",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="text-sm text-warmgrey mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-golddeep">Home</Link> / <Link href="/shop" className="hover:text-golddeep">Shop</Link>
        {category && <> / <Link href={`/shop?category=${category.slug}`} className="hover:text-golddeep">{category.name}</Link></>} / <span className="text-espresso font-medium">{product.name}</span>
      </nav>
      <div className="grid lg:grid-cols-2 gap-10">
        <div className="space-y-3">
          <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-band">
            <Image src={product.images[0]} alt={product.name} fill priority className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
            {product.demo && <span className="absolute top-4 left-4 bg-espresso/85 text-cream text-xs font-bold px-3 py-1.5 rounded-full">DEMO PRODUCT</span>}
            {discount > 0 && <span className="absolute top-4 right-4 bg-gold text-white text-xs font-bold px-3 py-1.5 rounded-full">SAVE {discount}%</span>}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.slice(1, 5).map((src, i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-band">
                  <Image src={src} alt={`${product.name} view ${i + 2}`} fill className="object-cover" sizes="12vw" loading="lazy" />
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <h1 className="font-display text-4xl font-semibold leading-tight">{product.name}</h1>
          <p className="flex items-baseline gap-3 mt-4">
            <span className="text-3xl font-bold text-golddeep">{formatBDT(product.price)}</span>
            {product.compareAtPrice && <span className="text-warmgrey line-through text-lg">{formatBDT(product.compareAtPrice)}</span>}
          </p>
          <p className="text-espresso/75 leading-relaxed mt-5">{product.description}</p>
          <div className="border-t border-linen mt-6 pt-6">
            <ProductBuy product={product} />
          </div>
          <div className="grid gap-3 mt-7 text-[15px]">
            <p className="flex gap-2.5 bg-white border border-linen rounded-2xl px-4 py-3"><Truck className="text-golddeep shrink-0" size={19} /> Delivery charge is calculated at checkout from your district — inside Dhaka {formatBDT(data.settings.deliveryInsideDhaka)}, outside {formatBDT(data.settings.deliveryOutsideDhaka)}.</p>
            <p className="flex gap-2.5 bg-white border border-linen rounded-2xl px-4 py-3"><ShieldCheck className="text-golddeep shrink-0" size={19} /> Cash on Delivery — pay when your order arrives. No advance payment needed.</p>
            <p className="flex gap-2.5 bg-white border border-linen rounded-2xl px-4 py-3"><RotateCcw className="text-golddeep shrink-0" size={19} /> Changed your mind? See our <Link href="/policies/returns" className="underline font-medium">returns &amp; refund policy</Link>.</p>
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-3xl font-semibold">You may also like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-6">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
