export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

export const displayDate = (value: string) => formatDate(new Date(value));
