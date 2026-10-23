"use client";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SearchX } from "lucide-react";
import type { Category, Product } from "@/lib/types";
import ProductCard from "./ProductCard";
import { useCart } from "@/context/CartContext";

const PAGE = 8;

export default function ShopClient({ products, categories }: { products: Product[]; categories: Category[] }) {
  const params = useSearchParams();
  const { wishlist } = useCart();
  const [q, setQ] = useState(params.get("q") || "");
  const [cat, setCat] = useState(params.get("category") || "all");
  const [sort, setSort] = useState(params.get("sort") || "featured");
  const [avail, setAvail] = useState("all");
  const [maxPrice, setMaxPrice] = useState(2000);
  const [shown, setShown] = useState(PAGE);
  const filter = params.get("filter");
  const wishOnly = params.get("wishlist") === "1";

  const ceiling = useMemo(() => Math.max(...products.map((p) => p.price), 0), [products]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (wishOnly) list = list.filter((p) => wishlist.includes(p.slug));
    if (filter === "bestsellers") list = list.filter((p) => p.bestSeller);
    if (cat !== "all") list = list.filter((p) => p.categorySlug === cat);
    if (q.trim()) list = list.filter((p) => p.name.toLowerCase().includes(q.trim().toLowerCase()));
    list = list.filter((p) => p.price <= maxPrice);
    if (avail === "in") list = list.filter((p) => p.stock > 0);
    if (avail === "out") list = list.filter((p) => p.stock <= 0);
    switch (sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "new": list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)); break;
      default: list.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return list;
  }, [products, q, cat, sort, avail, maxPrice, filter, wishOnly, wishlist]);

  const visible = filtered.slice(0, shown);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <h1 className="font-display text-4xl font-semibold">{wishOnly ? "Your Wishlist" : filter === "bestsellers" ? "Best Sellers" : "Shop All"}</h1>
      <p className="text-warmgrey mt-2">{filtered.length} product{filtered.length === 1 ? "" : "s"} · prices in Bangladeshi taka (৳) · Cash on Delivery available</p>

      <div className="grid lg:grid-cols-[240px_1fr] gap-8 mt-8">
        <aside className="space-y-6 lg:sticky lg:top-32 self-start bg-white lg:bg-transparent border border-linen lg:border-0 rounded-3xl lg:rounded-none p-5 lg:p-0">
          <div>
            <label htmlFor="shop-search" className="font-semibold text-sm tracking-wide">SEARCH</label>
            <input id="shop-search" value={q} onChange={(e) => { setQ(e.target.value); setShown(PAGE); }} placeholder="Search by name…"
              className="mt-2 w-full rounded-full border border-linen bg-white px-4 py-2.5 outline-none focus:border-gold" />
          </div>
          <div>
            <p className="font-semibold text-sm tracking-wide">CATEGORY</p>
            <div className="mt-2.5 flex flex-col gap-1">
              <button onClick={() => setCat("all")} className={`text-left px-3 py-2 rounded-lg font-medium ${cat === "all" ? "bg-espresso text-cream" : "hover:bg-band"}`}>All products</button>
              {categories.map((c) => (
                <button key={c.id} onClick={() => setCat(c.slug)} className={`text-left px-3 py-2 rounded-lg font-medium ${cat === c.slug ? "bg-espresso text-cream" : "hover:bg-band"}`}>{c.name}</button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="price-range" className="font-semibold text-sm tracking-wide">MAX PRICE — ৳{maxPrice.toLocaleString("en-IN")}</label>
            <input id="price-range" type="range" min={100} max={Math.max(ceiling, 2000)} step={50} value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full mt-2 accent-[#a67c2e]" />
          </div>
          <div>
            <label htmlFor="avail" className="font-semibold text-sm tracking-wide">AVAILABILITY</label>
            <select id="avail" value={avail} onChange={(e) => setAvail(e.target.value)} className="mt-2 w-full rounded-full border border-linen bg-white px-4 py-2.5 outline-none focus:border-gold">
              <option value="all">All</option>
              <option value="in">In stock</option>
              <option value="out">Out of stock</option>
            </select>
          </div>
          <div>
            <label htmlFor="sort" className="font-semibold text-sm tracking-wide">SORT BY</label>
            <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)} className="mt-2 w-full rounded-full border border-linen bg-white px-4 py-2.5 outline-none focus:border-gold">
              <option value="featured">Featured</option>
              <option value="new">Newest</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </div>
        </aside>

        <div>
          {visible.length === 0 ? (
            <div className="text-center py-20 bg-white border border-linen rounded-3xl">
              <SearchX className="mx-auto text-warmgrey" size={40} />
              <h2 className="font-display text-2xl font-semibold mt-4">No products found</h2>
              <p className="text-warmgrey mt-2">Try a different search term, category or price range.</p>
              <button onClick={() => { setQ(""); setCat("all"); setMaxPrice(Math.max(ceiling, 2000)); setAvail("all"); }} className="mt-5 bg-espresso text-cream px-6 py-3 rounded-full font-semibold hover:bg-golddeep">Clear all filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                {visible.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
              {shown < filtered.length && (
                <div className="text-center mt-10">
                  <button onClick={() => setShown((s) => s + PAGE)} className="border border-espresso px-8 py-3.5 rounded-full font-semibold hover:border-golddeep hover:text-golddeep">
                    Load more ({filtered.length - shown} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
