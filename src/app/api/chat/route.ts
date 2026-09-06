// POST /api/chat
// Streaming chat endpoint for multi-turn diagnostic conversation

import { NextRequest } from "next/server";
import { streamText } from "ai";
import { z } from "zod";
import { getModel } from "@/services/llm/client";
import {
  DIAGNOSTIC_SYSTEM_PROMPT,
  HEALTH_CHECK_INTRO,
} from "@/services/llm/prompts/diagnostic";
import { extractFactsSchema, paramsToFacts } from "@/services/llm/tools/extract-facts";
import { lookupAwardSchema, lookupAward } from "@/services/llm/tools/lookup-award";
import { evaluateFacts, sortBySeverity } from "@/services/rule-engine/engine";

export const maxDuration = 60; // Allow longer for LLM processing

export async function POST(request: NextRequest) {
  try {
    const { messages, flowType } = await request.json();

    const model = getModel();

    // Build system prompt based on flow type
    const systemPrompt = buildSystemPrompt(flowType);

    // Define tools - using type assertion to handle AI SDK typing
    const tools = {
      submitFacts: {
        description:
          "Submit collected workplace facts for rule engine analysis. Call this when you have gathered enough information to run a diagnostic.",
        parameters: extractFactsSchema,
        execute: async (params: Record<string, unknown>) => {
          const facts = paramsToFacts(params as Parameters<typeof paramsToFacts>[0]);
          const result = await evaluateFacts(facts);
          const findings = sortBySeverity(result.findings);

          return {
            findings: findings.map((f) => ({
              title: f.title,
              severity: f.severity,
              explanation: f.explanation,
              legalRef: f.legalRef,
              recommendedAction: f.recommendedAction,
              evidenceToCollect: f.evidenceToCollect,
            })),
            rulesEvaluated: result.rulesEvaluated,
            rulesTriggered: result.rulesTriggered,
          };
        },
      },
      lookupAward: {
        description:
          "Look up the minimum award rate for a specific industry. Use this when checking if a worker's pay rate is correct.",
        parameters: lookupAwardSchema,
        execute: async (params: Record<string, unknown>) => {
          return await lookupAward(params as Parameters<typeof lookupAward>[0]);
        },
      },
      requestClarification: {
        description:
          "Ask the user a clarifying question about their employment situation.",
        parameters: z.object({
          question: z.string().describe("The question to ask the user"),
          context: z
            .string()
            .describe("Why this information is needed for the diagnostic"),
        }),
        execute: async (params: Record<string, unknown>) => {
          return {
            action: "ask",
            question: params.question,
            context: params.context,
          };
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    const result = streamText({
      model,
      system: systemPrompt,
      messages,
      tools,
      onFinish: async ({ text, toolCalls }) => {
        console.log("Chat finished:", {
          textLength: text.length,
          toolCalls: toolCalls?.length ?? 0,
        });
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: "Chat processing failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

function buildSystemPrompt(flowType?: string): string {
  const base = DIAGNOSTIC_SYSTEM_PROMPT;

  switch (flowType) {
    case "HEALTH_CHECK":
      return `${base}

${HEALTH_CHECK_INTRO}

Your goal is to collect the following information through a natural conversation:
1. State or territory
2. Visa type (student, working holiday, other, or none)
3. Industry (restaurant, cafe, retail, cleaning, warehouse, etc.)
4. Employment type (full-time, part-time, casual)
5. Hourly pay rate
6. How they are paid (cash or bank transfer)
7. Whether they receive payslips
8. Whether their employer pays superannuation
9. Any trial/training shifts and how long they were
10. How long they've been employed
11. Average hours worked per week

Ask questions naturally, one or two at a time. Don't overwhelm the user.
When you have enough information, call the submitFacts tool to run the diagnostic.`;

    case "SITUATION_ANALYZER":
      return `${base}

The user will describe a workplace problem. Your job is to:
1. Understand the situation
2. Ask clarifying questions to gather missing context
3. Determine what workplace rights may be relevant
4. Call submitFacts with the information you've gathered
5. Explain the findings in plain English

Be empathetic and supportive. The user may be stressed about their situation.`;

    case "DOCUMENT_ANALYSIS":
      return `${base}

The user has uploaded a document for analysis. Focus on:
1. Understanding what type of document it is (payslip, contract, message, etc.)
2. Extracting relevant employment information
3. Identifying any red flags or concerns
4. Running a diagnostic based on the extracted information

Call submitFacts when you've extracted enough information.`;

    default:
      return base;
  }
}
