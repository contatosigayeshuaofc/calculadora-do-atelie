import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("apply Supabase migrations script", () => {
  it("prints activation steps in dry-run mode without exposing the database password", () => {
    const result = spawnSync(
      process.execPath,
      [join(process.cwd(), "scripts", "apply-supabase-migrations.mjs")],
      {
        encoding: "utf8",
        env: {
          ...process.env,
          SUPABASE_ACTIVATE_DRY_RUN: "1",
          SUPABASE_DB_PASSWORD: "secret-db-password",
          SUPABASE_PROJECT_REF: "abc123project",
        },
      },
    );

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Conectando o projeto Supabase");
    expect(result.stdout).toContain("Aplicando migrations no banco");
    expect(result.stdout).toContain("Conferindo migrations aplicadas");
    expect(result.stdout).not.toContain("secret-db-password");
  });
});
