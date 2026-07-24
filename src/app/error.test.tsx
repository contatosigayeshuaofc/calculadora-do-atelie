import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AppError from "./error";

describe("AppError", () => {
  it("shows a friendly message instead of technical error details", () => {
    render(
      <AppError
        error={new Error('permission denied for table "profiles"')}
        reset={vi.fn()}
      />,
    );

    expect(screen.getByRole("heading", { name: "Nao foi possivel carregar esta tela" })).toBeVisible();
    expect(screen.getByText(/Tente novamente em alguns instantes/i)).toBeVisible();
    expect(screen.queryByText(/permission denied|profiles|"/i)).not.toBeInTheDocument();
  });
});
