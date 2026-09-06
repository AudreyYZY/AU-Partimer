// Tool: Look up award rates for an industry and classification
// Used by the LLM to check minimum pay rates during the diagnostic

import { z } from "zod";
import {
  NATIONAL_MIN_WAGE_CASUAL_HOURLY,
  NATIONAL_MIN_WAGE_HOURLY,
} from "@/lib/constants";

/**
 * Schema for the lookupAward tool
 */
export const lookupAwardSchema = z.object({
  industry: z
    .string()
    .describe("Industry name (e.g., restaurant, retail, cleaning, warehouse)"),
  classification: z
    .string()
    .optional()
    .describe("Award classification level if known"),
});

// Industry to award code mapping
const INDUSTRY_AWARD_MAP: Record<string, string> = {
  restaurant: "MA000119",
  cafe: "MA000119",
  catering: "MA000119",
  hotpot: "MA000119",
  bubble_tea: "MA000119",
  retail: "MA000004",
  cleaning: "MA000022",
  warehouse: "MA000085",
  delivery: "MA000085",
};

// Conservative default benchmarks from 1 July 2026.
// Exact award rates need the official Fair Work Pay Calculator.
const DEFAULT_RATES: Record<string, { base: number; casual: number; name: string }> = {
  MA000119: {
    base: NATIONAL_MIN_WAGE_HOURLY,
    casual: NATIONAL_MIN_WAGE_CASUAL_HOURLY,
    name: "Restaurant Industry Award 2020",
  },
  MA000004: {
    base: NATIONAL_MIN_WAGE_HOURLY,
    casual: NATIONAL_MIN_WAGE_CASUAL_HOURLY,
    name: "General Retail Industry Award 2020",
  },
  MA000022: {
    base: NATIONAL_MIN_WAGE_HOURLY,
    casual: NATIONAL_MIN_WAGE_CASUAL_HOURLY,
    name: "Cleaning Services Award 2020",
  },
  MA000085: {
    base: NATIONAL_MIN_WAGE_HOURLY,
    casual: NATIONAL_MIN_WAGE_CASUAL_HOURLY,
    name: "Storage Services and Wholesale Award 2020",
  },
};

/**
 * Look up award information for an industry
 * Returns award code, name, and minimum rates
 */
export async function lookupAward(params: z.infer<typeof lookupAwardSchema>) {
  const awardCode = INDUSTRY_AWARD_MAP[params.industry.toLowerCase()];

  if (!awardCode) {
    return {
      found: false,
      message: `No specific award found for industry: ${params.industry}. The national minimum wage benchmark of $${NATIONAL_MIN_WAGE_HOURLY.toFixed(2)}/hr may apply if the worker is award and agreement free.`,
      nationalMinWage: NATIONAL_MIN_WAGE_HOURLY,
      nationalCasualMin: NATIONAL_MIN_WAGE_CASUAL_HOURLY,
    };
  }

  const rates = DEFAULT_RATES[awardCode];

  return {
    found: true,
    awardCode,
    awardName: rates.name,
    classification: params.classification ?? "Level 1 (introductory)",
    baseHourlyRate: rates.base,
    casualHourlyRate: rates.casual,
    casualLoading: "25%",
    effectiveFrom: "1 July 2026",
    source: "https://calculate.fairwork.gov.au/FindYourAward",
    note: "These are conservative national benchmarks. Verify the exact award, age, classification, penalty rates, and allowances with the official Fair Work Pay Calculator.",
  };
}
