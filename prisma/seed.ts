// prisma/seed.ts
// Seeds the database with legal reference data for the rule engine

// NOTE: This script requires a running PostgreSQL database with DATABASE_URL configured.
// Run after: npx prisma migrate dev
// Then: npx prisma db seed

import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

// ─── Award Rate Benchmarks (from 1 July 2026) ─────────
// IMPORTANT: These are MVP benchmark placeholders, not production legal data.
// Verify exact award rates against official Fair Work Pay Guides before use.

const AWARD_RATES = [
  // Restaurant Industry Award 2020 (MA000119)
  {
    awardCode: "MA000119",
    awardName: "Restaurant Industry Award 2020",
    classification: "Level 1",
    description: "Introductory / Food & Beverage Attendant Grade 1",
    baseHourly: 26.44,
    casualHourly: 33.05,
    effectiveFrom: new Date("2026-07-01"),
  },
  {
    awardCode: "MA000119",
    awardName: "Restaurant Industry Award 2020",
    classification: "Level 2",
    description: "Food & Beverage Attendant Grade 2",
    baseHourly: 25.7,
    casualHourly: 32.13,
    effectiveFrom: new Date("2026-07-01"),
  },
  {
    awardCode: "MA000119",
    awardName: "Restaurant Industry Award 2020",
    classification: "Level 3",
    description: "Food & Beverage Attendant Grade 3 / Cook Grade 1",
    baseHourly: 26.6,
    casualHourly: 33.25,
    effectiveFrom: new Date("2026-07-01"),
  },
  {
    awardCode: "MA000119",
    awardName: "Restaurant Industry Award 2020",
    classification: "Level 4",
    description: "Cook Grade 2",
    baseHourly: 27.5,
    casualHourly: 34.38,
    effectiveFrom: new Date("2026-07-01"),
  },
  {
    awardCode: "MA000119",
    awardName: "Restaurant Industry Award 2020",
    classification: "Level 5",
    description: "Cook Grade 3 / Supervisory",
    baseHourly: 28.6,
    casualHourly: 35.75,
    effectiveFrom: new Date("2026-07-01"),
  },
  {
    awardCode: "MA000119",
    awardName: "Restaurant Industry Award 2020",
    classification: "Level 6",
    description: "Senior Cook / Chef",
    baseHourly: 29.8,
    casualHourly: 37.25,
    effectiveFrom: new Date("2026-07-01"),
  },

  // General Retail Industry Award 2020 (MA000004)
  {
    awardCode: "MA000004",
    awardName: "General Retail Industry Award 2020",
    classification: "Level 1",
    description: "Retail Employee (introductory, first 3 months)",
    baseHourly: 26.74,
    casualHourly: 33.43,
    effectiveFrom: new Date("2026-07-01"),
  },
  {
    awardCode: "MA000004",
    awardName: "General Retail Industry Award 2020",
    classification: "Level 2",
    description: "Retail Employee (after introductory period)",
    baseHourly: 27.6,
    casualHourly: 34.5,
    effectiveFrom: new Date("2026-07-01"),
  },
  {
    awardCode: "MA000004",
    awardName: "General Retail Industry Award 2020",
    classification: "Level 3",
    description: "Retail Employee (experienced)",
    baseHourly: 28.5,
    casualHourly: 35.63,
    effectiveFrom: new Date("2026-07-01"),
  },
  {
    awardCode: "MA000004",
    awardName: "General Retail Industry Award 2020",
    classification: "Level 4",
    description: "Senior Retail Employee",
    baseHourly: 29.5,
    casualHourly: 36.88,
    effectiveFrom: new Date("2026-07-01"),
  },
  {
    awardCode: "MA000004",
    awardName: "General Retail Industry Award 2020",
    classification: "Level 5",
    description: "Supervisory",
    baseHourly: 30.6,
    casualHourly: 38.25,
    effectiveFrom: new Date("2026-07-01"),
  },

  // Cleaning Services Award 2020 (MA000022)
  {
    awardCode: "MA000022",
    awardName: "Cleaning Services Award 2020",
    classification: "Level 1",
    description: "Introductory cleaner",
    baseHourly: 26.44,
    casualHourly: 33.05,
    effectiveFrom: new Date("2026-07-01"),
  },
  {
    awardCode: "MA000022",
    awardName: "Cleaning Services Award 2020",
    classification: "Level 2",
    description: "Experienced cleaner",
    baseHourly: 25.7,
    casualHourly: 32.13,
    effectiveFrom: new Date("2026-07-01"),
  },
  {
    awardCode: "MA000022",
    awardName: "Cleaning Services Award 2020",
    classification: "Level 3",
    description: "Specialised cleaner / Supervisor",
    baseHourly: 26.6,
    casualHourly: 33.25,
    effectiveFrom: new Date("2026-07-01"),
  },

  // Storage Services and Wholesale Award 2020 (MA000085)
  {
    awardCode: "MA000085",
    awardName: "Storage Services and Wholesale Award 2020",
    classification: "Level 1",
    description: "Warehouse employee (basic)",
    baseHourly: 26.44,
    casualHourly: 33.05,
    effectiveFrom: new Date("2026-07-01"),
  },
  {
    awardCode: "MA000085",
    awardName: "Storage Services and Wholesale Award 2020",
    classification: "Level 2",
    description: "Warehouse employee (experienced)",
    baseHourly: 25.7,
    casualHourly: 32.13,
    effectiveFrom: new Date("2026-07-01"),
  },
  {
    awardCode: "MA000085",
    awardName: "Storage Services and Wholesale Award 2020",
    classification: "Level 3",
    description: "Senior warehouse / Forklift",
    baseHourly: 26.6,
    casualHourly: 33.25,
    effectiveFrom: new Date("2026-07-01"),
  },
  {
    awardCode: "MA000085",
    awardName: "Storage Services and Wholesale Award 2020",
    classification: "Level 4",
    description: "Leading hand",
    baseHourly: 27.5,
    casualHourly: 34.38,
    effectiveFrom: new Date("2026-07-01"),
  },
  {
    awardCode: "MA000085",
    awardName: "Storage Services and Wholesale Award 2020",
    classification: "Level 5",
    description: "Supervisory",
    baseHourly: 28.6,
    casualHourly: 35.75,
    effectiveFrom: new Date("2026-07-01"),
  },
];

// ─── Legal Rules ──────────────────────────────────────

const LEGAL_RULES = [
  // Wages Rules
  {
    ruleId: "MIN_WAGE_2026",
    category: "wages",
    name: "National Minimum Wage Check",
    description:
      "Checks if hourly rate meets the national minimum wage benchmark (from 1 July 2026)",
    conditions: JSON.stringify({
      all: [
        { fact: "hourlyRate", operator: "lessThan", value: 26.44 },
        { fact: "employmentType", operator: "notEqual", value: "casual" },
      ],
    }),
    event: JSON.stringify({
      type: "UNDERPAYMENT",
      params: {
        severity: "CRITICAL",
        title: "Possible Underpayment — Below Minimum Wage",
        explanationTemplate:
          "Your hourly rate of $${hourlyRate} appears to be below the current adult national minimum wage benchmark of $26.44 per hour (from 1 July 2026). Exact pay can depend on award coverage, age, classification, and duties.",
        legalRef: "Fair Work Act 2009, s.284-294; National Minimum Wage Order 2026",
        recommendedAction:
          "Confirm your award classification using the Fair Work Pay Calculator. Your employer must pay at least the minimum wage.",
        evidenceToCollect: [
          "Bank statements showing wage payments",
          "Roster or shift records",
          "Messages about pay rates",
          "Any written agreement about pay",
        ],
      },
    }),
    legalRef: "Fair Work Act 2009, s.284-294",
    sourceUrl: "https://www.fairwork.gov.au/pay-and-wages/minimum-wages",
    effectiveFrom: new Date("2026-07-01"),
  },
  {
    ruleId: "CASUAL_MIN_RATE_2026",
    category: "wages",
    name: "Casual Minimum Rate Check",
    description:
      "Checks if casual hourly rate includes the mandatory 25% loading",
    conditions: JSON.stringify({
      all: [
        { fact: "employmentType", operator: "equal", value: "casual" },
        { fact: "hourlyRate", operator: "lessThan", value: 33.05 },
      ],
    }),
    event: JSON.stringify({
      type: "UNDERPAYMENT",
      params: {
        severity: "CRITICAL",
        title: "Possible Underpayment — Casual Rate Below Minimum",
        explanationTemplate:
          "Your casual hourly rate of $${hourlyRate} appears below the current adult national casual minimum benchmark of $33.05/hr, which includes 25% casual loading. Exact award rates can depend on age, classification, and duties.",
        legalRef: "Fair Work Act 2009; Modern Award casual loading provisions",
        recommendedAction:
          "Check your award classification. Casual employees must receive at least the base rate plus 25% casual loading.",
        evidenceToCollect: [
          "Bank statements showing payments",
          "Roster showing hours worked",
          "Messages discussing your pay rate",
          "Any contract or offer letter",
        ],
      },
    }),
    legalRef: "Fair Work Act 2009",
    sourceUrl: "https://www.fairwork.gov.au/pay-and-wages/minimum-wages",
    effectiveFrom: new Date("2026-07-01"),
  },

  // Superannuation Rules
  {
    ruleId: "MISSING_SUPER_2026",
    category: "super",
    name: "Missing Superannuation Check",
    description: "Checks if employer is paying mandatory superannuation",
    conditions: JSON.stringify({
      all: [
        { fact: "hasSuper", operator: "equal", value: false },
        { fact: "employmentDurationWeeks", operator: "greaterThan", value: 0 },
      ],
    }),
    event: JSON.stringify({
      type: "MISSING_SUPER",
      params: {
        severity: "CRITICAL",
        title: "Possible Missing Superannuation",
        explanationTemplate:
          "Your employer may not be paying mandatory superannuation. The current super guarantee rate is 12% of your ordinary time earnings into a super fund. This applies to all employees aged 18+ regardless of hours worked.",
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
    }),
    legalRef: "Superannuation Guarantee (Administration) Act 1992",
    sourceUrl:
      "https://www.ato.gov.au/businesses-and-organisations/super-for-employers",
    effectiveFrom: new Date("2026-07-01"),
  },

  // Payslip Rules
  {
    ruleId: "NO_PAYSLIP_2026",
    category: "payslip",
    name: "No Payslips Check",
    description: "Checks if employer is providing mandatory payslips",
    conditions: JSON.stringify({
      all: [
        { fact: "hasPayslip", operator: "equal", value: false },
        { fact: "employmentDurationWeeks", operator: "greaterThan", value: 1 },
      ],
    }),
    event: JSON.stringify({
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
    }),
    legalRef: "Fair Work Act 2009, Section 536",
    sourceUrl:
      "https://www.fairwork.gov.au/pay-and-wages/payslips-and-record-keeping",
    effectiveFrom: new Date("2026-07-01"),
  },

  // Trial Shift Rules
  {
    ruleId: "LONG_UNPAID_TRIAL_2026",
    category: "trial",
    name: "Long Unpaid Trial Shift Check",
    description: "Checks if unpaid trial shift exceeds reasonable duration",
    conditions: JSON.stringify({
      all: [
        { fact: "trialShiftHours", operator: "greaterThan", value: 4 },
        { fact: "trialPaid", operator: "equal", value: false },
      ],
    }),
    event: JSON.stringify({
      type: "ILLEGAL_TRIAL",
      params: {
        severity: "CRITICAL",
        title: "Possible Unpaid Trial Exploitation",
        explanationTemplate:
          "Your trial shift of ${trialShiftHours} hours without pay may be illegal. Short work trials (approximately 1-4 hours) to demonstrate skills may be unpaid, but longer shifts must be paid at the applicable award rate.",
        legalRef:
          "Fair Work Act 2009; Fair Work Ombudsman Guidance on Work Trials",
        recommendedAction:
          "If your trial was longer than a few hours and you weren't paid, you may be entitled to back pay. Contact the Fair Work Ombudsman.",
        evidenceToCollect: [
          "Messages about the trial shift arrangement",
          "Roster showing trial shift times",
          "Any evidence of work performed during trial",
          "Witness statements from other workers",
        ],
      },
    }),
    legalRef: "Fair Work Act 2009",
    sourceUrl: "https://www.fairwork.gov.au",
    effectiveFrom: new Date("2026-07-01"),
  },
  {
    ruleId: "REPEATED_TRIAL_2026",
    category: "trial",
    name: "Repeated Trial Shift Check",
    description: "Checks for multiple unpaid trial shifts",
    conditions: JSON.stringify({
      all: [
        { fact: "trialRepeated", operator: "equal", value: true },
        { fact: "trialPaid", operator: "equal", value: false },
      ],
    }),
    event: JSON.stringify({
      type: "ILLEGAL_TRIAL",
      params: {
        severity: "CRITICAL",
        title: "Multiple Unpaid Trial Shifts",
        explanationTemplate:
          "Multiple unpaid trial shifts are not considered genuine work trials. If you've worked multiple shifts without pay, you may be entitled to payment for all hours worked.",
        legalRef:
          "Fair Work Act 2009; Fair Work Ombudsman Guidance on Work Trials",
        recommendedAction:
          "Keep records of all trial shifts worked. You may be entitled to back pay at the applicable award rate.",
        evidenceToCollect: [
          "Messages about each trial shift",
          "Roster or schedule showing trial shifts",
          "Evidence of work performed",
          "Any communication about potential employment",
        ],
      },
    }),
    legalRef: "Fair Work Act 2009",
    sourceUrl: "https://www.fairwork.gov.au",
    effectiveFrom: new Date("2026-07-01"),
  },

  // Hours Rules
  {
    ruleId: "EXCESSIVE_HOURS_2026",
    category: "hours",
    name: "Excessive Weekly Hours Check",
    description: "Checks if weekly hours exceed maximum ordinary hours",
    conditions: JSON.stringify({
      all: [
        { fact: "weeklyHours", operator: "greaterThan", value: 38 },
      ],
    }),
    event: JSON.stringify({
      type: "OVERTIME_CONCERN",
      params: {
        severity: "MEDIUM",
        title: "Working More Than 38 Hours Per Week",
        explanationTemplate:
          "You report working ${weeklyHours} hours per week. The standard maximum ordinary hours are 38 per week. Hours beyond this should be paid at overtime rates (typically 1.5x for the first 2-3 hours, then 2x).",
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
    }),
    legalRef: "Fair Work Act 2009, Section 62",
    sourceUrl: "https://www.fairwork.gov.au",
    effectiveFrom: new Date("2026-07-01"),
  },

  // Visa Rules
  {
    ruleId: "STUDENT_VISA_HOURS_2026",
    category: "visa",
    name: "Student Visa Work Hours Check",
    description: "Checks if student visa holder exceeds work hour limit",
    conditions: JSON.stringify({
      all: [
        { fact: "visaType", operator: "equal", value: "500" },
        { fact: "isStudyPeriod", operator: "equal", value: true },
        { fact: "weeklyHours", operator: "greaterThan", value: 24 },
      ],
    }),
    event: JSON.stringify({
      type: "VISA_RISK",
      params: {
        severity: "HIGH",
        title: "Possible Visa Work Hour Breach",
        explanationTemplate:
          "You report working ${weeklyHours} hours per week on a Student visa (subclass 500) during a study period. The limit is 48 hours per fortnight (averaging 24 hours per week). Exceeding this may breach your visa conditions.",
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
    }),
    legalRef: "Migration Regulations 1994, Schedule 8, Condition 8104",
    sourceUrl: "https://immi.homeaffairs.gov.au",
    effectiveFrom: new Date("2023-07-01"),
  },

  // Cash Payment Risk
  {
    ruleId: "CASH_NO_RECORDS_2026",
    category: "wages",
    name: "Cash Payment Without Records Check",
    description: "Flags cash payment without payslips as a risk indicator",
    conditions: JSON.stringify({
      all: [
        { fact: "paymentMethod", operator: "equal", value: "cash" },
        { fact: "hasPayslip", operator: "equal", value: false },
      ],
    }),
    event: JSON.stringify({
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
    }),
    legalRef: "Fair Work Act 2009",
    sourceUrl: "https://www.fairwork.gov.au",
    effectiveFrom: new Date("2026-07-01"),
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  console.log("  Clearing existing data...");
  await prisma.awardRate.deleteMany();
  await prisma.legalRule.deleteMany();

  // Seed Award Rates
  console.log(`  Seeding ${AWARD_RATES.length} award rates...`);
  for (const rate of AWARD_RATES) {
    await prisma.awardRate.create({
      data: {
        ...rate,
        isActive: true,
      },
    });
  }

  // Seed Legal Rules
  console.log(`  Seeding ${LEGAL_RULES.length} legal rules...`);
  for (const rule of LEGAL_RULES) {
    await prisma.legalRule.create({
      data: {
        ...rule,
        isActive: true,
      },
    });
  }

  console.log("✅ Seed complete!");
  console.log(`   - ${AWARD_RATES.length} award rates`);
  console.log(`   - ${LEGAL_RULES.length} legal rules`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
