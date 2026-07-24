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

  it("has an accessible search field name", () => {
    render(<AppHeader atelierName="Atelie da Ana" />);

    expect(screen.getByRole("searchbox", { name: "Buscar no atelie" })).toBeInTheDocument();
  });
});
