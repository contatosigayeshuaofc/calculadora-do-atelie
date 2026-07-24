# Guia Rapido: Ativar Supabase Real

Este guia e para tirar a Calculadora do Atelie do modo local e conectar o MVP ao Supabase real.

## Antes de comecar

Tenha em maos:

- Acesso ao painel do Supabase.
- Acesso ao projeto da Vercel, quando for publicar.
- Uma senha forte para o administrador.

Nunca coloque chaves secretas ou senha real em arquivos versionados. Use apenas `.env.local` no computador e variaveis secretas no provedor de deploy.

## 1. Criar ou abrir o projeto no Supabase

1. Entre no Supabase.
2. Crie um projeto novo ou abra o projeto definitivo do MVP.
3. Copie o identificador do projeto pela URL do painel:
   ```text
   https://supabase.com/dashboard/project/SEU-PROJECT-REF
   ```

Esse `SEU-PROJECT-REF` sera usado para conectar as migrations ao banco real.

## 2. Copiar as chaves certas

No Supabase, abra Settings > API Keys.

Preencha o `.env.local` assim:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua_publishable_key_ou_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_secret_key_ou_service_role
SUPABASE_PROJECT_REF=seu-project-ref
SUPABASE_DB_PASSWORD=sua_senha_do_banco
ADMIN_EMAILS=admin@atelielucrativo.com
ADMIN_BOOTSTRAP_EMAIL=admin@atelielucrativo.com
ADMIN_BOOTSTRAP_PASSWORD=sua_senha_segura_fora_do_codigo
ADMIN_BOOTSTRAP_NAME=Administrador
ADMIN_BOOTSTRAP_ATELIER=Atelie Lucrativo
```

Use:

- `NEXT_PUBLIC_SUPABASE_URL`: URL do projeto Supabase.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: publishable key, ou a anon key antiga.
- `SUPABASE_SERVICE_ROLE_KEY`: secret key, ou a service_role antiga.
- `SUPABASE_PROJECT_REF`: identificador do projeto, copiado da URL do painel.
- `SUPABASE_DB_PASSWORD`: senha do banco, usada somente para aplicar migrations.
- `ADMIN_BOOTSTRAP_PASSWORD`: senha real do administrador.

Nao use:

- Chave secreta em qualquer campo que comece com `NEXT_PUBLIC_`.
- Senha do banco em qualquer campo que comece com `NEXT_PUBLIC_`.
- Senha real em `.env.example`, README, docs ou mensagens publicas.

## 3. Conferir o ambiente

Depois de preencher `.env.local`, rode:

```bash
pnpm env:check
pnpm supabase:check
```

Resultado esperado:

```text
Ambiente pronto para o proximo passo do deploy.
Supabase pronto para conectar e aplicar migrations.
```

Se aparecer uma mensagem, corrija apenas o campo indicado e rode de novo.

## 4. Aplicar as migrations

Conecte o projeto local ao Supabase real:

```bash
pnpm supabase:check
pnpm supabase:activate
```

Se a CLI pedir login, rode `supabase login` uma vez e execute `pnpm supabase:activate` novamente.

As migrations precisam entrar no banco antes do primeiro login real:

1. `20260724112802_initial_schema.sql`
2. `20260724124300_product_pricing_rpc.sql`
3. `20260724143000_sales_rpc.sql`
4. `20260724152000_admin_access_review.sql`
5. `20260724154500_harden_public_api_surface.sql`

## 5. Criar o administrador

Com o `.env.local` preenchido e as migrations aplicadas, rode:

```bash
pnpm admin:create
```

Depois entre em:

```text
http://localhost:3000/entrar
```

Use:

- Email: `admin@atelielucrativo.com`
- Senha: a senha configurada em `ADMIN_BOOTSTRAP_PASSWORD`

## 6. Testar o fluxo real

1. Entre como administrador.
2. Confirme que o painel `/admin` aparece para o administrador.
3. Crie uma conta cliente de teste.
4. Confirme que ela fica aguardando aprovacao.
5. Aprove a cliente pelo painel admin.
6. Entre como cliente ativa.
7. Cadastre um produto.
8. Cadastre um cliente.
9. Registre uma venda.
10. Confira se o painel mostra os resultados.

## 7. Publicar na Vercel

Na Vercel, cadastre as mesmas variaveis do `.env.local`.

Marque como sensiveis, se a Vercel oferecer essa opcao:

- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_BOOTSTRAP_PASSWORD`

Depois do deploy, abra:

```text
https://seu-dominio.com/entrar
```

Repita o teste de administrador, cadastro, aprovacao, produto, cliente e venda no dominio final.

## Pronto para clientes

O MVP pode ir para piloto quando:

- `pnpm env:check` estiver aprovado.
- `pnpm supabase:check` estiver aprovado.
- Migrations estiverem aplicadas.
- Administrador conseguir entrar.
- Painel admin estiver visivel somente para o administrador.
- Cadastro de cliente ficar aguardando aprovacao.
- Cliente aprovada conseguir usar produto, cliente, venda e painel.
- Backup do Supabase estiver revisado.
