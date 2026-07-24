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

Abra `http://localhost:3000/entrar` para visualizar o app localmente.

## Configuracao do Supabase

No projeto real do Supabase, copie as chaves em Settings > API Keys e preencha:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_PROJECT_REF=
SUPABASE_DB_PASSWORD=
ADMIN_EMAILS=admin@atelielucrativo.com
ADMIN_BOOTSTRAP_EMAIL=admin@atelielucrativo.com
ADMIN_BOOTSTRAP_PASSWORD=
ADMIN_BOOTSTRAP_NAME=Administrador
ADMIN_BOOTSTRAP_ATELIER=Atelie Lucrativo
```

Use a publishable key no campo `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. A chave secreta ou `service_role` deve ficar somente no servidor, em `SUPABASE_SERVICE_ROLE_KEY`.

Use `SUPABASE_PROJECT_REF` e `SUPABASE_DB_PASSWORD` apenas para conectar a Supabase CLI e aplicar as migrations no banco real.

## Migrations do Banco

As migrations precisam ser aplicadas no Supabase real antes do primeiro teste com clientes:

1. `20260724112802_initial_schema.sql`
2. `20260724124300_product_pricing_rpc.sql`
3. `20260724143000_sales_rpc.sql`
4. `20260724152000_admin_access_review.sql`
5. `20260724154500_harden_public_api_surface.sql`

Com Supabase CLI instalado e projeto conectado:

```bash
pnpm supabase:check
supabase login
supabase link --project-ref <project-ref>
supabase db push
```

Depois gere os tipos atualizados:

```bash
supabase gen types typescript --linked --schema public > src/types/database.ts
```

## Scripts

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm env:check
pnpm supabase:check
pnpm pilot:check
pnpm build
pnpm test:e2e
pnpm admin:create
```

## Administrador

O e-mail `admin@atelielucrativo.com` e reconhecido como administrador do MVP.

Para criar ou atualizar esse usuario no Supabase real, preencha `ADMIN_BOOTSTRAP_PASSWORD` em `.env.local` e rode:

```bash
pnpm admin:create
```

A senha do administrador deve ficar apenas no `.env.local` ou no painel seguro do provedor. Ela nao deve ser commitada.

## Deploy na Vercel

Antes do deploy, confira o checklist completo em `docs/deploy-checklist.md`.

Para ativar o Supabase real passo a passo, siga tambem `docs/supabase-go-live-guide.md`.

Para decidir se o MVP ja pode receber clientes reais, confira tambem `docs/pilot-readiness.md`.

Na Vercel, configure as mesmas variaveis do `.env.local`. Marque `SUPABASE_SERVICE_ROLE_KEY` e `ADMIN_BOOTSTRAP_PASSWORD` como variaveis sensiveis quando o provedor oferecer essa opcao.

Depois rode as validacoes finais:

```bash
pnpm pilot:check
```

## Backup

Antes de abrir para clientes reais, ative uma rotina de Backup no Supabase. No piloto, o minimo recomendado e revisar diariamente os backups automaticos do projeto e exportar um backup manual antes de grandes alteracoes no banco.

## Observacao

O MVP nao e um sistema contabil, fiscal ou de estoque. Os valores de lucro sao estimativas comerciais baseadas nos custos informados pela propria usuaria.
