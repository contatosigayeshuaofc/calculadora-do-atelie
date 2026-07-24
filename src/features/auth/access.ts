import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export type AccessProfile = Database["public"]["Tables"]["profiles"]["Row"];

export type AccessDecision =
  | { status: "active"; destination: "/painel"; profile: AccessProfile }
  | { status: "pending"; destination: "/aguardando-liberacao"; profile: AccessProfile | null }
  | { status: "suspended"; destination: "/acesso-suspenso"; profile: AccessProfile | null };

export async function getAccessDecision(
  supabase: SupabaseClient<Database>,
  user: User,
): Promise<AccessDecision> {
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, atelier_name, whatsapp, access_status, activated_at, created_at, updated_at")
    .eq("id", user.id)
    .maybeSingle();

  if (data?.access_status === "active") {
    return { status: "active", destination: "/painel", profile: data };
  }

  if (data?.access_status === "suspended") {
    return { status: "suspended", destination: "/acesso-suspenso", profile: data };
  }

  return { status: "pending", destination: "/aguardando-liberacao", profile: data ?? null };
}
