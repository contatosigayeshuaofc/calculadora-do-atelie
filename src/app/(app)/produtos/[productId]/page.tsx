import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/products/product-detail";
import { getProductDetail } from "@/features/products/queries";

type ProductPageProps = {
  params: Promise<{
    productId: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params;
  const product = await getProductDetail(productId);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
