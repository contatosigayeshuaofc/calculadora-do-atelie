import { requireActiveUser } from "@/lib/auth/require-active-user";
import type { AtelierSettings } from "./types";

export async function getAtelierSettings(): Promise<AtelierSettings> {
  const { profile, supabase, user } = await requireActiveUser();
  const { data, error } = await supabase
    .from("user_settings")
    .select("minimum_price_multiplier, recommended_price_multiplier")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return {
    atelierName: profile.atelier_name,
    fullName: profile.full_name ?? "",
    minimumMultiplier: Number(data?.minimum_price_multiplier ?? 1.5),
    recommendedMultiplier: Number(data?.recommended_price_multiplier ?? 2),
    whatsapp: profile.whatsapp,
  };
}
