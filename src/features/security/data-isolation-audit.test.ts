import { describe, expect, test } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function readMigration(fileName: string) {
  return readFileSync(join(root, "supabase", "migrations", fileName), "utf8");
}

function readMigrations(...fileNames: string[]) {
  return fileNames.map(readMigration).join("\n");
}

function readSource(fileName: string) {
  return readFileSync(join(root, fileName), "utf8");
}

function normalizeSql(sql: string) {
  return sql.toLowerCase().replace(/\s+/g, " ");
}

describe("data isolation security audit", () => {
  const initialSchema = normalizeSql(
    readMigration("20260724112802_initial_schema.sql"),
  );
  const productRpc = normalizeSql(readMigration("20260724124300_product_pricing_rpc.sql"));
  const salesRpc = normalizeSql(
    readMigration("20260724143000_sales_rpc.sql"),
  );
  const adminAccessReview = normalizeSql(
    readMigration("20260724152000_admin_access_review.sql"),
  );
  const allMigrations = normalizeSql(
    readMigrations(
      "20260724112802_initial_schema.sql",
      "20260724124300_product_pricing_rpc.sql",
      "20260724143000_sales_rpc.sql",
      "20260724152000_admin_access_review.sql",
      "20260724154500_harden_public_api_surface.sql",
    ),
  );

  test("keeps RLS enabled for every tenant-owned table", () => {
    const tenantTables = [
      "profiles",
      "user_settings",
      "products",
      "product_cost_items",
      "customers",
      "sales",
      "sale_items",
    ];

    for (const table of tenantTables) {
      expect(initialSchema).toContain(
        `alter table public.${table} enable row level security;`,
      );
    }
  });

  test("blocks direct profile access-status changes by normal users", () => {
    expect(adminAccessReview).toContain("revoke update on public.profiles from authenticated;");
    expect(adminAccessReview).toContain('drop policy if exists "profiles_update_own"');
    expect(adminAccessReview).toContain("create or replace function public.update_my_profile");
    expect(adminAccessReview).not.toContain("p_access_status");
  });

  test("RPCs derive the tenant from auth.uid and do not accept a user_id input", () => {
    expect(productRpc).toContain("v_user_id uuid := auth.uid()");
    expect(productRpc).not.toContain("p_user_id");
    expect(productRpc).toContain("and user_id = v_user_id");

    expect(salesRpc).toContain("v_user_id uuid := auth.uid()");
    expect(salesRpc).not.toContain("p_user_id");
    expect(salesRpc).toContain("and product.user_id = v_user_id");
  });

  test("RPC execution is explicitly revoked from public and anon", () => {
    expect(allMigrations).toContain(
      "revoke execute on function public.upsert_product_with_cost_items",
    );
    expect(allMigrations).toContain(
      "revoke execute on function public.set_product_active(uuid, boolean) from public, anon;",
    );
    expect(allMigrations).toContain(
      "revoke execute on function public.create_sale_with_items",
    );
    expect(allMigrations).toContain(
      "revoke execute on function public.update_my_profile(text, text, text) from public, anon, authenticated;",
    );
  });

  test("service role key stays server-only and out of public env", () => {
    const adminClient = readSource("src/lib/supabase/admin.ts");
    const browserClient = readSource("src/lib/supabase/client.ts");
    const envHelpers = readSource("src/lib/supabase/env.ts");

    expect(adminClient).toContain('import "server-only";');
    expect(envHelpers).toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(browserClient).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(envHelpers).not.toContain("NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY");
  });
});
