export type CostItemMarketSuggestion = {
  itemHint: string;
  purchaseQuantityHint: string;
  purchasePriceHint: string;
  usedQuantityHint: string;
};

const generalSuggestion: CostItemMarketSuggestion = {
  itemHint:
    "Ex.: cera, essencia, pavio, gesso, resina, tecido, etiqueta, fita ou caixa.",
  purchaseQuantityHint:
    "Informe o total comprado no pacote, frasco, rolo ou saco. Ex.: pacote de 1 kg = 1000 g.",
  purchasePriceHint:
    "Use o valor pago pela compra inteira, incluindo frete quando ele fez parte desse insumo.",
  usedQuantityHint:
    "Informe apenas o que saiu do estoque para este lote. Ex.: comprou 1000 g e usou 80 g.",
};

const rules: Array<{
  keywords: string[];
  suggestion: Partial<CostItemMarketSuggestion>;
}> = [
  {
    keywords: ["essencia", "fragrancia", "aroma", "oleo essencial"],
    suggestion: {
      purchaseQuantityHint:
        "Frascos costumam vir em ml. Cadastre o volume comprado e o valor total do frasco.",
      usedQuantityHint:
        "Velas: use como partida 6% a 10% do peso da cera. Sabonete cold process: 3% a 6% dos oleos; base glicerinada: 2% a 3% do peso da base.",
    },
  },
  {
    keywords: ["cera", "parafina"],
    suggestion: {
      usedQuantityHint:
        "Velas: pese a capacidade do recipiente. Com 8% de essencia, uma vela de 120 g usa cerca de 111 g de cera e 9 g de essencia.",
    },
  },
  {
    keywords: ["gesso", "plaster"],
    suggestion: {
      purchaseQuantityHint:
        "Sacos de gesso normalmente sao cadastrados em gramas. Ex.: 1 kg = 1000 g.",
      usedQuantityHint:
        "Gesso para molde/peca: use como partida 30 a 35 ml de agua para cada 100 g de po. Lance aqui o peso de po usado no lote.",
    },
  },
  {
    keywords: ["pavio", "wick"],
    suggestion: {
      purchaseQuantityHint:
        "Cadastre a quantidade total de pavios do pacote. Ex.: pacote com 100 unidades.",
      usedQuantityHint:
        "Velas em pote geralmente usam 1 pavio por unidade; recipientes largos podem precisar de 2 ou mais apos teste de queima.",
    },
  },
  {
    keywords: ["base", "glicerinada", "sabonete"],
    suggestion: {
      usedQuantityHint:
        "Sabonete glicerinado: some base + fragrancia + corante/aditivos. A fragrancia costuma ficar em 2% a 3% do peso da base.",
    },
  },
  {
    keywords: ["corante", "pigmento", "mica"],
    suggestion: {
      usedQuantityHint:
        "Comece com pouco e pese o consumo real do lote. Pigmentos variam muito por fornecedor e intensidade da cor.",
    },
  },
  {
    keywords: ["resina", "epoxi", "epoxy"],
    suggestion: {
      usedQuantityHint:
        "Resina: pese a mistura pronta usada no lote e respeite a proporcao do fabricante entre resina e endurecedor.",
    },
  },
];

export const packagingCostSuggestion =
  "Inclua caixa, saco, etiqueta, fita, tag e protecao. Se comprou pacote com 100 caixas, divida o valor total por 100.";

export const otherBatchCostSuggestion =
  "Use para custos diretos do lote que nao entram como material unitario: energia do forno, taxa de corte, acabamento terceirizado ou perda medida.";

export function getCostItemMarketSuggestion(
  itemName: string,
): CostItemMarketSuggestion {
  const normalizedItemName = normalize(itemName);
  const matchedRule = rules.find((rule) =>
    rule.keywords.some((keyword) => normalizedItemName.includes(normalize(keyword))),
  );

  return {
    ...generalSuggestion,
    ...matchedRule?.suggestion,
  };
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
