import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CreateUserForm } from "./create-user-form";

vi.mock("@/features/admin/actions", () => ({
  createManualUserAction: async () => ({ message: "", status: "idle" }),
}));

describe("CreateUserForm", () => {
  it("keeps the temporary password hidden until the admin chooses to show it", async () => {
    render(<CreateUserForm />);

    const passwordInput = screen.getByLabelText("Senha temporária");
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(screen.getByText("Nome do ateliê")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Mínimo 6 caracteres")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Mostrar senha" }));

    expect(passwordInput).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: "Ocultar senha" })).toBeInTheDocument();
  });
});
