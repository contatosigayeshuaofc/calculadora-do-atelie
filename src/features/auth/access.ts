import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export type AccessProfile = Database["public"]["Tables"]["profiles"]["Row"];

export type AccessDecision =
  | { status: "active"; destination: "/painel"; profile: AccessProfile }
  | { status: "pending"; destination: "/aguardando-liberacao"; profile: AccessProfile | null }
  | { status: "suspended"; destination: "/acesso-suspenso"; profile: AccessProfile | null };

type AccessDecisionOptions = {
  isAdmin?: boolean;
};

function buildAdminProfile(user: User, profile: AccessProfile | null): AccessProfile {
  if (profile) {
    return {
      ...profile,
      access_status: "active",
      activated_at: profile.activated_at ?? profile.created_at,
    };
  }

  const createdAt = user.created_at ?? new Date(0).toISOString();
  const metadata = user.user_metadata as Record<string, unknown> | undefined;
  const fullName = typeof metadata?.full_name === "string" ? metadata.full_name : "Administrador";
  const atelierName = typeof metadata?.atelier_name === "string" ? metadata.atelier_name : "Atelie Lucrativo";
  const whatsapp = typeof metadata?.whatsapp === "string" ? metadata.whatsapp : null;

  return {
    access_status: "active",
    activated_at: createdAt,
    atelier_name: atelierName,
    created_at: createdAt,
    full_name: fullName,
    id: user.id,
    updated_at: createdAt,
    whatsapp,
  };
}

export async function getAccessDecision(
  supabase: SupabaseClient<Database>,
  user: User,
  options: AccessDecisionOptions = {},
): Promise<AccessDecision> {
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, atelier_name, whatsapp, access_status, activated_at, created_at, updated_at")
    .eq("id", user.id)
    .maybeSingle();

  if (options.isAdmin) {
    return { status: "active", destination: "/painel", profile: buildAdminProfile(user, data ?? null) };
  }

  if (data?.access_status === "active") {
    return { status: "active", destination: "/painel", profile: data };
  }

  if (data?.access_status === "suspended") {
    return { status: "suspended", destination: "/acesso-suspenso", profile: data };
  }

  return { status: "pending", destination: "/aguardando-liberacao", profile: data ?? null };
}
