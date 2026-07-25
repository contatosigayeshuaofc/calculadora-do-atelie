"use client";

import { useActionState, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Calculator, Plus, Save, Trash2 } from "lucide-react";
import { calculateProductPricing } from "@/features/pricing/calculate-product-pricing";
import type { ProductDetail } from "@/features/products/types";
import {
  buildProductPricingInput,
  parseProductFormData,
} from "@/features/products/schemas";
import { inferProductMultipliers } from "@/features/products/product-multipliers";
import {
  getCostItemMarketSuggestion,
  otherBatchCostSuggestion,
  packagingCostSuggestion,
} from "@/features/products/market-consumption-suggestions";
import { Button, Input, Textarea } from "@/components/ui";
import { formatCurrency } from "@/lib/currency/format-currency";
import { parseCurrencyInput } from "@/lib/currency/parse-currency-input";
import {
  formatCurrencyFromDigits,
  sanitizeDecimalInput,
  sanitizeIntegerInput,
} from "@/lib/forms/numeric-input";
import { saveProductAction } from "@/features/products/actions";
import { PriceSummary } from "./price-summary";
import { cn } from "@/lib/cn";

type ProductFormProps = {
  categories?: string[];
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

const saleUnitOptions = [
  {
    value: "unidade",
    label: "Unidade",
    hint: "Vela, sabonete, difusor ou peça vendida individualmente.",
  },
  {
    value: "kit",
    label: "Kit",
    hint: "Conjunto fechado vendido como um único produto.",
  },
  {
    value: "caixa",
    label: "Caixa",
    hint: "Caixa pronta com uma ou mais peças dentro.",
  },
  {
    value: "pacote",
    label: "Pacote",
    hint: "Sachês, tags, amostras ou itens agrupados.",
  },
  {
    value: "duzia",
    label: "Dúzia",
    hint: "Lote de 12 peças vendido junto.",
  },
];

const materialUnitOptions = [
  { value: "g", label: "g" },
  { value: "kg", label: "kg" },
  { value: "ml", label: "ml" },
  { value: "L", label: "L" },
  { value: "un", label: "un" },
  { value: "m", label: "m" },
  { value: "cm", label: "cm" },
];

export function ProductForm({
  categories = [],
  minimumMultiplier,
  product,
  recommendedMultiplier,
}: ProductFormProps) {
  const [step, setStep] = useState(0);
  const [stepMessage, setStepMessage] = useState<string | null>(null);
  const [isStepChanging, setIsStepChanging] = useState(false);
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
    setStepMessage(null);
    setForm((current) => ({ ...current, [name]: value }));
  }

  function updateCostItem(
    index: number,
    name: keyof CostItemDraft,
    value: string,
  ) {
    setStepMessage(null);
    setCostItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [name]: value } : item,
      ),
    );
  }

  function removeCostItem(index: number) {
    setStepMessage(null);
    setCostItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function goToStep(nextStep: number) {
    if (nextStep <= step) {
      setStepMessage(null);
      setStep(nextStep);
      return;
    }

    const error = getProductFormStepError(step, form, costItems);
    if (error) {
      setStepMessage(error);
      return;
    }

    setStepMessage(null);
    setIsStepChanging(true);
    setStep(nextStep);
    window.setTimeout(() => setIsStepChanging(false), 250);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section className="rounded-[var(--radius-sm)] border border-[color:var(--color-card-border)] bg-[color:var(--color-card)] p-4 shadow-[var(--shadow-floating)] sm:p-5">
        {isStepChanging || isPending ? (
          <LoadingOverlay
            label={isPending ? "Salvando produto..." : "Carregando próxima etapa..."}
          />
        ) : null}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--color-card-border)] pb-4">
          <div>
            <p className="text-xs font-normal uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">
              Etapa {step + 1} de 3
            </p>
            <h1 className="mt-1 font-medium text-2xl text-[color:var(--color-cream)]">
              {["Produto", "Custos", "Preço"][step]}
            </h1>
          </div>
          <div className="flex gap-1 rounded-[var(--radius-sm)] bg-[rgba(196,168,130,0.12)] p-1">
            {[0, 1, 2].map((item) => (
              <button
                aria-label={`Ir para etapa ${item + 1}`}
                className={`h-2.5 w-9 rounded-full ${
                  item === step
                    ? "bg-[color:var(--color-gold)]"
                    : "bg-[color:var(--color-card-border)]"
                }`}
                key={item}
                onClick={() => goToStep(item)}
                type="button"
              />
            ))}
          </div>
        </div>

        <div className="mt-5">
          {step === 0 ? (
            <ProductFields
              categories={categories}
              form={form}
              updateField={updateField}
            />
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
              product={product}
              pricing={pricing}
              settings={{
                minimumMultiplier,
                recommendedMultiplier,
              }}
              updateField={updateField}
            />
          ) : null}
        </div>

        {stepMessage ? (
          <p className="mt-4 rounded-[var(--radius-sm)] bg-[rgba(160,82,70,0.12)] px-3 py-2 text-sm font-medium text-[color:var(--color-danger)]" role="alert">
            {stepMessage}
          </p>
        ) : null}

        {state.message ? (
          <p className="mt-4 rounded-[var(--radius-sm)] bg-[rgba(160,82,70,0.12)] px-3 py-2 text-sm font-semibold text-[color:var(--color-danger)]">
            {state.message}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Button
            disabled={step === 0}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => goToStep(Math.max(0, step - 1))}
            type="button"
            variant="secondary"
          >
            Voltar
          </Button>
          {step < 2 ? (
            <Button
              className="w-full sm:w-auto"
              isLoading={isStepChanging}
              onClick={() => goToStep(Math.min(2, step + 1))}
              rightIcon={<ArrowRight className="h-4 w-4" />}
              type="button"
            >
              Continuar
            </Button>
          ) : (
            <form action={action}>
              <input name="payload" type="hidden" value={JSON.stringify(payload)} />
              <Button
                className="w-full sm:w-auto"
                isLoading={isPending}
                leftIcon={<Save className="h-4 w-4" />}
                type="submit"
              >
                Salvar produto
              </Button>
            </form>
          )}
        </div>
      </section>

      {pricing ? (
        <PriceSummary result={pricing} />
      ) : (
        <aside className="rounded-[var(--radius-sm)] border border-dashed border-[color:var(--color-card-border)] bg-[color:var(--color-card)] p-4 text-sm text-[color:var(--color-text-muted)] shadow-[var(--shadow-floating)]">
          Preencha os dados para ver o resumo de preço.
        </aside>
      )}
    </div>
  );
}

function LoadingOverlay({ label }: { label: string }) {
  return (
    <div
      aria-live="polite"
      className="fixed inset-0 z-50 grid place-items-center bg-[rgba(13,11,10,0.62)] px-4 backdrop-blur-sm"
      role="status"
    >
      <div className="w-full max-w-xs rounded-[var(--radius-sm)] border border-[color:var(--color-card-border)] bg-[color:var(--color-card)] p-5 text-center shadow-[var(--shadow-floating)]">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[rgba(196,168,130,0.24)] border-t-[color:var(--color-gold)]" />
        <p className="mt-3 text-sm font-medium text-[color:var(--color-cream)]">
          {label}
        </p>
      </div>
    </div>
  );
}

function ProductFields({
  categories,
  form,
  updateField,
}: {
  categories: string[];
  form: ProductFormDraft;
  updateField: (name: keyof ProductFormDraft, value: string) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Input
        label="Nome do produto"
        onChange={(event) => updateField("name", event.target.value)}
        placeholder="Ex.: Vela aromática lavanda 180g"
        value={form.name}
      />
      <CategoryField
        categories={categories}
        value={form.category}
        onChange={(value) => updateField("category", value)}
      />
      <SaleUnitField
        value={form.saleUnit}
        onChange={(value) => updateField("saleUnit", value)}
      />
      <Input
        inputMode="numeric"
        label="Rendimento do lote"
        hint="Informe quantas unidades vendáveis saem de uma produção completa. Ex.: se uma receita rende 12 velas prontas, coloque 12."
        onChange={(event) =>
          updateField("batchYield", sanitizeIntegerInput(event.target.value))
        }
        placeholder="Ex.: 12"
        value={form.batchYield}
      />
      <div className="md:col-span-2">
        <Textarea
          label="Descrição"
          placeholder="Informações úteis sobre aroma, tamanho, composição ou observações de produção."
          onChange={(event) => updateField("description", event.target.value)}
          value={form.description}
        />
      </div>
    </div>
  );
}

function CategoryField({
  categories,
  onChange,
  value,
}: {
  categories: string[];
  onChange: (value: string) => void;
  value: string;
}) {
  const normalizedCategories = categories.filter(Boolean);
  const [isCreating, setIsCreating] = useState(
    () =>
      normalizedCategories.length === 0 ||
      (Boolean(value) && !normalizedCategories.includes(value)),
  );

  return (
    <div className="md:col-span-2">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[color:var(--color-cream)]">
          Categoria
        </p>
        {normalizedCategories.length > 0 ? (
          <button
            className="text-xs font-medium text-[color:var(--color-gold)] hover:text-[color:var(--color-cream)]"
            onClick={() => {
              setIsCreating((current) => !current);
              if (!isCreating) {
                onChange("");
              }
            }}
            type="button"
          >
            {isCreating ? "Escolher existente" : "Criar categoria"}
          </button>
        ) : null}
      </div>

      {!isCreating && normalizedCategories.length > 0 ? (
        <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {normalizedCategories.map((category) => (
            <button
              className={cn(
                "min-h-11 rounded-[var(--radius-sm)] border px-3 py-2 text-left text-sm font-medium transition",
                value === category
                  ? "border-[color:var(--color-gold)] bg-[rgba(196,168,130,0.18)] text-[color:var(--color-cream)]"
                  : "border-[color:var(--color-card-border)] bg-[rgba(24,21,18,0.3)] text-[color:var(--color-text-muted)] hover:border-[color:var(--color-gold)] hover:text-[color:var(--color-cream)]",
              )}
              key={category}
              onClick={() => onChange(category)}
              type="button"
            >
              {category}
            </button>
          ))}
        </div>
      ) : (
        <Input
          hint="Use algo simples, como Velas, Sabonetes, Difusores, Kits ou Presentes. Depois essa categoria aparece como opção."
          onChange={(event) => onChange(event.target.value)}
          placeholder="Ex.: Velas"
          value={value}
        />
      )}

      {normalizedCategories.length === 0 ? (
        <p className="mt-2 text-xs text-[color:var(--color-text-muted)]">
          Essa será a primeira categoria salva no seu ateliê.
        </p>
      ) : null}
    </div>
  );
}

function SaleUnitField({
  onChange,
  value,
}: {
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <div className="md:col-span-2">
      <p className="text-sm font-medium text-[color:var(--color-cream)]">
        Unidade de venda
      </p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3" role="radiogroup" aria-label="Unidade de venda">
        {saleUnitOptions.map((option) => (
          <button
            aria-checked={value === option.value}
            key={option.value}
            onClick={() => onChange(option.value)}
            role="radio"
            type="button"
            className={cn(
              "block min-h-[76px] rounded-[var(--radius-sm)] border px-3 py-2 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(196,168,130,0.22)]",
              value === option.value
                ? "border-[color:var(--color-gold)] bg-[rgba(196,168,130,0.18)]"
                : "border-[color:var(--color-card-border)] bg-[rgba(24,21,18,0.3)] hover:border-[color:var(--color-gold)]",
            )}
          >
            <span className="block text-sm font-medium text-[color:var(--color-cream)]">
              {option.label}
            </span>
            <span className="mt-1 block text-xs leading-5 text-[color:var(--color-text-muted)]">
              {option.hint}
            </span>
          </button>
        ))}
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
    <div className="rounded-[var(--radius-sm)] border border-[color:var(--color-card-border)] bg-[rgba(24,21,18,0.3)] p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-[color:var(--color-cream)]">
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
        <MaterialUnitField
          onChange={(value) => updateCostItem(index, "unitMeasure", value)}
          value={item.unitMeasure}
        />
        <Input
          hint={suggestion.purchaseQuantityHint}
          inputMode="decimal"
          label="Qtd comprada"
          onChange={(event) =>
            updateCostItem(
              index,
              "purchaseQuantity",
              sanitizeDecimalInput(event.target.value),
            )
          }
          value={item.purchaseQuantity}
        />
        <Input
          hint={suggestion.usedQuantityHint}
          inputMode="decimal"
          label="Qtd usada"
          onChange={(event) =>
            updateCostItem(
              index,
              "usedQuantity",
              sanitizeDecimalInput(event.target.value),
            )
          }
          value={item.usedQuantity}
        />
        <Input
          className="md:col-span-2"
          hint={suggestion.purchasePriceHint}
          inputMode="decimal"
          label="Preço da compra"
          onChange={(event) =>
            updateCostItem(
              index,
              "purchasePrice",
              formatCurrencyFromDigits(event.target.value),
            )
          }
          value={item.purchasePrice}
        />
      </div>
    </div>
  );
}

function MaterialUnitField({
  onChange,
  value,
}: {
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-[color:var(--color-cream)]">
        Unidade
      </p>
      <p className="mt-1 text-xs leading-5 text-[color:var(--color-text-muted)]">
        Use a mesma unidade da compra e do consumo.
      </p>
      <div className="mt-2 grid grid-cols-4 gap-1.5 sm:grid-cols-3 md:grid-cols-4">
        {materialUnitOptions.map((option) => (
          <button
            aria-checked={value === option.value}
            key={option.value}
            onClick={() => onChange(option.value)}
            role="radio"
            type="button"
            className={cn(
              "flex h-9 items-center justify-center rounded-[var(--radius-sm)] border text-xs font-medium transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(196,168,130,0.22)]",
              value === option.value
                ? "border-[color:var(--color-gold)] bg-[rgba(196,168,130,0.18)] text-[color:var(--color-cream)]"
                : "border-[color:var(--color-card-border)] bg-[rgba(24,21,18,0.3)] text-[color:var(--color-text-muted)] hover:border-[color:var(--color-gold)] hover:text-[color:var(--color-cream)]",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function PriceFields({
  form,
  product,
  pricing,
  settings,
  updateField,
}: {
  form: ProductFormDraft;
  product?: ProductDetail | null;
  pricing: ReturnType<typeof calculateProductPricing> | null;
  settings: {
    minimumMultiplier: number;
    recommendedMultiplier: number;
  };
  updateField: (name: keyof ProductFormDraft, value: string) => void;
}) {
  function applyCurrentSettings() {
    updateField(
      "minimumMultiplier",
      String(settings.minimumMultiplier).replace(".", ","),
    );
    updateField(
      "recommendedMultiplier",
      String(settings.recommendedMultiplier).replace(".", ","),
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Input
        hint={packagingCostSuggestion}
        inputMode="decimal"
        label="Custo de embalagem por unidade"
        onChange={(event) =>
          updateField(
            "packagingCostPerUnit",
            formatCurrencyFromDigits(event.target.value),
          )
        }
        value={form.packagingCostPerUnit}
      />
      <Input
        hint={otherBatchCostSuggestion}
        inputMode="decimal"
        label="Outros custos do lote"
        onChange={(event) =>
          updateField(
            "additionalBatchCost",
            formatCurrencyFromDigits(event.target.value),
          )
        }
        value={form.additionalBatchCost}
      />
      <Input
        inputMode="decimal"
        label="Multiplicador mínimo"
        onChange={(event) =>
          updateField("minimumMultiplier", sanitizeDecimalInput(event.target.value))
        }
        value={form.minimumMultiplier}
      />
      <Input
        inputMode="decimal"
        label="Multiplicador recomendado"
        onChange={(event) =>
          updateField(
            "recommendedMultiplier",
            sanitizeDecimalInput(event.target.value),
          )
        }
        value={form.recommendedMultiplier}
      />
      {product ? (
        <div className="md:col-span-2 rounded-[var(--radius-sm)] bg-[rgba(196,168,130,0.12)] p-4 text-sm text-[color:var(--color-text-muted)]">
          Produtos já salvos mantêm os preços atuais. Use o botão abaixo
          somente se quiser recalcular este produto com os multiplicadores das
          configurações.
          <Button
            className="mt-3"
            leftIcon={<Calculator className="h-4 w-4" />}
            onClick={applyCurrentSettings}
            type="button"
            variant="secondary"
          >
            Recalcular este produto
          </Button>
        </div>
      ) : null}
      <Input
        inputMode="decimal"
        label="Preço praticado"
        onChange={(event) =>
          updateField("sellingPrice", formatCurrencyFromDigits(event.target.value))
        }
        value={form.sellingPrice}
      />
      <div className="rounded-[var(--radius-sm)] bg-[rgba(196,168,130,0.12)] p-4 text-sm text-[color:var(--color-text-muted)]">
        {pricing
          ? `Preço recomendado: ${formatCurrency(pricing.recommendedPriceCents)}`
          : "O recomendado aparece assim que os custos estiverem completos."}
      </div>
    </div>
  );
}

export function getProductFormStepError(
  step: number,
  form: ProductFormDraft,
  costItems: CostItemDraft[],
) {
  if (step === 0) {
    if (!form.name.trim()) {
      return "Informe o nome do produto para continuar.";
    }

    if (!form.saleUnit.trim()) {
      return "Escolha uma unidade de venda para continuar.";
    }

    const batchYield = Number(form.batchYield.replace(",", "."));
    if (!Number.isFinite(batchYield) || batchYield <= 0) {
      return "Informe quantas unidades prontas esse lote rende.";
    }

    return null;
  }

  if (step === 1) {
    if (costItems.length === 0) {
      return "Adicione pelo menos um material ou custo do produto.";
    }

    const incompleteIndex = costItems.findIndex((item) => {
      const purchaseQuantity = Number(item.purchaseQuantity.replace(",", "."));
      const usedQuantity = Number(item.usedQuantity.replace(",", "."));
      const purchasePriceCents = parseCurrencyInput(item.purchasePrice);

      return (
        !item.name.trim() ||
        !item.unitMeasure.trim() ||
        !Number.isFinite(purchaseQuantity) ||
        purchaseQuantity <= 0 ||
        !Number.isFinite(usedQuantity) ||
        usedQuantity <= 0 ||
        purchasePriceCents <= 0
      );
    });

    if (incompleteIndex >= 0) {
      return `Complete o custo ${incompleteIndex + 1}: item, unidade, quantidade comprada, quantidade usada e preço da compra.`;
    }
  }

  return null;
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
      saleUnit: "",
      batchYield: "",
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
    minimumMultiplier: String(
      inferProductMultipliers(
        {
          minimumPriceCents: product.minimum_price_cents,
          recommendedPriceCents: product.recommended_price_cents,
          unitCostCents: product.unit_cost_cents,
        },
        { minimumMultiplier, recommendedMultiplier },
      ).minimumMultiplier,
    ).replace(".", ","),
    recommendedMultiplier: String(
      inferProductMultipliers(
        {
          minimumPriceCents: product.minimum_price_cents,
          recommendedPriceCents: product.recommended_price_cents,
          unitCostCents: product.unit_cost_cents,
        },
        { minimumMultiplier, recommendedMultiplier },
      ).recommendedMultiplier,
    ).replace(".", ","),
    costItems: product.product_cost_items.map((item) => ({
      name: item.name,
      unitMeasure: item.unit_measure,
      purchaseQuantity: String(Number(item.purchase_quantity)),
      purchasePrice: formatCurrency(item.purchase_price_cents),
      usedQuantity: String(Number(item.used_quantity)),
    })),
  };
}
