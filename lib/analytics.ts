import { parseISO, subDays, format, startOfISOWeek, addWeeks } from "date-fns";
import { WeeklyEntry } from "./db";
import { annualBounds, currentQuarterIndex, isWithin, quarterBounds } from "./date-utils";
import { CONVERSION_BENCHMARKS, QUARTERLY_TARGETS, ANNUAL_TARGETS } from "./targets";

export interface DashboardSnapshot {
  currentQuarter: 1 | 2 | 3 | 4;
  engagementsQuarter: number;
  engagementsQuarterTarget: { min: number; max: number };
  posYtd: number;
  posYtdTarget: { min: number; max: number };
  revenueYtd: number;
  revenueYtdTarget: { min: number; max: number };
  pipelineValueLatest: number;
  samplesActiveLatest: number;
  weeklyActivity: WeeklyActivityRow[];
  cumulative: CumulativeRow[];
  funnel: FunnelView;
}

export interface WeeklyActivityRow {
  weekLabel: string;
  weekStart: string;
  new_prospects_added: number;
  cold_emails_sent: number;
  linkedin_requests_sent: number;
  discovery_calls_completed: number;
  proposals_issued: number;
  tier_a_touches: number;
}

export interface CumulativeRow {
  weekLabel: string;
  weekStart: string;
  engagements: number;
  pos: number;
}

export interface FunnelStep {
  label: string;
  count: number;
  conversion: number | null;
  benchmarkMin: number | null;
  benchmarkMax: number | null;
  status: "green" | "amber" | "red" | "neutral";
}
export interface FunnelView {
  steps: FunnelStep[];
  windowLabel: string;
}

function sum<T>(arr: T[], pick: (x: T) => number): number {
  return arr.reduce((acc, x) => acc + pick(x), 0);
}

function statusFor(actual: number, benchmark: number): "green" | "amber" | "red" {
  if (actual >= benchmark) return "green";
  if (actual >= benchmark * 0.75) return "amber";
  return "red";
}

export function buildSnapshot(entries: WeeklyEntry[]): DashboardSnapshot {
  const sorted = [...entries].sort((a, b) => a.week_start_date.localeCompare(b.week_start_date));
  const latest = sorted[sorted.length - 1];
  const cq = currentQuarterIndex();
  const qb = quarterBounds(cq);
  const ab = annualBounds();

  const inQuarter = sorted.filter((e) => isWithin(e.week_start_date, qb.start, qb.end));
  const inYear = sorted.filter((e) => isWithin(e.week_start_date, ab.start, ab.end));

  const engagementsQuarter = sum(inQuarter, (e) => e.engagements_signed);
  const posYtd = sum(inYear, (e) => e.production_pos_signed);
  const revenueYtd = sum(inYear, (e) => e.production_po_value_aud);

  const quarterTarget = QUARTERLY_TARGETS[cq - 1];
  const engagementsQuarterTarget = quarterTarget.newEngagements;
  const posYtdTarget = ANNUAL_TARGETS.productionPosClosed;
  const revenueYtdTarget = ANNUAL_TARGETS.closedRevenueAud;

  const last8 = sorted.slice(-8);
  const weeklyActivity: WeeklyActivityRow[] = last8.map((e) => ({
    weekStart: e.week_start_date,
    weekLabel: `W${e.iso_week}`,
    new_prospects_added: e.new_prospects_added,
    cold_emails_sent: e.cold_emails_sent,
    linkedin_requests_sent: e.linkedin_requests_sent,
    discovery_calls_completed: e.discovery_calls_completed,
    proposals_issued: e.proposals_issued,
    tier_a_touches: e.tier_a_touches,
  }));

  let runEng = 0;
  let runPo = 0;
  const cumulative: CumulativeRow[] = sorted.map((e) => {
    runEng += e.engagements_signed;
    runPo += e.production_pos_signed;
    return {
      weekStart: e.week_start_date,
      weekLabel: `W${e.iso_week}`,
      engagements: runEng,
      pos: runPo,
    };
  });

  const cutoff = subDays(new Date(), 90);
  const window = sorted.filter((e) => parseISO(e.week_start_date) >= cutoff);
  const outbound = sum(window, (e) => e.cold_emails_sent + e.linkedin_requests_sent);
  const calls = sum(window, (e) => e.discovery_calls_completed);
  const props = sum(window, (e) => e.proposals_issued);
  const engs = sum(window, (e) => e.engagements_signed);
  const pos = sum(window, (e) => e.production_pos_signed);

  const replyRate = outbound > 0 ? calls / outbound / 0.35 : 0;
  const repliesEstimated = outbound > 0 ? calls / 0.35 : 0;
  const qualified = Math.round(calls * 0.5);

  const replyBench = CONVERSION_BENCHMARKS.find((b) => b.key === "coldReply")!;
  const dToQ = CONVERSION_BENCHMARKS.find((b) => b.key === "discoveryToQualified")!;
  const qToP = CONVERSION_BENCHMARKS.find((b) => b.key === "qualifiedToProposal")!;
  const pToE = CONVERSION_BENCHMARKS.find((b) => b.key === "proposalToEngagement")!;
  const eToPo = CONVERSION_BENCHMARKS.find((b) => b.key === "engagementToPo")!;

  function evalStatus(actual: number | null, min: number, max: number): "green" | "amber" | "red" | "neutral" {
    if (actual === null || isNaN(actual)) return "neutral";
    if (actual >= min) return "green";
    if (actual >= min * 0.75) return "amber";
    return "red";
  }

  const callConvActual = outbound > 0 ? calls / outbound : null;
  const qConv = calls > 0 ? qualified / calls : null;
  const pConv = qualified > 0 ? props / qualified : null;
  const eConv = props > 0 ? engs / props : null;
  const poConv = engs > 0 ? pos / engs : null;

  const steps: FunnelStep[] = [
    {
      label: "Prospects contacted",
      count: outbound,
      conversion: null,
      benchmarkMin: null,
      benchmarkMax: null,
      status: "neutral",
    },
    {
      label: "Replies (est.)",
      count: Math.round(repliesEstimated),
      conversion: callConvActual,
      benchmarkMin: replyBench.min,
      benchmarkMax: replyBench.max,
      status: callConvActual == null ? "neutral" : evalStatus(callConvActual, replyBench.min, replyBench.max),
    },
    {
      label: "Discovery calls",
      count: calls,
      conversion: null,
      benchmarkMin: null,
      benchmarkMax: null,
      status: "neutral",
    },
    {
      label: "Qualified",
      count: qualified,
      conversion: qConv,
      benchmarkMin: dToQ.min,
      benchmarkMax: dToQ.max,
      status: qConv == null ? "neutral" : evalStatus(qConv, dToQ.min, dToQ.max),
    },
    {
      label: "Proposals",
      count: props,
      conversion: pConv,
      benchmarkMin: qToP.min,
      benchmarkMax: qToP.max,
      status: pConv == null ? "neutral" : evalStatus(pConv, qToP.min, qToP.max),
    },
    {
      label: "Engagements",
      count: engs,
      conversion: eConv,
      benchmarkMin: pToE.min,
      benchmarkMax: pToE.max,
      status: eConv == null ? "neutral" : evalStatus(eConv, pToE.min, pToE.max),
    },
    {
      label: "Production POs",
      count: pos,
      conversion: poConv,
      benchmarkMin: eToPo.min,
      benchmarkMax: eToPo.max,
      status: poConv == null ? "neutral" : evalStatus(poConv, eToPo.min, eToPo.max),
    },
  ];

  return {
    currentQuarter: cq,
    engagementsQuarter,
    engagementsQuarterTarget,
    posYtd,
    posYtdTarget,
    revenueYtd,
    revenueYtdTarget,
    pipelineValueLatest: latest?.pipeline_value_aud ?? 0,
    samplesActiveLatest: latest?.sample_programs_active ?? 0,
    weeklyActivity,
    cumulative,
    funnel: { steps, windowLabel: "Last 90 days" },
  };
}
