"use server";

import { revalidatePath } from "next/cache";
import { requireActiveUser } from "@/lib/auth/require-active-user";
import { enforceRateLimit, rateLimitPolicies } from "@/lib/rate-limit";
import { getSettingsFormError, parseSettingsFormData } from "./schemas";
import type { SettingsActionState } from "./types";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function saveSettingsAction(
  _previousState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  try {
    await enforceRateLimit(rateLimitPolicies.userWrite);

    const settings = parseSettingsFormData({
      atelierName: getString(formData, "atelierName"),
      currencyCode: getString(formData, "currencyCode"),
      fullName: getString(formData, "fullName"),
      minimumMultiplier: getString(formData, "minimumMultiplier"),
      recommendedMultiplier: getString(formData, "recommendedMultiplier"),
      whatsapp: getString(formData, "whatsapp"),
    });
    const { supabase, user } = await requireActiveUser();

    const { error: profileError } = await supabase.rpc("update_my_profile", {
      p_atelier_name: settings.atelierName,
      p_full_name: settings.fullName,
      p_whatsapp: settings.whatsapp,
    });

    if (profileError) {
      throw new Error(profileError.message);
    }

    const { error: settingsError } = await supabase
      .from("user_settings")
      .upsert(
        {
          currency_code: settings.currencyCode,
          minimum_price_multiplier: settings.minimumMultiplier,
          recommended_price_multiplier: settings.recommendedMultiplier,
          user_id: user.id,
        },
        { onConflict: "user_id" },
      );

    if (settingsError) {
      throw new Error(settingsError.message);
    }

    revalidatePath("/configuracoes");
    revalidatePath("/perfil");
    revalidatePath("/produtos/novo");
    revalidatePath("/vendas/nova");
    revalidatePath("/painel");

    return {
      message: "Configurações salvas. Novos valores já usam sua moeda.",
      status: "success",
    };
  } catch (error) {
    return {
      message: getSettingsFormError(error),
      status: "error",
    };
  }
}
