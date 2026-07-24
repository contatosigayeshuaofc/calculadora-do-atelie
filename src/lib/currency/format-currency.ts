const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatCurrency(cents: number): string {
  const roundedCents = Math.round(cents);

  return brlFormatter.format(roundedCents / 100);
}
