import { z } from "zod";

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
    fullName: z.string().trim().min(2, "Digite seu nome."),
    minimumMultiplier: multiplierFromString("Multiplicador minimo"),
    recommendedMultiplier: multiplierFromString("Multiplicador recomendado"),
    whatsapp: optionalTrimmedString,
  })
  .superRefine((value, context) => {
    if (value.recommendedMultiplier < value.minimumMultiplier) {
      context.addIssue({
        code: "custom",
        message:
          "O multiplicador recomendado precisa ser igual ou maior que o minimo.",
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
    return error.issues[0]?.message ?? "Revise suas configuracoes.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Nao foi possivel salvar as configuracoes.";
}
