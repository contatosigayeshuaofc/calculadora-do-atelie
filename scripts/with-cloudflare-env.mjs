import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { spawn } from "node:child_process";

const [command, ...args] = process.argv.slice(2);

if (!command) {
  console.error("Informe o comando Cloudflare que deve ser executado.");
  process.exit(1);
}

const root = process.cwd();
const wranglerHome = join(root, ".wrangler");
const xdgConfigHome = join(wranglerHome, "xdg-config");
const xdgDataHome = join(wranglerHome, "xdg-data");

mkdirSync(xdgConfigHome, { recursive: true });
mkdirSync(xdgDataHome, { recursive: true });

const child = spawn(command, args, {
  env: {
    ...process.env,
    HOME: process.env.HOME || root,
    USERPROFILE: process.env.USERPROFILE || root,
    WRANGLER_LOG: "debug",
    XDG_CONFIG_HOME: xdgConfigHome,
    XDG_DATA_HOME: xdgDataHome,
  },
  shell: process.platform === "win32",
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
