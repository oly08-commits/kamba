export default function formatCurrency(value: number): string {
  return `${value.toLocaleString("pt-AO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} Kz`;
}
