import Link from "next/link";
import { Calculator, PackagePlus, ReceiptText, Users } from "lucide-react";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { TopCustomers } from "@/components/dashboard/top-customers";
import { TopProducts } from "@/components/dashboard/top-products";
import { UpcomingDeliveries } from "@/components/dashboard/upcoming-deliveries";
import { Button } from "@/components/ui";
import { getDashboardSummary } from "@/features/dashboard/queries";

const quickActions = [
  { href: "/vendas/nova", label: "Registrar venda", icon: ReceiptText },
  { href: "/produtos/novo", label: "Novo produto", icon: PackagePlus },
  { href: "/clientes/novo", label: "Novo cliente", icon: Users },
  { href: "/produtos/novo", label: "Calcular preço", icon: Calculator },
];

export default async function DashboardPage() {
  const summary = await getDashboardSummary();

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">
            Painel
          </p>
          <h1 className="mt-1 text-3xl font-black text-[color:var(--color-cream)]">
            Resultado do ateliê
          </h1>
          <p className="mt-2 text-sm leading-6 text-[color:var(--color-text-muted)]">
            Período de {formatDate(summary.periodStart)} até{" "}
            {formatDate(summary.periodEnd)}. Lucro exibido como estimativa
            comercial.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link href={action.href as never} key={action.label}>
                <Button
                  leftIcon={<Icon className="h-4 w-4" aria-hidden="true" />}
                  variant={action.label === "Registrar venda" ? "primary" : "secondary"}
                >
                  {action.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </section>

      <SummaryCards summary={summary} />

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <UpcomingDeliveries deliveries={summary.upcomingDeliveries} />
        <RecentSales sales={summary.recentSales} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <TopProducts products={summary.topProducts} />
        <TopCustomers customers={summary.topCustomers} />
      </section>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(
    new Date(value),
  );
}
