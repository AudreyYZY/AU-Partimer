import { z } from "zod";
import { apiRoute, readJson } from "@/lib/server/http";
import { factsSchema } from "@/lib/case-model";
import { assessOpportunity } from "@/services/opportunity/decision-engine";

// Both entry points use the same screening contract and unknown-value semantics.
export const POST = apiRoute("screening", async (request) => {
  const body = z
    .object({ answers: factsSchema })
    .safeParse(await readJson(request));
  if (!body.success)
    return Response.json({ error: "INVALID_FACTS" }, { status: 400 });
  return Response.json(assessOpportunity(body.data.answers));
});
