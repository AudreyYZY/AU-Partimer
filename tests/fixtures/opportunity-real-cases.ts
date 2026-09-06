import type { OpportunityDecision, OpportunityFacts } from "../../src/types/opportunity";

export interface OpportunityCaseFixture {
  id: string;
  sourceUrl: string;
  description: string;
  facts: OpportunityFacts;
  expectedDecision: OpportunityDecision;
  expectedSignals: string[];
}

const restaurantStudentBase: OpportunityFacts = {
  state: "VIC",
  visaType: "500",
  isStudyPeriod: true,
  industry: "restaurant",
  roleTitle: "Waiter",
  employmentType: "casual",
  offeredHourlyRate: 34,
  weeklyHours: 18,
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

export const opportunityRealCaseFixtures: OpportunityCaseFixture[] = [
  {
    id: "SCAMWATCH-JOBSCAMS",
    sourceUrl: "https://www.scamwatch.gov.au/types-of-scams/jobs-and-employment-scams",
    description:
      "Task-style recruitment asks the worker to pay or top up money before earning.",
    facts: {
      ...restaurantStudentBase,
      state: "NSW",
      visaType: "none",
      isStudyPeriod: false,
      industry: "other",
      roleTitle: "Remote product task assistant",
      employmentType: "unknown",
      offeredHourlyRate: 45,
      weeklyHours: 10,
      paymentMethod: "unknown",
      hasPayslip: "unknown",
      superMentioned: "unknown",
      hasWrittenAgreement: "unknown",
      employerIdentityStatus: "not_provided",
      contactChannel: "whatsapp",
      requiresUpfrontPayment: true,
      asksForBankOrCrypto: true,
      asksForIdentityDocsEarly: true,
      urgentStartOrPressure: true,
      hasOtherOptions: "none",
      cashPressure: "high",
    },
    expectedDecision: "STOP",
    expectedSignals: [
      "upfront-payment",
      "bank-crypto",
      "identity-docs-early",
      "employer-identity-missing",
    ],
  },
  {
    id: "FWO-2025-DINTAIFUNG",
    sourceUrl:
      "https://www.fairwork.gov.au/newsroom/media-releases/2025-media-releases/july-2025/20250709-din-tai-fung-case-study-media-release",
    description:
      "Restaurant worker accepts low flat-rate work under income pressure; tool should give harm-reduction only when no severe scam or visa stop signal exists.",
    facts: {
      ...restaurantStudentBase,
      offeredHourlyRate: 24,
      paymentMethod: "cash",
      hasPayslip: "no",
      superMentioned: "no",
      hasWrittenAgreement: "no",
      employerIdentityStatus: "provided_unverified",
      hasOtherOptions: "none",
      cashPressure: "high",
    },
    expectedDecision: "SHORT_TERM_WITH_SAFEGUARDS",
    expectedSignals: ["below-minimum-benchmark", "cash-payment", "no-payslip"],
  },
  {
    id: "FWO-2015-GLORIAJEANS",
    sourceUrl:
      "https://www.fairwork.gov.au/newsroom/media-releases/2015-media-releases/february-2015/20150202-primeage-penalty-presser",
    description:
      "Low flat-rate cafe work with missing payslips and records should not be treated as safe.",
    facts: {
      ...restaurantStudentBase,
      state: "VIC",
      industry: "cafe",
      roleTitle: "Cafe all-rounder",
      offeredHourlyRate: 18,
      paymentMethod: "cash",
      hasPayslip: "no",
      superMentioned: "unknown",
      hasWrittenAgreement: "no",
      employerIdentityStatus: "provided_unverified",
      hasOtherOptions: "some",
      cashPressure: "medium",
    },
    expectedDecision: "VERIFY_FIRST",
    expectedSignals: ["below-minimum-benchmark", "cash-payment", "no-payslip"],
  },
  {
    id: "HOMEAFFAIRS-STUDENT-500",
    sourceUrl:
      "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500",
    description:
      "Student visa work pattern above 48 hours per fortnight during study period should stop the opportunity until roster is corrected.",
    facts: {
      ...restaurantStudentBase,
      weeklyHours: 30,
      hasOtherOptions: "none",
      cashPressure: "high",
    },
    expectedDecision: "STOP",
    expectedSignals: ["student-hours"],
  },
];
