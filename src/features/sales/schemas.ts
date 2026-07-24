import { z } from "zod";
import type { OrderStatus, PaymentStatus } from "@/types/database";
import { parseCurrencyInput } from "@/lib/currency/parse-currency-input";
import { getUserFacingErrorMessage } from "@/lib/errors/user-facing-error";

export const orderStatuses = [
  "quote",
  "awaiting_payment",
  "confirmed",
  "in_production",
  "ready",
  "delivered",
  "canceled",
] as const satisfies readonly OrderStatus[];

export const paymentStatuses = [
  "unpaid",
  "partially_paid",
  "paid",
] as const satisfies readonly PaymentStatus[];

const moneyFromString = z
  .string()
  .default("")
  .transform((value) => parseCurrencyInput(value));

const optionalText = z
  .string()
  .trim()
  .optional()
  .default("")
  .transform((value) => value || null);

export const saleItemFormSchema = z.object({
  productId: z.string().uuid("Selecione um produto."),
  quantity: z.coerce
    .number({ error: "Informe a quantidade." })
    .int("A quantidade precisa ser um numero inteiro.")
    .positive("A quantidade precisa ser maior que zero."),
  unitPrice: moneyFromString,
});

export const saleFormSchema = z
  .object({
    saleId: z.string().uuid().optional().or(z.literal("")),
    customerId: z.string().uuid().optional().or(z.literal("")),
    orderDate: z.string().min(1, "Informe a data do pedido."),
    deliveryDate: z.string().optional().default(""),
    status: z.enum(orderStatuses),
    paymentStatus: z.enum(paymentStatuses),
    paymentMethod: optionalText,
    discount: moneyFromString,
    deliveryFee: moneyFromString,
    notes: optionalText,
    items: z.array(saleItemFormSchema).min(1, "Adicione pelo menos um produto."),
  })
  .superRefine((value, context) => {
    if (value.deliveryDate && value.deliveryDate < value.orderDate) {
      context.addIssue({
        code: "custom",
        message: "A entrega nao pode ser antes da data do pedido.",
        path: ["deliveryDate"],
      });
    }
  })
  .transform((value) => ({
    saleId: value.saleId || undefined,
    customerId: value.customerId || null,
    orderDate: value.orderDate,
    deliveryDate: value.deliveryDate || null,
    status: value.status,
    paymentStatus: value.paymentStatus,
    paymentMethod: value.paymentMethod,
    discountCents: value.discount,
    deliveryFeeCents: value.deliveryFee,
    notes: value.notes,
    items: value.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPriceCents: item.unitPrice,
    })),
  }));

export const saleUpdateSchema = z
  .object({
    saleId: z.string().uuid("Venda nao informada."),
    orderDate: z.string().min(1, "Informe a data do pedido."),
    deliveryDate: z.string().optional().default(""),
    status: z.enum(orderStatuses),
    paymentStatus: z.enum(paymentStatuses),
    paymentMethod: optionalText,
    notes: optionalText,
  })
  .superRefine((value, context) => {
    if (value.deliveryDate && value.deliveryDate < value.orderDate) {
      context.addIssue({
        code: "custom",
        message: "A entrega nao pode ser antes da data do pedido.",
        path: ["deliveryDate"],
      });
    }
  })
  .transform((value) => ({
    ...value,
    deliveryDate: value.deliveryDate || null,
  }));

export type SaleFormValues = z.output<typeof saleFormSchema>;
export type SaleUpdateValues = z.output<typeof saleUpdateSchema>;

export function parseSaleFormData(input: unknown): SaleFormValues {
  return saleFormSchema.parse(input);
}

export function parseSaleUpdateData(input: unknown): SaleUpdateValues {
  return saleUpdateSchema.parse(input);
}

export function getSaleFormError(error: unknown): string {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message ?? "Revise os dados da venda.";
  }

  if (error instanceof Error) {
    return getUserFacingErrorMessage(error, "Nao foi possivel salvar a venda. Tente novamente.");
  }

  return "Nao foi possivel salvar a venda.";
}
