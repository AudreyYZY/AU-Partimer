// Tool: Extract workplace facts from conversation
// Used by the LLM to structure information gathered during the diagnostic interview

import { z } from "zod";
import type { WorkplaceFacts } from "@/types/facts";

/**
 * Schema for the extractFacts tool
 * The LLM calls this to submit collected facts for rule engine evaluation
 */
export const extractFactsSchema = z.object({
  state: z
    .enum(["NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"])
    .describe("Australian state or territory where the worker is employed"),
  visaType: z
    .enum(["500", "417", "462", "other", "none"])
    .describe(
      "Visa subclass number. Use 'none' if Australian citizen/permanent resident"
    ),
  isStudyPeriod: z
    .boolean()
    .describe(
      "Whether the worker is currently in a study period (relevant for student visa)"
    ),
  industry: z
    .enum([
      "restaurant",
      "cafe",
      "catering",
      "hotpot",
      "bubble_tea",
      "retail",
      "cleaning",
      "warehouse",
      "delivery",
      "other",
    ])
    .describe("Industry or type of workplace"),
  employmentType: z
    .enum(["full_time", "part_time", "casual"])
    .describe("Employment classification"),
  hourlyRate: z
    .number()
    .min(0)
    .describe("Hourly pay rate in Australian dollars as reported by worker"),
  weeklyHours: z
    .number()
    .min(0)
    .describe("Average hours worked per week"),
  paymentMethod: z
    .enum(["cash", "bank", "mixed"])
    .describe("How the worker receives their pay"),
  hasPayslip: z
    .boolean()
    .describe("Whether the worker receives payslips from their employer"),
  hasSuper: z
    .boolean()
    .describe(
      "Whether the worker's employer pays superannuation contributions"
    ),
  trialShiftHours: z
    .number()
    .min(0)
    .describe(
      "Total hours worked during trial/training shifts (0 if no trial)"
    ),
  trialPaid: z
    .boolean()
    .describe("Whether trial/training shifts were paid"),
  trialRepeated: z
    .boolean()
    .describe("Whether the worker was asked to do multiple trial shifts"),
  employmentDurationWeeks: z
    .number()
    .min(0)
    .describe("How many weeks the worker has been employed"),
});

/**
 * Convert tool call parameters to WorkplaceFacts
 */
export function paramsToFacts(
  params: Partial<z.infer<typeof extractFactsSchema>>
): WorkplaceFacts {
  return {
    state: params.state,
    visaType: params.visaType,
    isStudyPeriod: params.isStudyPeriod,
    industry: params.industry,
    employmentType: params.employmentType,
    hourlyRate: params.hourlyRate,
    weeklyHours: params.weeklyHours,
    paymentMethod: params.paymentMethod,
    hasPayslip: params.hasPayslip,
    hasSuper: params.hasSuper,
    trialShiftHours: params.trialShiftHours,
    trialPaid: params.trialPaid,
    trialRepeated: params.trialRepeated,
    employmentDurationWeeks: params.employmentDurationWeeks,
  };
}
