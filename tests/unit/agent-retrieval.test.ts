import test from "node:test";
import assert from "node:assert/strict";
import { createCase } from "../../src/lib/case-model";
import { assessOpportunity } from "../../src/services/opportunity/decision-engine";
import {
  inferGuidanceTopics,
  retrieveOfficialGuidance,
} from "../../src/services/agent/retrieval";

test("retrieval ranks reviewed official records for the case topics", () => {
  const facts = {
    ...createCase("Trial").facts,
    trialShiftHours: 4,
    trialPaid: "no" as const,
    offeredHourlyRate: 20,
  };
  const report = assessOpportunity(facts, new Date("2026-09-08"));
  const topics = inferGuidanceTopics(facts, report);
  const result = retrieveOfficialGuidance({
    query: "unpaid trial and hourly pay",
    topics,
    language: "en",
    asOf: new Date("2026-09-08"),
  });
  assert.equal(result[0].id, "FWO-UNPAID-TRIALS");
  assert.ok(result.every((item) => item.sourceUrl.startsWith("https://")));
  assert.ok(result.every((item) => !item.stale));
});

test("retrieval exposes, rather than hides, overdue source reviews", () => {
  const result = retrieveOfficialGuidance({
    query: "student visa fortnight hours",
    topics: ["visa", "hours"],
    language: "zh",
    asOf: new Date("2026-11-01"),
  });
  assert.ok(result.some((item) => item.id === "DHA-STUDENT-500"));
  assert.ok(result.every((item) => item.stale));
});

test("Chinese phrases retrieve the corresponding official topic", () => {
  const result = retrieveOfficialGuidance({
    query: "对方让我明天无薪试工，我应该先确认什么？",
    topics: ["identity", "pay", "trial"],
    language: "zh",
    asOf: new Date("2026-09-08"),
  });
  assert.equal(result[0].id, "FWO-UNPAID-TRIALS");
});
