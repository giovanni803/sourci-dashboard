import { format, parseISO } from "date-fns";

export function formatDateShort(d: string | Date): string {
  const date = typeof d === "string" ? parseISO(d) : d;
  return format(date, "d MMM yyyy");
}
