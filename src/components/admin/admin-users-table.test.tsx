import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AdminUsersTable } from "./admin-users-table";
import type { AdminUserSummary } from "@/features/admin/types";

vi.mock("@/features/admin/actions", () => ({
  deleteCanceledUserAction: async () => ({ message: "", status: "idle" }),
  updateUserAccessAction: async () => ({ message: "", status: "idle" }),
}));

function userSummary(overrides: Partial<AdminUserSummary>): AdminUserSummary {
  return {
    activatedAt: null,
    atelierName: "Atelie Teste",
    createdAt: "2026-07-24T12:00:00.000Z",
    email: "cliente@teste.com",
    fullName: "Cliente Teste",
    id: "11111111-1111-4111-8111-111111111111",
    status: "pending",
    whatsapp: "11999999999",
    ...overrides,
  };
}

function getAccessGroup(label: string) {
  const group = screen.getByText(label).closest("details");
  if (!group) {
    throw new Error(`Grupo ${label} não encontrado.`);
  }

  return group;
}

describe("AdminUsersTable", () => {
  it("groups customers by access status so the admin can review active users quickly", () => {
    render(
      <AdminUsersTable
        users={[
          userSummary({ fullName: "Cliente Pendente", id: "11111111-1111-4111-8111-111111111111", status: "pending" }),
          userSummary({ fullName: "Cliente Ativa", id: "22222222-2222-4222-8222-222222222222", status: "active" }),
          userSummary({ fullName: "Cliente Cancelada", id: "33333333-3333-4333-8333-333333333333", status: "suspended" }),
        ]}
      />,
    );

    const pendingGroup = getAccessGroup("Acessos Pendentes");
    const activeGroup = getAccessGroup("Acessos Ativos");
    const suspendedGroup = getAccessGroup("Acessos Cancelados");

    expect(pendingGroup).toBeInTheDocument();
    expect(activeGroup).toBeInTheDocument();
    expect(suspendedGroup).toBeInTheDocument();
    expect(within(pendingGroup).getByText("Cliente Pendente")).toBeInTheDocument();
    expect(within(activeGroup).getByText("Cliente Ativa")).toBeInTheDocument();
    expect(within(suspendedGroup).getByText("Cliente Cancelada")).toBeInTheDocument();
    expect(within(suspendedGroup).getByRole("button", { name: "Excluir" })).toBeInTheDocument();
  });
});
