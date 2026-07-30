import Link from "next/link";
import { Calculator } from "lucide-react";
import { DateFilter } from "@/components/dashboard/date-filter";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { TopCustomers } from "@/components/dashboard/top-customers";
import { TopProducts } from "@/components/dashboard/top-products";
import { UpcomingDeliveries } from "@/components/dashboard/upcoming-deliveries";
import { Button } from "@/components/ui";
import { getDashboardSummary } from "@/features/dashboard/queries";

type DashboardPageProps = {
  searchParams: Promise<{
    fim?: string;
    inicio?: string;
  }>;
};

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const params = await searchParams;
  const summary = await getDashboardSummary({
    periodEnd: params.fim,
    periodStart: params.inicio,
  });

  return (
    <div className="space-y-5">
      <section className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="text-center lg:text-left">
          <p className="text-xs font-normal uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">
            Painel
          </p>
          <h1 className="mt-1 text-3xl font-medium text-[color:var(--color-cream)]">
            Resultado do ateliê
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-[color:var(--color-text-muted)] lg:mx-0">
            Período de {formatDate(summary.periodStart)} até{" "}
            {formatDate(summary.periodEnd)}. Lucro exibido como estimativa
            comercial.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center lg:justify-end">
          <Link href="/produtos/novo">
            <Button leftIcon={<Calculator className="h-4 w-4" aria-hidden="true" />}>
              Calcular preço
            </Button>
          </Link>
          <DateFilter
            endDate={summary.periodEnd}
            startDate={summary.periodStart}
          />
        </div>
      </section>

      <SummaryCards summary={summary} />

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <UpcomingDeliveries currencyCode={summary.currencyCode} deliveries={summary.upcomingDeliveries} />
        <RecentSales currencyCode={summary.currencyCode} sales={summary.recentSales} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <TopProducts currencyCode={summary.currencyCode} products={summary.topProducts} />
        <TopCustomers currencyCode={summary.currencyCode} customers={summary.topCustomers} />
      </section>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(
    new Date(value),
  );
}
