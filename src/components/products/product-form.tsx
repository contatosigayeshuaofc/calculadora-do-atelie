"use client";

import { useActionState, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Plus, Save, Trash2 } from "lucide-react";
import { calculateProductPricing } from "@/features/pricing/calculate-product-pricing";
import type { ProductDetail } from "@/features/products/types";
import {
  buildProductPricingInput,
  parseProductFormData,
} from "@/features/products/schemas";
import {
  getCostItemMarketSuggestion,
  otherBatchCostSuggestion,
  packagingCostSuggestion,
} from "@/features/products/market-consumption-suggestions";
import { Button, Input, Textarea } from "@/components/ui";
import { formatCurrency } from "@/lib/currency/format-currency";
import { parseCurrencyInput } from "@/lib/currency/parse-currency-input";
import { saveProductAction } from "@/features/products/actions";
import { PriceSummary } from "./price-summary";

type ProductFormProps = {
  product?: ProductDetail | null;
  minimumMultiplier: number;
  recommendedMultiplier: number;
};

type CostItemDraft = {
  name: string;
  unitMeasure: string;
  purchaseQuantity: string;
  purchasePrice: string;
  usedQuantity: string;
};

type ProductFormDraft = {
  productId: string;
  name: string;
  category: string;
  description: string;
  saleUnit: string;
  batchYield: string;
  packagingCostPerUnit: string;
  additionalBatchCost: string;
  sellingPrice: string;
  minimumMultiplier: string;
  recommendedMultiplier: string;
  costItems: CostItemDraft[];
};

const emptyCostItem: CostItemDraft = {
  name: "",
  unitMeasure: "g",
  purchaseQuantity: "",
  purchasePrice: "",
  usedQuantity: "",
};

export function ProductForm({
  minimumMultiplier,
  product,
  recommendedMultiplier,
}: ProductFormProps) {
  const [step, setStep] = useState(0);
  const [state, action, isPending] = useActionState(saveProductAction, {
    status: "idle" as const,
    message: null,
  });
  const [form, setForm] = useState<ProductFormDraft>(() =>
    productToForm(product, minimumMultiplier, recommendedMultiplier),
  );
  const [costItems, setCostItems] = useState<CostItemDraft[]>(
    () => form.costItems ?? [{ ...emptyCostItem }],
  );
  const payload = useMemo(
    () => ({ ...form, costItems, productId: product?.id ?? "" }),
    [costItems, form, product?.id],
  );
  const pricing = useMemo(() => {
    try {
      const parsed = parseProductFormData(payload);
      return calculateProductPricing(buildProductPricingInput(parsed));
    } catch {
      return null;
    }
  }, [payload]);

  function updateField(name: keyof ProductFormDraft, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function updateCostItem(
    index: number,
    name: keyof CostItemDraft,
    value: string,
  ) {
    setCostItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [name]: value } : item,
      ),
    );
  }

  function removeCostItem(index: number) {
    setCostItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <form action={action} className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <input name="payload" type="hidden" value={JSON.stringify(payload)} />
      <section className="rounded-[var(--radius-sm)] border border-[color:var(--color-clay-beige)] bg-white p-4 shadow-[var(--shadow-soft)] sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--color-clay-beige)] pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">
              Etapa {step + 1} de 3
            </p>
            <h1 className="mt-1 font-serif text-2xl text-[color:var(--color-warm-graphite)]">
              {["Produto", "Custos", "Preco"][step]}
            </h1>
          </div>
          <div className="flex gap-1 rounded-[var(--radius-sm)] bg-[color:var(--color-soft-cream)] p-1">
            {[0, 1, 2].map((item) => (
              <button
                aria-label={`Ir para etapa ${item + 1}`}
                className={`h-2.5 w-9 rounded-full ${
                  item === step
                    ? "bg-[color:var(--color-olive)]"
                    : "bg-[color:var(--color-clay-beige)]"
                }`}
                key={item}
                onClick={() => setStep(item)}
                type="button"
              />
            ))}
          </div>
        </div>

        <div className="mt-5">
          {step === 0 ? (
            <ProductFields form={form} updateField={updateField} />
          ) : null}
          {step === 1 ? (
            <CostFields
              costItems={costItems}
              removeCostItem={removeCostItem}
              setCostItems={setCostItems}
              updateCostItem={updateCostItem}
            />
          ) : null}
          {step === 2 ? (
            <PriceFields
              form={form}
              pricing={pricing}
              updateField={updateField}
            />
          ) : null}
        </div>

        {state.message ? (
          <p className="mt-4 rounded-[var(--radius-sm)] bg-[rgba(160,82,70,0.12)] px-3 py-2 text-sm font-semibold text-[color:var(--color-danger)]">
            {state.message}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Button
            disabled={step === 0}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => setStep((current) => Math.max(0, current - 1))}
            type="button"
            variant="secondary"
          >
            Voltar
          </Button>
          {step < 2 ? (
            <Button
              onClick={() => setStep((current) => Math.min(2, current + 1))}
              rightIcon={<ArrowRight className="h-4 w-4" />}
              type="button"
            >
              Continuar
            </Button>
          ) : (
            <Button
              isLoading={isPending}
              leftIcon={<Save className="h-4 w-4" />}
              type="submit"
            >
              Salvar produto
            </Button>
          )}
        </div>
      </section>

      {pricing ? (
        <PriceSummary result={pricing} />
      ) : (
        <aside className="rounded-[var(--radius-sm)] border border-dashed border-[color:var(--color-clay-beige)] bg-white p-4 text-sm text-[color:var(--color-text-muted)]">
          Preencha os dados para ver o resumo de preco.
        </aside>
      )}
    </form>
  );
}

function ProductFields({
  form,
  updateField,
}: {
  form: ProductFormDraft;
  updateField: (name: keyof ProductFormDraft, value: string) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Input
        label="Nome do produto"
        onChange={(event) => updateField("name", event.target.value)}
        value={form.name}
      />
      <Input
        label="Categoria"
        onChange={(event) => updateField("category", event.target.value)}
        value={form.category}
      />
      <Input
        label="Unidade de venda"
        onChange={(event) => updateField("saleUnit", event.target.value)}
        value={form.saleUnit}
      />
      <Input
        inputMode="numeric"
        label="Rendimento do lote"
        onChange={(event) => updateField("batchYield", event.target.value)}
        value={form.batchYield}
      />
      <div className="md:col-span-2">
        <Textarea
          label="Descricao"
          onChange={(event) => updateField("description", event.target.value)}
          value={form.description}
        />
      </div>
    </div>
  );
}

function CostFields({
  costItems,
  removeCostItem,
  setCostItems,
  updateCostItem,
}: {
  costItems: CostItemDraft[];
  removeCostItem: (index: number) => void;
  setCostItems: (items: CostItemDraft[]) => void;
  updateCostItem: (
    index: number,
    name: keyof CostItemDraft,
    value: string,
  ) => void;
}) {
  return (
    <div className="space-y-4">
      {costItems.map((item, index) => (
        <CostItemFields
          costItemsLength={costItems.length}
          index={index}
          item={item}
          key={index}
          removeCostItem={removeCostItem}
          updateCostItem={updateCostItem}
        />
      ))}
      <Button
        leftIcon={<Plus className="h-4 w-4" />}
        onClick={() => setCostItems([...costItems, { ...emptyCostItem }])}
        type="button"
        variant="secondary"
      >
        Adicionar custo
      </Button>
    </div>
  );
}

function CostItemFields({
  costItemsLength,
  index,
  item,
  removeCostItem,
  updateCostItem,
}: {
  costItemsLength: number;
  index: number;
  item: CostItemDraft;
  removeCostItem: (index: number) => void;
  updateCostItem: (
    index: number,
    name: keyof CostItemDraft,
    value: string,
  ) => void;
}) {
  const suggestion = getCostItemMarketSuggestion(item.name);

  return (
    <div className="rounded-[var(--radius-sm)] border border-[color:var(--color-clay-beige)] p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-[color:var(--color-warm-graphite)]">
          Custo {index + 1}
        </p>
        {costItemsLength > 1 ? (
          <Button
            aria-label="Remover custo"
            leftIcon={<Trash2 className="h-4 w-4" />}
            onClick={() => removeCostItem(index)}
            size="icon"
            type="button"
            variant="ghost"
          />
        ) : null}
      </div>
      <div className="grid gap-4 md:grid-cols-5">
        <Input
          className="md:col-span-2"
          hint={suggestion.itemHint}
          label="Item"
          onChange={(event) =>
            updateCostItem(index, "name", event.target.value)
          }
          value={item.name}
        />
        <Input
          hint="Use a mesma unidade da compra e do consumo: g, ml, un, m ou cm."
          label="Unidade"
          onChange={(event) =>
            updateCostItem(index, "unitMeasure", event.target.value)
          }
          value={item.unitMeasure}
        />
        <Input
          hint={suggestion.purchaseQuantityHint}
          inputMode="decimal"
          label="Qtd comprada"
          onChange={(event) =>
            updateCostItem(index, "purchaseQuantity", event.target.value)
          }
          value={item.purchaseQuantity}
        />
        <Input
          hint={suggestion.usedQuantityHint}
          inputMode="decimal"
          label="Qtd usada"
          onChange={(event) =>
            updateCostItem(index, "usedQuantity", event.target.value)
          }
          value={item.usedQuantity}
        />
        <Input
          className="md:col-span-2"
          hint={suggestion.purchasePriceHint}
          inputMode="decimal"
          label="Preco da compra"
          onBlur={(event) =>
            updateCostItem(
              index,
              "purchasePrice",
              formatCurrency(parseCurrencyInput(event.target.value)),
            )
          }
          onChange={(event) =>
            updateCostItem(index, "purchasePrice", event.target.value)
          }
          value={item.purchasePrice}
        />
      </div>
    </div>
  );
}

function PriceFields({
  form,
  pricing,
  updateField,
}: {
  form: ProductFormDraft;
  pricing: ReturnType<typeof calculateProductPricing> | null;
  updateField: (name: keyof ProductFormDraft, value: string) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Input
        hint={packagingCostSuggestion}
        inputMode="decimal"
        label="Custo de embalagem por unidade"
        onBlur={(event) =>
          updateField(
            "packagingCostPerUnit",
            formatCurrency(parseCurrencyInput(event.target.value)),
          )
        }
        onChange={(event) =>
          updateField("packagingCostPerUnit", event.target.value)
        }
        value={form.packagingCostPerUnit}
      />
      <Input
        hint={otherBatchCostSuggestion}
        inputMode="decimal"
        label="Outros custos do lote"
        onBlur={(event) =>
          updateField(
            "additionalBatchCost",
            formatCurrency(parseCurrencyInput(event.target.value)),
          )
        }
        onChange={(event) =>
          updateField("additionalBatchCost", event.target.value)
        }
        value={form.additionalBatchCost}
      />
      <Input
        inputMode="decimal"
        label="Multiplicador minimo"
        onChange={(event) => updateField("minimumMultiplier", event.target.value)}
        value={form.minimumMultiplier}
      />
      <Input
        inputMode="decimal"
        label="Multiplicador recomendado"
        onChange={(event) =>
          updateField("recommendedMultiplier", event.target.value)
        }
        value={form.recommendedMultiplier}
      />
      <Input
        inputMode="decimal"
        label="Preco praticado"
        onBlur={(event) =>
          updateField(
            "sellingPrice",
            formatCurrency(parseCurrencyInput(event.target.value)),
          )
        }
        onChange={(event) => updateField("sellingPrice", event.target.value)}
        value={form.sellingPrice}
      />
      <div className="rounded-[var(--radius-sm)] bg-[color:var(--color-soft-cream)] p-4 text-sm text-[color:var(--color-text-muted)]">
        {pricing
          ? `Preco recomendado: ${formatCurrency(pricing.recommendedPriceCents)}`
          : "O recomendado aparece assim que os custos estiverem completos."}
      </div>
    </div>
  );
}

function productToForm(
  product: ProductDetail | null | undefined,
  minimumMultiplier: number,
  recommendedMultiplier: number,
): ProductFormDraft {
  if (!product) {
    return {
      productId: "",
      name: "",
      category: "",
      description: "",
      saleUnit: "unidade",
      batchYield: "1",
      packagingCostPerUnit: "",
      additionalBatchCost: "",
      sellingPrice: "",
      minimumMultiplier: String(minimumMultiplier).replace(".", ","),
      recommendedMultiplier: String(recommendedMultiplier).replace(".", ","),
      costItems: [{ ...emptyCostItem }],
    };
  }

  return {
    productId: product.id,
    name: product.name,
    category: product.category ?? "",
    description: product.description ?? "",
    saleUnit: product.sale_unit,
    batchYield: String(product.batch_yield),
    packagingCostPerUnit: formatCurrency(product.packaging_cost_per_unit_cents),
    additionalBatchCost: formatCurrency(product.additional_batch_cost_cents),
    sellingPrice: formatCurrency(product.selling_price_cents),
    minimumMultiplier: String(minimumMultiplier).replace(".", ","),
    recommendedMultiplier: String(recommendedMultiplier).replace(".", ","),
    costItems: product.product_cost_items.map((item) => ({
      name: item.name,
      unitMeasure: item.unit_measure,
      purchaseQuantity: String(Number(item.purchase_quantity)),
      purchasePrice: formatCurrency(item.purchase_price_cents),
      usedQuantity: String(Number(item.used_quantity)),
    })),
  };
}
