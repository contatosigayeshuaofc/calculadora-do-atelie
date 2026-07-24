type SupabaseActivationEnv = Partial<Record<string, string | undefined>>;

export type SupabaseActivationStep = {
  args: string[];
  label: string;
};

function requireValue(env: SupabaseActivationEnv, key: string): string {
  const value = env[key]?.trim();

  if (!value) {
    throw new Error(`Configure ${key} antes de ativar o Supabase.`);
  }

  return value;
}

export function buildSupabaseActivationSteps(
  env: SupabaseActivationEnv,
): SupabaseActivationStep[] {
  const projectRef = requireValue(env, "SUPABASE_PROJECT_REF");
  const databasePassword = requireValue(env, "SUPABASE_DB_PASSWORD");

  return [
    {
      args: ["link", "--project-ref", projectRef, "--password", databasePassword],
      label: "Conectando o projeto Supabase",
    },
    {
      args: ["db", "push", "--linked", "--password", databasePassword],
      label: "Aplicando migrations no banco",
    },
    {
      args: ["migration", "list", "--linked", "--password", databasePassword],
      label: "Conferindo migrations aplicadas",
    },
  ];
}
