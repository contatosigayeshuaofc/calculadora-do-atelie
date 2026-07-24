import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SettingsForm } from "./settings-form";

describe("SettingsForm", () => {
  it("shows profile fields and support email at the bottom", () => {
    render(
      <SettingsForm
        settings={{
          atelierName: "Atelie Lucrativo",
          fullName: "Ana",
          minimumMultiplier: 1.5,
          recommendedMultiplier: 2,
          whatsapp: "11999999999",
        }}
      />,
    );

    expect(screen.getByRole("textbox", { name: "Seu nome" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /WhatsApp/ })).toBeInTheDocument();
    expect(screen.getByText("suporte@ateliearomatico.site")).toBeInTheDocument();
  });
});
