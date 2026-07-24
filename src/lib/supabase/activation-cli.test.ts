import { describe, expect, it } from "vitest";

import { buildSupabaseActivationSteps } from "./activation-cli";

describe("buildSupabaseActivationSteps", () => {
  it("builds link, push and migration list steps from local Supabase env", () => {
    const steps = buildSupabaseActivationSteps({
      SUPABASE_DB_PASSWORD: "secret-db-password",
      SUPABASE_PROJECT_REF: "abc123project",
    });

    expect(steps).toEqual([
      {
        args: ["link", "--project-ref", "abc123project", "--password", "secret-db-password"],
        label: "Conectando o projeto Supabase",
      },
      {
        args: ["db", "push", "--linked", "--password", "secret-db-password"],
        label: "Aplicando migrations no banco",
      },
      {
        args: ["migration", "list", "--linked", "--password", "secret-db-password"],
        label: "Conferindo migrations aplicadas",
      },
    ]);
  });
});
