"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { canAdminAccess, parseAdminEmails } from "@/features/admin/schemas";
import { getAccessDecision } from "@/features/auth/access";
import { forgotPasswordSchema, resetPasswordSchema, signInSchema, signUpSchema } from "@/features/auth/schemas";
import { enforceRateLimit, RateLimitError, rateLimitPolicies } from "@/lib/rate-limit";
import { missingSupabaseMessage } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export type AuthActionState = {
  message: string;
  status: "idle" | "error" | "success";
};

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function errorState(message: string): AuthActionState {
  return { message, status: "error" };
}

function getSignUpErrorMessage(error: { code?: string; message?: string }) {
  const text = `${error.code ?? ""} ${error.message ?? ""}`.toLowerCase();

  if (text.includes("email_address_invalid") || text.includes("email address") || text.includes("invalid")) {
    return "Esse e-mail não foi aceito. Use um e-mail real e ativo para criar o acesso.";
  }

  if (text.includes("already") || text.includes("registered") || text.includes("exists")) {
    return "Esse e-mail já possui cadastro. Entre com sua senha ou recupere o acesso.";
  }

  return "Não foi possível criar sua conta agora. Verifique os dados e tente de novo.";
}

async function getOrigin() {
  const headerStore = await headers();
  return headerStore.get("origin") ?? "http://localhost:3000";
}

async function getRateLimitState(policy: typeof rateLimitPolicies[keyof typeof rateLimitPolicies]) {
  try {
    await enforceRateLimit(policy);
    return null;
  } catch (error) {
    if (error instanceof RateLimitError) {
      return errorState(error.message);
    }

    throw error;
  }
}

export async function signInAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const rateLimitState = await getRateLimitState(rateLimitPolicies.signIn);
  if (rateLimitState) {
    return rateLimitState;
  }

  const parsed = signInSchema.safeParse({
    email: getString(formData, "email"),
    password: getString(formData, "password"),
  });

  if (!parsed.success) {
    return errorState(parsed.error.issues[0]?.message ?? "Revise os dados de entrada.");
  }

  const supabase = await createClient();

  if (!supabase) {
    return errorState(missingSupabaseMessage);
  }

  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return errorState("E-mail ou senha não conferem.");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return errorState("Não foi possível confirmar sua sessão. Tente novamente.");
  }

  const decision = await getAccessDecision(supabase, user, {
    isAdmin: canAdminAccess(user.email, parseAdminEmails(process.env.ADMIN_EMAILS)),
  });
  redirect(decision.destination as never);
}

export async function signUpAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const rateLimitState = await getRateLimitState(rateLimitPolicies.signUp);
  if (rateLimitState) {
    return rateLimitState;
  }

  const parsed = signUpSchema.safeParse({
    atelierName: getString(formData, "atelierName"),
    countryCode: getString(formData, "countryCode"),
    currencyCode: getString(formData, "currencyCode"),
    email: getString(formData, "email"),
    fullName: getString(formData, "fullName"),
    password: getString(formData, "password"),
    whatsapp: getString(formData, "whatsapp"),
  });

  if (!parsed.success) {
    return errorState(parsed.error.issues[0]?.message ?? "Revise os dados do cadastro.");
  }

  const supabase = await createClient();

  if (!supabase) {
    return errorState(missingSupabaseMessage);
  }

  const origin = await getOrigin();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        atelier_name: parsed.data.atelierName || null,
        country_code: parsed.data.countryCode,
        currency_code: parsed.data.currencyCode,
        full_name: parsed.data.fullName,
        whatsapp: parsed.data.whatsapp,
      },
      emailRedirectTo: `${origin}/auth/callback?next=/aguardando-liberacao`,
    },
  });

  if (error) {
    return errorState(getSignUpErrorMessage(error));
  }

  redirect("/aguardando-liberacao" as never);
}

export async function forgotPasswordAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const rateLimitState = await getRateLimitState(rateLimitPolicies.authRecovery);
  if (rateLimitState) {
    return rateLimitState;
  }

  const parsed = forgotPasswordSchema.safeParse({
    email: getString(formData, "email"),
  });

  if (!parsed.success) {
    return errorState(parsed.error.issues[0]?.message ?? "Digite um e-mail válido.");
  }

  const supabase = await createClient();

  if (!supabase) {
    return errorState(missingSupabaseMessage);
  }

  const origin = await getOrigin();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${origin}/auth/callback?next=/redefinir-senha`,
  });

  if (error) {
    return errorState("Não foi possível enviar o link. Tente novamente em alguns minutos.");
  }

  return {
    message: "Enviamos o link de recuperação para o seu e-mail.",
    status: "success",
  };
}

export async function resetPasswordAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const rateLimitState = await getRateLimitState(rateLimitPolicies.authRecovery);
  if (rateLimitState) {
    return rateLimitState;
  }

  const parsed = resetPasswordSchema.safeParse({
    confirmPassword: getString(formData, "confirmPassword"),
    password: getString(formData, "password"),
  });

  if (!parsed.success) {
    return errorState(parsed.error.issues[0]?.message ?? "Revise sua nova senha.");
  }

  const supabase = await createClient();

  if (!supabase) {
    return errorState(missingSupabaseMessage);
  }

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });

  if (error) {
    return errorState("Não foi possível atualizar sua senha. Abra o link mais recente enviado por e-mail.");
  }

  return {
    message: "Senha atualizada. Agora você já pode entrar novamente.",
    status: "success",
  };
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase?.auth.signOut();
  redirect("/entrar");
}
