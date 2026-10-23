import { promises as fs } from "fs";
import path from "path";
import type { StoreData } from "./types";
import { seedData } from "./seed";

// ── Data layer ────────────────────────────────────────────────────────────────
// Default: local JSON file database (data/store.json) — fully working for
// development and single-server hosting. Production switch: set the Supabase
// env vars and run supabase/schema.sql; src/lib/supabase.ts exposes the client
// and the schema mirrors these exact types. Prices/stock are ALWAYS
// re-validated on the server in /api/orders — client totals are never trusted.
const DATA_FILE = path.join(process.cwd(), "data", "store.json");

let cache: StoreData | null = null;

export async function readData(): Promise<StoreData> {
  if (cache) return cache;
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    cache = JSON.parse(raw) as StoreData;
  } catch {
    cache = structuredClone(seedData);
    await writeData(cache);
  }
  return cache;
}

export async function writeData(data: StoreData): Promise<void> {
  cache = data;
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  const tmp = `${DATA_FILE}.${process.pid}.${Math.random().toString(36).slice(2)}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, DATA_FILE);
}

export function isDemoMode(): boolean {
  return !process.env.NEXT_PUBLIC_SUPABASE_URL;
}

export function newId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function formatBDT(n: number): string {
  return `৳${n.toLocaleString("en-IN")}`;
}
