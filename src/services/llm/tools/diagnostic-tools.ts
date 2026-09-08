import {
  OPPORTUNITY_RULESET_VERSION,
  SOURCE_REVIEW_DUE,
} from "@/lib/constants";
import { tool } from "ai";
import { z } from "zod";
import { extractFactsSchema, paramsToFacts } from "./extract-facts";
import { lookupAwardSchema, lookupAward } from "./lookup-award";
import { evaluateFacts, sortBySeverity } from "@/services/rule-engine/engine";

export const diagnosticTools = {
  submitFacts: tool({
    description:
      "Evaluate only facts explicitly stated or confirmed by the user. Omit unknowns; never invent values.",
    inputSchema: extractFactsSchema.partial().extend({
      age: z.number().int().min(14).max(100).optional(),
      fortnightHours: z.number().min(0).max(336).optional(),
      trialSupervised: z.boolean().optional(),
      visaHoursException: z.boolean().optional(),
    }),
    execute: async (params) => {
      const facts = {
        ...paramsToFacts(params),
        age: params.age,
        fortnightHours: params.fortnightHours,
        trialSupervised: params.trialSupervised,
        visaHoursException: params.visaHoursException,
      };
      const result = await evaluateFacts(facts);
      return {
        findings: sortBySeverity(result.findings),
        rulesetVersion: OPPORTUNITY_RULESET_VERSION,
        sourceReviewOverdue:
          new Date().toISOString().slice(0, 10) > SOURCE_REVIEW_DUE,
        rulesEvaluated: result.rulesEvaluated,
        missingFacts: [
          "state",
          "age",
          "employmentType",
          "hourlyRate",
          "weeklyHours",
          "hasPayslip",
          "hasSuper",
        ].filter((key) => facts[key as keyof typeof facts] === undefined),
        interpretation:
          "Screening only. No triggered rules does not establish compliance.",
      };
    },
  }),
  lookupAward: tool({
    description:
      "Retrieve a national adult benchmark and candidate award, never an exact classification rate.",
    inputSchema: lookupAwardSchema,
    execute: lookupAward,
  }),
};
