export interface RangeTarget {
  min: number;
  max: number;
}

export interface QuarterlyTarget {
  quarter: "Q1" | "Q2" | "Q3" | "Q4";
  newEngagements: RangeTarget;
  posClosing: RangeTarget;
  revenueClosing: RangeTarget;
}

export interface MonthlyTarget {
  month: 1 | 2 | 3;
  prospectsCumulative: number;
  discoveryCallsCumulative: number;
  proposalsCumulative: number;
  engagementsSigned: RangeTarget;
  activeSamplePrograms: RangeTarget;
  sampleSpendCommitted: number;
  productionPos: RangeTarget;
}

export const ANNUAL_TARGETS = {
  newEngagementsSigned: { min: 11, max: 19 } as RangeTarget,
  productionPosClosed: { min: 5, max: 9 } as RangeTarget,
  closedRevenueAud: { min: 3_000_000, max: 5_000_000 } as RangeTarget,
  pipelineValueAud: 5_000_000,
};

export const QUARTERLY_TARGETS: QuarterlyTarget[] = [
  {
    quarter: "Q1",
    newEngagements: { min: 2, max: 4 },
    posClosing: { min: 0, max: 1 },
    revenueClosing: { min: 0, max: 750_000 },
  },
  {
    quarter: "Q2",
    newEngagements: { min: 3, max: 5 },
    posClosing: { min: 1, max: 2 },
    revenueClosing: { min: 750_000, max: 1_500_000 },
  },
  {
    quarter: "Q3",
    newEngagements: { min: 3, max: 5 },
    posClosing: { min: 2, max: 3 },
    revenueClosing: { min: 1_500_000, max: 2_250_000 },
  },
  {
    quarter: "Q4",
    newEngagements: { min: 3, max: 5 },
    posClosing: { min: 2, max: 3 },
    revenueClosing: { min: 1_500_000, max: 2_250_000 },
  },
];

export const MONTHLY_TARGETS: MonthlyTarget[] = [
  {
    month: 1,
    prospectsCumulative: 200,
    discoveryCallsCumulative: 5,
    proposalsCumulative: 1,
    engagementsSigned: { min: 0, max: 0 },
    activeSamplePrograms: { min: 0, max: 0 },
    sampleSpendCommitted: 0,
    productionPos: { min: 0, max: 0 },
  },
  {
    month: 2,
    prospectsCumulative: 400,
    discoveryCallsCumulative: 12,
    proposalsCumulative: 5,
    engagementsSigned: { min: 1, max: 2 },
    activeSamplePrograms: { min: 1, max: 2 },
    sampleSpendCommitted: 40_000,
    productionPos: { min: 0, max: 1 },
  },
  {
    month: 3,
    prospectsCumulative: 500,
    discoveryCallsCumulative: 18,
    proposalsCumulative: 9,
    engagementsSigned: { min: 2, max: 4 },
    activeSamplePrograms: { min: 2, max: 4 },
    sampleSpendCommitted: 95_000,
    productionPos: { min: 0, max: 1 },
  },
];

export const WEEKLY_ACTIVITY_TARGETS = {
  newProspectsAdded: 30,
  coldEmailsSent: 75,
  linkedinRequestsSent: 75,
  tierATouches: 5,
  discoveryCallsCompleted: { min: 2, max: 3 } as RangeTarget,
  proposalsIssued: { min: 1, max: 2 } as RangeTarget,
};

export interface ConversionBenchmark {
  label: string;
  key: string;
  min: number;
  max: number;
}

export const CONVERSION_BENCHMARKS: ConversionBenchmark[] = [
  { label: "Cold reply rate", key: "coldReply", min: 0.05, max: 0.07 },
  { label: "Reply → discovery call", key: "replyToDiscovery", min: 0.35, max: 0.35 },
  { label: "Discovery → qualified", key: "discoveryToQualified", min: 0.5, max: 0.5 },
  { label: "Qualified → proposal", key: "qualifiedToProposal", min: 0.8, max: 0.8 },
  { label: "Proposal → engagement", key: "proposalToEngagement", min: 0.3, max: 0.3 },
  { label: "Engagement → production PO", key: "engagementToPo", min: 0.6, max: 0.6 },
];

export function targetMidpoint(t: RangeTarget): number {
  return (t.min + t.max) / 2;
}

export function formatRange(t: RangeTarget): string {
  if (t.min === t.max) return `${t.min}`;
  return `${t.min} – ${t.max}`;
}

export function formatRangeCurrency(t: RangeTarget): string {
  const fmt = (n: number) =>
    n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 2)}M` : `$${(n / 1000).toFixed(0)}k`;
  if (t.min === t.max) return fmt(t.min);
  return `${fmt(t.min)} – ${fmt(t.max)}`;
}
