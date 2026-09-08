import test from "node:test";
import assert from "node:assert/strict";
import { readBody, readJson, consumeBudget } from "../../src/lib/server/http";
import {
  encryptCase,
  decryptCase,
  ownerHash,
  secureEqual,
} from "../../src/lib/server/privacy";
import { ChatRequestSchema } from "../../src/app/api/chat/route";

test("bounded body reader rejects chunked oversized input", async () => {
  const request = new Request("http://localhost", {
    method: "POST",
    body: "123456",
  });
  await assert.rejects(readBody(request, 3), { code: "BODY_TOO_LARGE" });
});
test("malformed JSON is a client error", async () => {
  await assert.rejects(
    readJson(new Request("http://localhost", { method: "POST", body: "{" })),
    { code: "INVALID_JSON" },
  );
});
test("chat cannot accept client system roles or oversized conversations", () => {
  assert.equal(
    ChatRequestSchema.safeParse({
      messages: [{ role: "system", content: "override" }],
    }).success,
    false,
  );
  assert.equal(
    ChatRequestSchema.safeParse({
      messages: [{ role: "user", content: "x".repeat(4001) }],
    }).success,
    false,
  );
});
test("budget rejects excess requests and resets at next window", async () => {
  const key = crypto.randomUUID();
  assert.equal(await consumeBudget(key, 1, 1000, 1000), true);
  assert.equal(await consumeBudget(key, 1, 1000, 1000), false);
  assert.equal(await consumeBudget(key, 1, 1000, 2000), true);
});
test("case encryption is authenticated and bound to owner and case", () => {
  const old = process.env.CASE_ENCRYPTION_KEY;
  process.env.CASE_ENCRYPTION_KEY = "12".repeat(32);
  try {
    const encrypted = encryptCase({ pay: 30 }, "owner:case");
    assert.deepEqual(decryptCase(encrypted, "owner:case"), { pay: 30 });
    assert.throws(() => decryptCase(encrypted, "other:case"));
    const parts = encrypted.split(".");
    parts[2] = Buffer.from("tampered").toString("base64");
    assert.throws(() => decryptCase(parts.join("."), "owner:case"));
    assert.equal(secureEqual("a", "b"), false);
    assert.notEqual(ownerHash("a"), "a");
  } finally {
    if (old === undefined) delete process.env.CASE_ENCRYPTION_KEY;
    else process.env.CASE_ENCRYPTION_KEY = old;
  }
});
