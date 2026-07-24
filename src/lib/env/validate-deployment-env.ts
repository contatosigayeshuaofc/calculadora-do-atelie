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

export function validateDeploymentEnv(env: DeploymentEnv): DeploymentEnvValidation {
  const messages: string[] = requiredVariables
    .filter(({ key }) => !env[key]?.trim())
    .map(({ message }) => message);

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
