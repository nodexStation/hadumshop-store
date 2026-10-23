# HADUM Shop — Integrations & Owner Checklist

## Needs credentials / accounts (owner)
- [ ] **Supabase project** — run `supabase/schema.sql`, create Storage bucket `products`, set the 3 env vars (see README). Until then the store runs on the local file DB.
- [ ] **Vercel team access** — deploying under Ahmed's Vercel team needs a one-time team-scope approval in the Vercel connector (a 403 "ahmed-s-pro scope" was returned on 2026-10-23 when creating a project). Alternative: any Node VPS with `npm run start`.
- [ ] **ADMIN_PASSWORD + ADMIN_SESSION_SECRET** — set real values in production env. Demo default `hadum-admin-demo` must never go live.
- [ ] **Custom domain** (optional) — attach in Vercel after deploy; set `NEXT_PUBLIC_SITE_URL` to it.

## Needs real business data (owner — replaces demo content)
- [ ] Real product photos, names, prices, variants, stock → Admin → Products (delete/undemo the 8 demo products).
- [ ] Confirm delivery charges are correct → Admin → Settings (seeded demo defaults: inside Dhaka ৳70 / outside ৳130; free-delivery threshold optional).
- [ ] Confirm announcement + promo text → Admin → Settings.
- [ ] Add the store URL to the Instagram bio link (in-app: Edit profile → Links).
- [ ] Add verified customer testimonials only when real ones exist → Admin → Overview.

## Payments (structure ready, NOT operational)
- [ ] bKash merchant account + Tokenized Checkout credentials → sandbox test → enable.
- [ ] Nagad merchant account → sandbox test → enable.
- [ ] SSLCommerz store ID/password → sandbox test → enable.
- Rule: a payment method is displayed as available only after its integration is configured AND tested end-to-end. COD is the only live method today.

## Verified working (2026-10-23, production build)
- [x] `npm run build` passes; TypeScript clean.
- [x] All routes 200: /, /shop, /product/:slug, /cart, /checkout, /about, /contact, /policies/*, /admin, sitemap, robots.
- [x] COD order placed via API → order # generated, total recomputed server-side (850×2 + 130 = ৳1,830 test), variant stock decremented 8→6.
- [x] Invalid BD phone rejected (422); overselling an out-of-stock item rejected (422).
- [x] Admin: wrong password 401, demo login OK, product create/delete OK, order status update OK, unauthenticated admin calls 401.
- [x] Newsletter subscribe OK; confirmation page renders the real order.
- [x] Cold-start race in the file DB fixed (unique temp file per write); repeated home loads 200.
