import { z } from "zod";
import { normalizeCurrencyCode } from "@/lib/currency/supported-currencies";
import { getUserFacingErrorMessage } from "@/lib/errors/user-facing-error";

const multiplierFromString = (field: string) =>
  z
    .string()
    .trim()
    .min(1, `${field} precisa ser informado.`)
    .transform((value) => Number(value.replace(",", ".")))
    .pipe(z.number().positive(`${field} precisa ser maior que zero.`));

const optionalTrimmedString = z
  .string()
  .trim()
  .transform((value) => value || null);

export const settingsFormSchema = z
  .object({
    atelierName: optionalTrimmedString,
    currencyCode: z
      .string()
      .optional()
      .transform((value) => normalizeCurrencyCode(value)),
    fullName: z.string().trim().min(2, "Digite seu nome."),
    minimumMultiplier: multiplierFromString("Multiplicador mínimo"),
    recommendedMultiplier: multiplierFromString("Multiplicador recomendado"),
    whatsapp: optionalTrimmedString,
  })
  .superRefine((value, context) => {
    if (value.recommendedMultiplier < value.minimumMultiplier) {
      context.addIssue({
        code: "custom",
        message:
          "O multiplicador recomendado precisa ser igual ou maior que o mínimo.",
        path: ["recommendedMultiplier"],
      });
    }
  });

export type SettingsFormValues = z.output<typeof settingsFormSchema>;

export function parseSettingsFormData(input: unknown): SettingsFormValues {
  return settingsFormSchema.parse(input);
}

export function getSettingsFormError(error: unknown): string {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message ?? "Revise suas configurações.";
  }

  if (error instanceof Error) {
    return getUserFacingErrorMessage(error, "Não foi possível salvar as configurações. Tente novamente.");
  }

  return "Não foi possível salvar as configurações.";
}
