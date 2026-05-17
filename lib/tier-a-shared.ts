export const TIER_A_STATUSES = [
  "cold",
  "contacted",
  "replied",
  "discovery_booked",
  "engaged",
  "closed",
  "dead",
] as const;

export type TierAStatus = (typeof TIER_A_STATUSES)[number];

export interface TierATarget {
  id: number;
  brand_name: string;
  founder_name: string;
  instagram_handle: string;
  linkedin_url: string;
  email: string;
  status: string;
  last_contacted: string;
  expected_deal_value_aud: number;
  notes: string;
}
