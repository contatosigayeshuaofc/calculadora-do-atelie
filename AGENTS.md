# Calculadora do Atelie

## Direcao do Projeto

- Use o arquivo `PLANO-CODEX-CALCULADORA-DO-ATELIE.md` como fonte principal de escopo.
- A imagem `arquitetura-calculadora-do-atelie.png` orienta arquitetura, fluxo e direcao visual.
- Mantenha a interface em portugues do Brasil.
- Priorize MVP funcional, mobile-first e seguro.
- Nao implemente itens listados como fora do MVP.

## Regras Tecnicas

- Use Next.js App Router, TypeScript estrito e Tailwind CSS.
- Regras de negocio devem ficar em funcoes puras, fora dos componentes React.
- Valores monetarios devem ser calculados em centavos inteiros.
- Nunca exponha chaves secretas do Supabase no cliente.
- Toda mutacao futura deve validar usuario no servidor.

## Validacao

Antes de concluir uma etapa, rode os comandos relacionados:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```
