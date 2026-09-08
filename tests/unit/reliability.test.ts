import test from "node:test";
import assert from "node:assert/strict";
import { generateText, stepCountIs } from "ai";
import { MockLanguageModelV3 } from "ai/test";
import { z } from "zod";
import { assessOpportunity } from "../../src/services/opportunity/decision-engine";
import { evaluateFacts } from "../../src/services/rule-engine/engine";
import { lookupAward } from "../../src/services/llm/tools/lookup-award";
import { verifyEmployerIdentity } from "../../src/services/verification/abn";
import { diagnosticTools } from "../../src/services/llm/tools/diagnostic-tools";
import { opportunityRealCaseFixtures } from "../fixtures/opportunity-real-cases";

const base = {
  ...opportunityRealCaseFixtures[1].facts,
  employerIdentityStatus: "verified" as const,
  offeredHourlyRate: 40,
  hasPayslip: "yes" as const,
  superMentioned: "yes" as const,
  hasWrittenAgreement: "yes" as const,
  paymentMethod: "bank" as const,
  cashPressure: "medium" as const,
};
const assess = (changes = {}) =>
  assessOpportunity({ ...base, ...changes }, new Date("2026-09-07"));

test("missing essential facts cannot produce a proceed decision", () => {
  for (const changes of [
    { offeredHourlyRate: undefined },
    { weeklyHours: undefined },
    { age: undefined },
    { employerIdentityStatus: "provided_unverified" },
    { fortnightHours: undefined },
  ]) {
    assert.equal(assess(changes).decision, "VERIFY_FIRST");
  }
});
test("income pressure never overrides identity concerns", () => {
  const result = assess({
    asksForIdentityDocsEarly: true,
    cashPressure: "high",
    hasOtherOptions: "none",
  });
  assert.equal(result.decision, "VERIFY_FIRST");
});
test("income pressure preserves pay risk while offering safeguards for a known employer", () => {
  const result = assess({
    offeredHourlyRate: 20,
    cashPressure: "high",
    hasOtherOptions: "none",
  });
  assert.equal(result.decision, "SHORT_TERM_WITH_SAFEGUARDS");
  assert.ok(result.riskSignals.some((r) => r.id === "below-minimum-benchmark"));
});
test("weekly hours alone are not proof of a fortnight breach", () => {
  assert.equal(
    assess({ weeklyHours: 25, fortnightHours: undefined }).decision,
    "VERIFY_FIRST",
  );
  assert.equal(assess({ fortnightHours: 49 }).decision, "STOP");
  assert.notEqual(assess({ fortnightHours: 48 }).decision, "STOP");
});
test("expired source review cannot produce proceed", () => {
  assert.equal(
    assessOpportunity(base, new Date("2027-01-01")).decision,
    "VERIFY_FIRST",
  );
});
test("data completeness is explicitly not calibrated accuracy", () => {
  assert.equal(
    assess().confidence.interpretation,
    "information_completeness_not_accuracy",
  );
  assert.equal(
    assess().confidence.verification,
    "self_reported_not_independently_verified",
  );
});
test("junior pay is not treated as adult underpayment", () => {
  const result = assess({ age: 17, offeredHourlyRate: 20 });
  assert.equal(result.decision, "VERIFY_FIRST");
  assert.ok(
    !result.riskSignals.some((r) => r.id === "below-minimum-benchmark"),
  );
});
test("two-hour unpaid trial triggers a check", async () => {
  const result = await evaluateFacts({
    trialShiftHours: 2,
    trialPaid: false,
    trialSupervised: false,
  });
  assert.ok(result.findings.some((f) => f.type === "UNPAID_TRIAL_CHECK"));
});
test("award benchmark never claims a classification rate", async () => {
  const r = await lookupAward({
    industry: "retail",
    classification: "Level 5",
  });
  assert.equal(r.exactRateAvailable, false);
  assert.equal(r.confirmedClassification, null);
  assert.ok(!("baseHourlyRate" in r));
});
test("registry records and provider failures remain distinct", async () => {
  const originalFetch = global.fetch;
  const guid = process.env.ABN_LOOKUP_GUID;
  process.env.ABN_LOOKUP_GUID = "test-only";
  try {
    global.fetch = async () =>
      new Response(
        'callback({"Abn":"51824753556","EntityName":"Test","AbnStatus":"Cancelled"})',
      );
    const cancelled = await verifyEmployerIdentity("51824753556");
    assert.equal(cancelled.status, "record_found");
    assert.equal(cancelled.matches[0].status, "Cancelled");
    global.fetch = async () =>
      new Response('callback({"Message":"Invalid GUID","Names":[]})');
    assert.equal(
      (await verifyEmployerIdentity("Test")).status,
      "service_error",
    );
    delete process.env.ABN_LOOKUP_GUID;
    assert.equal(
      (await verifyEmployerIdentity("12345678901")).status,
      "invalid_identifier",
    );
  } finally {
    global.fetch = originalFetch;
    if (guid === undefined) delete process.env.ABN_LOOKUP_GUID;
    else process.env.ABN_LOOKUP_GUID = guid;
  }
});
test("tool contract exposes facts and supports a second explanation step", async () => {
  const usage = {
    inputTokens: { total: 1, noCache: 1, cacheRead: 0, cacheWrite: 0 },
    outputTokens: { total: 1, text: 1, reasoning: 0 },
  };
  let calls = 0;
  const model = new MockLanguageModelV3({
    doGenerate: async (options) => {
      calls++;
      assert.ok(
        options.tools?.some(
          (t) =>
            t.type === "function" &&
            JSON.stringify(t.inputSchema).includes("hourlyRate"),
        ),
      );
      return calls === 1
        ? {
            content: [
              {
                type: "tool-call",
                toolCallId: "1",
                toolName: "submitFacts",
                input: "{}",
              },
            ],
            finishReason: { unified: "tool-calls", raw: "tool_calls" },
            usage,
            warnings: [],
          }
        : {
            content: [
              { type: "text", text: "Please confirm your hourly rate." },
            ],
            finishReason: { unified: "stop", raw: "stop" },
            usage,
            warnings: [],
          };
    },
  });
  const result = await generateText({
    model,
    prompt: "Check my job",
    tools: diagnosticTools,
    stopWhen: stepCountIs(4),
  });
  assert.equal(calls, 2);
  assert.ok(result.text.includes("confirm"));
  assert.ok(z.object({}).safeParse({}).success);
});
