"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Eye, Heart, ShoppingBag, X } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatBDT } from "@/lib/format";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }: { product: Product }) {
  const { add, wishlist, toggleWish } = useCart();
  const [quick, setQuick] = useState(false);
  const [variantId, setVariantId] = useState(product.variants[0]?.id);
  const out = product.stock <= 0;
  const discount = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0;
  const variant = product.variants.find((v) => v.id === variantId);

  function addToCart() {
    add({
      productId: product.id, slug: product.slug, name: product.name,
      image: product.images[0], price: product.price,
      variantId: variant?.id, variantLabel: variant?.label,
    });
  }

  return (
    <article className="bg-white rounded-3xl border border-linen overflow-hidden card-hover flex flex-col">
      <div className="relative aspect-[4/5] bg-band">
        <Link href={`/product/${product.slug}`} aria-label={product.name}>
          <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="(max-width:640px) 50vw, 25vw" loading="lazy" />
        </Link>
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.demo && <span className="bg-espresso/85 text-cream text-[11px] font-bold px-2.5 py-1 rounded-full">DEMO</span>}
          {discount > 0 && <span className="bg-gold text-white text-[11px] font-bold px-2.5 py-1 rounded-full">-{discount}%</span>}
          {product.isNew && <span className="bg-white text-espresso text-[11px] font-bold px-2.5 py-1 rounded-full border border-linen">NEW</span>}
        </div>
        <button onClick={() => toggleWish(product.slug)} aria-label="Toggle wishlist"
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${wishlist.includes(product.slug) ? "bg-gold text-white" : "bg-white/90 text-espresso hover:bg-white"}`}>
          <Heart size={17} fill={wishlist.includes(product.slug) ? "currentColor" : "none"} />
        </button>
        {out && <span className="absolute bottom-3 left-3 bg-white text-espresso text-xs font-bold px-3 py-1.5 rounded-full">Out of stock</span>}
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <Link href={`/product/${product.slug}`} className="font-semibold leading-snug hover:text-golddeep line-clamp-2">{product.name}</Link>
        <p className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-golddeep">{formatBDT(product.price)}</span>
          {product.compareAtPrice ? <span className="text-warmgrey line-through text-sm">{formatBDT(product.compareAtPrice)}</span> : null}
        </p>
        {product.variants.length > 0 && <p className="text-xs text-warmgrey">{product.variants.map((v) => v.label.split(": ")[1] || v.label).join(" · ")}</p>}
        <div className="mt-auto flex gap-2 pt-1">
          <button disabled={out} onClick={addToCart}
            className="flex-1 bg-espresso text-cream rounded-full py-2.5 text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-golddeep transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            <ShoppingBag size={15} /> Add to Cart
          </button>
          <button onClick={() => setQuick(true)} aria-label="Quick view" className="w-10 rounded-full border border-linen flex items-center justify-center hover:border-gold hover:text-golddeep"><Eye size={16} /></button>
        </div>
      </div>

      {quick && (
        <div className="fixed inset-0 z-[70] bg-espresso/60 flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true" aria-label={`Quick view ${product.name}`}>
          <div className="bg-cream w-full max-w-2xl rounded-t-3xl sm:rounded-3xl overflow-hidden fade-up max-h-[92vh] overflow-y-auto">
            <div className="grid sm:grid-cols-2">
              <div className="relative aspect-[4/5] bg-band">
                <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="50vw" />
              </div>
              <div className="p-6 flex flex-col gap-3">
                <button onClick={() => setQuick(false)} aria-label="Close quick view" className="self-end -mt-1 -mr-1 p-1.5 hover:text-golddeep"><X size={20} /></button>
                <h3 className="font-display text-2xl font-semibold leading-tight">{product.name}</h3>
                <p className="text-xl font-bold text-golddeep">{formatBDT(product.price)} {product.compareAtPrice && <span className="text-warmgrey line-through text-base font-normal ml-1">{formatBDT(product.compareAtPrice)}</span>}</p>
                <p className="text-[15px] text-espresso/75 line-clamp-4">{product.description}</p>
                {product.variants.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button key={v.id} onClick={() => setVariantId(v.id)} disabled={v.stock <= 0}
                        className={`px-3.5 py-1.5 rounded-full border text-sm font-medium disabled:opacity-40 ${variantId === v.id ? "bg-espresso text-cream border-espresso" : "border-linen bg-white"}`}>{v.label}</button>
                    ))}
                  </div>
                )}
                <p className="text-sm text-warmgrey">{out ? "Currently out of stock" : "In stock — Cash on Delivery available"}</p>
                <div className="mt-auto flex gap-2">
                  <button disabled={out} onClick={() => { addToCart(); setQuick(false); }} className="flex-1 bg-espresso text-cream rounded-full py-3 font-semibold hover:bg-golddeep disabled:opacity-40">Add to Cart</button>
                  <Link href={`/product/${product.slug}`} className="flex-1 text-center border border-espresso rounded-full py-3 font-semibold hover:border-golddeep hover:text-golddeep">Full details</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
