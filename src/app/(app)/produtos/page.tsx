import { ProductList } from "@/components/products/product-list";
import { listProducts } from "@/features/products/queries";

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
  const products = await listProducts({
    search: params.busca,
    includeArchived: params.arquivados === "1",
  });

  return (
    <ProductList
      includeArchived={params.arquivados === "1"}
      products={products}
      search={params.busca}
    />
  );
}
