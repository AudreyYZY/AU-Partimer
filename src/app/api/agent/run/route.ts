import { apiRoute, readJson } from "@/lib/server/http";
import { agentRequestSchema } from "@/services/agent/types";
import { runAgentWorkflow } from "@/services/agent/workflow";

export const maxDuration = 45;

export const POST = apiRoute("agent", async (request) => {
  const parsed = agentRequestSchema.safeParse(await readJson(request, 60000));
  if (!parsed.success)
    return Response.json({ error: "INVALID_AGENT_REQUEST" }, { status: 400 });
  return Response.json(await runAgentWorkflow(parsed.data));
});
