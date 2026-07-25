import { CheckCircle2, ClipboardCheck, ExternalLink } from "lucide-react";
import { StatusBadge } from "@/components/ui";

const readinessItems = [
  {
    title: "Configurar Supabase real",
    description: "Conectar o banco definitivo, aplicar as tabelas e confirmar o backup antes de liberar clientes.",
  },
  {
    title: "Criar administrador real",
    description: "Entrar com o e-mail administrador e confirmar que somente esse acesso vê o painel de aprovação.",
  },
  {
    title: "Testar cliente real",
    description: "Criar uma conta de teste, aprovar no admin e validar produto, cliente, venda e painel pelo celular.",
  },
  {
    title: "Publicar no dominio final",
    description: "Configurar o site publicado com as mesmas chaves do ambiente real e repetir o teste completo.",
  },
];

export function PilotReadinessCard() {
  return (
    <section className="atelier-panel mt-6 overflow-hidden">
      <div className="border-b border-[color:var(--color-card-border)] p-5 sm:flex sm:items-start sm:justify-between sm:gap-4 sm:p-6">
        <div>
          <p className="text-xs font-normal uppercase tracking-[0.16em] text-[color:var(--color-gold)]">Liberação do MVP</p>
          <h2 className="mt-2 text-3xl font-medium leading-none text-[color:var(--color-cream)]">
            Status do piloto
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--color-text-muted)]">
            Use esta lista para conferir o que falta antes de vender o acesso para clientes reais.
          </p>
        </div>
        <StatusBadge className="mt-4 sm:mt-0" tone="warning">
          Preparação final
        </StatusBadge>
      </div>

      <div className="grid gap-0 divide-y divide-[color:var(--color-card-border)] lg:grid-cols-2 lg:divide-x lg:divide-y-0">
        {readinessItems.map((item) => (
          <article className="flex gap-3 p-5 sm:p-6" key={item.title}>
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[rgba(92,117,82,0.12)] text-[color:var(--color-success)]">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-[color:var(--color-cream)]">{item.title}</h3>
              <p className="mt-1 text-sm leading-6 text-[color:var(--color-text-muted)]">{item.description}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="flex flex-col gap-3 border-t border-[color:var(--color-card-border)] bg-[rgba(245,180,72,0.06)] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3">
          <ClipboardCheck className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--color-antique-gold)]" aria-hidden="true" />
          <p className="text-sm leading-6 text-[color:var(--color-text-muted)]">
            Rode a checagem final antes de vender o acesso. Se algum ponto parar, corrija esse item e confira novamente.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 text-sm font-bold text-[color:var(--color-gold)]">
          Checklist interno
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </section>
  );
}
