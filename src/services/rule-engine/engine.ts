// Rule Engine Service
// Uses json-rules-engine for deterministic evaluation of workplace facts
// Both tool outputs and LLM explanations are screening, not legal determinations.

import { Engine, type RuleProperties } from "json-rules-engine";
import type { WorkplaceFacts } from "@/types/facts";
import type { Finding, Severity } from "@/types/findings";
import {
  NATIONAL_MIN_WAGE_EFFECTIVE_FROM,
  SOURCE_REVIEW_DUE,
} from "@/lib/constants";
import { getActiveRules } from "./rules";

export interface RuleEngineResult {
  findings: Finding[];
  factsUsed: Record<string, unknown>;
  rulesEvaluated: number;
  rulesTriggered: number;
}

/**
 * Evaluate workplace facts against the rule engine
 * This is the core deterministic evaluation - no LLM involved
 */
export async function evaluateFacts(
  facts: WorkplaceFacts,
): Promise<RuleEngineResult> {
  const engine = new Engine();

  // Load active rules from our rule definitions
  const rules = await getActiveRules();

  // Add each rule to the engine
  for (const rule of rules) {
    const ruleProperties: RuleProperties = {
      conditions: rule.conditions as RuleProperties["conditions"],
      event: {
        type: rule.event.type,
        params: {
          ...rule.event.params,
          ruleId: rule.id,
          sourceUrl: rule.sourceUrl,
        },
      },
    };
    engine.addRule(ruleProperties);
  }

  // Prepare facts for the engine
  // json-rules-engine expects a flat object of facts
  const engineFacts = prepareFacts(facts);

  // Run the engine
  const { events } = await engine.run(engineFacts);

  // Convert events to findings
  const findings = events.map((event) =>
    eventToFinding(
      {
        type: event.type,
        params: (event.params ?? {}) as Record<string, unknown>,
      },
      facts,
    ),
  );

  return {
    findings: deduplicateFindings(findings),
    factsUsed: engineFacts,
    rulesEvaluated: rules.length,
    rulesTriggered: events.length,
  };
}

/**
 * Prepare workplace facts for the rule engine
 * Ensures all required fields have values (defaults for missing data)
 */
function prepareFacts(facts: WorkplaceFacts): Record<string, unknown> {
  return {
    // Location & Identity
    state: facts.state ?? null,
    visaType: facts.visaType ?? "none",
    isStudyPeriod: facts.isStudyPeriod ?? false,
    industry: facts.industry ?? null,
    employmentType: facts.employmentType ?? null,

    // Wages
    hourlyRate: facts.hourlyRate ?? null,
    adultBenchmarkApplicable:
      facts.age !== undefined &&
      facts.age >= 21 &&
      new Date().toISOString().slice(0, 10) >=
        NATIONAL_MIN_WAGE_EFFECTIVE_FROM &&
      new Date().toISOString().slice(0, 10) <= SOURCE_REVIEW_DUE,
    fortnightHours: facts.fortnightHours ?? null,
    visaHoursException: facts.visaHoursException ?? false,
    weeklyHours: facts.weeklyHours ?? null,
    paymentMethod: facts.paymentMethod ?? null,

    // Entitlements
    hasPayslip: facts.hasPayslip ?? null,
    hasSuper: facts.hasSuper ?? null,
    superRate: facts.superRate ?? null,

    // Trial & Probation
    trialShiftHours: facts.trialShiftHours ?? 0,
    trialPaid: facts.trialPaid ?? null,
    trialRepeated: facts.trialRepeated ?? false,
    trialSupervised: facts.trialSupervised ?? null,

    // Employment Duration
    employmentDurationWeeks: facts.employmentDurationWeeks ?? 0,

    // Document-derived
    awardCode: facts.awardCode ?? null,
    awardClassification: facts.awardClassification ?? null,
    employerAbn: facts.employerAbn ?? null,
  };
}

/**
 * Convert a rule engine event to a Finding object
 */
function eventToFinding(
  event: { type: string; params: Record<string, unknown> },
  originalFacts: WorkplaceFacts,
): Finding {
  const params = event.params;

  // Interpolate explanation template with actual fact values
  const explanation = interpolateTemplate(
    (params.explanationTemplate as string) ?? "",
    originalFacts,
  );

  return {
    id: generateFindingId(event.type),
    type: event.type,
    title: (params.title as string) ?? event.type,
    severity: (params.severity as Severity) ?? "MEDIUM",
    explanation,
    legalBasis:
      "Screening signal; verify applicability with the official source.",
    sourceUrl: params.sourceUrl as string | undefined,
    legalRef: params.legalRef as string,
    recommendedAction: (params.recommendedAction as string) ?? "",
    evidenceToCollect: (params.evidenceToCollect as string[]) ?? [],
    ruleId: String(params.ruleId),
    triggeredFacts: extractTriggeredFacts(event.type, originalFacts),
  };
}

/**
 * Interpolate a template string with fact values
 * Replaces ${key} with the corresponding fact value
 */
function interpolateTemplate(template: string, facts: WorkplaceFacts): string {
  return template.replace(/\$\{(\w+)\}/g, (match, key) => {
    const value = facts[key as keyof WorkplaceFacts];
    if (value === undefined || value === null) return match;
    if (typeof value === "number") {
      return key.includes("Rate") ? `$${value.toFixed(2)}` : String(value);
    }
    return String(value);
  });
}

/**
 * Extract the specific facts that triggered a finding
 * Used for transparency and audit trail
 */
function extractTriggeredFacts(
  eventType: string,
  facts: WorkplaceFacts,
): Record<string, unknown> {
  const relevant: Record<string, unknown> = {};

  switch (eventType) {
    case "UNDERPAYMENT":
      relevant.hourlyRate = facts.hourlyRate;
      relevant.employmentType = facts.employmentType;
      relevant.industry = facts.industry;
      break;
    case "MISSING_SUPER":
      relevant.hasSuper = facts.hasSuper;
      relevant.employmentDurationWeeks = facts.employmentDurationWeeks;
      break;
    case "PAYSLIP_CHECK":
      relevant.hasPayslip = facts.hasPayslip;
      relevant.employmentDurationWeeks = facts.employmentDurationWeeks;
      break;
    case "UNPAID_TRIAL_CHECK":
      relevant.trialShiftHours = facts.trialShiftHours;
      relevant.trialPaid = facts.trialPaid;
      relevant.trialRepeated = facts.trialRepeated;
      break;
    case "VISA_RISK":
      relevant.visaType = facts.visaType;
      relevant.isStudyPeriod = facts.isStudyPeriod;
      relevant.fortnightHours = facts.fortnightHours;
      relevant.visaHoursException = facts.visaHoursException;
      break;
    case "CASH_PAYMENT_RISK":
      relevant.paymentMethod = facts.paymentMethod;
      relevant.hasPayslip = facts.hasPayslip;
      break;
    case "OVERTIME_CONCERN":
      relevant.weeklyHours = facts.weeklyHours;
      break;
    default:
      Object.assign(relevant, facts);
  }

  return relevant;
}

/**
 * Generate a unique ID for a finding
 */
function generateFindingId(eventType: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `f_${eventType.toLowerCase()}_${timestamp}_${random}`;
}

/**
 * Remove duplicate findings based on type
 * Keeps the first occurrence of each finding type
 */
function deduplicateFindings(findings: Finding[]): Finding[] {
  const seen = new Set<string>();
  return findings.filter((finding) => {
    if (seen.has(finding.ruleId ?? finding.type)) return false;
    seen.add(finding.ruleId ?? finding.type);
    return true;
  });
}

/**
 * Sort findings by severity (Critical first, Info last)
 */
export function sortBySeverity(findings: Finding[]): Finding[] {
  const severityOrder: Record<Severity, number> = {
    CRITICAL: 0,
    HIGH: 1,
    MEDIUM: 2,
    LOW: 3,
    INFO: 4,
  };

  return [...findings].sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity],
  );
}
