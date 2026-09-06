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
    return "根据你提供的信息，暂时没有发现明确问题。但这不代表工作安排一定完全合规；如果你仍然担心，建议联系 Fair Work Ombudsman 核对。";
  }

  const criticalCount = findings.filter((f) => f.severity === "CRITICAL").length;
  const highCount = findings.filter((f) => f.severity === "HIGH").length;
  const mediumCount = findings.filter((f) => f.severity === "MEDIUM").length;

  const parts: string[] = [];

  if (criticalCount > 0) {
    parts.push(`${criticalCount} 个需要尽快处理的严重问题`);
  }
  if (highCount > 0) {
    parts.push(`${highCount} 个高优先级风险`);
  }
  if (mediumCount > 0) {
    parts.push(`${mediumCount} 个中等优先级核查项`);
  }

  return `这次工作权益体检发现了${parts.join("、")}。请按严重程度查看每一项的说明和建议行动。`;
}

/**
 * Generate a deterministic overall assessment
 */
function generateDeterministicAssessment(
  findings: Finding[],
  facts: WorkplaceFacts
): string {
  if (findings.length === 0) {
    return "根据你提供的信息，暂时没有发现明显严重问题。";
  }

  const hasCritical = findings.some((f) => f.severity === "CRITICAL");
  const assessmentParts: string[] = [];

  if (hasCritical) {
    assessmentParts.push(
      "你的情况出现了可能较严重的工作权益风险，建议尽快补证据并核对官方信息。"
    );
  } else {
    assessmentParts.push(
      "你的情况有一些值得继续核查的风险点。"
    );
  }

  // Add context about what was checked
  const checksPerformed: string[] = [];
  if (facts.hourlyRate !== undefined) checksPerformed.push("工资水平");
  if (facts.hasSuper !== undefined) checksPerformed.push("养老金");
  if (facts.hasPayslip !== undefined) checksPerformed.push("工资单");
  if (facts.trialShiftHours !== undefined) checksPerformed.push("试工安排");
  if (facts.weeklyHours !== undefined) checksPerformed.push("工时");
  if (facts.visaType && facts.visaType !== "none")
    checksPerformed.push("签证工时条件");

  if (checksPerformed.length > 0) {
    assessmentParts.push(
      `本次检查覆盖：${checksPerformed.join("、")}。`
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
      "先收集证据：保存工时、工资、排班、工资单和与雇主沟通的记录。"
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
      "使用 Fair Work Pay Calculator（calculate.fairwork.gov.au）核对你的正确工资。"
    );
  }

  if (hasSuper) {
    steps.push(
      "通过 myGov 或你的 super fund 核对养老金到账情况；如未支付，可向 ATO 查询或报告。"
    );
  }

  if (hasPayslip) {
    steps.push(
      "用文字向雇主索要工资单，并保存这次请求的记录。"
    );
  }

  if (hasTrial) {
    steps.push(
      "记录所有试工/培训工时；如果实际提供了劳动，可能需要追讨工资。"
    );
  }

  if (hasVisa) {
    steps.push(
      "仔细核对签证条件；如果担心合规风险，考虑寻求移民建议。"
    );
  }

  // Always include Fair Work contact
  steps.push(
    "联系 Fair Work Ombudsman（13 13 94）获取免费信息和进一步指引。"
  );

  // Add translation service for non-English speakers
  steps.push(
    "如果需要中文或其他语言帮助，可使用 Translating and Interpreting Service：13 14 50。"
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
  return "这份报告由诊断工具生成，不构成法律建议。内容基于澳大利亚雇佣法的一般信息，可能无法覆盖你的全部具体情况。具体法律建议请咨询合资格律师，或联系 Fair Work Ombudsman：13 13 94。";
}

/**
 * Generate a unique report ID
 */
function generateReportId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `rpt_${timestamp}_${random}`;
}
