import { SaleList } from "@/components/sales/sale-list";
import { listSales } from "@/features/sales/queries";
import type { OrderStatus, PaymentStatus } from "@/types/database";

type SalesPageProps = {
  searchParams: Promise<{
    busca?: string;
    status?: OrderStatus;
    pagamento?: PaymentStatus;
  }>;
};

export default async function SalesPage({ searchParams }: SalesPageProps) {
  const params = await searchParams;
  const sales = await listSales({
    search: params.busca,
    status: params.status ?? "",
    paymentStatus: params.pagamento ?? "",
  });

  return (
    <SaleList
      paymentStatus={params.pagamento}
      sales={sales}
      search={params.busca}
      status={params.status}
    />
  );
}
