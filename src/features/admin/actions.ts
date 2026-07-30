"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/auth/require-admin-user";
import { missingSupabaseAdminMessage } from "@/lib/supabase/env";
import { enforceRateLimit, rateLimitPolicies } from "@/lib/rate-limit";
import { getAdminFormError, parseCreateUserFormData, parseUpdateAccessFormData } from "./schemas";
import type { AdminActionState } from "./types";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function getInitialsEmailName(email: string) {
  return email.split("@")[0] ?? email;
}

export async function createManualUserAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    await enforceRateLimit(rateLimitPolicies.adminWrite);

    const input = parseCreateUserFormData({
      atelierName: getString(formData, "atelierName"),
      email: getString(formData, "email"),
      fullName: getString(formData, "fullName") || getInitialsEmailName(getString(formData, "email")),
      password: getString(formData, "password"),
      whatsapp: getString(formData, "whatsapp"),
    });
    const { adminClient } = await requireAdminUser();

    if (!adminClient) {
      throw new Error(missingSupabaseAdminMessage);
    }

    const { data, error } = await adminClient.auth.admin.createUser({
      email: input.email,
      email_confirm: true,
      password: input.password,
      user_metadata: {
        atelier_name: input.atelierName ?? null,
        full_name: input.fullName,
        whatsapp: input.whatsapp ?? null,
      },
    });

    if (error || !data.user) {
      throw new Error(error?.message ?? "Não foi possível criar a cliente.");
    }

    const { error: profileError } = await adminClient.from("profiles").upsert({
      access_status: input.accessStatus,
      activated_at: input.accessStatus === "active" ? new Date().toISOString() : null,
      atelier_name: input.atelierName ?? null,
      full_name: input.fullName,
      id: data.user.id,
      whatsapp: input.whatsapp ?? null,
    });

    if (profileError) {
      throw new Error(profileError.message);
    }

    const { error: settingsError } = await adminClient.from("user_settings").upsert(
      {
        currency_code: "BRL",
        user_id: data.user.id,
      },
      { onConflict: "user_id" },
    );

    if (settingsError) {
      throw new Error(settingsError.message);
    }

    revalidatePath("/admin");

    return {
      message: "Cliente criada e liberada para acessar o app.",
      status: "success",
    };
  } catch (error) {
    return {
      message: getAdminFormError(error),
      status: "error",
    };
  }
}

export async function updateUserAccessAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    await enforceRateLimit(rateLimitPolicies.adminWrite);

    const input = parseUpdateAccessFormData({
      accessStatus: getString(formData, "accessStatus"),
      userId: getString(formData, "userId"),
    });
    const { adminClient, user } = await requireAdminUser();

    if (!adminClient) {
      throw new Error(missingSupabaseAdminMessage);
    }

    if (input.userId === user.id && input.accessStatus === "suspended") {
      throw new Error("Você não pode cancelar seu próprio acesso admin.");
    }

    const { error } = await adminClient
      .from("profiles")
      .update({
        access_status: input.accessStatus,
        activated_at: input.accessStatus === "active" ? new Date().toISOString() : null,
      })
      .eq("id", input.userId);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/admin");

    return {
      message: input.accessStatus === "active" ? "Cliente aprovada para acessar o app." : "Acesso da cliente cancelado.",
      status: "success",
    };
  } catch (error) {
    return {
      message: getAdminFormError(error),
      status: "error",
    };
  }
}
