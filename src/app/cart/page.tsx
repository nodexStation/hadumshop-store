"use client";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatBDT } from "@/lib/format";

export default function CartPage() {
  const { items, setQty, remove, subtotal, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <ShoppingBag className="mx-auto text-warmgrey" size={44} />
        <h1 className="font-display text-3xl font-semibold mt-5">Your cart is empty</h1>
        <p className="text-warmgrey mt-2">Beautiful things are waiting in the shop.</p>
        <Link href="/shop" className="inline-block mt-6 bg-espresso text-cream px-7 py-3.5 rounded-full font-semibold hover:bg-golddeep">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <h1 className="font-display text-4xl font-semibold">Your Cart</h1>
      <div className="grid lg:grid-cols-[1fr_360px] gap-8 mt-8">
        <ul className="space-y-4">
          {items.map((i) => (
            <li key={i.productId + (i.variantId || "")} className="bg-white border border-linen rounded-3xl p-4 flex gap-4">
              <div className="relative w-24 h-28 rounded-2xl overflow-hidden bg-band shrink-0">
                <Image src={i.image} alt={i.name} fill className="object-cover" sizes="96px" />
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/product/${i.slug}`} className="font-semibold hover:text-golddeep line-clamp-2">{i.name}</Link>
                {i.variantLabel && <p className="text-sm text-warmgrey mt-0.5">{i.variantLabel}</p>}
                <p className="font-bold text-golddeep mt-1.5">{formatBDT(i.price)}</p>
                <div className="flex items-center gap-3 mt-2.5">
                  <div className="flex items-center border border-linen rounded-full">
                    <button onClick={() => setQty(i.productId, i.variantId, i.quantity - 1)} className="p-2 px-2.5 hover:text-golddeep" aria-label="Decrease"><Minus size={14} /></button>
                    <span className="w-7 text-center font-bold text-sm">{i.quantity}</span>
                    <button onClick={() => setQty(i.productId, i.variantId, i.quantity + 1)} className="p-2 px-2.5 hover:text-golddeep" aria-label="Increase"><Plus size={14} /></button>
                  </div>
                  <button onClick={() => remove(i.productId, i.variantId)} className="text-red-700 hover:text-red-900 inline-flex items-center gap-1 text-sm font-medium"><Trash2 size={15} /> Remove</button>
                </div>
              </div>
              <p className="font-bold whitespace-nowrap">{formatBDT(i.price * i.quantity)}</p>
            </li>
          ))}
        </ul>
        <aside className="bg-white border border-linen rounded-3xl p-6 self-start lg:sticky lg:top-32">
          <h2 className="font-display text-2xl font-semibold">Order summary</h2>
          <div className="space-y-2.5 mt-4 text-[15px]">
            <p className="flex justify-between"><span className="text-warmgrey">Subtotal</span><strong>{formatBDT(subtotal)}</strong></p>
            <p className="flex justify-between"><span className="text-warmgrey">Delivery</span><span>Calculated at checkout</span></p>
            <p className="border-t border-linen pt-3 flex justify-between text-lg"><span className="font-semibold">Total so far</span><strong className="text-golddeep">{formatBDT(subtotal)}</strong></p>
          </div>
          <Link href="/checkout" className="block text-center bg-espresso text-cream rounded-full py-3.5 font-semibold mt-6 hover:bg-golddeep">Proceed to Checkout</Link>
          <Link href="/shop" className="block text-center font-semibold mt-3 hover:text-golddeep">Continue shopping</Link>
          <button onClick={clear} className="block mx-auto text-sm text-warmgrey hover:text-red-700 mt-4">Clear cart</button>
        </aside>
      </div>
    </div>
  );
}
