# HADUM Shop — Premium E-Commerce Website

A complete, working online store for **HADUM Shop** (Instagram: [@hadumshop](https://www.instagram.com/hadumshop/)) — premium lifestyle brand from Khulna, Bangladesh. *"Rooted in heritage. Designed for modern life."*

Next.js 15 (TypeScript) + Tailwind CSS 4, server-validated Cash-on-Delivery checkout, a full admin dashboard, and a Supabase-ready data layer.

## ⚠️ About the catalogue data (read first)
The public @hadumshop Instagram lists **no real products, prices or categories yet** (audited 2026-10-22) — so the seeded catalogue is **DEMO data**: every demo product is flagged `demo: true`, shows a **DEMO badge** on the site, and can be replaced in **Admin → Products** in minutes. No reviews, sales figures or claims were invented: testimonials render only when the owner adds a verified one in Admin; "Best Sellers" shows only products the owner marks.

## What's inside
- **Storefront:** announcement bar (editable), header with search/account/wishlist/cart count, hero (editable), Shop by Category, Featured, New Arrivals, Best Sellers (owner-marked), brand story, promo banner (editable), verified-testimonials section (hidden while empty), Instagram gallery (genuine brand posts, linked — not a fake live feed), newsletter with validation + consent, full footer with policies.
- **Shop:** search by name, category filter, price-range slider, availability filter, sort (featured / newest / price), load-more, clear empty states.
- **Product pages:** image gallery, variants (size/colour) with per-variant stock, quantity selector, Add to Cart / Buy Now, delivery + COD + returns info, related products, Product JSON-LD.
- **Cart:** add/remove/quantity/variants, subtotal, persisted in localStorage across refreshes.
- **Checkout:** BD customer details with validation (BD mobile regex), district-based delivery charge (configurable), order summary, **Cash on Delivery** (bKash/Nagad/SSLCommerz shown honestly as "coming soon" until merchant accounts exist). Orders are created by `/api/orders`, which **recomputes every price and stock level on the server** — client totals are never trusted — decrements stock, and issues an order number like `HDM-20261023-0001` shown on the confirmation page.
- **Admin (`/admin`):** password login (server-side, HMAC session cookie), overview with revenue/orders/stock stats, product create/edit/delete with image upload + URL, categories, variants, pricing/discounts, stock, order list with customer details and status updates (pending → confirmed → shipped → delivered / cancelled), delivery-charge + homepage banner/announcement settings, verified-testimonial manager, basic sales report.
- **SEO/perf:** metadata + Open Graph, sitemap.xml, robots.txt, lazy-loaded images, responsive mobile-first design, `prefers-reduced-motion` respected.

## Run locally
```bash
npm install
cp .env.example .env.local   # set ADMIN_PASSWORD + ADMIN_SESSION_SECRET!
npm run dev                  # http://localhost:3000
```
- Store: http://localhost:3000
- Admin: http://localhost:3000/admin
- **Local demo admin password** (only when `ADMIN_PASSWORD` is unset): `hadum-admin-demo` — set a real one in `.env.local` before deploying.
- Without Supabase env vars the store runs on a local file database (`data/store.json`, auto-seeded, git-ignored). Orders placed in this mode are real records in that file and are flagged demo-mode; connect Supabase (below) for production persistence.

## Go live with Supabase (production data)
1. Create a project at supabase.com.
2. Run `supabase/schema.sql` in the SQL editor (tables + Row Level Security: public read of catalogue, no public order access, newsletter insert-only).
3. Create a public Storage bucket named `products` for product images (or keep pasting image URLs in Admin).
4. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — the client factory is in `src/lib/supabase.ts`; orders must always be written server-side with the service role after price validation (pattern already implemented in `src/app/api/orders/route.ts`).

## Deploy to Vercel
1. Push this repo to GitHub, then "Import Project" in Vercel (framework: Next.js, root: this folder).
2. Add env vars: `NEXT_PUBLIC_SITE_URL` (your domain), `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, plus the Supabase vars for production data.
3. Deploy. Attach a custom domain when ready.
> Note: the file database does not persist across serverless instances — use the Supabase setup above for a live shop, or host on a single Node server/VPS where `npm run start` + the file DB works as-is.

## Payments roadmap (not operational until configured)
Checkout architecture keeps payment methods behind configuration: COD is live. bKash (Tokenized Checkout), Nagad and SSLCommerz slots exist in the UI as disabled "coming soon" and in `.env.example` — they must only be enabled after merchant accounts, sandbox testing and server-side verification are complete. Never display a payment method as working before then.

## Brand system
Cream `#FAF6EF` · Espresso `#1C1917` · Gold `#A67C2E` / deep `#926820` / soft `#C9A24B` · Fraunces (display) + Inter (body) — the same system as the @hadumshop Instagram relaunch and `~/workspace/hadumshop-brand-kit/`.
