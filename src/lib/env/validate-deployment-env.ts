type DeploymentEnv = Partial<Record<string, string | undefined>>;

export type DeploymentEnvValidation = {
  messages: string[];
  ok: boolean;
};

const requiredVariables = [
  {
    key: "NEXT_PUBLIC_SUPABASE_URL",
    message: "Informe a URL do projeto Supabase em NEXT_PUBLIC_SUPABASE_URL.",
  },
  {
    key: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    message:
      "Informe a publishable key do Supabase em NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
  },
  {
    key: "SUPABASE_SERVICE_ROLE_KEY",
    message: "Informe a chave secreta do Supabase em SUPABASE_SERVICE_ROLE_KEY.",
  },
  {
    key: "ADMIN_BOOTSTRAP_PASSWORD",
    message: "Informe a senha do administrador em ADMIN_BOOTSTRAP_PASSWORD.",
  },
] as const;

const supabaseActivationVariables = [
  {
    key: "SUPABASE_PROJECT_REF",
    message: "Informe o project-ref do Supabase em SUPABASE_PROJECT_REF.",
  },
  {
    key: "SUPABASE_DB_PASSWORD",
    message:
      "Informe a senha do banco Supabase em SUPABASE_DB_PASSWORD para aplicar as migrations.",
  },
] as const;

function isSupabaseUrl(value: string | undefined): boolean {
  if (!value?.trim()) {
    return true;
  }

  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" && url.hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

function isPublishableOrLegacyAnonKey(value: string | undefined): boolean {
  if (!value?.trim()) {
    return true;
  }

  const key = value.trim();
  return key.startsWith("sb_publishable_") || key.startsWith("eyJ");
}

function isServerSecretKey(value: string | undefined): boolean {
  if (!value?.trim()) {
    return true;
  }

  const key = value.trim();
  return key.startsWith("sb_secret_") || key.startsWith("eyJ");
}

export function validateDeploymentEnv(env: DeploymentEnv): DeploymentEnvValidation {
  const messages: string[] = requiredVariables
    .filter(({ key }) => !env[key]?.trim())
    .map(({ message }) => message);

  if (!isSupabaseUrl(env.NEXT_PUBLIC_SUPABASE_URL)) {
    messages.push(
      "Confira NEXT_PUBLIC_SUPABASE_URL: ela deve ser uma URL do Supabase, como https://seu-projeto.supabase.co.",
    );
  }

  if (!isPublishableOrLegacyAnonKey(env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)) {
    messages.push(
      "Confira NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: use a publishable key ou anon key, nunca uma chave secreta.",
    );
  }

  if (!isServerSecretKey(env.SUPABASE_SERVICE_ROLE_KEY)) {
    messages.push(
      "Confira SUPABASE_SERVICE_ROLE_KEY: use uma secret key ou service_role, nunca a publishable key.",
    );
  }

  if (env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY?.trim()) {
    messages.push(
      "Remova NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY: chave secreta nao pode ficar publica.",
    );
  }

  return {
    messages,
    ok: messages.length === 0,
  };
}

export function validateSupabaseActivationEnv(
  env: DeploymentEnv,
): DeploymentEnvValidation {
  const deploymentResult = validateDeploymentEnv(env);
  const messages = [
    ...deploymentResult.messages,
    ...supabaseActivationVariables
      .filter(({ key }) => !env[key]?.trim())
      .map(({ message }) => message),
  ];

  return {
    messages,
    ok: messages.length === 0,
  };
}
