// POST /api/chat
// Streaming chat endpoint for multi-turn diagnostic conversation

import { NextRequest } from "next/server";
import { streamText } from "ai";
import { z } from "zod";
import { getModel, isLlmConfigured } from "@/services/llm/client";
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

    if (!isLlmConfigured()) {
      return new Response(JSON.stringify({ error: "LLM 未配置，请设置 OPENAI_API_KEY 后再使用具体情况分析。" }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      });
    }

    const model = getModel();

    // Build system prompt based on flow type
    const systemPrompt = buildSystemPrompt(flowType);

    // Define tools - using type assertion to handle AI SDK typing
    const tools = {
      submitFacts: {
        description:
          "Submit collected workplace facts for rule engine analysis. Call this when enough facts are gathered.",
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
          "Look up the conservative wage benchmark for a specific industry.",
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
    return new Response(JSON.stringify({ error: "聊天分析失败" }), {
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
1. 工作州或领地
2. 签证类型
3. 行业
4. 雇佣类型
5. 税前时薪
6. 付款方式
7. 是否有工资单
8. 是否支付养老金
9. 是否有试工/培训班次及其时长
10. 已工作多久
11. 平均每周工时

自然追问，每次只问一两个问题。收集到足够信息后，调用 submitFacts 运行规则诊断。`;

    case "SITUATION_ANALYZER":
      return `${base}

用户会描述一个具体工作问题。你的任务是：
1. 先理解发生了什么
2. 追问缺失背景
3. 判断可能涉及哪些工作权益
4. 在信息足够时调用 submitFacts
5. 用中文解释发现的问题、证据和下一步

语气要支持、冷静、具体。用户可能正因为工作问题感到压力。`;

    case "DOCUMENT_ANALYSIS":
      return `${base}

用户上传了文件。重点是：
1. 判断文件类型，例如工资单、合同、聊天记录、招聘广告
2. 提取雇主、工资、工时、排班、养老金、扣款等信息
3. 标记风险和缺失信息
4. 信息足够时运行规则诊断

提取到足够事实后调用 submitFacts。`;

    default:
      return base;
  }
}
