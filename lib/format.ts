export function formatCurrency(amount: number): string {
  const rounded = Math.round(amount);
  const formatted = new Intl.NumberFormat("en-US").format(Math.abs(rounded));
  return rounded < 0 ? `-Rs ${formatted}` : `Rs ${formatted}`;
}

export function monthParam(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-01`;
}

export function monthLabel(monthParamStr: string): string {
  // monthParamStr is "YYYY-MM-01"
  const [year, month] = monthParamStr.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function monthNameOnly(monthParamStr: string): string {
  const [year, month] = monthParamStr.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-US", { month: "long" });
}

/** "TODAY", "YESTERDAY", or e.g. "SEP 3" */
export function relativeDayLabel(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((today.getTime() - date.getTime()) / 86_400_000);

  if (diffDays === 0) return "TODAY";
  if (diffDays === 1) return "YESTERDAY";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase();
}

export function timeLabel(isoDateStr: string): string {
  return new Date(isoDateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}