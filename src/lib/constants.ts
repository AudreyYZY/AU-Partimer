// ─── National Minimum Wage (from 1 July 2026) ────────

export const OPPORTUNITY_RULESET_VERSION = "2026.09.06";
export const NATIONAL_MIN_WAGE_EFFECTIVE_FROM = "2026-07-01";
export const NATIONAL_MIN_WAGE_HOURLY = 26.44;
export const NATIONAL_MIN_WAGE_WEEKLY = 1004.9; // 38 hours
export const NATIONAL_MIN_WAGE_CASUAL_HOURLY = 33.05; // Includes 25% loading
export const STANDARD_WEEKLY_HOURS = 38;

// ─── Casual Loading ───────────────────────────────────

export const CASUAL_LOADING_PERCENT = 25;
export const CASUAL_LOADING_MULTIPLIER = 1.25;

// ─── Superannuation ───────────────────────────────────

export const SUPER_GUARANTEE_RATE_CURRENT = 0.12; // 12%
export const SUPER_MIN_AGE = 18;
export const SUPER_UNDER_18_MIN_HOURS_WEEK = 30;

// ─── Trial Shifts ─────────────────────────────────────

export const TRIAL_MAX_UNPAID_HOURS = 4;
export const TRIAL_PROBATION_MAX_MONTHS = 3;

// ─── Visa Work Restrictions ───────────────────────────

export const STUDENT_VISA_500_MAX_HOURS_FORTNIGHT = 48;
export const WHV_MAX_EMPLOYER_MONTHS = 6;

// ─── Payslip Requirements ─────────────────────────────

export const PAYSLIP_ISSUE_DEADLINE_DAYS = 1;
export const RECORD_RETENTION_YEARS = 7;

// ─── Award Codes ──────────────────────────────────────

export const AWARDS = {
  RESTAURANT: "MA000119",
  RETAIL: "MA000004",
  CLEANING: "MA000022",
  WAREHOUSE: "MA000085",
} as const;

// ─── Australian States ────────────────────────────────

export const AU_STATES = [
  "NSW",
  "VIC",
  "QLD",
  "SA",
  "WA",
  "TAS",
  "NT",
  "ACT",
] as const;

export type AUState = (typeof AU_STATES)[number];

// ─── Industry Mapping ─────────────────────────────────

export const INDUSTRY_AWARD_MAP: Record<string, string> = {
  restaurant: AWARDS.RESTAURANT,
  cafe: AWARDS.RESTAURANT,
  catering: AWARDS.RESTAURANT,
  hotpot: AWARDS.RESTAURANT,
  "bubble_tea": AWARDS.RESTAURANT,
  retail: AWARDS.RETAIL,
  cleaning: AWARDS.CLEANING,
  warehouse: AWARDS.WAREHOUSE,
  delivery: AWARDS.WAREHOUSE,
} as const;

// ─── Visa Types ───────────────────────────────────────

export const VISA_TYPES = {
  STUDENT_500: "500",
  WHV_417: "417",
  WHV_462: "462",
  OTHER: "other",
} as const;

// ─── Severity Colors (for UI) ─────────────────────────

export const SEVERITY_COLORS = {
  CRITICAL: { bg: "bg-red-100", text: "text-red-800", border: "border-red-300" },
  HIGH: { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-300" },
  MEDIUM: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-300" },
  LOW: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300" },
  INFO: { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-300" },
} as const;

// ─── Resources ────────────────────────────────────────

export const LEGAL_RESOURCES = {
  FAIR_WORK: {
    name: "Fair Work Ombudsman",
    url: "https://www.fairwork.gov.au",
    phone: "13 13 94",
  },
  PAY_CALCULATOR: {
    name: "Pay Calculator (PACT)",
    url: "https://calculate.fairwork.gov.au/FindYourAward",
  },
  PAY_GUIDES: {
    name: "Pay Guides",
    url: "https://www.fairwork.gov.au/pay-and-wages/pay-guides",
  },
  FIND_AWARD: {
    name: "Find Your Award",
    url: "https://www.fairwork.gov.au/awards-and-agreements",
  },
  MINIMUM_WAGES: {
    name: "Minimum Wages",
    url: "https://www.fairwork.gov.au/pay-and-wages/minimum-wages",
  },
  PUBLIC_HOLIDAYS: {
    name: "Public Holidays",
    url: "https://www.fairwork.gov.au/employment-conditions/public-holidays/list-of-public-holidays",
  },
  PAYSLIPS: {
    name: "Payslips & Record-Keeping",
    url: "https://www.fairwork.gov.au/pay-and-wages/payslips-and-record-keeping",
  },
  FWC: {
    name: "Fair Work Commission",
    url: "https://www.fwc.gov.au",
  },
  ATO_SUPER: {
    name: "ATO Superannuation for Employers",
    url: "https://www.ato.gov.au/businesses-and-organisations/super-for-employers",
  },
  HOME_AFFAIRS: {
    name: "Department of Home Affairs",
    url: "https://immi.homeaffairs.gov.au",
  },
  TRANSLATING_SERVICE: {
    name: "Translating & Interpreting Service",
    phone: "13 14 50",
  },
} as const;
