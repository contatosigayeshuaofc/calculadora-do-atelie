import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

const migrationPath = join(process.cwd(), "supabase", "migrations", "20260724152000_admin_access_review.sql");

describe("admin access migration", () => {
  test("revokes direct profile updates and exposes a limited own-profile function", () => {
    const sql = readFileSync(migrationPath, "utf8").toLowerCase();

    expect(sql).toContain("revoke update on public.profiles from authenticated");
    expect(sql).toContain("create or replace function public.update_my_profile");
    expect(sql).toContain("revoke execute on function public.update_my_profile");
    expect(sql).toContain("grant execute on function public.update_my_profile");
    expect(sql).not.toContain("p_access_status");
  });
});
