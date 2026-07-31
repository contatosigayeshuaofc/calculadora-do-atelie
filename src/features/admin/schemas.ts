import { z } from "zod";
import type { AccessStatus } from "@/types/database";
import { getUserFacingErrorMessage } from "@/lib/errors/user-facing-error";

export const DEFAULT_ADMIN_EMAIL = "admin@atelielucrativo.com";

const managedAccessStatusSchema = z.enum(["active", "suspended"], {
  error: "Escolha aprovar ou cancelar o acesso.",
});

const createUserSchema = z.object({
  accessStatus: managedAccessStatusSchema.default("active"),
  atelierName: z.string().trim().optional(),
  email: z.string().trim().toLowerCase().email("Digite um e-mail válido."),
  fullName: z.string().trim().min(2, "Digite o nome da cliente."),
  password: z.string().min(6, "A senha temporária precisa ter pelo menos 6 caracteres."),
  whatsapp: z.string().trim().optional(),
});

const updateAccessSchema = z.object({
  accessStatus: managedAccessStatusSchema,
  userId: z.string().uuid("Usuário inválido."),
});

const deleteUserSchema = z.object({
  userId: z.string().uuid("Usuário inválido."),
});

export type ManagedAccessStatus = Extract<AccessStatus, "active" | "suspended">;

export type CreateManualUserInput = z.infer<typeof createUserSchema>;

export type UpdateAccessInput = z.infer<typeof updateAccessSchema>;

export type DeleteUserInput = z.infer<typeof deleteUserSchema>;

export function parseAdminEmails(value: string | undefined) {
  void value;

  return new Set([DEFAULT_ADMIN_EMAIL]);
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

export function parseDeleteUserFormData(input: Record<string, FormDataEntryValue | string | undefined>): DeleteUserInput {
  return deleteUserSchema.parse({
    userId: input.userId,
  });
}

export function getAdminFormError(error: unknown) {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message ?? "Revise os dados.";
  }

  if (error instanceof Error) {
    return getUserFacingErrorMessage(error, "Não foi possível concluir a ação. Tente novamente.");
  }

  return "Não foi possível concluir a ação.";
}
