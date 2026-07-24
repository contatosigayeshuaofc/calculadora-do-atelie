"use server";

import { revalidatePath } from "next/cache";
import { requireActiveUser } from "@/lib/auth/require-active-user";
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
    const settings = parseSettingsFormData({
      atelierName: getString(formData, "atelierName"),
      fullName: getString(formData, "fullName"),
      minimumMultiplier: getString(formData, "minimumMultiplier"),
      recommendedMultiplier: getString(formData, "recommendedMultiplier"),
      whatsapp: getString(formData, "whatsapp"),
    });
    const { supabase, user } = await requireActiveUser();

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        atelier_name: settings.atelierName,
        full_name: settings.fullName,
        whatsapp: settings.whatsapp,
      })
      .eq("id", user.id);

    if (profileError) {
      throw new Error(profileError.message);
    }

    const { error: settingsError } = await supabase
      .from("user_settings")
      .upsert(
        {
          currency_code: "BRL",
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
    revalidatePath("/produtos/novo");
    revalidatePath("/painel");

    return {
      message: "Configuracoes salvas. Novos produtos ja usam esses multiplicadores.",
      status: "success",
    };
  } catch (error) {
    return {
      message: getSettingsFormError(error),
      status: "error",
    };
  }
}
