import { ArrowUpRight, Calculator, PackagePlus, ReceiptText, Users } from "lucide-react";
import { Button, EmptyState, Skeleton, StatusBadge } from "@/components/ui";

const metrics = [
  { label: "Faturamento do mes", value: "R$ 0,00", tone: "neutral" as const },
  { label: "Pedidos abertos", value: "0", tone: "warning" as const },
  { label: "Produtos ativos", value: "0", tone: "success" as const },
];

const quickActions = [
  { label: "Novo produto", icon: PackagePlus },
  { label: "Calcular preco", icon: Calculator },
  { label: "Nova venda", icon: ReceiptText },
  { label: "Novo cliente", icon: Users },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-3 md:grid-cols-3">
        {metrics.map((metric) => (
          <article className="rounded-[var(--radius-md)] border border-[color:var(--color-clay-beige)] bg-[rgba(248,246,241,0.74)] p-5" key={metric.label}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[color:var(--color-text-muted)]">{metric.label}</p>
              <StatusBadge tone={metric.tone}>Hoje</StatusBadge>
            </div>
            <p className="mt-5 font-[var(--font-cormorant)] text-4xl leading-none text-[color:var(--color-warm-graphite)]">{metric.value}</p>
          </article>
        ))}
      </section>

      <section className="mt-20 grid gap-6 md:mt-0 xl:grid-cols-[1fr_360px]">
        <div className="rounded-[var(--radius-md)] border border-[color:var(--color-clay-beige)] bg-[rgba(248,246,241,0.76)] p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="font-[var(--font-cormorant)] text-3xl leading-tight text-[color:var(--color-warm-graphite)]">O que precisa de atencao</h2>
              <p className="mt-1 text-sm leading-6 text-[color:var(--color-text-muted)]">Acompanhe os pontos principais antes de vender.</p>
            </div>
            <Button rightIcon={<ArrowUpRight className="h-4 w-4" aria-hidden="true" />} variant="secondary">
              Ver vendas
            </Button>
          </div>

          <div className="mt-5 grid gap-3">
            <EmptyState
              actionLabel="Cadastrar primeiro produto"
              description="Quando seus produtos entrarem aqui, o app mostra custo, margem e preco recomendado."
              title="Seu atelie ainda esta pronto para comecar"
            />
          </div>
        </div>

        <aside className="rounded-[var(--radius-md)] border border-[color:var(--color-clay-beige)] bg-[rgba(236,232,225,0.72)] p-5">
          <h2 className="font-[var(--font-cormorant)] text-3xl leading-tight text-[color:var(--color-warm-graphite)]">Acoes rapidas</h2>
          <div className="mt-5 grid gap-2">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Button className="justify-start" key={action.label} leftIcon={<Icon className="h-4 w-4" aria-hidden="true" />} variant="secondary">
                  {action.label}
                </Button>
              );
            })}
          </div>

          <div className="mt-6 space-y-2">
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>
        </aside>
      </section>
    </div>
  );
}
