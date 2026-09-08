import {
  OPPORTUNITY_RULESET_VERSION,
  SOURCE_REVIEW_DUE,
} from "@/lib/constants";
export function GET() {
  return Response.json(
    {
      status: "ok",
      rulesetVersion: OPPORTUNITY_RULESET_VERSION,
      sourceReviewDue: SOURCE_REVIEW_DUE,
      capabilities: {
        screening: true,
        chat: Boolean(process.env.OPENAI_API_KEY),
        registry: Boolean(process.env.ABN_LOOKUP_GUID),
        remoteBackup:
          process.env.ENABLE_REMOTE_BACKUP === "true" &&
          Boolean(process.env.DATABASE_URL) &&
          Boolean(process.env.CASE_ENCRYPTION_KEY),
        imageOcr: false,
        exactAwardRates: false,
        expertValidated: false,
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
