import test from "node:test";
import assert from "node:assert/strict";
import {
  createCase,
  caseSchema,
  vaultSchema,
  shiftSchema,
  fortnightWindows,
  effectiveHourlyPay,
} from "../../src/lib/case-model";
import { evaluateCases, wilson95 } from "../../src/lib/evaluation";
const shift = (date: string, hours: number) =>
  shiftSchema.parse({ id: crypto.randomUUID(), date, hours });

test("case export preserves confirmed facts, evidence and assessment snapshots", () => {
  const c = createCase("Example");
  const restored = vaultSchema.parse(
    JSON.parse(JSON.stringify({ version: 1, cases: [c] })),
  );
  assert.equal(restored.cases[0].id, c.id);
  assert.equal(c.facts.employerIdentityStatus, "unknown");
  assert.equal(c.facts.requiresUpfrontPayment, undefined);
  assert.deepEqual(restored.cases[0].agentRuns, []);
});
test("imports reject duplicate cases, malformed dates and invalid pay", () => {
  const c = createCase("Example");
  assert.equal(
    vaultSchema.safeParse({ version: 1, cases: [c, c] }).success,
    false,
  );
  assert.equal(
    shiftSchema.safeParse({
      id: crypto.randomUUID(),
      date: "2026-02-30",
      hours: 4,
    }).success,
    false,
  );
  assert.equal(
    caseSchema.safeParse({ ...c, facts: { ...c.facts, offeredHourlyRate: -5 } })
      .success,
    false,
  );
});
test("Monday windows catch overlapping fortnight risks across jobs and years", () => {
  const windows = fortnightWindows([
    shift("2026-12-28", 24),
    shift("2027-01-04", 24),
    shift("2027-01-05", 1),
  ]);
  assert.equal(windows.find((w) => w.start === "2026-12-28")?.hours, 49);
  assert.equal(windows.find((w) => w.start === "2027-01-04")?.hours, 25);
});
test("effective earnings requires explicit travel assumptions", () => {
  const c = createCase("Example");
  assert.equal(effectiveHourlyPay(c.facts), null);
  assert.equal(
    effectiveHourlyPay({
      ...c.facts,
      offeredHourlyRate: 30,
      shiftHours: 4,
      commuteMinutes: 30,
      commuteCostPerShift: 10,
    }),
    22,
  );
});
test("evaluation never claims legal validation from regression labels", () => {
  const result = evaluateCases([]);
  assert.equal(result.expertValidationEstablished, false);
  assert.equal(result.decisionAccuracy, null);
  assert.equal(wilson95(0, 0), null);
  assert.ok(wilson95(10, 10)![0] < 1);
});
