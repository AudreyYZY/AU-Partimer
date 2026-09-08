import { z } from "zod";
import { factsSchema, daySchema } from "./case-model";
import { assessOpportunity } from "@/services/opportunity/decision-engine";
const decision = z.enum([
  "STOP",
  "VERIFY_FIRST",
  "SHORT_TERM_WITH_SAFEGUARDS",
  "PROCEED",
]);
export const evaluationCaseSchema = z.object({
  id: z.string().min(1),
  sourceFamily: z.string().min(1),
  sourceType: z.enum(["synthetic", "official_adapted", "user_consented"]),
  sourceUrl: z.string().url().optional(),
  split: z.enum(["regression", "holdout"]),
  asOf: daySchema,
  facts: factsSchema,
  expectedDecision: decision,
  expectedSignals: z.array(z.string()),
  reviewerIds: z.array(z.string().min(1)).default([]),
  adjudicated: z.boolean().default(false),
});
export type EvaluationCase = z.infer<typeof evaluationCaseSchema>;
export function wilson95(successes: number, total: number) {
  if (!total) return null;
  const z = 1.96,
    p = successes / total,
    den = 1 + (z * z) / total;
  const center = (p + (z * z) / (2 * total)) / den;
  const margin =
    (z * Math.sqrt((p * (1 - p)) / total + (z * z) / (4 * total * total))) /
    den;
  return [Math.max(0, center - margin), Math.min(1, center + margin)];
}
export function evaluateCases(cases: EvaluationCase[]) {
  if (new Set(cases.map((c) => c.id)).size !== cases.length)
    throw new Error("Duplicate case IDs");
  const regressionFamilies = new Set(
    cases.filter((c) => c.split === "regression").map((c) => c.sourceFamily),
  );
  if (
    cases.some(
      (c) => c.split === "holdout" && regressionFamilies.has(c.sourceFamily),
    )
  )
    throw new Error("Source-family leakage into holdout");
  const rows = cases.map((c) => {
    const report = assessOpportunity(c.facts, new Date(c.asOf));
    const missingSignals = c.expectedSignals.filter(
      (id) => !report.riskSignals.some((s) => s.id === id),
    );
    return {
      id: c.id,
      split: c.split,
      expected: c.expectedDecision,
      actual: report.decision,
      missingSignals,
      matched: report.decision === c.expectedDecision && !missingSignals.length,
    };
  });
  const confusion: Record<string, Record<string, number>> = {};
  for (const row of rows) {
    confusion[row.expected] ??= {};
    confusion[row.expected][row.actual] =
      (confusion[row.expected][row.actual] ?? 0) + 1;
  }
  const stop = rows.filter((r) => r.expected === "STOP"),
    recalled = stop.filter((r) => r.actual === "STOP").length;
  const labelledHoldout = cases.filter(
    (c) =>
      c.split === "holdout" &&
      new Set(c.reviewerIds).size >= 2 &&
      c.adjudicated,
  );
  return {
    datasetSize: cases.length,
    matched: rows.filter((r) => r.matched).length,
    decisionAccuracy: rows.length
      ? rows.filter((r) => r.expected === r.actual).length / rows.length
      : null,
    stopRecall: stop.length ? recalled / stop.length : null,
    stopRecallWilson95: wilson95(recalled, stop.length),
    falseProceed: rows.filter(
      (r) => r.expected !== "PROCEED" && r.actual === "PROCEED",
    ).length,
    verifyFirstRate: rows.length
      ? rows.filter((r) => r.actual === "VERIFY_FIRST").length / rows.length
      : null,
    independentlyLabelledHoldout: labelledHoldout.length,
    expertValidationEstablished: false,
    interpretation:
      "Agreement with supplied labels, not proof of legal correctness or calibrated confidence.",
    confusion,
    rows,
  };
}
