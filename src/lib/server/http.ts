import type { NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { secureEqual } from "./privacy";
import { getDatabase } from "@/lib/prisma";

export class HttpError extends Error {
  constructor(
    public status: number,
    public code: string,
  ) {
    super(code);
  }
}
export async function readBody(
  request: Request,
  limit: number,
  timeoutMs = 15000,
): Promise<Uint8Array> {
  const length = Number(request.headers.get("content-length"));
  if (Number.isFinite(length) && length > limit)
    throw new HttpError(413, "BODY_TOO_LARGE");
  if (!request.body) return new Uint8Array();
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  const deadline = Date.now() + timeoutMs;
  try {
    while (true) {
      let timer: ReturnType<typeof setTimeout> | undefined;
      const result = await Promise.race([
        reader.read(),
        new Promise<never>((_, reject) => {
          timer = setTimeout(
            () => {
              reject(new HttpError(408, "BODY_TIMEOUT"));
              void reader.cancel().catch(() => {});
            },
            Math.max(0, deadline - Date.now()),
          );
        }),
      ]).finally(() => clearTimeout(timer));
      if (result.done) break;
      total += result.value.byteLength;
      if (total > limit) {
        await reader.cancel();
        throw new HttpError(413, "BODY_TOO_LARGE");
      }
      chunks.push(result.value);
    }
  } finally {
    reader.releaseLock();
  }
  const buffer = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return buffer;
}
export async function readJson(
  request: Request,
  limit = 100000,
): Promise<unknown> {
  try {
    return JSON.parse(new TextDecoder().decode(await readBody(request, limit)));
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(400, "INVALID_JSON");
  }
}
const memory = new Map<string, { used: number; until: number }>();
export async function consumeBudget(
  key: string,
  max: number,
  durationMs: number,
  now = Date.now(),
) {
  const bucket = Math.floor(now / durationMs);
  const id = key + ":" + bucket;
  if (process.env.NODE_ENV === "production") {
    const expires = new Date((bucket + 1) * durationMs);
    const db = getDatabase();
    const result = await db.apiBudget.upsert({
      where: { id },
      create: { id, used: 1, expiresAt: expires },
      update: { used: { increment: 1 } },
    });
    return result.used <= max;
  }
  for (const [k, v] of memory) if (v.until <= now) memory.delete(k);
  const value = memory.get(id) ?? { used: 0, until: (bucket + 1) * durationMs };
  if (memory.size >= 10000 && !memory.has(id)) return false;
  value.used++;
  memory.set(id, value);
  return value.used <= max;
}
type Kind =
  "screening" | "chat" | "registry" | "document" | "backup" | "access";
export function hasAccess(request: NextRequest) {
  const expected = process.env.APP_ACCESS_TOKEN;
  const token =
    request.cookies.get("au-access")?.value ??
    request.headers.get("authorization")?.replace(/^Bearer /, "") ??
    "";
  return Boolean(
    expected && expected.length >= 32 && secureEqual(token, expected),
  );
}
export function apiRoute(
  kind: Kind,
  handler: (request: NextRequest) => Promise<Response>,
) {
  return async (request: NextRequest) => {
    const requestId = randomUUID();
    const start = Date.now();
    let response: Response;
    try {
      const origin = request.headers.get("origin");
      const expectedOrigin =
        process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_APP_URL
          ? new URL(process.env.NEXT_PUBLIC_APP_URL).origin
          : request.nextUrl.origin;
      if (origin && origin !== expectedOrigin)
        throw new HttpError(403, "ORIGIN_REJECTED");
      if (
        process.env.NODE_ENV === "production" &&
        kind !== "access" &&
        kind !== "screening" &&
        !hasAccess(request)
      ) {
        throw new HttpError(401, "ACCESS_REQUIRED");
      }
      if (
        !(await consumeBudget(
          "global-minute:" + kind,
          kind === "chat" ? 8 : 60,
          60000,
        ))
      )
        throw new HttpError(429, "RATE_LIMITED");
      if (
        kind === "chat" &&
        !(await consumeBudget("global-chat-day", 100, 86400000))
      )
        throw new HttpError(429, "DAILY_LIMIT");
      response = await handler(request);
    } catch (error) {
      const known = error instanceof HttpError;
      response = Response.json(
        { error: known ? error.code : "SERVICE_UNAVAILABLE", requestId },
        { status: known ? error.status : 503 },
      );
    }
    response.headers.set("X-Request-ID", requestId);
    response.headers.set("Cache-Control", "no-store");
    if (response.status === 429) response.headers.set("Retry-After", "60");
    console.info(
      JSON.stringify({
        event: "api_request",
        requestId,
        kind,
        status: response.status,
        durationMs: Date.now() - start,
      }),
    );
    return response;
  };
}
