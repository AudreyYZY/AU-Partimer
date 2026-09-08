import { apiRoute, readJson } from "@/lib/server/http";
import { factsSchema } from "@/lib/case-model";
import { assessOpportunity } from "@/services/opportunity/decision-engine";
export const POST = apiRoute("screening", async (request) => {
  const parsed = factsSchema.safeParse(await readJson(request));
  if (!parsed.success)
    return Response.json({ error: "INVALID_FACTS" }, { status: 400 });
  return Response.json(assessOpportunity(parsed.data));
});
