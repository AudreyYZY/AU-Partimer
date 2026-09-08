import { NextResponse } from "next/server";
import { z } from "zod";
import { apiRoute, readJson } from "@/lib/server/http";
import { secureEqual } from "@/lib/server/privacy";
export const POST = apiRoute("access", async (request) => {
  const parsed = z
    .object({ token: z.string().min(32).max(256) })
    .safeParse(await readJson(request, 1024));
  const expected = process.env.APP_ACCESS_TOKEN;
  if (
    !parsed.success ||
    !expected ||
    expected.length < 32 ||
    !secureEqual(parsed.data.token, expected)
  )
    return NextResponse.json({ error: "ACCESS_DENIED" }, { status: 401 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set("au-access", parsed.data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 86400,
    path: "/",
  });
  return response;
});
export const DELETE = apiRoute("access", async () => {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("au-access");
  response.cookies.delete("au-owner");
  return response;
});
