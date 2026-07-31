import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CustomerForm } from "./customer-form";

describe("CustomerForm", () => {
  it("formats WhatsApp and removes typed text", () => {
    render(<CustomerForm />);

    const whatsapp = screen.getByRole("textbox", { name: "WhatsApp" });

    fireEvent.change(whatsapp, {
      target: { value: "abc11999998888texto" },
    });

    expect(whatsapp).toHaveValue("+55 (11) 99999-8888");
  });

  it("does not show birthday field", () => {
    render(<CustomerForm />);

    expect(screen.queryByLabelText(/Aniversário/i)).not.toBeInTheDocument();
  });
});
