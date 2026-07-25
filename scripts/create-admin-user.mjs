import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

const DEFAULT_ADMIN_EMAIL = "admin@atelielucrativo.com";

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

    if (key) {
      process.env[key] = value;
    }
  }
}

function requireEnv(key) {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Configure ${key} antes de criar o administrador.`);
  }

  return value;
}

async function findUserByEmail(supabase, email) {
  let page = 1;

  while (page <= 10) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });

    if (error) {
      throw error;
    }

    const user = data.users.find((item) => item.email?.toLowerCase() === email);

    if (user) {
      return user;
    }

    if (data.users.length < 1000) {
      return null;
    }

    page += 1;
  }

  return null;
}

async function main() {
  loadEnvFile(".env.local");
  loadEnvFile(".env");

  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const password = requireEnv("ADMIN_BOOTSTRAP_PASSWORD");
  const email = (process.env.ADMIN_BOOTSTRAP_EMAIL || DEFAULT_ADMIN_EMAIL).trim().toLowerCase();
  const fullName = process.env.ADMIN_BOOTSTRAP_NAME || "Administrador";
  const atelierName = process.env.ADMIN_BOOTSTRAP_ATELIER || "Atelie Lucrativo";

  const supabase = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const existingUser = await findUserByEmail(supabase, email);
  const authPayload = {
    email_confirm: true,
    password,
    user_metadata: {
      atelier_name: atelierName,
      full_name: fullName,
    },
  };

  const { data, error } = existingUser
    ? await supabase.auth.admin.updateUserById(existingUser.id, authPayload)
    : await supabase.auth.admin.createUser({
        ...authPayload,
        email,
      });

  if (error || !data.user) {
    throw error ?? new Error("Nao foi possivel criar o administrador.");
  }

  const { error: profileError } = await supabase.from("profiles").upsert({
    access_status: "active",
    activated_at: new Date().toISOString(),
    atelier_name: atelierName,
    full_name: fullName,
    id: data.user.id,
    whatsapp: null,
  });

  if (profileError) {
    throw profileError;
  }

  const { error: settingsError } = await supabase.from("user_settings").upsert(
    {
      currency_code: "BRL",
      user_id: data.user.id,
    },
    { onConflict: "user_id" },
  );

  if (settingsError) {
    throw settingsError;
  }

  console.log(`Administrador pronto: ${email}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
