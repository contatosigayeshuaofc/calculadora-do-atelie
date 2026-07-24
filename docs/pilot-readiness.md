# Prontidao do MVP para Piloto

Este documento resume a situacao atual da Calculadora do Atelie antes de abrir o acesso para clientes reais.

## Pronto no codigo

- Cadastro, login, recuperacao e redefinicao de senha.
- Fluxo de conta pendente, ativa e suspensa.
- Painel administrativo restrito ao administrador.
- Cadastro manual de usuarios pelo administrador.
- Aprovacao, suspensao e reativacao de cadastros.
- Cadastro de produtos com materiais, embalagem e outros custos.
- Sugestoes de consumo/gasto abaixo dos campos de materiais.
- Calculo de custo do lote, custo por unidade, preco minimo, preco recomendado e lucro estimado.
- Cadastro de clientes.
- Registro e acompanhamento de vendas.
- Painel comercial com faturamento, lucro estimado, pedidos, ticket medio e proximas entregas.
- Configuracoes do atelie e multiplicadores de preco.
- Mensagens de erro amigaveis para a usuaria.
- Rodape com suporte: suporte@ateliearomatico.site.
- Testes unitarios, testes de componentes e smoke E2E local.

## Bloqueios para uso real

- Configurar um projeto Supabase real.
- Preencher as variaveis de ambiente reais.
- Conferir as variaveis reais com `pnpm env:check`.
- Aplicar as migrations no banco real.
- Gerar tipos atualizados do banco depois das migrations.
- Criar o administrador real com `admin@atelielucrativo.com`.
- Fazer teste com conta real de cliente.
- Publicar na Vercel com as mesmas variaveis.
- Confirmar backup no Supabase antes de liberar clientes.

## Ordem recomendada

1. Criar ou abrir o projeto Supabase real.
2. Preencher `.env.local` com URL, publishable key e chave secreta do Supabase.
3. Rodar `pnpm env:check`.
4. Aplicar as migrations com a Supabase CLI.
5. Gerar os tipos do banco.
6. Criar o administrador com `pnpm admin:create`.
7. Entrar como administrador e confirmar que `/admin` esta restrito.
8. Criar uma conta de cliente real de teste.
9. Aprovar a cliente no painel administrador.
10. Entrar como cliente ativa e testar produto, cliente, venda e painel.
11. Configurar as variaveis na Vercel.
12. Publicar na Vercel.
13. Repetir o teste com conta real no dominio final.

## criterios de aceite antes de vender

- Visitante cria conta e fica aguardando aprovacao.
- Administrador aprova ou suspende o cadastro.
- Cliente ativa consegue entrar no aplicativo.
- Cliente ativa cadastra produto com dois ou mais custos.
- O custo proporcional dos materiais esta correto.
- Preco minimo e preco recomendado aparecem corretamente.
- Cliente cadastra contato.
- Cliente registra venda com itens, desconto, entrega e datas.
- Historico do cliente e painel sao atualizados.
- Orcamentos e vendas canceladas nao entram no faturamento.
- Uma cliente nao acessa dados de outra cliente.
- App funciona bem no celular.
- `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm env:check`, `pnpm build` e `pnpm test:e2e` passam.

## Decisao

O MVP esta pronto no codigo para iniciar a configuracao real. Ele ainda nao deve ser vendido enquanto o Supabase real, o administrador, o backup e o teste completo no dominio final nao forem confirmados.
