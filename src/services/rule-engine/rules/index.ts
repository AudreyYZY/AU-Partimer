// Rule definitions for the employment rights diagnostic engine
// These rules are the SOURCE OF TRUTH for legal determinations
// LLM explains these findings - it does NOT create them

import {
  NATIONAL_MIN_WAGE_CASUAL_HOURLY,
  NATIONAL_MIN_WAGE_EFFECTIVE_FROM,
  NATIONAL_MIN_WAGE_HOURLY,
  SUPER_GUARANTEE_RATE_CURRENT,
} from "@/lib/constants";

export interface StoredRule {
  id: string;
  name: string;
  description: string;
  category: string;
  conditions: Record<string, unknown>;
  event: {
    type: string;
    params: Record<string, unknown>;
  };
  legalRef: string;
  sourceUrl?: string;
}

/**
 * Get all active rules for the rule engine
 * In MVP, rules are defined here. Future: load from database.
 */
export async function getActiveRules(): Promise<StoredRule[]> {
  return [...WAGE_RULES, ...SUPER_RULES, ...PAYSLIP_RULES, ...TRIAL_RULES, ...HOURS_RULES, ...VISA_RULES, ...CASH_RULES];
}

// ─── Wages Rules ──────────────────────────────────────

const WAGE_RULES: StoredRule[] = [
  {
    id: "MIN_WAGE_2026",
    name: "National Minimum Wage Check",
    description: "Checks if hourly rate meets the national minimum wage benchmark (from 1 July 2026)",
    category: "wages",
    conditions: {
      all: [
        { fact: "hourlyRate", operator: "lessThan", value: NATIONAL_MIN_WAGE_HOURLY },
        { fact: "employmentType", operator: "notEqual", value: "casual" },
      ],
    },
    event: {
      type: "UNDERPAYMENT",
      params: {
        severity: "CRITICAL",
        title: "Possible Underpayment - Below Current Minimum Wage Benchmark",
        explanationTemplate:
          `Your hourly rate of $\${hourlyRate} appears to be below the current adult national minimum wage benchmark of $${NATIONAL_MIN_WAGE_HOURLY.toFixed(2)} per hour (from ${NATIONAL_MIN_WAGE_EFFECTIVE_FROM}). Exact pay can depend on award coverage, age, classification, and duties.`,
        legalRef: "Fair Work Act 2009, s.284-294; National Minimum Wage Order 2026",
        recommendedAction:
          "Confirm your award, age-based rate, and classification using the Fair Work Pay Calculator before treating this as a final underpayment conclusion.",
        evidenceToCollect: [
          "Bank statements showing wage payments",
          "Roster or shift records",
          "Messages about pay rates",
          "Any written agreement about pay",
        ],
      },
    },
    legalRef: "Fair Work Act 2009, s.284-294",
    sourceUrl: "https://www.fairwork.gov.au/pay-and-wages/minimum-wages",
  },
  {
    id: "CASUAL_MIN_RATE_2026",
    name: "Casual Minimum Rate Check",
    description: "Checks if casual hourly rate includes the mandatory 25% loading",
    category: "wages",
    conditions: {
      all: [
        { fact: "employmentType", operator: "equal", value: "casual" },
        { fact: "hourlyRate", operator: "lessThan", value: NATIONAL_MIN_WAGE_CASUAL_HOURLY },
      ],
    },
    event: {
      type: "UNDERPAYMENT",
      params: {
        severity: "CRITICAL",
        title: "Possible Underpayment - Casual Rate Below Current Benchmark",
        explanationTemplate:
          `Your casual hourly rate of $\${hourlyRate} appears below the current adult national casual minimum benchmark of $${NATIONAL_MIN_WAGE_CASUAL_HOURLY.toFixed(2)}/hr, which includes 25% casual loading. Exact award rates can depend on age, classification, and duties.`,
        legalRef: "Fair Work Act 2009; Modern Award casual loading provisions",
        recommendedAction:
          "Check the award and classification. Casual employees usually receive a base rate plus casual loading, but the exact minimum rate needs official pay calculator verification.",
        evidenceToCollect: [
          "Bank statements showing payments",
          "Roster showing hours worked",
          "Messages discussing your pay rate",
          "Any contract or offer letter",
        ],
      },
    },
    legalRef: "Fair Work Act 2009",
    sourceUrl: "https://www.fairwork.gov.au/pay-and-wages/minimum-wages",
  },
];

// ─── Superannuation Rules ─────────────────────────────

const SUPER_RULES: StoredRule[] = [
  {
    id: "MISSING_SUPER_2026",
    name: "Missing Superannuation Check",
    description: "Checks if employer is paying mandatory superannuation",
    category: "super",
    conditions: {
      all: [
        { fact: "hasSuper", operator: "equal", value: false },
        { fact: "employmentDurationWeeks", operator: "greaterThan", value: 0 },
      ],
    },
    event: {
      type: "MISSING_SUPER",
      params: {
        severity: "CRITICAL",
        title: "Possible Missing Superannuation",
        explanationTemplate:
          `Your employer may not be paying mandatory superannuation. The current super guarantee rate is ${(SUPER_GUARANTEE_RATE_CURRENT * 100).toFixed(0)}% of eligible earnings. Check your payslip, super fund, or myGov to verify contributions.`,
        legalRef: "Superannuation Guarantee (Administration) Act 1992",
        recommendedAction:
          "Check your super account (myGov/ATO). Ask your employer about super contributions. If unpaid, you can report to the ATO.",
        evidenceToCollect: [
          "Payslips showing (or not showing) super contributions",
          "Super account statements from your fund",
          "Employment contract or offer letter",
          "Bank statements showing gross pay",
        ],
      },
    },
    legalRef: "Superannuation Guarantee (Administration) Act 1992",
    sourceUrl: "https://www.ato.gov.au/businesses-and-organisations/super-for-employers",
  },
];

// ─── Payslip Rules ────────────────────────────────────

const PAYSLIP_RULES: StoredRule[] = [
  {
    id: "NO_PAYSLIP_2026",
    name: "No Payslips Check",
    description: "Checks if employer is providing mandatory payslips",
    category: "payslip",
    conditions: {
      all: [
        { fact: "hasPayslip", operator: "equal", value: false },
        { fact: "employmentDurationWeeks", operator: "greaterThan", value: 1 },
      ],
    },
    event: {
      type: "PAYSLIP_VIOLATION",
      params: {
        severity: "HIGH",
        title: "No Payslips Provided",
        explanationTemplate:
          "Your employer is required to issue payslips within one working day of paying you. Not providing payslips is a breach of the Fair Work Act.",
        legalRef: "Fair Work Act 2009, Section 536",
        recommendedAction:
          "Request payslips from your employer in writing (email/text). Keep records of the request. If refused, contact the Fair Work Ombudsman.",
        evidenceToCollect: [
          "Messages requesting payslips",
          "Bank statements showing payments received",
          "Roster or shift records",
          "Any written communication about your employment",
        ],
      },
    },
    legalRef: "Fair Work Act 2009, Section 536",
    sourceUrl: "https://www.fairwork.gov.au/pay-and-wages/payslips-and-record-keeping",
  },
];

// ─── Trial Shift Rules ────────────────────────────────

const TRIAL_RULES: StoredRule[] = [
  {
    id: "LONG_UNPAID_TRIAL_2026",
    name: "Long Unpaid Trial Shift Check",
    description: "Checks if unpaid trial shift exceeds reasonable duration",
    category: "trial",
    conditions: {
      all: [
        { fact: "trialShiftHours", operator: "greaterThan", value: 4 },
        { fact: "trialPaid", operator: "equal", value: false },
      ],
    },
    event: {
      type: "ILLEGAL_TRIAL",
      params: {
        severity: "CRITICAL",
        title: "Possible Unpaid Trial Exploitation",
        explanationTemplate:
          "Your trial shift of ${trialShiftHours} hours without pay needs careful checking. A short unpaid trial may be allowed only when it is genuinely needed to demonstrate skills and is directly supervised. Longer or productive work may need to be paid.",
        legalRef: "Fair Work Act 2009; Fair Work Ombudsman Guidance on Work Trials",
        recommendedAction:
          "Keep written evidence of the trial length, tasks, supervision, and outcome. Check the Fair Work unpaid trial guidance or contact Fair Work before treating it as unpaid work.",
        evidenceToCollect: [
          "Messages about the trial shift arrangement",
          "Roster showing trial shift times",
          "Any evidence of work performed during trial",
          "Witness statements from other workers",
        ],
      },
    },
    legalRef: "Fair Work Act 2009",
    sourceUrl: "https://www.fairwork.gov.au",
  },
  {
    id: "REPEATED_TRIAL_2026",
    name: "Repeated Trial Shift Check",
    description: "Checks for multiple unpaid trial shifts",
    category: "trial",
    conditions: {
      all: [
        { fact: "trialRepeated", operator: "equal", value: true },
        { fact: "trialPaid", operator: "equal", value: false },
      ],
    },
    event: {
      type: "ILLEGAL_TRIAL",
      params: {
        severity: "CRITICAL",
        title: "Multiple Unpaid Trial Shifts",
        explanationTemplate:
          "Multiple unpaid trial shifts are a serious warning sign because repeated or productive work is less likely to be a genuine short skills demonstration.",
        legalRef: "Fair Work Act 2009; Fair Work Ombudsman Guidance on Work Trials",
        recommendedAction:
          "Keep records of all trial shifts worked. You may be entitled to back pay at the applicable award rate.",
        evidenceToCollect: [
          "Messages about each trial shift",
          "Roster or schedule showing trial shifts",
          "Evidence of work performed",
          "Any communication about potential employment",
        ],
      },
    },
    legalRef: "Fair Work Act 2009",
    sourceUrl: "https://www.fairwork.gov.au",
  },
];

// ─── Hours Rules ──────────────────────────────────────

const HOURS_RULES: StoredRule[] = [
  {
    id: "EXCESSIVE_HOURS_2026",
    name: "Excessive Weekly Hours Check",
    description: "Checks if weekly hours exceed maximum ordinary hours",
    category: "hours",
    conditions: {
      all: [
        { fact: "weeklyHours", operator: "greaterThan", value: 38 },
      ],
    },
    event: {
      type: "OVERTIME_CONCERN",
      params: {
        severity: "MEDIUM",
        title: "Working More Than 38 Hours Per Week",
        explanationTemplate:
          "You report working ${weeklyHours} hours per week. The standard maximum ordinary hours are 38 per week, but overtime and penalty rules depend on the applicable award, agreement, and roster pattern.",
        legalRef: "Fair Work Act 2009, Section 62 (National Employment Standards)",
        recommendedAction:
          "Check if you're being paid overtime rates for hours beyond 38 per week. Keep records of all hours worked.",
        evidenceToCollect: [
          "Timesheets or time records",
          "Roster showing scheduled hours",
          "Bank statements to verify pay matches hours",
          "Messages about extra shifts or hours",
        ],
      },
    },
    legalRef: "Fair Work Act 2009, Section 62",
    sourceUrl: "https://www.fairwork.gov.au",
  },
];

// ─── Visa Rules ───────────────────────────────────────

const VISA_RULES: StoredRule[] = [
  {
    id: "STUDENT_VISA_HOURS_2026",
    name: "Student Visa Work Hours Check",
    description: "Checks if student visa holder exceeds work hour limit",
    category: "visa",
    conditions: {
      all: [
        { fact: "visaType", operator: "equal", value: "500" },
        { fact: "isStudyPeriod", operator: "equal", value: true },
        { fact: "weeklyHours", operator: "greaterThan", value: 24 },
      ],
    },
    event: {
      type: "VISA_RISK",
      params: {
        severity: "HIGH",
        title: "Possible Visa Work Hour Breach",
        explanationTemplate:
          "You report working ${weeklyHours} hours per week on a Student visa (subclass 500) during a study period. Student visa work limits are counted across a rolling 14-day fortnight, so check the exact roster rather than relying only on a weekly average.",
        legalRef: "Migration Regulations 1994, Schedule 8, Condition 8104",
        recommendedAction:
          "Check your visa conditions. Reduce your hours to comply with the 48-hour fortnightly limit during study periods. Seek immigration advice if concerned.",
        evidenceToCollect: [
          "Roster showing all shifts",
          "Timesheet records",
          "Pay slips showing hours worked",
          "University enrollment confirmation",
        ],
      },
    },
    legalRef: "Migration Regulations 1994, Schedule 8, Condition 8104",
    sourceUrl: "https://immi.homeaffairs.gov.au",
  },
];

// ─── Cash Payment Rules ───────────────────────────────

const CASH_RULES: StoredRule[] = [
  {
    id: "CASH_NO_RECORDS_2026",
    name: "Cash Payment Without Records Check",
    description: "Flags cash payment without payslips as a risk indicator",
    category: "wages",
    conditions: {
      all: [
        { fact: "paymentMethod", operator: "equal", value: "cash" },
        { fact: "hasPayslip", operator: "equal", value: false },
      ],
    },
    event: {
      type: "CASH_PAYMENT_RISK",
      params: {
        severity: "HIGH",
        title: "Cash Payment Without Records",
        explanationTemplate:
          "Being paid in cash without receiving payslips is a significant concern. This arrangement may indicate unreported wages, tax avoidance, and makes it difficult to prove your employment terms or claim underpayment.",
        legalRef: "Fair Work Act 2009; Taxation Administration Act 1953",
        recommendedAction:
          "Request payslips and a written employment agreement. Keep your own records of hours worked and payments received. Consider seeking advice from the Fair Work Ombudsman.",
        evidenceToCollect: [
          "Your own records of hours worked (diary, photos of rosters)",
          "Bank deposit records if cash is deposited",
          "Messages about pay arrangements",
          "Any documentation of your employment",
        ],
      },
    },
    legalRef: "Fair Work Act 2009",
    sourceUrl: "https://www.fairwork.gov.au",
  },
];
