import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Select } from "./select";
import { Textarea } from "./textarea";

describe("form controls", () => {
  it("keeps labels readable on the dark member-area theme", () => {
    render(
      <>
        <Select label="Status" name="status">
          <option>Ativo</option>
        </Select>
        <Textarea label="Observações" name="notes" />
      </>,
    );

    expect(screen.getByText("Status")).toHaveClass("text-[color:var(--color-cream)]");
    expect(screen.getByText("Observações")).toHaveClass("text-[color:var(--color-cream)]");
  });
});
