import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SummaryCards } from "./summary-cards";

const summary = {
  activeOrderCount: 1,
  averageTicketCents: 2500,
  customerCount: 3,
  estimatedProfitCents: 4500,
  itemQuantity: 8,
  orderCount: 2,
  pendingAmountCents: 1200,
  pendingAmountIsApproximate: false,
  periodEnd: "2026-07-31",
  periodStart: "2026-07-01",
  recentSales: [],
  revenueCents: 10000,
  topCustomers: [],
  topProducts: [],
  upcomingDeliveries: [],
};

describe("SummaryCards", () => {
  it("shows dashboard labels with Portuguese accents", () => {
    render(<SummaryCards summary={summary} />);

    expect(screen.getByText("Lucro líquido")).toBeInTheDocument();
    expect(screen.getByText("Peças vendidas")).toBeInTheDocument();
    expect(screen.getByText("Ticket médio")).toBeInTheDocument();
    expect(screen.getByText("Pagamentos pendentes")).toBeInTheDocument();
  });

  it("uses floating member-area cards with emoji icons", () => {
    render(<SummaryCards summary={summary} />);

    expect(screen.getByLabelText("Resumo do mês")).toHaveClass("atelier-floating-card");
    expect(screen.getByText("💰")).toBeInTheDocument();
    expect(screen.getByText("✨")).toBeInTheDocument();
  });
});
