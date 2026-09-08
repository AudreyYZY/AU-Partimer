// Workplace facts extracted from user input or documents
// These are the inputs to the rule engine

export interface WorkplaceFacts {
  // ─── Location & Identity ────────────────────────────
  state?: string; // NSW, VIC, QLD, SA, WA, TAS, NT, ACT
  visaType?: string; // "500", "417", "462", "other", "none"
  isStudyPeriod?: boolean; // for student visa
  industry?: string; // restaurant, cafe, retail, cleaning, warehouse, delivery
  employmentType?: "full_time" | "part_time" | "casual";

  // ─── Wages ──────────────────────────────────────────
  age?: number;
  fortnightHours?: number;
  visaHoursException?: boolean;
  hourlyRate?: number; // as reported by user
  weeklyHours?: number;
  paymentMethod?: "cash" | "bank" | "mixed";

  // ─── Entitlements ───────────────────────────────────
  hasPayslip?: boolean;
  hasSuper?: boolean;
  superRate?: number; // if known

  // ─── Trial & Probation ──────────────────────────────
  trialShiftHours?: number; // total hours of trial
  trialPaid?: boolean;
  trialRepeated?: boolean; // multiple trial shifts
  trialSupervised?: boolean;

  // ─── Employment Duration ────────────────────────────
  employmentDurationWeeks?: number;

  // ─── Document-derived ───────────────────────────────
  awardCode?: string; // if identified from documents
  awardClassification?: string;
  employerAbn?: string;

  // ─── Additional Context ─────────────────────────────
  concerns?: string[]; // user-described concerns
  specificIssue?: string; // for situation analyzer flow
}

// Partial facts for form updates
export type WorkplaceFactsUpdate = Partial<WorkplaceFacts>;
