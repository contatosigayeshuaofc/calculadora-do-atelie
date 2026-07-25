import { z } from "zod";
import { getUserFacingErrorMessage } from "@/lib/errors/user-facing-error";
import { normalizeBrazilianWhatsapp, onlyPhoneDigits } from "@/lib/forms/phone-input";

const optionalTrimmedString = z
  .string()
  .optional()
  .default("")
  .transform((value) => value.trim())
  .transform((value) => (value ? value : null));

export const customerFormSchema = z
  .object({
    customerId: z.string().uuid().optional().or(z.literal("")),
    name: z.string().trim().min(1, "Informe o nome da cliente."),
    whatsapp: optionalTrimmedString.refine(
      (value) => !value || onlyPhoneDigits(value).length >= 10,
      "Informe um WhatsApp com DDD.",
    ),
    instagram: optionalTrimmedString,
    city: optionalTrimmedString,
    birthday: optionalTrimmedString,
    notes: optionalTrimmedString,
  })
  .transform((value) => ({
    customerId: value.customerId || undefined,
    name: value.name,
    whatsapp: normalizeBrazilianWhatsapp(value.whatsapp),
    instagram: value.instagram,
    city: value.city,
    birthday: null,
    notes: value.notes,
  }));

export type CustomerFormInput = z.input<typeof customerFormSchema>;
export type CustomerFormValues = z.output<typeof customerFormSchema>;

export type CustomerSalesSummary = {
  orderCount: number;
  totalSpentCents: number;
  lastOrderDate: string | null;
};

export function parseCustomerFormData(input: unknown): CustomerFormValues {
  return customerFormSchema.parse(input);
}

export function buildEmptyCustomerSummary(): CustomerSalesSummary {
  return {
    orderCount: 0,
    totalSpentCents: 0,
    lastOrderDate: null,
  };
}

export function getCustomerFormError(error: unknown): string {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message ?? "Revise os dados da cliente.";
  }

  if (error instanceof Error) {
    return getUserFacingErrorMessage(error, "Não foi possível salvar a cliente. Tente novamente.");
  }

  return "Não foi possível salvar a cliente.";
}
