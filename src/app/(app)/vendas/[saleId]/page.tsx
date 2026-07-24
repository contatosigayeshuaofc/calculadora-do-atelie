import { notFound } from "next/navigation";
import { SaleDetail } from "@/components/sales/sale-detail";
import { getSaleDetail } from "@/features/sales/queries";

type SalePageProps = {
  params: Promise<{
    saleId: string;
  }>;
};

export default async function SalePage({ params }: SalePageProps) {
  const { saleId } = await params;
  const sale = await getSaleDetail(saleId);

  if (!sale) {
    notFound();
  }

  return <SaleDetail sale={sale} />;
}
