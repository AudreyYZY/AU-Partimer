export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";

export interface Finding {
  sourceUrl?: string;
  id: string;
  type: string; // e.g. "underpayment", "missing_super", "payslip_violation"
  title: string;
  severity: Severity;
  explanation: string;
  legalBasis: string;
  legalRef?: string;
  recommendedAction: string;
  evidenceToCollect: string[];
  ruleId?: string;
  triggeredFacts?: Record<string, unknown>;
}

export interface DiagnosticReport {
  id: string;
  sessionId: string;
  summary: string;
  overallAssessment: string;
  nextSteps: string[];
  resources: Array<{ name: string; url?: string; phone?: string }>;
  disclaimer: string;
  findings: Finding[];
  generatedAt: Date;
}

export interface FindingTemplate {
  type: string;
  title: string;
  severity: Severity;
  explanationTemplate: string; // supports ${variable} interpolation
  legalBasis: string;
  legalRef: string;
  recommendedAction: string;
  evidenceToCollect: string[];
}
