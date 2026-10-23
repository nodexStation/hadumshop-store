"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Zap } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";

export default function ProductBuy({ product }: { product: Product }) {
  const { add } = useCart();
  const router = useRouter();
  const [variantId, setVariantId] = useState(product.variants[0]?.id);
  const [qty, setQty] = useState(1);
  const variant = product.variants.find((v) => v.id === variantId);
  const stock = variant ? variant.stock : product.stock;
  const out = stock <= 0;

  const payload = {
    productId: product.id, slug: product.slug, name: product.name,
    image: product.images[0], price: product.price,
    variantId: variant?.id, variantLabel: variant?.label,
  };

  return (
    <div className="flex flex-col gap-4">
      {product.variants.length > 0 && (
        <div>
          <p className="font-semibold text-sm tracking-wide mb-2">SELECT OPTION</p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button key={v.id} onClick={() => setVariantId(v.id)} disabled={v.stock <= 0}
                className={`px-4 py-2 rounded-full border font-medium text-sm disabled:opacity-40 disabled:line-through ${variantId === v.id ? "bg-espresso text-cream border-espresso" : "bg-white border-linen hover:border-gold"}`}>
                {v.label}{v.stock <= 0 ? " — out" : ""}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="flex items-center gap-4">
        <p className="font-semibold text-sm tracking-wide">QUANTITY</p>
        <div className="flex items-center border border-linen rounded-full bg-white">
          <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2.5 px-3 hover:text-golddeep" aria-label="Decrease quantity"><Minus size={16} /></button>
          <span className="w-8 text-center font-bold" aria-live="polite">{qty}</span>
          <button onClick={() => setQty(Math.min(stock || 1, qty + 1))} className="p-2.5 px-3 hover:text-golddeep" aria-label="Increase quantity"><Plus size={16} /></button>
        </div>
        <p className={`text-sm font-medium ${out ? "text-red-700" : "text-golddeep"}`}>{out ? "Out of stock" : `${stock} in stock`}</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mt-1">
        <button disabled={out} onClick={() => add(payload, qty)}
          className="flex-1 bg-espresso text-cream rounded-full py-3.5 font-semibold flex items-center justify-center gap-2 hover:bg-golddeep transition-colors disabled:opacity-40">
          <ShoppingBag size={17} /> Add to Cart
        </button>
        <button disabled={out} onClick={() => { add(payload, qty); router.push("/checkout"); }}
          className="flex-1 bg-gold text-white rounded-full py-3.5 font-semibold flex items-center justify-center gap-2 hover:bg-golddeep transition-colors disabled:opacity-40">
          <Zap size={17} /> Buy Now
        </button>
      </div>
    </div>
  );
}
