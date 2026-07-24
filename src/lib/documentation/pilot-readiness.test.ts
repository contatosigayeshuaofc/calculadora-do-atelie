import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

const root = process.cwd();

function readProjectFile(path: string) {
  return readFileSync(join(root, path), "utf8");
}

describe("pilot readiness documentation", () => {
  test("summarizes what is ready, what is blocked, and the launch order", () => {
    const readme = readProjectFile("README.md");
    const readiness = readProjectFile("docs/pilot-readiness.md");
    const packageJson = readProjectFile("package.json");

    expect(readme).toContain("docs/pilot-readiness.md");
    expect(readme).toContain("pnpm pilot:check");
    expect(packageJson).toContain('"pilot:check": "node scripts/pilot-check.mjs"');
    expect(readiness).toContain("Pronto no codigo");
    expect(readiness).toContain("Bloqueios para uso real");
    expect(readiness).toContain("Ordem recomendada");
    expect(readiness).toContain("pnpm pilot:check");
    expect(readiness).toContain("Supabase real");
    expect(readiness).toContain("migrations");
    expect(readiness).toContain("administrador");
    expect(readiness).toContain("admin@atelielucrativo.com");
    expect(readiness).toContain("teste com conta real");
    expect(readiness).toContain("Vercel");
    expect(readiness).toContain("criterios de aceite");
  });
});
