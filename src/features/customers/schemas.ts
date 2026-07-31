import { z } from "zod";
import { getUserFacingErrorMessage } from "@/lib/errors/user-facing-error";
import { normalizeWhatsappForCountry, onlyPhoneDigits } from "@/lib/forms/international-phone-input";
import { getCountryOption, normalizeCountryCode } from "@/lib/localization/countries";

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
    countryCode: z
      .string()
      .optional()
      .transform((value) => normalizeCountryCode(value)),
    whatsapp: optionalTrimmedString,
    instagram: optionalTrimmedString,
    city: optionalTrimmedString,
    birthday: optionalTrimmedString,
    notes: optionalTrimmedString,
  })
  .superRefine((value, context) => {
    const country = getCountryOption(value.countryCode);
    const digits = onlyPhoneDigits(value.whatsapp ?? "");

    if (value.whatsapp && digits.length < Math.min(9, country.localDigits)) {
      context.addIssue({
        code: "custom",
        message: "Informe um WhatsApp com DDI e número completo.",
        path: ["whatsapp"],
      });
    }
  })
  .transform((value) => ({
    customerId: value.customerId || undefined,
    name: value.name,
    whatsapp: normalizeWhatsappForCountry(value.whatsapp, value.countryCode),
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
    lastOrderDate: null,
    totalSpentCents: 0,
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
