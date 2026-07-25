import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

function loadEnvFile(fileName, { override = true } = {}) {
  const filePath = resolve(process.cwd(), fileName);

  if (!existsSync(filePath)) {
    return;
  }

  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [key, ...valueParts] = trimmed.split("=");
    const value = valueParts.join("=").trim().replace(/^['"]|['"]$/g, "");

    if (key && (override || process.env[key] == null)) {
      process.env[key] = value;
    }
  }
}

function requireValue(key) {
  const value = process.env[key]?.trim();

  if (!value) {
    throw new Error(`Configure ${key} antes de ativar o Supabase.`);
  }

  return value;
}

function getSupabaseBin() {
  return resolve(
    process.cwd(),
    "node_modules",
    ".bin",
    process.platform === "win32" ? "supabase.CMD" : "supabase",
  );
}

function buildSteps() {
  const projectRef = requireValue("SUPABASE_PROJECT_REF");
  const databasePassword = requireValue("SUPABASE_DB_PASSWORD");

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

function runStep(supabaseBin, step) {
  console.log(`- ${step.label}`);

  if (process.env.SUPABASE_ACTIVATE_DRY_RUN === "1") {
    return;
  }

  const result = spawnSync(supabaseBin, step.args, {
    env: process.env,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

try {
  const shouldOverrideEnv = process.env.SUPABASE_ACTIVATE_DRY_RUN !== "1";
  loadEnvFile(".env.local", { override: shouldOverrideEnv });
  loadEnvFile(".env", { override: shouldOverrideEnv });

  const steps = buildSteps();
  const supabaseBin = getSupabaseBin();

  if (!existsSync(supabaseBin)) {
    throw new Error("Instale a CLI do Supabase antes de ativar o banco.");
  }

  console.log("Ativacao do Supabase real:");
  for (const step of steps) {
    runStep(supabaseBin, step);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
