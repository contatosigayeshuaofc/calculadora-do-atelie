"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getSupabasePublicEnv } from "./env";

let browserClient: SupabaseClient<Database> | null = null;

export function createClient(): SupabaseClient<Database> | null {
  const env = getSupabasePublicEnv();

  if (!env) {
    return null;
  }

  browserClient ??= createBrowserClient<Database>(env.url, env.publishableKey);
  return browserClient;
}
