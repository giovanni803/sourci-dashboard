import { differenceInCalendarDays } from "date-fns";
import { getSalesCycleStartDate } from "./config";
import { PHASE_LABELS, PHASE_LENGTH_DAYS, PhaseInfo, SalesCyclePhase } from "./sales-cycle-data";

function phaseAt(daysSinceStart: number): { phase: SalesCyclePhase; index: 0 | 1 | 2 | 3 } {
  if (daysSinceStart < PHASE_LENGTH_DAYS) return { phase: "M1", index: 0 };
  if (daysSinceStart < PHASE_LENGTH_DAYS * 2) return { phase: "M2", index: 1 };
  if (daysSinceStart < PHASE_LENGTH_DAYS * 3) return { phase: "M3", index: 2 };
  return { phase: "steady", index: 3 };
}

export function getSalesCyclePhase(now: Date = new Date()): PhaseInfo {
  const start = getSalesCycleStartDate();
  const daysSinceStart = Math.max(0, differenceInCalendarDays(now, start));
  const { phase, index } = phaseAt(daysSinceStart);

  const daysInPhase = daysSinceStart - index * PHASE_LENGTH_DAYS;
  const daysUntilNext = phase === "steady" ? null : (index + 1) * PHASE_LENGTH_DAYS - daysSinceStart;
  const nextPhase: SalesCyclePhase | null =
    phase === "M1" ? "M2" : phase === "M2" ? "M3" : phase === "M3" ? "steady" : null;

  return {
    phase,
    label: PHASE_LABELS[phase].full,
    shortLabel: PHASE_LABELS[phase].short,
    index,
    daysIn: daysInPhase,
    daysUntilNext,
    nextLabel: nextPhase ? PHASE_LABELS[nextPhase].full : null,
  };
}
