import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MobileNav } from "./mobile-nav";
import { Sidebar } from "./sidebar";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

const mockedUsePathname = vi.mocked(usePathname);

describe("app navigation", () => {
  beforeEach(() => {
    mockedUsePathname.mockReturnValue("/produtos/abc/editar");
  });

  it("marks the matching section as current in the sidebar", () => {
    render(<Sidebar />);

    expect(screen.getByRole("link", { name: "Produtos" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Painel" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("marks the matching section as current in the mobile navigation", () => {
    render(<MobileNav />);

    expect(screen.getByRole("link", { name: "Produtos" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Painel" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("sends the pricing shortcut to the product calculator flow", () => {
    render(<Sidebar />);

    expect(screen.getByRole("link", { name: "Precificar" })).toHaveAttribute(
      "href",
      "/produtos/novo",
    );
  });
});
