import { spawnSync } from "node:child_process";

const checks = [
  ["typecheck", "Conferindo tipos do app"],
  ["lint", "Conferindo qualidade do codigo"],
  ["test", "Rodando testes principais"],
  ["env:check", "Conferindo configuracao do Supabase"],
  ["build", "Gerando versao de producao"],
  ["test:e2e", "Rodando teste visual do fluxo principal"],
];

function pnpmCommand() {
  return process.platform === "win32" ? "pnpm.cmd" : "pnpm";
}

console.log("Checagem do piloto iniciada.");

for (const [script, label] of checks) {
  console.log(`\n${label}...`);

  const result = spawnSync(pnpmCommand(), ["run", script], {
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    console.error(
      `\nA checagem parou em "${script}". Corrija esse ponto e rode pnpm pilot:check novamente.`,
    );
    process.exit(result.status ?? 1);
  }
}

console.log("\nChecagem do piloto concluida. O app passou nas validacoes locais.");
