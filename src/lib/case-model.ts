import { z } from "zod";

export const factsSchema = z.object({
  state: z
    .enum(["NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT", "unknown"])
    .default("unknown"),
  visaType: z.enum(["500", "417", "462", "other", "none"]).default("other"),
  isStudyPeriod: z.boolean().optional(),
  age: z.number().int().min(14).max(100).optional(),
  industry: z
    .enum([
      "restaurant",
      "cafe",
      "catering",
      "hotpot",
      "bubble_tea",
      "retail",
      "cleaning",
      "warehouse",
      "delivery",
      "other",
    ])
    .default("other"),
  employerNameOrAbn: z.string().max(200).optional(),
  roleTitle: z.string().max(200).optional(),
  employmentType: z
    .enum(["full_time", "part_time", "casual", "unknown"])
    .default("unknown"),
  offeredHourlyRate: z.number().min(0).max(1000).optional(),
  weeklyHours: z.number().min(0).max(168).optional(),
  fortnightHours: z.number().min(0).max(336).optional(),
  visaHoursException: z.boolean().optional(),
  paymentMethod: z
    .enum(["bank", "cash", "mixed", "unknown"])
    .default("unknown"),
  hasPayslip: z.enum(["yes", "no", "unknown"]).default("unknown"),
  superMentioned: z.enum(["yes", "no", "unknown"]).default("unknown"),
  hasWrittenAgreement: z.enum(["yes", "no", "unknown"]).default("unknown"),
  employerIdentityStatus: z
    .enum(["verified", "provided_unverified", "not_provided", "unknown"])
    .default("unknown"),
  trialShiftHours: z.number().min(0).max(168).optional(),
  trialPaid: z.enum(["yes", "no", "unknown"]).default("unknown"),
  trialSupervised: z.boolean().optional(),
  contactChannel: z
    .enum([
      "official_email",
      "phone",
      "job_platform",
      "wechat",
      "whatsapp",
      "telegram",
      "sms",
      "other",
    ])
    .default("other"),
  requiresUpfrontPayment: z.boolean().optional(),
  asksForBankOrCrypto: z.boolean().optional(),
  asksForIdentityDocsEarly: z.boolean().optional(),
  urgentStartOrPressure: z.boolean().optional(),
  hasOtherOptions: z.enum(["none", "some", "several"]).default("some"),
  cashPressure: z.enum(["low", "medium", "high"]).default("medium"),
  commuteMinutes: z.number().min(0).max(600).optional(),
  commuteCostPerShift: z.number().min(0).max(1000).optional(),
  shiftHours: z.number().min(0.25).max(24).optional(),
  employmentDurationWeeks: z.number().min(0).max(5200).optional(),
  trialRepeated: z.boolean().optional(),
});
export type CaseFacts = z.infer<typeof factsSchema>;

export const daySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const timestamp = Date.parse(value + "T00:00:00Z");
    return (
      Number.isFinite(timestamp) &&
      new Date(timestamp).toISOString().slice(0, 10) === value
    );
  }, "Invalid date");

export const shiftSchema = z.object({
  id: z.string().uuid(),
  date: daySchema,
  hours: z.number().min(0.25).max(24),
  paid: z.number().min(0).max(10000).optional(),
});
export const evidenceSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  text: z.string().max(16000),
  method: z.enum(["manual", "text", "pdf"]),
  confirmed: z.boolean(),
  createdAt: z.string().datetime(),
});
export const caseSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(120),
  phase: z.enum(["considering", "working"]).default("considering"),
  updatedAt: z.string().datetime(),
  revision: z.number().int().min(0).default(0),
  facts: factsSchema,
  evidence: z.array(evidenceSchema).max(20).default([]),
  factEvidence: z.record(z.string().max(100), z.string().uuid()).default({}),
  shifts: z.array(shiftSchema).max(366).default([]),
  questions: z.string().max(4000).default(""),
  reviewDate: daySchema.optional(),
  exitConditions: z.string().max(2000).default(""),
  actions: z
    .record(z.string().max(200), z.boolean())
    .refine((a) => Object.keys(a).length <= 100)
    .default({}),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(12000),
      }),
    )
    .max(20)
    .default([]),
  snapshots: z
    .array(
      z.object({
        at: z.string().datetime(),
        rulesetVersion: z.string().max(40),
        decision: z.enum([
          "STOP",
          "VERIFY_FIRST",
          "SHORT_TERM_WITH_SAFEGUARDS",
          "PROCEED",
        ]),
        facts: factsSchema,
        factEvidence: z
          .record(z.string().max(100), z.string().uuid())
          .default({}),
        signalIds: z.array(z.string().max(100)).max(50),
      }),
    )
    .max(20)
    .default([]),
});
export type WorkCase = z.infer<typeof caseSchema>;
export type Shift = z.infer<typeof shiftSchema>;
export const vaultSchema = z
  .object({
    version: z.literal(1),
    cases: z.array(caseSchema).max(20),
  })
  .refine(
    (v) => new Set(v.cases.map((c) => c.id)).size === v.cases.length,
    "Duplicate case IDs",
  );

export function createCase(title: string): WorkCase {
  return caseSchema.parse({
    id: crypto.randomUUID(),
    title,
    updatedAt: new Date().toISOString(),
    facts: {},
  });
}

// Each Monday starts an overlapping 14-day window, including across month/year boundaries.
export function fortnightWindows(input: Shift[]) {
  // Restored copies retain shift IDs; count the same recorded shift only once.
  const shifts = [...new Map(input.map((shift) => [shift.id, shift])).values()];
  const windows = new Map<number, number>();
  for (const shift of shifts) {
    const day = new Date(shift.date + "T00:00:00Z");
    const monday = day.getTime() - ((day.getUTCDay() + 6) % 7) * 86400000;
    for (const start of [monday, monday - 7 * 86400000]) windows.set(start, 0);
  }
  for (const start of windows.keys()) {
    windows.set(
      start,
      shifts
        .filter((s) => {
          const date = Date.parse(s.date + "T00:00:00Z");
          return date >= start && date < start + 14 * 86400000;
        })
        .reduce((sum, s) => sum + s.hours, 0),
    );
  }
  return [...windows]
    .sort(([a], [b]) => a - b)
    .map(([start, hours]) => ({
      start: new Date(start).toISOString().slice(0, 10),
      hours,
    }));
}

export function effectiveHourlyPay(facts: CaseFacts): number | null {
  if (
    facts.offeredHourlyRate === undefined ||
    !facts.shiftHours ||
    facts.commuteMinutes === undefined ||
    facts.commuteCostPerShift === undefined
  )
    return null;
  return (
    (facts.offeredHourlyRate * facts.shiftHours - facts.commuteCostPerShift) /
    (facts.shiftHours + (facts.commuteMinutes * 2) / 60)
  );
}
