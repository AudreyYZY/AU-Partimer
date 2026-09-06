// Prompts for generating explanations of findings

import type { Finding } from "@/types/findings";

/**
 * Generate a prompt for explaining a finding in plain English
 */
export function generateExplanationPrompt(finding: Finding): string {
  return `Explain the following workplace rights finding to a worker who has no legal background.

FINDING:
- Title: ${finding.title}
- Severity: ${finding.severity}
- Type: ${finding.type}
- Legal Reference: ${finding.legalRef ?? "Not specified"}
- Current Explanation: ${finding.explanation}
- Recommended Action: ${finding.recommendedAction}

REQUIREMENTS:
1. Use simple, everyday language (no legal jargon)
2. Explain WHY this matters to the worker
3. Be specific about what they should do next
4. Include relevant Fair Work Ombudsman contact (13 13 94)
5. Keep it under 150 words
6. Be empathetic but factual

Do NOT:
- Provide specific legal advice
- Make guarantees about outcomes
- Use phrases like "you should sue" or "you have a strong case"
- Minimize the seriousness of potential violations

Write the explanation as if speaking directly to the worker.`;
}

/**
 * Generate a prompt for the overall diagnostic summary
 */
export function generateSummaryPrompt(
  findings: Finding[],
  facts: Record<string, unknown>
): string {
  const findingSummaries = findings
    .map(
      (f, i) =>
        `${i + 1}. [${f.severity}] ${f.title}: ${f.explanation.substring(0, 100)}...`
    )
    .join("\n");

  return `Generate a brief summary of this workplace diagnostic report.

FINDINGS IDENTIFIED:
${findingSummaries}

WORKPLACE CONTEXT:
${JSON.stringify(facts, null, 2)}

Write a 2-3 paragraph summary that:
1. Explains the overall situation in plain English
2. Highlights the most serious issues first
3. Reassures the worker that help is available
4. Includes the Fair Work Ombudsman helpline (13 13 94)

Keep the tone supportive and factual. Do not provide legal advice.`;
}
