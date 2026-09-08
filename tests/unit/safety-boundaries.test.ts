import test from "node:test";
import assert from "node:assert/strict";
import { boundedChatHistory } from "../../src/lib/chat-history";
import { readBody, HttpError } from "../../src/lib/server/http";
import { evaluateFacts } from "../../src/services/rule-engine/engine";
import { createCase, fortnightWindows } from "../../src/lib/case-model";
import { assessOpportunity } from "../../src/services/opportunity/decision-engine";
import { extractPdf } from "../../src/services/documents/pdf";

test("bounded conversation preserves the newest question within API limits", () => {
  const history = boundedChatHistory([
    ...Array.from({ length: 18 }, () => ({
      role: "assistant" as const,
      content: "x".repeat(12000),
    })),
    { role: "user", content: "Latest question" },
  ]);
  assert.equal(history.at(-1)?.content, "Latest question");
  assert.ok(history.every((m) => m.content.length <= 4000));
  assert.ok(history.reduce((n, m) => n + m.content.length, 0) <= 20000);
});
test("slow streaming request bodies time out", async () => {
  const request = new Request("http://localhost", {
    method: "POST",
    body: new ReadableStream(),
    duplex: "half",
  } as RequestInit);
  await assert.rejects(
    readBody(request, 100, 20),
    (e: unknown) => e instanceof HttpError && e.status === 408,
  );
});
test("unknown wage is not coerced into zero by the rule engine", async () => {
  const report = await evaluateFacts({ age: 25, employmentType: "casual" });
  assert.equal(
    report.findings.some((f) => f.type === "UNDERPAYMENT"),
    false,
  );
});
test("restoring a case copy does not double-count the same recorded shift", () => {
  const shift = { id: crypto.randomUUID(), date: "2026-09-07", hours: 8 };
  assert.equal(
    Math.max(...fortnightWindows([shift, shift]).map((w) => w.hours)),
    8,
  );
});
test("historical dates do not apply the current bundled wage", () => {
  const c = createCase("Historical");
  const report = assessOpportunity(
    { ...c.facts, age: 25, offeredHourlyRate: 10 },
    new Date("2025-09-01"),
  );
  assert.equal(
    report.riskSignals.some((s) => s.id === "below-minimum-benchmark"),
    false,
  );
  assert.ok(report.missingChecks.some((m) => m.includes("predates")));
});
test("malformed PDF fails closed and releases its worker slot", async () => {
  for (let i = 0; i < 3; i++)
    await assert.rejects(
      extractPdf(new TextEncoder().encode("%PDF-invalid")),
      (e: unknown) => e instanceof HttpError && e.status === 422,
    );
});
