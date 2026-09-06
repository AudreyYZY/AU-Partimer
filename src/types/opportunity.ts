export type OpportunityDecision =
  | "STOP"
  | "VERIFY_FIRST"
  | "SHORT_TERM_WITH_SAFEGUARDS"
  | "PROCEED";

export type RiskBand = "severe" | "high" | "medium" | "low";

export type RiskCategory =
  | "scam"
  | "pay"
  | "documentation"
  | "visa"
  | "practical";

export interface OpportunityFacts {
  state: string;
  visaType: "500" | "417" | "462" | "other" | "none";
  isStudyPeriod: boolean;
  industry:
    | "restaurant"
    | "cafe"
    | "catering"
    | "hotpot"
    | "bubble_tea"
    | "retail"
    | "cleaning"
    | "warehouse"
    | "delivery"
    | "other";
  roleTitle?: string;
  employmentType: "full_time" | "part_time" | "casual" | "unknown";
  offeredHourlyRate?: number;
  weeklyHours?: number;
  paymentMethod: "bank" | "cash" | "mixed" | "unknown";
  hasPayslip: "yes" | "no" | "unknown";
  superMentioned: "yes" | "no" | "unknown";
  hasWrittenAgreement: "yes" | "no" | "unknown";
  trialShiftHours?: number;
  trialPaid: "yes" | "no" | "unknown";
  contactChannel:
    | "official_email"
    | "phone"
    | "job_platform"
    | "wechat"
    | "whatsapp"
    | "telegram"
    | "sms"
    | "other";
  requiresUpfrontPayment: boolean;
  asksForBankOrCrypto: boolean;
  asksForIdentityDocsEarly: boolean;
  urgentStartOrPressure: boolean;
  hasOtherOptions: "none" | "some" | "several";
  cashPressure: "low" | "medium" | "high";
  commuteMinutes?: number;
}

export interface RiskSignal {
  id: string;
  category: RiskCategory;
  band: RiskBand;
  title: string;
  explanation: string;
  sourceName?: string;
  sourceUrl?: string;
  sourceId?: string;
  caseIds?: string[];
}

export interface OpportunityAlternative {
  title: string;
  whySafer: string;
  whatToSearch: string[];
}

export type ConfidenceLevel = "high" | "medium" | "low";

export interface OpportunityConfidence {
  level: ConfidenceLevel;
  score: number;
  evidenceCompleteness: number;
  sourceCoverage: number;
  explanation: string;
}

export interface OpportunityReportMeta {
  rulesetVersion: string;
  generatedAt: string;
  jurisdiction: "AU";
  effectiveFrom: string;
  wageBenchmark: {
    adultHourly: number;
    adultCasualHourly: number;
    note: string;
  };
  limitations: string[];
}

export interface OpportunityReport {
  decision: OpportunityDecision;
  decisionLabel: string;
  summary: string;
  riskScore: number;
  confidence: OpportunityConfidence;
  riskSignals: RiskSignal[];
  missingChecks: string[];
  questionsForEmployer: string[];
  safeguards: string[];
  alternatives: OpportunityAlternative[];
  sources: Array<{ name: string; url: string }>;
  meta: OpportunityReportMeta;
  disclaimer: string;
}
