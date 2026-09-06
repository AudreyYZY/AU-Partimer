import {
  NATIONAL_MIN_WAGE_EFFECTIVE_FROM,
  NATIONAL_MIN_WAGE_HOURLY,
  NATIONAL_MIN_WAGE_CASUAL_HOURLY,
  OPPORTUNITY_RULESET_VERSION,
} from "@/lib/constants";
import type {
  OpportunityConfidence,
  OpportunityAlternative,
  OpportunityDecision,
  OpportunityFacts,
  OpportunityReport,
  RiskSignal,
} from "@/types/opportunity";

const SOURCES = [
  {
    name: "Fair Work Ombudsman: Minimum wages",
    url: "https://www.fairwork.gov.au/pay-and-wages/minimum-wages",
  },
  {
    name: "Fair Work Ombudsman: Pay slips",
    url: "https://www.fairwork.gov.au/pay-and-wages/paying-wages/pay-slips",
  },
  {
    name: "ATO: Super guarantee",
    url: "https://www.ato.gov.au/tax-rates-and-codes/key-superannuation-rates-and-thresholds/super-guarantee",
  },
  {
    name: "Home Affairs: Student visa work conditions",
    url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500",
  },
  {
    name: "Scamwatch: Jobs and employment scams",
    url: "https://www.scamwatch.gov.au/types-of-scams/jobs-and-employment-scams",
  },
];

const REQUIRED_FACT_KEYS: Array<keyof OpportunityFacts> = [
  "state",
  "visaType",
  "industry",
  "employmentType",
  "offeredHourlyRate",
  "weeklyHours",
  "paymentMethod",
  "hasPayslip",
  "superMentioned",
  "hasWrittenAgreement",
  "employerIdentityStatus",
  "contactChannel",
  "hasOtherOptions",
  "cashPressure",
];

const BAND_WEIGHTS: Record<RiskSignal["band"], number> = {
  severe: 36,
  high: 22,
  medium: 11,
  low: 4,
};

export function assessOpportunity(facts: OpportunityFacts): OpportunityReport {
  const riskSignals = buildRiskSignals(facts);
  const missingChecks = buildMissingChecks(facts);
  const decision = chooseDecision(facts, riskSignals);
  const riskScore = calculateRiskScore(riskSignals, missingChecks);
  const confidence = buildConfidence(facts, riskSignals, missingChecks);

  return {
    decision,
    decisionLabel: getDecisionLabel(decision),
    summary: getDecisionSummary(decision, facts, riskSignals),
    riskScore,
    confidence,
    riskSignals,
    missingChecks,
    questionsForEmployer: buildQuestionsForEmployer(facts, riskSignals),
    safeguards: buildSafeguards(facts, riskSignals),
    verificationSteps: buildVerificationSteps(facts, riskSignals),
    alternatives: buildAlternatives(facts.industry),
    sources: SOURCES,
    meta: {
      rulesetVersion: OPPORTUNITY_RULESET_VERSION,
      generatedAt: new Date().toISOString(),
      jurisdiction: "AU",
      effectiveFrom: NATIONAL_MIN_WAGE_EFFECTIVE_FROM,
      wageBenchmark: {
        adultHourly: NATIONAL_MIN_WAGE_HOURLY,
        adultCasualHourly: NATIONAL_MIN_WAGE_CASUAL_HOURLY,
        note:
          "National adult benchmark only. Award, age, classification, duties, and penalty rates may require higher rates.",
      },
      limitations: [
        "This screening does not verify whether an employer or job ad is genuine.",
        "It does not calculate award-specific rates, penalty rates, allowances, or junior rates.",
        "It does not provide legal, migration, tax, or financial advice.",
        "Low-risk output still depends on the facts entered by the user.",
      ],
    },
    disclaimer:
      "This is a practical screening tool, not legal or migration advice. It highlights risk signals from the information provided and points you to official sources for checking.",
  };
}

function buildRiskSignals(facts: OpportunityFacts): RiskSignal[] {
  const signals: RiskSignal[] = [];

  if (facts.requiresUpfrontPayment) {
    signals.push({
      id: "upfront-payment",
      category: "scam",
      band: "severe",
      title: "Asked to pay money before earning",
      explanation:
        "A job that requires a deposit, recharge, training fee, equipment payment, PayID transfer, or cryptocurrency top-up before you earn money is a major job scam signal.",
      sourceName: "Scamwatch",
      sourceUrl: "https://www.scamwatch.gov.au/types-of-scams/jobs-and-employment-scams",
      sourceId: "SCAMWATCH-JOBSCAMS",
      caseIds: ["SCAMWATCH-JOBSCAMS"],
    });
  }

  if (facts.asksForBankOrCrypto) {
    signals.push({
      id: "bank-crypto",
      category: "scam",
      band: "severe",
      title: "Bank, crypto, or transfer activity requested",
      explanation:
        "Work that involves moving money, receiving packages, buying items, using crypto, or topping up an account can expose the worker to fraud or money mule risk.",
      sourceName: "Scamwatch",
      sourceUrl: "https://www.scamwatch.gov.au/types-of-scams/jobs-and-employment-scams",
      sourceId: "SCAMWATCH-JOBSCAMS",
      caseIds: ["SCAMWATCH-JOBSCAMS"],
    });
  }

  if (
    facts.contactChannel === "wechat" ||
    facts.contactChannel === "telegram" ||
    facts.contactChannel === "whatsapp" ||
    facts.contactChannel === "sms"
  ) {
    signals.push({
      id: "informal-channel",
      category: "scam",
      band: facts.urgentStartOrPressure ? "high" : "medium",
      title: "Recruitment is happening through informal messaging",
      explanation:
        "Unexpected or fast-moving recruitment through SMS, WhatsApp, Telegram, or similar channels is not automatically fake, but it needs independent verification.",
      sourceName: "Scamwatch",
      sourceUrl: "https://www.scamwatch.gov.au/types-of-scams/jobs-and-employment-scams",
      sourceId: "SCAMWATCH-JOBSCAMS",
      caseIds: ["SCAMWATCH-JOBSCAMS"],
    });
  }

  if (
    facts.employerIdentityStatus === "not_provided" ||
    facts.employerIdentityStatus === "unknown"
  ) {
    signals.push({
      id: "employer-identity-missing",
      category: "scam",
      band: facts.urgentStartOrPressure ? "high" : "medium",
      title: "Employer identity is not independently verifiable yet",
      explanation:
        "Before sending documents or starting a shift, verify the legal employer name, ABN or business name, workplace address, and official contact channel.",
      sourceName: "ABN Lookup",
      sourceUrl: "https://abr.business.gov.au/",
      sourceId: "ABN-LOOKUP",
      caseIds: ["SCAMWATCH-JOBSCAMS"],
    });
  }

  if (facts.asksForIdentityDocsEarly) {
    signals.push({
      id: "identity-docs-early",
      category: "scam",
      band: "high",
      title: "Identity documents requested too early",
      explanation:
        "Passport, licence, Medicare, bank, or tax details should only be shared after you are confident the employer is genuine and the role is real.",
      sourceName: "Scamwatch",
      sourceUrl: "https://www.scamwatch.gov.au/types-of-scams/jobs-and-employment-scams",
      sourceId: "SCAMWATCH-JOBSCAMS",
      caseIds: ["SCAMWATCH-JOBSCAMS"],
    });
  }

  if (facts.urgentStartOrPressure) {
    signals.push({
      id: "pressure",
      category: "scam",
      band: "medium",
      title: "Pressure to decide quickly",
      explanation:
        "Pressure is a common manipulation pattern. A legitimate employer should be able to answer basic questions about pay, employer identity, and work conditions.",
      sourceName: "Scamwatch",
      sourceUrl: "https://www.scamwatch.gov.au/stop-check-protect/help-to-spot-and-avoid-scams/methods-scammers-use",
      sourceId: "SCAMWATCH-PRESSURE",
      caseIds: ["SCAMWATCH-JOBSCAMS", "ACCC-2025-SCAMS"],
    });
  }

  if (facts.offeredHourlyRate !== undefined) {
    const relevantMinimum =
      facts.employmentType === "casual"
        ? NATIONAL_MIN_WAGE_CASUAL_HOURLY
        : NATIONAL_MIN_WAGE_HOURLY;

    if (facts.offeredHourlyRate < relevantMinimum) {
      signals.push({
        id: "below-minimum-benchmark",
        category: "pay",
        band:
          facts.offeredHourlyRate < NATIONAL_MIN_WAGE_HOURLY ? "high" : "medium",
        title: "Pay is below the current national benchmark",
        explanation:
          `The offered rate of $${facts.offeredHourlyRate.toFixed(2)}/hr is below the current adult national ${
            facts.employmentType === "casual" ? "casual " : ""
          }minimum benchmark of $${relevantMinimum.toFixed(2)}/hr. Exact award rates can depend on age, classification, duties, and coverage, so this should be treated as a serious check item rather than a final legal conclusion.`,
        sourceName: "Fair Work Ombudsman",
        sourceUrl: "https://www.fairwork.gov.au/pay-and-wages/minimum-wages",
        sourceId: "FWO-MINIMUM-WAGES-2026",
        caseIds: [
          "FWO-2026-CARLUCCIS",
          "FWO-2026-MISO",
          "FWO-2025-DINTAIFUNG",
          "FWO-2025-MRVIET",
          "FWO-2019-PHATELEPHANT",
          "FWO-2015-GLORIAJEANS",
        ],
      });
    }
  }

  if (facts.paymentMethod === "cash" || facts.paymentMethod === "mixed") {
    signals.push({
      id: "cash-payment",
      category: "documentation",
      band: facts.hasPayslip === "no" ? "high" : "medium",
      title: "Cash or mixed payment needs records",
      explanation:
        "Cash payment is not automatically unlawful, but without payslips, rosters, and written pay terms it becomes much harder to prove hours, rate, tax, and super.",
      sourceName: "Fair Work Ombudsman",
      sourceUrl: "https://www.fairwork.gov.au/pay-and-wages/paying-wages/pay-slips",
      sourceId: "FWO-PAYSLIPS",
      caseIds: [
        "FWO-2026-MISO",
        "FWO-2025-MRVIET",
        "FWO-2019-PHATELEPHANT",
        "FWO-2015-GLORIAJEANS",
      ],
    });
  }

  if (facts.hasPayslip === "no") {
    signals.push({
      id: "no-payslip",
      category: "documentation",
      band: "high",
      title: "No payslip arrangement",
      explanation:
        "Employers need to give employees pay slips within one working day of pay day. No payslip also makes wage and super checks harder.",
      sourceName: "Fair Work Ombudsman",
      sourceUrl: "https://www.fairwork.gov.au/pay-and-wages/paying-wages/pay-slips",
      sourceId: "FWO-PAYSLIPS",
      caseIds: [
        "FWO-2026-MISO",
        "FWO-2025-MRVIET",
        "FWO-2019-PHATELEPHANT",
        "FWO-2015-GLORIAJEANS",
      ],
    });
  }

  if (facts.superMentioned === "no") {
    signals.push({
      id: "super-not-mentioned",
      category: "pay",
      band: "medium",
      title: "Super has not been mentioned",
      explanation:
        "Super is usually paid on top of wages for eligible employees. Ask how super will be handled and check it through your fund or myGov after starting.",
      sourceName: "ATO",
      sourceUrl: "https://www.ato.gov.au/tax-rates-and-codes/key-superannuation-rates-and-thresholds/super-guarantee",
      sourceId: "ATO-SUPER-GUARANTEE",
      caseIds: ["FWO-2026-CARLUCCIS"],
    });
  }

  if (facts.hasWrittenAgreement === "no" || facts.hasWrittenAgreement === "unknown") {
    signals.push({
      id: "no-written-terms",
      category: "documentation",
      band: "medium",
      title: "Employment terms are not written down",
      explanation:
        "Before starting, try to get written confirmation of employer name, ABN if available, role, hourly rate before tax, pay cycle, trial shift terms, and payslip arrangement.",
      sourceId: "FWO-RECORDS",
      caseIds: ["FWO-2026-MISO", "FWO-2025-MRVIET"],
    });
  }

  if (
    facts.trialShiftHours !== undefined &&
    facts.trialShiftHours > 0 &&
    facts.trialPaid === "no"
  ) {
    signals.push({
      id: "unpaid-trial",
      category: "pay",
      band: facts.trialShiftHours > 4 ? "high" : "medium",
      title: "Unpaid trial needs careful checking",
      explanation:
        "A short unpaid trial may be allowed only when it is genuinely needed to show skills and is directly supervised. Longer or productive trial work may need to be paid.",
      sourceName: "Fair Work Ombudsman",
      sourceUrl: "https://www.fairwork.gov.au/starting-employment/unpaid-work/unpaid-trials",
      sourceId: "FWO-UNPAID-TRIALS",
      caseIds: ["FWO-2015-GLORIAJEANS"],
    });
  }

  if (facts.visaType === "500" && facts.isStudyPeriod && (facts.weeklyHours ?? 0) > 24) {
    signals.push({
      id: "student-hours",
      category: "visa",
      band: "high",
      title: "Student visa hours may be over the fortnight limit",
      explanation:
        "Student visa work limits are counted across a rolling 14-day fortnight, not just a simple weekly average. Check your exact roster across both weeks.",
      sourceName: "Department of Home Affairs",
      sourceUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500",
      sourceId: "HOMEAFFAIRS-STUDENT-500",
      caseIds: ["FWO-VISA-LEON"],
    });
  }

  if ((facts.commuteMinutes ?? 0) >= 75) {
    signals.push({
      id: "long-commute",
      category: "practical",
      band: "medium",
      title: "Long commute reduces the real value of the job",
      explanation:
        "A long commute can turn a stable-looking job into low effective hourly pay, especially for short shifts or late-night finish times.",
      sourceId: "PRACTICAL-EFFECTIVE-PAY",
    });
  }

  return signals;
}

function calculateRiskScore(
  riskSignals: RiskSignal[],
  missingChecks: string[]
): number {
  const signalScore = riskSignals.reduce(
    (total, signal) => total + BAND_WEIGHTS[signal.band],
    0
  );
  const missingScore = Math.min(missingChecks.length * 4, 18);

  return Math.min(100, signalScore + missingScore);
}

function buildConfidence(
  facts: OpportunityFacts,
  riskSignals: RiskSignal[],
  missingChecks: string[]
): OpportunityConfidence {
  const evidenceCompleteness = calculateEvidenceCompleteness(facts, missingChecks);
  const sourcedSignals = riskSignals.filter(
    (signal) => signal.sourceUrl || signal.sourceId
  ).length;
  const sourceCoverage =
    riskSignals.length === 0
      ? 100
      : Math.round((sourcedSignals / riskSignals.length) * 100);
  const sourcePenalty = sourceCoverage >= 80 ? 0 : sourceCoverage >= 60 ? 8 : 16;
  const confidenceScore = Math.max(
    0,
    Math.min(100, evidenceCompleteness - sourcePenalty)
  );
  const level =
    confidenceScore >= 82 ? "high" : confidenceScore >= 58 ? "medium" : "low";

  return {
    level,
    score: confidenceScore,
    evidenceCompleteness,
    sourceCoverage,
    explanation: buildConfidenceExplanation(
      level,
      evidenceCompleteness,
      sourceCoverage,
      missingChecks
    ),
  };
}

function calculateEvidenceCompleteness(
  facts: OpportunityFacts,
  missingChecks: string[]
): number {
  const presentFacts = REQUIRED_FACT_KEYS.filter((key) => {
    const value = facts[key];

    if (value === undefined || value === null || value === "") return false;
    if (value === "unknown") return false;

    return true;
  }).length;
  const rawCompleteness = Math.round(
    (presentFacts / REQUIRED_FACT_KEYS.length) * 100
  );
  const missingPenalty = Math.min(missingChecks.length * 3, 21);

  return Math.max(0, rawCompleteness - missingPenalty);
}

function buildConfidenceExplanation(
  level: OpportunityConfidence["level"],
  evidenceCompleteness: number,
  sourceCoverage: number,
  missingChecks: string[]
): string {
  const prefix = {
    high: "Most key fields are present and the main signals are tied to source-backed rules.",
    medium:
      "The result is useful for screening, but some facts still need verification before relying on it.",
    low: "The result is provisional because too many key facts are missing or unverifiable.",
  }[level];
  const missing =
    missingChecks.length > 0
      ? ` Missing checks: ${missingChecks.slice(0, 3).join("; ")}.`
      : "";

  return `${prefix} Evidence completeness: ${evidenceCompleteness}%. Source coverage: ${sourceCoverage}%.${missing}`;
}

function buildMissingChecks(facts: OpportunityFacts): string[] {
  const missing: string[] = [];

  if (!facts.roleTitle) missing.push("Exact role title and main duties");
  if (facts.employmentType === "unknown") missing.push("Employment type: casual, part-time, full-time, or contractor");
  if (facts.offeredHourlyRate === undefined) missing.push("Hourly rate before tax");
  if (facts.weeklyHours === undefined) missing.push("Expected weekly hours and exact roster");
  if (facts.hasPayslip === "unknown") missing.push("Whether payslips will be provided");
  if (facts.superMentioned === "unknown") missing.push("Whether super will be paid on top of wages");
  if (facts.hasWrittenAgreement === "unknown") missing.push("Written confirmation of employer and pay terms");
  if (
    facts.employerIdentityStatus === "unknown" ||
    facts.employerIdentityStatus === "not_provided"
  ) {
    missing.push("Independently verifiable employer name, ABN, website, or workplace address");
  }

  return missing;
}

function chooseDecision(
  facts: OpportunityFacts,
  riskSignals: RiskSignal[]
): OpportunityDecision {
  const hasSevereScam = riskSignals.some(
    (signal) => signal.category === "scam" && signal.band === "severe"
  );
  const hasHighVisa = riskSignals.some(
    (signal) => signal.category === "visa" && signal.band === "high"
  );
  const highRiskCount = riskSignals.filter((signal) =>
    ["severe", "high"].includes(signal.band)
  ).length;
  const mediumRiskCount = riskSignals.filter(
    (signal) => signal.band === "medium"
  ).length;
  const hasUnverifiedEmployer = riskSignals.some(
    (signal) => signal.id === "employer-identity-missing"
  );

  if (hasSevereScam || hasHighVisa) return "STOP";

  if (
    facts.cashPressure === "high" &&
    facts.hasOtherOptions === "none" &&
    highRiskCount > 0
  ) {
    return "SHORT_TERM_WITH_SAFEGUARDS";
  }

  if (
    highRiskCount > 0 ||
    hasUnverifiedEmployer ||
    mediumRiskCount >= 2 ||
    buildMissingChecks(facts).length >= 3
  ) {
    return "VERIFY_FIRST";
  }

  return "PROCEED";
}

function getDecisionLabel(decision: OpportunityDecision): string {
  switch (decision) {
    case "STOP":
      return "不要继续";
    case "VERIFY_FIRST":
      return "先确认再继续";
    case "SHORT_TERM_WITH_SAFEGUARDS":
      return "可短期过渡，但要保护自己";
    case "PROCEED":
      return "相对可继续";
  }
}

function getDecisionSummary(
  decision: OpportunityDecision,
  facts: OpportunityFacts,
  riskSignals: RiskSignal[]
): string {
  const severeOrHigh = riskSignals.filter((signal) =>
    ["severe", "high"].includes(signal.band)
  );

  if (decision === "STOP") {
    return "这个机会出现了不适合试错的风险信号。先不要付款、不要交身份文件、不要转账或代收钱，也不要开始任何可能影响签证条件的排班。";
  }

  if (decision === "SHORT_TERM_WITH_SAFEGUARDS") {
    return "如果你现在确实需要稳定收入，而且暂时没有其他选择，可以把它当作短期过渡，但要先拿到关键书面确认，并从第一天开始保留证据，同时继续找更低风险的替代机会。";
  }

  if (decision === "VERIFY_FIRST") {
    return `这个机会还有 ${severeOrHigh.length || riskSignals.length} 个关键风险或信息缺口。先问清楚工资、payslip、super、试工和雇主身份，再决定是否去试。`;
  }

  return `基于你提供的信息，这个${labelIndustry(facts.industry)}机会没有明显的严重风险信号。仍建议保存聊天记录，并在上班前确认工资、排班和 payslip。`;
}

function buildQuestionsForEmployer(
  facts: OpportunityFacts,
  riskSignals: RiskSignal[]
): string[] {
  const questions = [
    "Could you confirm the legal employer name, ABN if available, and workplace address?",
    "Could you confirm the hourly rate before tax, pay cycle, and whether payslips are provided?",
    "Could you confirm whether super is paid on top of wages and which employment type this role is?",
  ];

  if (facts.trialShiftHours && facts.trialPaid !== "yes") {
    questions.push(
      "Is the trial or training shift paid? If unpaid, how long is it, what tasks will I do, and who will supervise it?"
    );
  }

  if (facts.visaType === "500") {
    questions.push(
      "Could you send the expected roster for each 14-day fortnight so I can check my student visa work limit?"
    );
  }

  if (riskSignals.some((signal) => signal.category === "scam")) {
    questions.push(
      "Can I verify this role through your official company email, website, or the original job platform listing?"
    );
  }

  return questions;
}

function buildSafeguards(
  facts: OpportunityFacts,
  riskSignals: RiskSignal[]
): string[] {
  const safeguards = [
    "Do not pay any deposit, recharge fee, training fee, or crypto top-up to start work.",
    "Keep screenshots of the job ad, recruiter profile, pay discussion, roster, and every shift worked.",
    "Write your own shift log after every shift: date, start time, finish time, break, location, and pay received.",
    "Ask for pay by bank transfer and a payslip for each pay period.",
  ];

  if (facts.cashPressure === "high" && facts.hasOtherOptions === "none") {
    safeguards.push(
      "Set a short review point after the first one or two pay cycles. If pay, payslips, or roster promises are not met, treat it as a sign to exit."
    );
  }

  if (riskSignals.some((signal) => signal.category === "visa")) {
    safeguards.push(
      "Track work hours across rolling 14-day fortnights, including unpaid work experience unless it is a mandatory course requirement."
    );
  }

  if (facts.asksForIdentityDocsEarly) {
    safeguards.push(
      "Do not send passport, licence, Medicare, banking, or tax details until you have independently verified the employer."
    );
  }

  return safeguards;
}

function buildVerificationSteps(
  facts: OpportunityFacts,
  riskSignals: RiskSignal[]
): OpportunityReport["verificationSteps"] {
  const steps: OpportunityReport["verificationSteps"] = [
    {
      id: "verify-employer-identity",
      title: "Verify the employer through an independent source",
      description:
        "Search the business name, ABN, workplace address, and official website yourself. Do not rely only on links sent in chat messages.",
      url: "https://abr.business.gov.au/",
      priority: "before_documents",
    },
    {
      id: "check-pay-benchmark",
      title: "Check the pay rate against official tools",
      description:
        "Use Fair Work's Pay and Conditions Tool for award-specific pay rates, penalty rates, allowances, and classifications.",
      url: "https://calculate.fairwork.gov.au/FindYourAward",
      priority: "before_shift",
    },
    {
      id: "save-evidence",
      title: "Create an evidence file before starting",
      description:
        "Save the ad, recruiter profile, messages, roster, pay rate, employer details, and your own shift log.",
      url: "https://www.fairwork.gov.au/tools-and-resources/record-my-hours-app",
      priority: "before_shift",
    },
  ];

  if (facts.visaType === "500") {
    steps.push({
      id: "check-visa-hours",
      title: "Check the roster against student visa work limits",
      description:
        "Ask for the expected roster across each rolling 14-day fortnight before accepting shifts during a study period.",
      url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500",
      priority: "before_shift",
    });
  }

  if (riskSignals.some((signal) => signal.category === "scam")) {
    steps.unshift({
      id: "stop-scam-pressure",
      title: "Pause if there is pressure, payment, or identity collection",
      description:
        "If the recruiter pushes for quick action, asks for money, or requests documents too early, stop and verify through official contact details.",
      url: "https://www.scamwatch.gov.au/types-of-scams/jobs-and-employment-scams",
      priority: "before_contact",
    });
  }

  return steps;
}

function buildAlternatives(industry: OpportunityFacts["industry"]): OpportunityAlternative[] {
  const common = [
    {
      title: "Campus jobs",
      whySafer:
        "University or campus employers are easier to verify and usually have clearer payroll processes.",
      whatToSearch: ["campus casual", "student ambassador", "library assistant"],
    },
    {
      title: "Large employers with payroll systems",
      whySafer:
        "Bigger employers are not risk-free, but payslips, rosters, and super are usually more standardized.",
      whatToSearch: ["casual team member", "night fill", "customer assistant"],
    },
  ];

  switch (industry) {
    case "restaurant":
    case "cafe":
    case "hotpot":
    case "bubble_tea":
    case "catering":
      return [
        {
          title: "Chain fast food or cafe casual",
          whySafer:
            "Similar customer-service or food-prep work, with a higher chance of written rosters and formal payroll.",
          whatToSearch: ["crew member casual", "cafe all-rounder payroll", "food service assistant"],
        },
        ...common,
      ];
    case "warehouse":
    case "delivery":
      return [
        {
          title: "Retail distribution centre or supermarket night fill",
          whySafer:
            "Similar physical work, but often advertised through official employer portals or known labour-hire agencies.",
          whatToSearch: ["warehouse team member", "pick packer agency", "night fill casual"],
        },
        ...common,
      ];
    case "cleaning":
      return [
        {
          title: "Registered cleaning agency or facilities role",
          whySafer:
            "Agency or facility roles are easier to verify and more likely to provide rosters, payslips, and workplace insurance coverage.",
          whatToSearch: ["cleaning attendant payroll", "facilities cleaner casual", "school cleaner casual"],
        },
        ...common,
      ];
    case "retail":
      return [
        {
          title: "Supermarket, pharmacy, or chain retail casual",
          whySafer:
            "Similar retail experience, usually with clearer award coverage and payroll records.",
          whatToSearch: ["retail assistant casual", "supermarket team member", "pharmacy assistant casual"],
        },
        ...common,
      ];
    default:
      return common;
  }
}

function labelIndustry(industry: OpportunityFacts["industry"]): string {
  return industry.replace(/_/g, " ");
}
