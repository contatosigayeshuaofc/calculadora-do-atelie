import { z } from "zod";
import type { AccessStatus } from "@/types/database";

const managedAccessStatusSchema = z.enum(["active", "suspended"], {
  error: "Escolha aprovar ou cancelar o acesso.",
});

const createUserSchema = z.object({
  accessStatus: managedAccessStatusSchema.default("active"),
  atelierName: z.string().trim().optional(),
  email: z.string().trim().toLowerCase().email("Digite um e-mail valido."),
  fullName: z.string().trim().min(2, "Digite o nome da cliente."),
  password: z.string().min(6, "A senha temporaria precisa ter pelo menos 6 caracteres."),
  whatsapp: z.string().trim().optional(),
});

const updateAccessSchema = z.object({
  accessStatus: managedAccessStatusSchema,
  userId: z.string().uuid("Usuario invalido."),
});

export type ManagedAccessStatus = Extract<AccessStatus, "active" | "suspended">;

export type CreateManualUserInput = z.infer<typeof createUserSchema>;

export type UpdateAccessInput = z.infer<typeof updateAccessSchema>;

export function parseAdminEmails(value: string | undefined) {
  return new Set(
    (value ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function canAdminAccess(email: string | null | undefined, adminEmails: Set<string>) {
  return Boolean(email && adminEmails.has(email.trim().toLowerCase()));
}

export function parseCreateUserFormData(input: Record<string, FormDataEntryValue | string | undefined>): CreateManualUserInput {
  const parsed = createUserSchema.parse({
    accessStatus: input.accessStatus || "active",
    atelierName: input.atelierName,
    email: input.email,
    fullName: input.fullName,
    password: input.password,
    whatsapp: input.whatsapp,
  });

  return {
    ...parsed,
    atelierName: parsed.atelierName || undefined,
    whatsapp: parsed.whatsapp || undefined,
  };
}

export function parseUpdateAccessFormData(input: Record<string, FormDataEntryValue | string | undefined>): UpdateAccessInput {
  return updateAccessSchema.parse({
    accessStatus: input.accessStatus,
    userId: input.userId,
  });
}

export function getAdminFormError(error: unknown) {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message ?? "Revise os dados.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Nao foi possivel concluir a acao.";
}
