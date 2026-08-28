import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// This client uses the Supabase service role key and bypasses Row Level
// Security entirely. It must ONLY be imported from files inside
// app/admin/(dashboard)/** or lib/actions/admin.ts-guarded server actions,
// where requireAdmin() has already checked the ADMIN_PASSWORD cookie.
// Never import this in any page or component reachable without that check,
// and never expose SUPABASE_SERVICE_ROLE_KEY to the client bundle.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY مش متظبط. ضيفه في .env.local (وفي Vercel Environment Variables) — Supabase Dashboard -> Settings -> API -> service_role secret key."
    );
  }

  return createSupabaseClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
