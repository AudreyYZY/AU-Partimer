import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { caseSchema } from "@/lib/case-model";
import { getDatabase } from "@/lib/prisma";
import { apiRoute, HttpError, readJson } from "@/lib/server/http";
import {
  encryptCase,
  decryptCase,
  ownerHash,
  newOwnerToken,
} from "@/lib/server/privacy";
function owner(request: NextRequest) {
  if (process.env.ENABLE_REMOTE_BACKUP !== "true")
    throw new HttpError(503, "BACKUP_UNAVAILABLE");
  const token = request.cookies.get("au-owner")?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token))
    throw new HttpError(401, "BACKUP_SESSION_REQUIRED");
  return ownerHash(token);
}
export const GET = apiRoute("backup", async (request) => {
  if (process.env.ENABLE_REMOTE_BACKUP !== "true")
    throw new HttpError(503, "BACKUP_UNAVAILABLE");
  if (!request.cookies.get("au-owner")) {
    const response = NextResponse.json({ cases: [] });
    response.cookies.set("au-owner", newOwnerToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 30 * 86400,
    });
    return response;
  }
  const hash = owner(request);
  const rows = await getDatabase().caseRecord.findMany({
    where: { ownerHash: hash },
    take: 20,
    orderBy: { updatedAt: "desc" },
  });
  return Response.json({
    cases: rows.map((row) => ({
      case: caseSchema.parse(decryptCase(row.encrypted, hash + ":" + row.id)),
      remoteRevision: row.revision,
    })),
  });
});
export const PUT = apiRoute("backup", async (request) => {
  const hash = owner(request);
  const parsed = z
    .object({ case: caseSchema, expectedRevision: z.number().int().min(0) })
    .safeParse(await readJson(request, 1_000_000));
  if (!parsed.success) throw new HttpError(400, "INVALID_CASE");
  const data = parsed.data;
  const encrypted = encryptCase(data.case, hash + ":" + data.case.id);
  const db = getDatabase();
  if (data.expectedRevision === 0) {
    await db.$transaction(
      async (tx) => {
        if ((await tx.caseRecord.count({ where: { ownerHash: hash } })) >= 20)
          throw new HttpError(409, "CASE_LIMIT");
        const result = await tx.caseRecord.createMany({
          data: [{ id: data.case.id, ownerHash: hash, encrypted, revision: 1 }],
          skipDuplicates: true,
        });
        if (result.count !== 1) throw new HttpError(409, "REVISION_CONFLICT");
      },
      { isolationLevel: "Serializable" },
    );
    return Response.json({ remoteRevision: 1 });
  }
  const updated = await db.caseRecord.updateMany({
    where: {
      id: data.case.id,
      ownerHash: hash,
      revision: data.expectedRevision,
    },
    data: { encrypted, revision: { increment: 1 } },
  });
  if (updated.count !== 1) throw new HttpError(409, "REVISION_CONFLICT");
  return Response.json({ remoteRevision: data.expectedRevision + 1 });
});
export const DELETE = apiRoute("backup", async (request) => {
  const hash = owner(request);
  const parsed = z
    .object({ id: z.string().uuid() })
    .safeParse(await readJson(request, 1024));
  if (!parsed.success) throw new HttpError(400, "INVALID_CASE");
  await getDatabase().caseRecord.deleteMany({
    where: { id: parsed.data.id, ownerHash: hash },
  });
  return Response.json({ ok: true });
});
