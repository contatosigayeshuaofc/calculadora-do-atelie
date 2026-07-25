import { describe, expect, it } from "vitest";
import { getAccessDecision } from "./access";

const user = { id: "user-1" } as Parameters<typeof getAccessDecision>[1];
const adminUser = {
  app_metadata: {},
  aud: "authenticated",
  created_at: "2026-07-24T00:00:00Z",
  email: "admin@atelielucrativo.com",
  id: "admin-1",
  user_metadata: {
    atelier_name: "Atelie Lucrativo",
    full_name: "Administrador",
  },
} as Parameters<typeof getAccessDecision>[1];

function supabaseWithStatus(access_status: "active" | "pending" | "suspended" | null, id = "user-1") {
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({
            data: access_status
              ? {
                  access_status,
                  activated_at: null,
                  atelier_name: null,
                  created_at: "2026-07-24T00:00:00Z",
                  full_name: null,
                  id,
                  updated_at: "2026-07-24T00:00:00Z",
                  whatsapp: null,
                }
              : null,
          }),
        }),
      }),
    }),
  } as unknown as Parameters<typeof getAccessDecision>[0];
}

describe("getAccessDecision", () => {
  it("libera perfil ativo para o painel", async () => {
    await expect(getAccessDecision(supabaseWithStatus("active"), user)).resolves.toMatchObject({
      destination: "/painel",
      status: "active",
    });
  });

  it("mantem perfil pendente aguardando liberacao", async () => {
    await expect(getAccessDecision(supabaseWithStatus("pending"), user)).resolves.toMatchObject({
      destination: "/aguardando-liberacao",
      status: "pending",
    });
  });

  it("bloqueia perfil suspenso", async () => {
    await expect(getAccessDecision(supabaseWithStatus("suspended"), user)).resolves.toMatchObject({
      destination: "/acesso-suspenso",
      status: "suspended",
    });
  });

  it("libera o administrador para usar o app normal mesmo com perfil pendente", async () => {
    await expect(getAccessDecision(supabaseWithStatus("pending", "admin-1"), adminUser, { isAdmin: true })).resolves.toMatchObject({
      destination: "/painel",
      profile: {
        access_status: "active",
        id: "admin-1",
      },
      status: "active",
    });
  });

  it("cria um perfil interno para o administrador quando ainda nao existe profile", async () => {
    await expect(getAccessDecision(supabaseWithStatus(null), adminUser, { isAdmin: true })).resolves.toMatchObject({
      destination: "/painel",
      profile: {
        access_status: "active",
        atelier_name: "Atelie Lucrativo",
        full_name: "Administrador",
        id: "admin-1",
      },
      status: "active",
    });
  });
});
