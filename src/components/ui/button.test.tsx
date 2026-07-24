import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("renders its label", () => {
    render(<Button>Salvar</Button>);

    expect(screen.getByRole("button", { name: "Salvar" })).toBeInTheDocument();
  });

  it("is disabled while loading", () => {
    render(<Button isLoading>Salvar</Button>);

    expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
  });
});
