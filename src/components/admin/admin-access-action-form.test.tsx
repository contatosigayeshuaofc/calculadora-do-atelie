import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AdminAccessActionForm } from "./admin-access-action-form";

vi.mock("@/features/admin/actions", () => ({
  updateUserAccessAction: async () => ({ message: "", status: "idle" }),
}));

describe("AdminAccessActionForm", () => {
  it("renders a clear approval action without exposing technical fields", () => {
    render(<AdminAccessActionForm actionLabel="Aprovar" status="active" userId="11111111-1111-4111-8111-111111111111" />);

    expect(screen.getByRole("button", { name: "Aprovar" })).toBeInTheDocument();
    expect(screen.queryByText("userId")).not.toBeInTheDocument();
    expect(screen.queryByText("accessStatus")).not.toBeInTheDocument();
  });
});
