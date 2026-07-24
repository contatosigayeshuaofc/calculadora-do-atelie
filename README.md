# Calculadora do Atelie

Aplicativo web para artesas calcularem custos, definirem precos, registrarem clientes, acompanharem vendas e visualizarem resultados comerciais estimados.

## Stack

- Next.js com App Router
- TypeScript
- Tailwind CSS
- Supabase Auth e PostgreSQL
- Zod e React Hook Form
- Vitest, React Testing Library e Playwright

## Como Rodar

```bash
pnpm install
pnpm dev
```

Copie `.env.example` para `.env.local` quando as credenciais do Supabase estiverem disponiveis.

## Scripts

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

## Observacao

O MVP nao e um sistema contabil, fiscal ou de estoque. Os valores de lucro sao estimativas comerciais baseadas nos custos informados pela propria usuaria.
