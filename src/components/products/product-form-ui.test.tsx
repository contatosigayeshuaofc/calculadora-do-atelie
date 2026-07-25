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
    expect(screen.getByRole("radio", { name: /Unidade/ })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /Kit/ })).toBeInTheDocument();
  });

  it("lets the user choose a different sale unit", () => {
    render(
      <ProductForm
        categories={[]}
        minimumMultiplier={1.5}
        recommendedMultiplier={2}
      />,
    );

    const kitOption = screen.getByRole("radio", { name: /Kit/ });

    fireEvent.click(kitOption);

    expect(kitOption).toBeChecked();
    expect(screen.getByRole("radio", { name: /Unidade/ })).not.toBeChecked();
  });

  it("shows a friendly message when continuing without filling the first step", () => {
    render(
      <ProductForm
        categories={[]}
        minimumMultiplier={1.5}
        recommendedMultiplier={2}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Continuar" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Informe o nome do produto para continuar.",
    );
  });

  it("keeps the continue action out of the final submit form", () => {
    render(
      <ProductForm
        categories={[]}
        minimumMultiplier={1.5}
        recommendedMultiplier={2}
      />,
    );

    expect(screen.getByRole("button", { name: "Continuar" })).toHaveAttribute(
      "type",
      "button",
    );
    expect(document.querySelector("form")).not.toBeInTheDocument();
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
    fireEvent.click(screen.getByRole("radio", { name: /Unidade/ }));
    fireEvent.change(screen.getByPlaceholderText("Ex.: 12"), {
      target: { value: "12" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Continuar" }));

    expect(screen.getByText("Custo 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Item")).toBeInTheDocument();
  });
});
