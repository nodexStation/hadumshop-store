"use client";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  variantId?: string;
  variantLabel?: string;
  quantity: number;
}

interface CartCtx {
  items: CartItem[];
  wishlist: string[];
  count: number;
  subtotal: number;
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  remove: (productId: string, variantId?: string) => void;
  setQty: (productId: string, variantId: string | undefined, qty: number) => void;
  clear: () => void;
  toggleWish: (slug: string) => void;
}

const Ctx = createContext<CartCtx | null>(null);
const CART_KEY = "hadum_cart_v1";
const WISH_KEY = "hadum_wishlist_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem(CART_KEY) || "[]"));
      setWishlist(JSON.parse(localStorage.getItem(WISH_KEY) || "[]"));
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items, loaded]);
  useEffect(() => {
    if (loaded) localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
  }, [wishlist, loaded]);

  const value = useMemo<CartCtx>(() => ({
    items,
    wishlist,
    count: items.reduce((s, i) => s + i.quantity, 0),
    subtotal: items.reduce((s, i) => s + i.price * i.quantity, 0),
    add(item, qty = 1) {
      setItems((prev) => {
        const idx = prev.findIndex((p) => p.productId === item.productId && p.variantId === item.variantId);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + qty };
          return copy;
        }
        return [...prev, { ...item, quantity: qty }];
      });
    },
    remove(productId, variantId) {
      setItems((prev) => prev.filter((p) => !(p.productId === productId && p.variantId === variantId)));
    },
    setQty(productId, variantId, qty) {
      setItems((prev) => qty <= 0
        ? prev.filter((p) => !(p.productId === productId && p.variantId === variantId))
        : prev.map((p) => (p.productId === productId && p.variantId === variantId ? { ...p, quantity: qty } : p)));
    },
    clear() { setItems([]); },
    toggleWish(slug) {
      setWishlist((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
    },
  }), [items, wishlist]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart(): CartCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
