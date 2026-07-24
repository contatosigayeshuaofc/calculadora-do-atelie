import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

const root = process.cwd();

function readProjectFile(path: string) {
  return readFileSync(join(root, path), "utf8");
}

describe("pilot deployment documentation", () => {
  test("documents the complete production activation checklist", () => {
    const readme = readProjectFile("README.md");
    const checklist = readProjectFile("docs/deploy-checklist.md");
    const fullText = `${readme}\n${checklist}`;

    expect(fullText).toContain("NEXT_PUBLIC_SUPABASE_URL");
    expect(fullText).toContain("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
    expect(fullText).toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(fullText).toContain("ADMIN_EMAILS");
    expect(fullText).toContain("ADMIN_BOOTSTRAP_PASSWORD");

    expect(fullText).toContain("20260724112802_initial_schema.sql");
    expect(fullText).toContain("20260724124300_product_pricing_rpc.sql");
    expect(fullText).toContain("20260724143000_sales_rpc.sql");
    expect(fullText).toContain("20260724152000_admin_access_review.sql");
    expect(fullText).toContain("20260724154500_harden_public_api_surface.sql");

    expect(fullText).toContain("pnpm admin:create");
    expect(fullText).toContain("pnpm test:e2e");
    expect(fullText).toContain("supabase db push");
    expect(fullText).toContain("supabase gen types typescript");
    expect(fullText).toContain("Backup");
    expect(fullText).toContain("Vercel");
  });
});
