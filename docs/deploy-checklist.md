# Checklist de Deploy do MVP na Cloudflare

Este checklist prepara a Calculadora do Atelie para sair do modo local e funcionar com clientes reais.

Para uma versao mais guiada da ativacao do Supabase real, use tambem `docs/supabase-go-live-guide.md`.

## 1. Preparar o ambiente local

1. Instale as dependencias.
   ```bash
   pnpm install
   ```
2. Copie `.env.example` para `.env.local`.
3. Preencha as variaveis abaixo.
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
4. Confira se o ambiente esta completo.
   ```bash
   pnpm env:check
   pnpm supabase:check
   ```
5. Rode o app.
   ```bash
   pnpm dev
   ```
6. Abra `http://localhost:3000/entrar`.

## 2. Configurar Supabase

1. Crie ou abra o projeto no Supabase.
2. Em Settings > API Keys, copie:
   - URL do projeto para `NEXT_PUBLIC_SUPABASE_URL`.
   - Publishable key para `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
   - Secret key ou service_role legacy para `SUPABASE_SERVICE_ROLE_KEY`.
   - Identificador do projeto para `SUPABASE_PROJECT_REF`.
   - Senha do banco para `SUPABASE_DB_PASSWORD`.
3. Nunca coloque `SUPABASE_SERVICE_ROLE_KEY` ou `SUPABASE_DB_PASSWORD` em variavel `NEXT_PUBLIC_`.
4. Confirme que o projeto usa Supabase Auth com email e senha.

## 3. Aplicar migrations

As migrations ficam em `supabase/migrations` e devem estar aplicadas nessa ordem:

1. `20260724112802_initial_schema.sql`
2. `20260724124300_product_pricing_rpc.sql`
3. `20260724143000_sales_rpc.sql`
4. `20260724152000_admin_access_review.sql`
5. `20260724154500_harden_public_api_surface.sql`
6. `20260724223508_revoke_rls_auto_enable_execute.sql`
7. `20260724223624_harden_profile_update_rpc.sql`
8. `20260730182811_allow_supported_currency_codes.sql`

Com a Supabase CLI conectada ao projeto:

```bash
pnpm supabase:check
pnpm supabase:activate
```

Se a CLI pedir login, rode `supabase login` uma vez e execute `pnpm supabase:activate` novamente.

Por dentro, esse script conecta o projeto, executa `supabase db push` e confere `supabase migration list`.

Depois gere os tipos do banco:

```bash
supabase gen types typescript --linked --schema public > src/types/database.ts
```

## 4. Criar administrador

1. Defina a senha segura em `ADMIN_BOOTSTRAP_PASSWORD`.
2. Rode:
   ```bash
   pnpm admin:create
   ```
3. Entre com:
   - Email: `admin@atelielucrativo.com`
   - Senha: a senha configurada fora do codigo
4. Confirme que o painel `/admin` aparece somente para o administrador.

## 5. Validar o fluxo do piloto

1. Criar uma conta nova como cliente.
2. Confirmar que ela fica aguardando aprovacao.
3. Entrar como administrador e aprovar a cliente.
4. Entrar como cliente ativa.
5. Cadastrar um produto com materiais.
6. Conferir preco minimo e preco recomendado.
7. Cadastrar cliente.
8. Registrar venda.
9. Conferir painel e historico.
10. Cancelar ou suspender uma conta de teste e confirmar que ela perde acesso.

## 6. Rodar validacoes

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm cf:build
pnpm test:e2e
pnpm pilot:check
```

O teste E2E completo com dados reais so deve ser considerado final depois que o Supabase real estiver configurado e as migrations estiverem aplicadas.

## 7. Deploy na Cloudflare

O app usa Cloudflare Workers com OpenNext. Nao use export estatico para esse MVP, porque ele depende de Server Actions, cookies de autenticacao e Supabase no servidor.

Observacao para Windows: o OpenNext pode precisar criar symlinks durante `pnpm cf:build`. Se o Windows bloquear essa permissao localmente, rode o build em WSL, em uma maquina Linux ou direto no ambiente de build da Cloudflare. O build padrao `pnpm build` continua validando o Next.js localmente.

1. Faca login na Cloudflare pela CLI se for publicar pelo terminal.
   ```bash
   wrangler login
   ```
2. Configure as variaveis de producao no painel da Cloudflare ou via `wrangler secret put`.
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_EMAILS`
   - `ADMIN_BOOTSTRAP_EMAIL`
   - `ADMIN_BOOTSTRAP_PASSWORD`
   - `ADMIN_BOOTSTRAP_NAME`
   - `ADMIN_BOOTSTRAP_ATELIER`
3. Use `SUPABASE_PROJECT_REF` e `SUPABASE_DB_PASSWORD` somente em ambiente seguro quando precisar aplicar migrations. Elas nao precisam ir para o navegador.
4. Gere o build Cloudflare.
   ```bash
   pnpm cf:build
   ```
5. Publique.
   ```bash
   pnpm cf:deploy
   ```
6. Abra `/entrar` no dominio final.
7. Teste login de administrador, cadastro de cliente, aprovacao, produto, cliente, venda e dashboard.
8. No Supabase Auth, ajuste as URLs permitidas quando o dominio final estiver definido:
   - Site URL: dominio final da Cloudflare.
   - Redirect URLs: dominio final com `/auth/callback`.

## 8. Backup

Antes de chamar clientes reais:

1. Confirme a rotina de Backup do Supabase no painel do projeto.
2. Exporte um backup manual antes de alteracoes grandes no banco.
3. Guarde uma copia das migrations versionadas.
4. Anote a data da primeira abertura para clientes.

## 9. Pronto para piloto

O MVP so deve ser liberado quando:

- Migrations aplicadas.
- Administrador criado.
- Login funcionando.
- Aprovacao manual funcionando.
- Produto, cliente, venda e painel funcionando.
- Moeda salva e aplicada nos campos de valor.
- Mensagens de erro amigaveis.
- Limite de requisicao ativo.
- `pnpm typecheck`, `pnpm lint`, `pnpm test` e `pnpm build` aprovados localmente.
- `pnpm cf:build` aprovado em WSL, Linux ou no ambiente de build da Cloudflare.
