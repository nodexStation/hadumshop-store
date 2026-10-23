import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Supabase switch: when NEXT_PUBLIC_SUPABASE_URL + keys are set, use these
// clients against the schema in supabase/schema.sql (tables mirror
// src/lib/types.ts). Until then the store runs on the file database
// (src/lib/db.ts) so every feature works locally with zero credentials.
let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowser(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  if (!browserClient) browserClient = createClient(url, anon);
  return browserClient;
}

export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !service) return null;
  return createClient(url, service, { auth: { persistSession: false } });
}
