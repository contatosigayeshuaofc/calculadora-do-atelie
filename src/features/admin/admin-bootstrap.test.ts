import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

const root = process.cwd();

describe("admin bootstrap", () => {
  test("provides a server-side script that reads the admin password from env", () => {
    const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as {
      scripts?: Record<string, string>;
    };
    const script = readFileSync(join(root, "scripts", "create-admin-user.mjs"), "utf8");

    expect(packageJson.scripts?.["admin:create"]).toBe("node scripts/create-admin-user.mjs");
    expect(script).toContain("ADMIN_BOOTSTRAP_PASSWORD");
    expect(script).not.toContain("!Trader0407");
  });
});
