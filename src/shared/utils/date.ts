import { format, formatDistance, isToday, isYesterday, startOfDay, endOfDay } from "date-fns";

export function formatDate(date: Date | string, pattern = "dd MMM yyyy"): string {
  return format(new Date(date), pattern);
}

export function formatRelative(date: Date | string): string {
  const d = new Date(date);
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  return formatDistance(d, new Date(), { addSuffix: true });
}

export function getDayRange(date: Date = new Date()): { from: Date; to: Date } {
  return {
    from: startOfDay(date),
    to: endOfDay(date),
  };
}

export function toISODate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}
