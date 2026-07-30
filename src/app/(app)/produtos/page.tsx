import { ProductList } from "@/components/products/product-list";
import { getProductPricingSettings, listProducts } from "@/features/products/queries";

type ProductsPageProps = {
  searchParams: Promise<{
    busca?: string;
    arquivados?: string;
  }>;
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;
  const [products, settings] = await Promise.all([
    listProducts({
      search: params.busca,
      includeArchived: params.arquivados === "1",
    }),
    getProductPricingSettings(),
  ]);

  return (
    <ProductList
      currencyCode={settings.currencyCode}
      includeArchived={params.arquivados === "1"}
      products={products}
      search={params.busca}
    />
  );
}
