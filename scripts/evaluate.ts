import { readFileSync, writeFileSync } from "node:fs";
import { evaluationCaseSchema, evaluateCases } from "../src/lib/evaluation";
import { opportunityRealCaseFixtures } from "../tests/fixtures/opportunity-real-cases";

const input = process.argv.find((arg) => arg.startsWith("--input="))?.slice(8);
const output = process.argv.find((arg) => arg.startsWith("--out="))?.slice(6);
const raw = input
  ? JSON.parse(readFileSync(input, "utf8"))
  : opportunityRealCaseFixtures.map((c) => ({
      ...c,
      sourceFamily: c.id,
      sourceType: "official_adapted",
      split: "regression",
      asOf: "2026-09-07",
      reviewerIds: [],
      adjudicated: false,
    }));
const cases = evaluationCaseSchema.array().parse(raw);
const result = evaluateCases(cases);
const json = JSON.stringify(result, null, 2);
if (output) writeFileSync(output, json + "\n");
console.log(json);
if (result.matched !== result.datasetSize) process.exitCode = 1;
if (
  process.argv.includes("--require-expert") &&
  (result.independentlyLabelledHoldout < 100 ||
    result.falseProceed > 0 ||
    result.matched !== result.datasetSize)
) {
  console.error(
    "Release gate unmet: requires at least 100 independently double-reviewed, adjudicated holdout cases and no test failures. This gate is not legal certification.",
  );
  process.exitCode = 2;
}
