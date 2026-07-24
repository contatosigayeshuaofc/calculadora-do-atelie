import { describe, expect, test } from "vitest";

import { validateDeploymentEnv } from "./validate-deployment-env";

describe("validateDeploymentEnv", () => {
  test("reports friendly setup messages when required values are missing", () => {
    const result = validateDeploymentEnv({});

    expect(result.ok).toBe(false);
    expect(result.messages).toEqual([
      "Informe a URL do projeto Supabase em NEXT_PUBLIC_SUPABASE_URL.",
      "Informe a publishable key do Supabase em NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
      "Informe a chave secreta do Supabase em SUPABASE_SERVICE_ROLE_KEY.",
      "Informe a senha do administrador em ADMIN_BOOTSTRAP_PASSWORD.",
    ]);
  });

  test("accepts a complete deployment environment", () => {
    const result = validateDeploymentEnv({
      ADMIN_BOOTSTRAP_PASSWORD: "!Trader0407",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test",
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "sb_secret_test",
    });

    expect(result).toEqual({ messages: [], ok: true });
  });

  test("warns when a server secret is accidentally exposed as public", () => {
    const result = validateDeploymentEnv({
      ADMIN_BOOTSTRAP_PASSWORD: "!Trader0407",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test",
      NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY: "sb_secret_should_not_be_public",
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "sb_secret_test",
    });

    expect(result.ok).toBe(false);
    expect(result.messages).toContain(
      "Remova NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY: chave secreta nao pode ficar publica.",
    );
  });

  test("reports friendly messages for values that look pasted in the wrong field", () => {
    const result = validateDeploymentEnv({
      ADMIN_BOOTSTRAP_PASSWORD: "!Trader0407",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_secret_wrong_place",
      NEXT_PUBLIC_SUPABASE_URL: "not-a-url",
      SUPABASE_SERVICE_ROLE_KEY: "sb_publishable_wrong_place",
    });

    expect(result.ok).toBe(false);
    expect(result.messages).toEqual([
      "Confira NEXT_PUBLIC_SUPABASE_URL: ela deve ser uma URL do Supabase, como https://seu-projeto.supabase.co.",
      "Confira NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: use a publishable key ou anon key, nunca uma chave secreta.",
      "Confira SUPABASE_SERVICE_ROLE_KEY: use uma secret key ou service_role, nunca a publishable key.",
    ]);
  });
});
