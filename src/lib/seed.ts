import type { StoreData, Product, Category } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// SEED DATA — DEMO CONTENT, CLEARLY FLAGGED.
// Evidence from the real @hadumshop Instagram (audited 2026-10-22): premium
// lifestyle brand, "Rooted in heritage. Designed for modern life", Khulna BD.
// NO real products, prices or categories are publicly listed there yet, so the
// products below are DEMO placeholders (demo: true, "Demo" badge in the UI).
// Replace them in /admin with real photos, names and prices — do not rename
// the demo flag away without replacing the data.
// ─────────────────────────────────────────────────────────────────────────────

const now = new Date().toISOString();

export const seedCategories: Category[] = [
  { id: "cat-lifestyle", name: "Lifestyle Essentials", nameBn: "লাইফস্টাইল", slug: "lifestyle-essentials", image: "/demo/cat-lifestyle.svg", description: "Everyday premium pieces for modern life." },
  { id: "cat-apparel", name: "Apparel", nameBn: "পোশাক", slug: "apparel", image: "/demo/cat-apparel.svg", description: "Minimal, timeless clothing — heritage craft, modern cut." },
  { id: "cat-home", name: "Home & Living", nameBn: "ঘর সাজানো", slug: "home-living", image: "/demo/cat-home.svg", description: "Crafted pieces that make a house feel like heritage." },
  { id: "cat-gifts", name: "Gifts", nameBn: "উপহার", slug: "gifts", image: "/demo/cat-gifts.svg", description: "Considered gifts, beautifully finished." },
];

function demoProduct(p: Partial<Product> & Pick<Product, "id" | "slug" | "name" | "categorySlug" | "price">): Product {
  return {
    compareAtPrice: null,
    description: "Demo product — replace this description in the admin dashboard with the real product's materials, sizing and care details.",
    images: [`/demo/${p.slug}.svg`],
    variants: [],
    stock: 10,
    featured: false,
    bestSeller: false,
    isNew: false,
    demo: true,
    createdAt: now,
    ...p,
  } as Product;
}

export const seedProducts: Product[] = [
  demoProduct({ id: "p1", slug: "heritage-essential-tee", name: "Heritage Essential Tee (Demo)", categorySlug: "apparel", price: 850, compareAtPrice: 1050, featured: true, bestSeller: true, stock: 24, variants: [
    { id: "p1-s", label: "Size: S", stock: 6 }, { id: "p1-m", label: "Size: M", stock: 8 }, { id: "p1-l", label: "Size: L", stock: 6 }, { id: "p1-xl", label: "Size: XL", stock: 4 } ] }),
  demoProduct({ id: "p2", slug: "khulna-tote-bag", name: "Khulna Canvas Tote (Demo)", categorySlug: "lifestyle-essentials", price: 650, featured: true, isNew: true, stock: 30 }),
  demoProduct({ id: "p3", slug: "modern-kurta-shirt", name: "Modern Heritage Shirt (Demo)", categorySlug: "apparel", price: 1450, compareAtPrice: 1750, featured: true, bestSeller: true, stock: 15, variants: [
    { id: "p3-m", label: "Size: M", stock: 5 }, { id: "p3-l", label: "Size: L", stock: 6 }, { id: "p3-xl", label: "Size: XL", stock: 4 } ] }),
  demoProduct({ id: "p4", slug: "artisan-scented-candle", name: "Artisan Scented Candle (Demo)", categorySlug: "home-living", price: 550, isNew: true, stock: 40 }),
  demoProduct({ id: "p5", slug: "heritage-gift-box", name: "Heritage Gift Box (Demo)", categorySlug: "gifts", price: 1950, compareAtPrice: 2400, featured: true, stock: 12 }),
  demoProduct({ id: "p6", slug: "minimal-leather-wallet", name: "Minimal Card Wallet (Demo)", categorySlug: "lifestyle-essentials", price: 950, bestSeller: true, stock: 20 }),
  demoProduct({ id: "p7", slug: "clay-tea-set", name: "Clay Tea Set for Two (Demo)", categorySlug: "home-living", price: 1250, isNew: true, stock: 0 }),
  demoProduct({ id: "p8", slug: "linen-scarf", name: "Handloom Linen Scarf (Demo)", categorySlug: "apparel", price: 750, stock: 18, variants: [
    { id: "p8-sand", label: "Colour: Sand", stock: 9 }, { id: "p8-olive", label: "Colour: Olive", stock: 9 } ] }),
];

export const seedData: StoreData = {
  settings: {
    announcement: "New collection coming soon — Cash on Delivery available across Bangladesh",
    heroHeadline: "Rooted in heritage. Designed for modern life.",
    heroSubtext: "HADUM is a premium lifestyle brand from Khulna, Bangladesh — heritage craft, minimal timeless design, honest prices on every piece.",
    heroImage: "/brand/hero-brand.jpg",
    promoTitle: "The First Drop is coming",
    promoText: "Followers on Instagram see new pieces first. Follow @hadumshop so you never miss a drop.",
    promoCta: "Follow on Instagram",
    // Demo defaults — the owner sets real charges in /admin → Settings.
    deliveryInsideDhaka: 70,
    deliveryOutsideDhaka: 130,
    freeDeliveryAbove: null,
    instagram: "https://www.instagram.com/hadumshop/",
    email: "hadumshop@gmail.com",
  },
  categories: seedCategories,
  products: seedProducts,
  orders: [],
  subscribers: [],
  testimonials: [], // empty = section hidden. Add only VERIFIED customer feedback in admin.
};
