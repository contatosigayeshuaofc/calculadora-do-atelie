import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const requiredVariables = [
  [
    "NEXT_PUBLIC_SUPABASE_URL",
    "Informe a URL do projeto Supabase em NEXT_PUBLIC_SUPABASE_URL.",
  ],
  [
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    "Informe a publishable key do Supabase em NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
  ],
  [
    "SUPABASE_SERVICE_ROLE_KEY",
    "Informe a chave secreta do Supabase em SUPABASE_SERVICE_ROLE_KEY.",
  ],
  [
    "ADMIN_BOOTSTRAP_PASSWORD",
    "Informe a senha do administrador em ADMIN_BOOTSTRAP_PASSWORD.",
  ],
];

function loadEnvFile(fileName) {
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

    if (key && process.env[key] == null) {
      process.env[key] = value;
    }
  }
}

function validateEnv(env) {
  const messages = requiredVariables
    .filter(([key]) => !env[key]?.trim())
    .map(([, message]) => message);

  if (!isSupabaseUrl(env.NEXT_PUBLIC_SUPABASE_URL)) {
    messages.push(
      "Confira NEXT_PUBLIC_SUPABASE_URL: ela deve ser uma URL do Supabase, como https://seu-projeto.supabase.co.",
    );
  }

  if (!isPublishableOrLegacyAnonKey(env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)) {
    messages.push(
      "Confira NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: use a publishable key ou anon key, nunca uma chave secreta.",
    );
  }

  if (!isServerSecretKey(env.SUPABASE_SERVICE_ROLE_KEY)) {
    messages.push(
      "Confira SUPABASE_SERVICE_ROLE_KEY: use uma secret key ou service_role, nunca a publishable key.",
    );
  }

  if (env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY?.trim()) {
    messages.push(
      "Remova NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY: chave secreta nao pode ficar publica.",
    );
  }

  return { messages, ok: messages.length === 0 };
}

function isSupabaseUrl(value) {
  if (!value?.trim()) {
    return true;
  }

  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" && url.hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

function isPublishableOrLegacyAnonKey(value) {
  if (!value?.trim()) {
    return true;
  }

  const key = value.trim();
  return key.startsWith("sb_publishable_") || key.startsWith("eyJ");
}

function isServerSecretKey(value) {
  if (!value?.trim()) {
    return true;
  }

  const key = value.trim();
  return key.startsWith("sb_secret_") || key.startsWith("eyJ");
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const result = validateEnv(process.env);

if (!result.ok) {
  console.error("Configuracao incompleta para publicar o MVP:");
  for (const message of result.messages) {
    console.error(`- ${message}`);
  }
  process.exit(1);
}

console.log("Ambiente pronto para o proximo passo do deploy.");
