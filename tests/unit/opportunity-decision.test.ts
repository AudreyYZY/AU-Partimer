import assert from "node:assert/strict";
import { assessOpportunity } from "../../src/services/opportunity/decision-engine";
import type { OpportunityFacts } from "../../src/types/opportunity";

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

const cleanReport = assessOpportunity(baseOpportunity);

assert.equal(cleanReport.decision, "PROCEED");

console.log("Opportunity decision tests passed.");
