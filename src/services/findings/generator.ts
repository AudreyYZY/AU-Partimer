// Findings Generator Service
// Combines rule engine results into Finding objects and generates reports

import type { WorkplaceFacts } from "@/types/facts";
import type { Finding, DiagnosticReport } from "@/types/findings";
import { evaluateFacts, sortBySeverity } from "@/services/rule-engine/engine";
import { LEGAL_RESOURCES } from "@/lib/constants";

export interface GenerateReportOptions {
  facts: WorkplaceFacts;
  sessionId: string;
  llmSummary?: string; // Optional LLM-generated summary
  llmOverallAssessment?: string; // Optional LLM-generated assessment
}

/**
 * Generate a complete diagnostic report from workplace facts
 */
export async function generateReport(
  options: GenerateReportOptions
): Promise<DiagnosticReport> {
  const { facts, sessionId, llmSummary, llmOverallAssessment } = options;

  // Run the rule engine
  const engineResult = await evaluateFacts(facts);

  // Sort findings by severity
  const findings = sortBySeverity(engineResult.findings);

  // Generate summary (use LLM if available, otherwise deterministic)
  const summary = llmSummary ?? generateDeterministicSummary(findings);

  // Generate overall assessment
  const overallAssessment =
    llmOverallAssessment ?? generateDeterministicAssessment(findings, facts);

  // Generate next steps
  const nextSteps = generateNextSteps(findings);

  // Gather relevant resources
  const resources = gatherResources(findings);

  return {
    id: generateReportId(),
    sessionId,
    summary,
    overallAssessment,
    nextSteps,
    resources,
    disclaimer: getDisclaimer(),
    findings,
    generatedAt: new Date(),
  };
}

/**
 * Generate a deterministic summary based on findings
 * Used when LLM is not available
 */
function generateDeterministicSummary(findings: Finding[]): string {
  if (findings.length === 0) {
    return "Based on the information provided, no specific issues were identified. However, this does not guarantee that your employment is fully compliant. If you have concerns, contact the Fair Work Ombudsman.";
  }

  const criticalCount = findings.filter((f) => f.severity === "CRITICAL").length;
  const highCount = findings.filter((f) => f.severity === "HIGH").length;
  const mediumCount = findings.filter((f) => f.severity === "MEDIUM").length;

  const parts: string[] = [];

  if (criticalCount > 0) {
    parts.push(
      `${criticalCount} critical issue${criticalCount > 1 ? "s" : ""} requiring immediate attention`
    );
  }
  if (highCount > 0) {
    parts.push(
      `${highCount} high-priority concern${highCount > 1 ? "s" : ""}`
    );
  }
  if (mediumCount > 0) {
    parts.push(
      `${mediumCount} medium-priority matter${mediumCount > 1 ? "s" : ""}`
    );
  }

  return `Your workplace diagnostic identified ${parts.join(", ")}. Review each finding below for details and recommended actions.`;
}

/**
 * Generate a deterministic overall assessment
 */
function generateDeterministicAssessment(
  findings: Finding[],
  facts: WorkplaceFacts
): string {
  if (findings.length === 0) {
    return "No significant issues were identified based on the information provided.";
  }

  const hasCritical = findings.some((f) => f.severity === "CRITICAL");
  const assessmentParts: string[] = [];

  if (hasCritical) {
    assessmentParts.push(
      "Your situation shows signs of potential serious workplace violations. You should take action promptly."
    );
  } else {
    assessmentParts.push(
      "Your situation shows some areas of concern that are worth investigating further."
    );
  }

  // Add context about what was checked
  const checksPerformed: string[] = [];
  if (facts.hourlyRate !== undefined) checksPerformed.push("wage rates");
  if (facts.hasSuper !== undefined) checksPerformed.push("superannuation");
  if (facts.hasPayslip !== undefined) checksPerformed.push("payslip compliance");
  if (facts.trialShiftHours !== undefined) checksPerformed.push("trial shift conditions");
  if (facts.weeklyHours !== undefined) checksPerformed.push("working hours");
  if (facts.visaType && facts.visaType !== "none")
    checksPerformed.push("visa work conditions");

  if (checksPerformed.length > 0) {
    assessmentParts.push(
      `This assessment checked: ${checksPerformed.join(", ")}.`
    );
  }

  return assessmentParts.join(" ");
}

/**
 * Generate recommended next steps based on findings
 */
function generateNextSteps(findings: Finding[]): string[] {
  const steps: string[] = [];

  // Always include evidence collection
  if (findings.length > 0) {
    steps.push(
      "Start collecting evidence: keep records of your hours, pay, and any communications with your employer."
    );
  }

  // Add specific steps based on findings
  const hasUnderpayment = findings.some((f) => f.type === "UNDERPAYMENT");
  const hasSuper = findings.some((f) => f.type === "MISSING_SUPER");
  const hasPayslip = findings.some((f) => f.type === "PAYSLIP_VIOLATION");
  const hasTrial = findings.some((f) => f.type === "ILLEGAL_TRIAL");
  const hasVisa = findings.some((f) => f.type === "VISA_RISK");

  if (hasUnderpayment) {
    steps.push(
      "Use the Fair Work Pay Calculator (calculate.fairwork.gov.au) to check your correct pay rate."
    );
  }

  if (hasSuper) {
    steps.push(
      "Check your superannuation account through myGov or your super fund. Report unpaid super to the ATO."
    );
  }

  if (hasPayslip) {
    steps.push(
      "Request payslips from your employer in writing. Keep a copy of the request."
    );
  }

  if (hasTrial) {
    steps.push(
      "Document all hours worked during trial shifts. You may be entitled to back pay."
    );
  }

  if (hasVisa) {
    steps.push(
      "Review your visa conditions carefully. Consider seeking immigration advice if concerned about compliance."
    );
  }

  // Always include Fair Work contact
  steps.push(
    "Contact the Fair Work Ombudsman on 13 13 94 for free advice about your situation."
  );

  // Add translation service for non-English speakers
  steps.push(
    "If you need help in another language, use the Translating and Interpreting Service on 13 14 50."
  );

  return steps;
}

/**
 * Gather relevant resources based on findings
 */
function gatherResources(
  findings: Finding[]
): Array<{ name: string; url?: string; phone?: string }> {
  const resources: Array<{ name: string; url?: string; phone?: string }> = [];

  // Always include Fair Work
  resources.push({
    name: LEGAL_RESOURCES.FAIR_WORK.name,
    url: LEGAL_RESOURCES.FAIR_WORK.url,
    phone: LEGAL_RESOURCES.FAIR_WORK.phone,
  });

  // Add specific resources based on findings
  const hasUnderpayment = findings.some((f) => f.type === "UNDERPAYMENT");
  const hasSuper = findings.some((f) => f.type === "MISSING_SUPER");
  const hasPayslip = findings.some((f) => f.type === "PAYSLIP_VIOLATION");
  const hasVisa = findings.some((f) => f.type === "VISA_RISK");

  if (hasUnderpayment) {
    resources.push({
      name: LEGAL_RESOURCES.PAY_CALCULATOR.name,
      url: LEGAL_RESOURCES.PAY_CALCULATOR.url,
    });
    resources.push({
      name: LEGAL_RESOURCES.FIND_AWARD.name,
      url: LEGAL_RESOURCES.FIND_AWARD.url,
    });
  }

  if (hasSuper) {
    resources.push({
      name: LEGAL_RESOURCES.ATO_SUPER.name,
      url: LEGAL_RESOURCES.ATO_SUPER.url,
    });
  }

  if (hasPayslip) {
    resources.push({
      name: LEGAL_RESOURCES.PAYSLIPS.name,
      url: LEGAL_RESOURCES.PAYSLIPS.url,
    });
  }

  if (hasVisa) {
    resources.push({
      name: LEGAL_RESOURCES.HOME_AFFAIRS.name,
      url: LEGAL_RESOURCES.HOME_AFFAIRS.url,
    });
  }

  // Always include translation service
  resources.push({
    name: LEGAL_RESOURCES.TRANSLATING_SERVICE.name,
    phone: LEGAL_RESOURCES.TRANSLATING_SERVICE.phone,
  });

  return resources;
}

/**
 * Get the standard disclaimer text
 */
function getDisclaimer(): string {
  return "This report is generated by a diagnostic tool and does not constitute legal advice. The information provided is based on general Australian employment law and may not account for all circumstances. For specific legal advice, please consult a qualified lawyer or contact the Fair Work Ombudsman on 13 13 94.";
}

/**
 * Generate a unique report ID
 */
function generateReportId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `rpt_${timestamp}_${random}`;
}
