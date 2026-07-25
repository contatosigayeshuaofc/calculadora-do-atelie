import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductForm } from "./product-form";

describe("ProductForm", () => {
  it("shows category choices and sale unit blocks on the first step", () => {
    render(
      <ProductForm
        categories={["Velas", "Difusores"]}
        minimumMultiplier={1.5}
        recommendedMultiplier={2}
      />,
    );

    expect(screen.getByRole("button", { name: "Velas" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Difusores" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Unidade/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Kit/ })).toBeInTheDocument();
  });

  it("moves from product basics to costs when required fields are complete", () => {
    render(
      <ProductForm
        categories={[]}
        minimumMultiplier={1.5}
        recommendedMultiplier={2}
      />,
    );

    fireEvent.change(screen.getByLabelText("Nome do produto"), {
      target: { value: "Vela teste" },
    });
    fireEvent.change(screen.getByPlaceholderText("Ex.: 12"), {
      target: { value: "12" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Continuar" }));

    expect(screen.getByText("Custo 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Item")).toBeInTheDocument();
  });
});
