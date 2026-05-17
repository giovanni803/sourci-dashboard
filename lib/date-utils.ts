import {
  startOfISOWeek,
  endOfISOWeek,
  getISOWeek,
  getISOWeekYear,
  format,
  differenceInCalendarDays,
  addMonths,
  startOfMonth,
  isAfter,
  isBefore,
  subDays,
  parseISO,
} from "date-fns";
import { getStartDate } from "./config";

export function isoWeekBounds(d: Date = new Date()) {
  const start = startOfISOWeek(d);
  const end = endOfISOWeek(d);
  return {
    weekStart: format(start, "yyyy-MM-dd"),
    weekEnd: format(end, "yyyy-MM-dd"),
    isoYear: getISOWeekYear(d),
    isoWeek: getISOWeek(d),
    label: `Week ${getISOWeek(d)}, ${getISOWeekYear(d)}`,
    rangeLabel: `${format(start, "d MMM")} – ${format(end, "d MMM yyyy")}`,
  };
}

export function currentMonthIndex(): number {
  const start = getStartDate();
  const now = new Date();
  if (isBefore(now, start)) return 0;
  let m = 1;
  while (m < 24 && isAfter(now, addMonths(start, m))) m++;
  return m;
}

export function currentQuarterIndex(): 1 | 2 | 3 | 4 {
  const start = getStartDate();
  const now = new Date();
  if (isBefore(now, start)) return 1;
  const monthsElapsed = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  const q = Math.floor(monthsElapsed / 3) + 1;
  return (Math.min(Math.max(q, 1), 4)) as 1 | 2 | 3 | 4;
}

export function quarterBounds(quarterIndex: 1 | 2 | 3 | 4) {
  const start = startOfMonth(getStartDate());
  const qStart = addMonths(start, (quarterIndex - 1) * 3);
  const qEnd = subDays(addMonths(qStart, 3), 1);
  return { start: qStart, end: qEnd };
}

export function annualBounds() {
  const start = startOfMonth(getStartDate());
  const end = subDays(addMonths(start, 12), 1);
  return { start, end };
}

export function daysSinceStart(): number {
  return differenceInCalendarDays(new Date(), getStartDate());
}

export function formatDateShort(d: string | Date): string {
  const date = typeof d === "string" ? parseISO(d) : d;
  return format(date, "d MMM yyyy");
}

export function isWithin(dateStr: string, start: Date, end: Date): boolean {
  const d = parseISO(dateStr);
  return !isBefore(d, start) && !isAfter(d, end);
}
