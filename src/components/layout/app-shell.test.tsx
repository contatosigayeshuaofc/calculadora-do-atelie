import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AppShell } from "./app-shell";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/painel"),
}));

describe("AppShell", () => {
  it("keeps enough bottom space for the fixed mobile navigation", () => {
    render(<AppShell>Conteudo principal</AppShell>);

    expect(screen.getByTestId("app-shell-content")).toHaveClass(
      "pb-[calc(7rem+env(safe-area-inset-bottom))]",
    );
  });
});
