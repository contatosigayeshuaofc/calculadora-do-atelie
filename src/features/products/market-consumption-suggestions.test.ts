import { describe, expect, it } from "vitest";
import {
  getCostItemMarketSuggestion,
  packagingCostSuggestion,
} from "./market-consumption-suggestions";

describe("market consumption suggestions", () => {
  it("suggests fragrance usage for candle cost items", () => {
    const suggestion = getCostItemMarketSuggestion("Essencia de baunilha");

    expect(suggestion.usedQuantityHint).toContain("Velas");
    expect(suggestion.usedQuantityHint).toContain("6% a 10%");
  });

  it("suggests gypsum powder consumption when the item is plaster", () => {
    const suggestion = getCostItemMarketSuggestion("Gesso branco");

    expect(suggestion.usedQuantityHint).toContain("30 a 35 ml");
    expect(suggestion.usedQuantityHint).toContain("100 g");
  });

  it("keeps a general suggestion for unknown material names", () => {
    const suggestion = getCostItemMarketSuggestion("Linha dourada");

    expect(suggestion.purchaseQuantityHint).toContain("pacote");
    expect(suggestion.usedQuantityHint).toContain("saiu do estoque");
  });

  it("explains how to estimate packaging cost per unit", () => {
    expect(packagingCostSuggestion).toContain("caixa");
    expect(packagingCostSuggestion).toContain("divida");
  });
});
