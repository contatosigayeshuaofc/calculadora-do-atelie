import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/products/product-form";
import {
  getProductDetail,
  getProductPricingSettings,
} from "@/features/products/queries";

type EditProductPageProps = {
  params: Promise<{
    productId: string;
  }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { productId } = await params;
  const [product, settings] = await Promise.all([
    getProductDetail(productId),
    getProductPricingSettings(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-5">
      <div>
        <Link
          className="text-sm font-semibold text-[color:var(--color-text-muted)] hover:text-[color:var(--color-gold)]"
          href={`/produtos/${product.id}` as never}
        >
          Voltar para o produto
        </Link>
        <h1 className="mt-3 font-black text-3xl text-[color:var(--color-cream)]">
          Editar produto
        </h1>
      </div>
      <ProductForm
        minimumMultiplier={settings.minimumMultiplier}
        product={product}
        recommendedMultiplier={settings.recommendedMultiplier}
      />
    </div>
  );
}
