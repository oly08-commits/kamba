export default function formatDate(value: string): string {
  const date = new Date(value.replace(" ", "T"));

  return date.toLocaleString("pt-AO", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
