import test from "node:test";
import assert from "node:assert/strict";
import { createCase } from "../../src/lib/case-model";
import { runAgentWorkflow } from "../../src/services/agent/workflow";

test("agent completes an auditable deterministic workflow without an API key", async () => {
  const previous = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;
  try {
    const result = await runAgentWorkflow({
      caseId: crypto.randomUUID(),
      language: "zh",
      question: "对方让我明天无薪试工，我应该确认什么？",
      facts: {
        ...createCase("Trial").facts,
        trialShiftHours: 6,
        trialPaid: "no",
      },
      history: [],
    });
    assert.equal(result.explanationMode, "deterministic");
    assert.equal(result.modelUsed, false);
    assert.equal(result.status, "needs_user_input");
    assert.ok(result.answer.includes("当前结论"));
    assert.deepEqual(
      result.trace.map((item) => item.node),
      ["assess", "plan", "human_input", "retrieve", "explain"],
    );
    assert.ok(result.sources.some((source) => source.id === "FWO-UNPAID-TRIALS"));
    assert.ok(result.plan.some((step) => step.kind === "human_confirmation"));
  } finally {
    if (previous === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = previous;
  }
});

test("agent request does not require or receive stored evidence text", async () => {
  const workCase = createCase("Privacy boundary");
  workCase.evidence.push({
    id: crypto.randomUUID(),
    name: "Private message",
    text: "passport and bank details that must not enter the workflow",
    method: "manual",
    confirmed: true,
    createdAt: new Date().toISOString(),
  });
  const result = await runAgentWorkflow({
    language: "en",
    question: "What do I verify?",
    facts: workCase.facts,
    history: [],
  });
  assert.ok(!JSON.stringify(result).includes("passport and bank details"));
});
