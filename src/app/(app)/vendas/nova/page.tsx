import Link from "next/link";
import { Plus } from "lucide-react";
import { SaleForm } from "@/components/sales/sale-form";
import { Button, EmptyState } from "@/components/ui";
import { getSaleFormOptions } from "@/features/sales/queries";

export default async function NewSalePage() {
  const { currencyCode, customers, products } = await getSaleFormOptions();

  if (products.length === 0) {
    return (
      <EmptyState
        action={
          <Link href="/produtos/novo">
            <Button leftIcon={<Plus className="h-4 w-4" />}>
              Cadastrar produto
            </Button>
          </Link>
        }
        description="Cadastre pelo menos um produto ativo para registrar pedidos."
        title="Nenhum produto para vender"
      />
    );
  }

  return <SaleForm currencyCode={currencyCode} customers={customers} products={products} />;
}
