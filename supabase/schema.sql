-- ─────────────────────────────────────────────────────────────────────────────
-- HADUM Shop — Supabase / PostgreSQL schema (mirrors src/lib/types.ts)
-- Run in Supabase SQL Editor. Then create a public Storage bucket named
-- "products" for product images, and set the env vars from .env.example.
-- ─────────────────────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

create table if not exists categories (
  id text primary key,
  name text not null,
  name_bn text,
  slug text unique not null,
  image text not null default '',
  description text,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id text primary key,
  slug text unique not null,
  name text not null,
  category_slug text not null references categories(slug) on update cascade,
  price integer not null check (price >= 0),            -- BDT, whole taka
  compare_at_price integer check (compare_at_price is null or compare_at_price >= 0),
  description text not null default '',
  images text[] not null default '{}',
  variants jsonb not null default '[]',                  -- [{id,label,stock}]
  stock integer not null default 0 check (stock >= 0),
  featured boolean not null default false,
  best_seller boolean not null default false,            -- owner-marked only
  is_new boolean not null default false,
  demo boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id text primary key,                                   -- HDM-YYYYMMDD-XXXX
  items jsonb not null,                                  -- server-priced snapshot
  subtotal integer not null,
  delivery_charge integer not null,
  total integer not null,
  customer jsonb not null,                               -- name/phone/address/district/city/notes
  payment_method text not null default 'cod' check (payment_method in ('cod')),
  status text not null default 'pending'
    check (status in ('pending','confirmed','shipped','delivered','cancelled')),
  demo boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists subscribers (
  email text primary key,
  created_at timestamptz not null default now()
);

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  text text not null,
  verified boolean not null default false,               -- only verified buyers
  created_at timestamptz not null default now()
);

create table if not exists store_settings (
  key text primary key,
  value jsonb not null
);

-- ── Row Level Security ────────────────────────────────────────────────────────
alter table categories    enable row level security;
alter table products      enable row level security;
alter table orders        enable row level security;
alter table subscribers   enable row level security;
alter table testimonials  enable row level security;
alter table store_settings enable row level security;

-- Public can READ the shop catalogue + settings + verified testimonials only.
create policy "public read categories"   on categories   for select using (true);
create policy "public read products"     on products     for select using (true);
create policy "public read settings"     on store_settings for select using (true);
create policy "public read testimonials" on testimonials for select using (verified = true);

-- Anyone may subscribe to the newsletter (insert only, never read).
create policy "public insert subscriber" on subscribers for insert with check (true);

-- Orders: NO public access at all. Orders are created and managed only by
-- server-side code using the SERVICE ROLE key (bypasses RLS) after it
-- re-validates prices/stock — exactly like src/app/api/orders/route.ts does
-- for the file database. Admin UI access likewise goes through server routes
-- guarded by the admin session (src/lib/auth.ts) — never expose the service
-- role key to the browser.

-- Storage: create bucket "products" (public read). Uploads only via
-- authenticated/admin server routes in production.
