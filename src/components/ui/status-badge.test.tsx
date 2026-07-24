import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusBadge } from "./status-badge";

describe("StatusBadge", () => {
  it("shows the status text", () => {
    render(<StatusBadge tone="success">Liberado</StatusBadge>);

    expect(screen.getByText("Liberado")).toBeInTheDocument();
  });
});
