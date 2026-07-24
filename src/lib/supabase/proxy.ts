import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";
import { getSupabasePublicEnv } from "./env";

export async function updateSession(request: NextRequest) {
  const env = getSupabasePublicEnv();
  const response = NextResponse.next({ request });

  if (!env) {
    return response;
  }

  const supabase = createServerClient<Database>(env.url, env.publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headersToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });

        for (const [key, value] of Object.entries(headersToSet ?? {})) {
          response.headers.set(key, value);
        }
      },
    },
  });

  await supabase.auth.getClaims();
  return response;
}
