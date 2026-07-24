export type SupabasePublicEnv = {
  publishableKey: string;
  url: string;
};

export type SupabaseAdminEnv = SupabasePublicEnv & {
  serviceRoleKey: string;
};

export function getSupabasePublicEnv(): SupabasePublicEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    return null;
  }

  return { publishableKey, url };
}

export function getSupabaseAdminEnv(): SupabaseAdminEnv | null {
  const publicEnv = getSupabasePublicEnv();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!publicEnv || !serviceRoleKey) {
    return null;
  }

  return { ...publicEnv, serviceRoleKey };
}

export const missingSupabaseMessage =
  "Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY para ativar login, cadastro e protecao do app.";

export const missingSupabaseAdminMessage =
  "Configure SUPABASE_SERVICE_ROLE_KEY e ADMIN_EMAILS para ativar o painel administrativo.";
