import { describe, expect, test } from "vitest";
import {
  DEFAULT_ADMIN_EMAIL,
  canAdminAccess,
  parseAdminEmails,
  parseCreateUserFormData,
  parseUpdateAccessFormData,
} from "./schemas";

describe("admin schemas", () => {
  test("keeps the official owner email as an admin by default", () => {
    const admins = parseAdminEmails(undefined);

    expect(canAdminAccess(DEFAULT_ADMIN_EMAIL.toUpperCase(), admins)).toBe(true);
    expect(canAdminAccess("cliente@atelielucrativo.com", admins)).toBe(false);
  });

  test("matches admin email list case-insensitively", () => {
    const admins = parseAdminEmails("dona@atelie.com, financeiro@atelie.com");

    expect(canAdminAccess("DONA@ATELIE.COM", admins)).toBe(true);
    expect(canAdminAccess("cliente@atelie.com", admins)).toBe(false);
  });

  test("normalizes manual user creation fields", () => {
    const parsed = parseCreateUserFormData({
      atelierName: "  Velas da Ana ",
      email: " ANA@EXEMPLO.COM ",
      fullName: " Ana Souza ",
      password: "segredo123",
      whatsapp: " 11999999999 ",
    });

    expect(parsed).toEqual({
      accessStatus: "active",
      atelierName: "Velas da Ana",
      email: "ana@exemplo.com",
      fullName: "Ana Souza",
      password: "segredo123",
      whatsapp: "11999999999",
    });
  });

  test("accepts only admin-managed access status updates", () => {
    expect(parseUpdateAccessFormData({ accessStatus: "active", userId: crypto.randomUUID() })).toMatchObject({
      accessStatus: "active",
    });

    expect(() => parseUpdateAccessFormData({ accessStatus: "pending", userId: crypto.randomUUID() })).toThrow(
      "Escolha aprovar ou cancelar o acesso.",
    );
  });
});
