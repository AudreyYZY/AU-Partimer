import assert from "node:assert/strict";
import { assessOpportunity } from "../../src/services/opportunity/decision-engine";
import type { OpportunityFacts } from "../../src/types/opportunity";
import { opportunityRealCaseFixtures } from "../fixtures/opportunity-real-cases";

const baseOpportunity: OpportunityFacts = {
  state: "NSW",
  visaType: "500",
  isStudyPeriod: true,
  industry: "restaurant",
  roleTitle: "Waiter",
  employmentType: "casual",
  offeredHourlyRate: 34,
  weeklyHours: 20,
  paymentMethod: "bank",
  hasPayslip: "yes",
  superMentioned: "yes",
  hasWrittenAgreement: "yes",
  employerIdentityStatus: "verified",
  trialShiftHours: 0,
  trialPaid: "unknown",
  contactChannel: "job_platform",
  requiresUpfrontPayment: false,
  asksForBankOrCrypto: false,
  asksForIdentityDocsEarly: false,
  urgentStartOrPressure: false,
  hasOtherOptions: "some",
  cashPressure: "medium",
  commuteMinutes: 30,
};

const upfrontPaymentReport = assessOpportunity({
  ...baseOpportunity,
  requiresUpfrontPayment: true,
});

assert.equal(upfrontPaymentReport.decision, "STOP");
assert.ok(upfrontPaymentReport.riskScore >= 36);
assert.equal(upfrontPaymentReport.meta.rulesetVersion, "2026.09.06");
assert.equal(upfrontPaymentReport.meta.wageBenchmark.adultCasualHourly, 33.05);
assert.ok(
  upfrontPaymentReport.riskSignals.some((signal) => signal.id === "upfront-payment")
);

const harmReductionReport = assessOpportunity({
  ...baseOpportunity,
  offeredHourlyRate: 24,
  hasOtherOptions: "none",
  cashPressure: "high",
});

assert.equal(harmReductionReport.decision, "SHORT_TERM_WITH_SAFEGUARDS");
assert.ok(
  harmReductionReport.safeguards.some((item) => item.includes("review point"))
);
assert.ok(
  harmReductionReport.verificationSteps.some(
    (step) => step.id === "verify-employer-identity"
  )
);

const unverifiableEmployerReport = assessOpportunity({
  ...baseOpportunity,
  contactChannel: "wechat",
  employerIdentityStatus: "not_provided",
  hasWrittenAgreement: "unknown",
});

assert.equal(unverifiableEmployerReport.decision, "VERIFY_FIRST");
assert.ok(
  unverifiableEmployerReport.riskSignals.some(
    (signal) => signal.id === "employer-identity-missing"
  )
);

const cleanReport = assessOpportunity(baseOpportunity);

assert.equal(cleanReport.decision, "PROCEED");
assert.ok(cleanReport.confidence.score >= 80);
assert.equal(cleanReport.confidence.evidenceCompleteness, 100);

for (const fixture of opportunityRealCaseFixtures) {
  const report = assessOpportunity(fixture.facts);

  assert.equal(
    report.decision,
    fixture.expectedDecision,
    `${fixture.id} should return ${fixture.expectedDecision}`
  );

  for (const expectedSignal of fixture.expectedSignals) {
    assert.ok(
      report.riskSignals.some((signal) => signal.id === expectedSignal),
      `${fixture.id} should include ${expectedSignal}`
    );
  }

  assert.ok(report.riskScore > 0, `${fixture.id} should have a non-zero risk score`);
  assert.ok(
    report.riskSignals.every((signal) => signal.sourceId || signal.sourceUrl),
    `${fixture.id} should keep source traceability on every signal`
  );
}

console.log("Opportunity decision tests passed.");
