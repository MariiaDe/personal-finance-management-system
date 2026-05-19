export function formatCurrency(value, currency = "UAH") {
  try {
    return new Intl.NumberFormat("uk-UA", {
      style: "currency",
      currency,
      maximumFractionDigits: 0
    }).format(Number(value || 0));
  } catch {
    return `${Number(value || 0)} ${currency}`;
  }
}
