import { NextResponse } from "next/server";
import { apiRoute, readJson } from "@/lib/server/http";
import { z } from "zod";
import { AU_STATES } from "@/lib/constants";
import { verifyEmployerIdentity } from "@/services/verification/abn";

export const runtime = "nodejs";

const VerificationRequestSchema = z.object({
  query: z.string().trim().min(2).max(200),
  state: z.enum(AU_STATES).optional(),
});

export const POST = apiRoute("registry", async (request) => {
  try {
    const body = await readJson(request, 2048);
    const parsed = VerificationRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "请输入雇主名称、ABN 或 ACN", details: parsed.error.issues },
        { status: 400 },
      );
    }

    const result = await verifyEmployerIdentity(
      parsed.data.query,
      parsed.data.state,
    );
    const status =
      result.status === "invalid_identifier"
        ? 400
        : result.status === "manual_required"
          ? 501
          : result.status === "service_error"
            ? 502
            : 200;

    return NextResponse.json(result, { status });
  } catch (error) {
    if (error instanceof Error && "status" in error) throw error;
    return NextResponse.json({ error: "雇主身份核验失败" }, { status: 500 });
  }
});
