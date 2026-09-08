import test from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { createCase } from "../../src/lib/case-model";

test(
  "real database enforces case ownership, revisions, encryption and shared budgets",
  { skip: !process.env.TEST_DATABASE_URL },
  async () => {
    Object.assign(process.env, {
      DATABASE_URL: process.env.TEST_DATABASE_URL,
      NODE_ENV: "production",
      APP_ACCESS_TOKEN: "test-access-token-".repeat(3),
      CASE_ENCRYPTION_KEY: "ab".repeat(32),
      ENABLE_REMOTE_BACKUP: "true",
      NEXT_PUBLIC_APP_URL: "http://localhost",
    });
    const { GET, PUT, DELETE } = await import("../../src/app/api/cases/route");
    const { getDatabase } = await import("../../src/lib/prisma");
    const { consumeBudget } = await import("../../src/lib/server/http");
    const db = getDatabase();
    const token = "au-access=" + process.env.APP_ACCESS_TOKEN;
    const req = (method: string, cookie = token, body?: unknown) =>
      new NextRequest("http://localhost/api/cases", {
        method,
        headers: {
          cookie,
          "content-type": "application/json",
          origin: "http://localhost",
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    const work = createCase("Private test");
    try {
      assert.equal((await GET(req("GET", ""))).status, 401);
      const a = await GET(req("GET"));
      const b = await GET(req("GET"));
      const ownerA = a.headers.get("set-cookie")!.split(";")[0],
        ownerB = b.headers.get("set-cookie")!.split(";")[0];
      const cookiesA = token + "; " + ownerA,
        cookiesB = token + "; " + ownerB;
      const put = await PUT(
        req("PUT", cookiesA, { case: work, expectedRevision: 0 }),
      );
      assert.equal(put.status, 200);
      const row = await db.caseRecord.findUniqueOrThrow({
        where: { id: work.id },
      });
      assert.ok(!row.encrypted.includes("Private test"));
      const listA = await (await GET(req("GET", cookiesA))).json();
      const listB = await (await GET(req("GET", cookiesB))).json();
      assert.equal(listA.cases.length, 1);
      assert.equal(listB.cases.length, 0);
      assert.equal(
        (await PUT(req("PUT", cookiesB, { case: work, expectedRevision: 1 })))
          .status,
        409,
      );
      assert.equal(
        (await PUT(req("PUT", cookiesA, { case: work, expectedRevision: 1 })))
          .status,
        200,
      );
      assert.equal(
        (await PUT(req("PUT", cookiesA, { case: work, expectedRevision: 1 })))
          .status,
        409,
      );
      await DELETE(req("DELETE", cookiesB, { id: work.id }));
      assert.ok(await db.caseRecord.findUnique({ where: { id: work.id } }));
      const key = "integration:" + crypto.randomUUID();
      const budgets = await Promise.all(
        Array.from({ length: 6 }, () => consumeBudget(key, 2, 60000)),
      );
      assert.equal(budgets.filter(Boolean).length, 2);
      await DELETE(req("DELETE", cookiesA, { id: work.id }));
      assert.equal(
        await db.caseRecord.findUnique({ where: { id: work.id } }),
        null,
      );
      await db.apiBudget.deleteMany({ where: { id: { startsWith: key } } });
    } finally {
      await db.caseRecord.deleteMany({ where: { id: work.id } });
      await db.$disconnect();
    }
  },
);
