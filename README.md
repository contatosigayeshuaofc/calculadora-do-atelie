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
pnpm admin:create
```

## Administrador

O e-mail `admin@atelielucrativo.com` e reconhecido como administrador do MVP.

Para criar ou atualizar esse usuario no Supabase real, configure em `.env.local`:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_BOOTSTRAP_PASSWORD=
```

Depois rode:

```bash
pnpm admin:create
```

A senha do administrador deve ficar apenas no `.env.local` ou no painel seguro do provedor. Ela nao deve ser commitada.

## Observacao

O MVP nao e um sistema contabil, fiscal ou de estoque. Os valores de lucro sao estimativas comerciais baseadas nos custos informados pela propria usuaria.
