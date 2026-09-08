import { z } from "zod";
import { factsSchema } from "@/lib/case-model";
import type { OpportunityDecision, OpportunityReport } from "@/types/opportunity";

export const agentMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(4000),
});

export const agentRequestSchema = z
  .object({
    caseId: z.string().uuid().optional(),
    language: z.enum(["zh", "en"]).default("zh"),
    question: z.string().trim().min(1).max(4000),
    facts: factsSchema,
    history: z.array(agentMessageSchema).max(12).default([]),
  })
  .refine(
    (body) =>
      body.question.length +
        body.history.reduce((total, item) => total + item.content.length, 0) <=
      16000,
    "Agent context is too large",
  );

export type AgentRequest = z.infer<typeof agentRequestSchema>;

export const agentPlanItemSchema = z.object({
  id: z.string().max(120),
  kind: z.enum(["assessment", "human_confirmation", "official_check"]),
  label: z.string().max(500),
  required: z.boolean(),
});
export type AgentPlanItem = z.infer<typeof agentPlanItemSchema>;

export const agentTraceItemSchema = z.object({
  node: z.enum(["assess", "plan", "human_input", "retrieve", "explain"]),
  status: z.enum(["completed", "attention", "fallback"]),
  detail: z.string().max(300),
});
export type AgentTraceItem = z.infer<typeof agentTraceItemSchema>;

export interface RetrievedGuidance {
  id: string;
  title: string;
  summary: string;
  sourceUrl: string;
  authority: string;
  reviewedAt: string;
  reviewDue: string;
  stale: boolean;
  score: number;
  matchedTerms: string[];
}

export interface AgentWorkflowResult {
  requestId: string;
  status: "needs_user_input" | "completed";
  explanationMode: "model" | "deterministic";
  answer: string;
  decision: OpportunityDecision;
  missingFacts: string[];
  plan: AgentPlanItem[];
  sources: RetrievedGuidance[];
  trace: AgentTraceItem[];
  report: OpportunityReport;
  modelUsed: boolean;
}
