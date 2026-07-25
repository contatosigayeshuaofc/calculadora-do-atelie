import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppHeader } from "./app-header";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

const mockedUsePathname = vi.mocked(usePathname);

describe("AppHeader", () => {
  beforeEach(() => {
    mockedUsePathname.mockReturnValue("/vendas/nova");
  });

  it("shows the current section title", () => {
    render(<AppHeader atelierName="Atelie da Ana" />);

    expect(screen.getByRole("heading", { name: "Vendas" })).toBeInTheDocument();
  });

  it("normalizes the common atelier spelling when the profile was saved without accent", () => {
    render(<AppHeader atelierName="Atelie Lucrativo" />);

    expect(screen.getByText("Ateliê Lucrativo")).toBeInTheDocument();
  });

  it("has an accessible search field name", () => {
    render(<AppHeader atelierName="Ateliê da Ana" />);

    expect(screen.getByRole("searchbox", { name: "Buscar no ateliê" })).toBeInTheDocument();
  });

  it("uses the accented default app name", () => {
    render(<AppHeader />);

    expect(screen.getByText("Calculadora do Ateliê")).toBeInTheDocument();
  });
});
