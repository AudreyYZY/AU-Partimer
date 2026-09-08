import { z } from "zod";
import {
  INDUSTRY_AWARD_MAP,
  NATIONAL_MIN_WAGE_HOURLY,
  NATIONAL_MIN_WAGE_CASUAL_HOURLY,
  NATIONAL_MIN_WAGE_EFFECTIVE_FROM,
  SOURCE_REVIEW_DUE,
  LEGAL_RESOURCES,
} from "@/lib/constants";

export const lookupAwardSchema = z.object({
  industry: z.string().max(100),
  classification: z.string().max(100).optional(),
});

export async function lookupAward(params: z.infer<typeof lookupAwardSchema>) {
  return {
    status: "benchmark_only",
    sourceReviewOverdue:
      new Date().toISOString().slice(0, 10) > SOURCE_REVIEW_DUE,
    exactRateAvailable: false,
    candidateAwardCode:
      INDUSTRY_AWARD_MAP[params.industry.toLowerCase()] ?? null,
    reportedClassification: params.classification ?? null,
    confirmedClassification: null,
    nationalAdultBenchmark: NATIONAL_MIN_WAGE_HOURLY,
    nationalAdultCasualBenchmark: NATIONAL_MIN_WAGE_CASUAL_HOURLY,
    effectiveFrom: NATIONAL_MIN_WAGE_EFFECTIVE_FROM,
    reviewDue: SOURCE_REVIEW_DUE,
    source: LEGAL_RESOURCES.MINIMUM_WAGES.url,
    nextStepUrl: LEGAL_RESOURCES.PAY_CALCULATOR.url,
    limitations: [
      "National adult benchmarks only; these are not award classification rates. Some award rates can be lower. Do not apply expired or out-of-period benchmarks.",
      "Coverage, age, duties, classification, agreement and roster require confirmation.",
      "A candidate award is not a verified award determination.",
    ],
  };
}
