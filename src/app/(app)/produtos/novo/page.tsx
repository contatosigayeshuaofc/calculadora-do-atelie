import Link from "next/link";
import { ProductForm } from "@/components/products/product-form";
import {
  getProductPricingSettings,
  listProductCategories,
} from "@/features/products/queries";

export default async function NewProductPage() {
  const [categories, settings] = await Promise.all([
    listProductCategories(),
    getProductPricingSettings(),
  ]);

  return (
    <div className="space-y-5">
      <div>
        <Link
          className="text-sm font-semibold text-[color:var(--color-text-muted)] hover:text-[color:var(--color-gold)]"
          href="/produtos"
        >
          Voltar para produtos
        </Link>
        <h1 className="mt-3 font-medium text-3xl text-[color:var(--color-cream)]">
          Novo produto
        </h1>
      </div>
      <ProductForm
        categories={categories}
        currencyCode={settings.currencyCode}
        minimumMultiplier={settings.minimumMultiplier}
        recommendedMultiplier={settings.recommendedMultiplier}
      />
    </div>
  );
}
