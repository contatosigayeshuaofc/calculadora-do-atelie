import { notFound } from "next/navigation";
import { SaleEditForm } from "@/components/sales/sale-edit-form";
import { getSaleDetail } from "@/features/sales/queries";

type EditSalePageProps = {
  params: Promise<{
    saleId: string;
  }>;
};

export default async function EditSalePage({ params }: EditSalePageProps) {
  const { saleId } = await params;
  const sale = await getSaleDetail(saleId);

  if (!sale) {
    notFound();
  }

  return <SaleEditForm sale={sale} />;
}
