import type { CaseFacts } from "@/lib/case-model";
import type { OpportunityReport } from "@/types/opportunity";
import {
  GUIDANCE_DOCUMENTS,
  type GuidanceDocument,
  type GuidanceTopic,
} from "./knowledge-base";
import type { RetrievedGuidance } from "./types";

const categoryTopics: Record<string, GuidanceTopic[]> = {
  scam: ["scam", "identity"],
  pay: ["pay", "award"],
  documentation: ["payslip", "hours"],
  visa: ["visa", "hours"],
  practical: ["hours"],
};

function tokenise(value: string) {
  return new Set(
    value
      .toLowerCase()
      .match(/[a-z0-9]+|[\u3400-\u9fff]{1,4}/g)
      ?.filter((token) => token.length > 1) ?? [],
  );
}

export function inferGuidanceTopics(
  facts: CaseFacts,
  report: OpportunityReport,
): GuidanceTopic[] {
  const topics = new Set<GuidanceTopic>(["identity", "pay"]);
  for (const signal of report.riskSignals)
    for (const topic of categoryTopics[signal.category] ?? []) topics.add(topic);
  if (facts.visaType === "500") {
    topics.add("visa");
    topics.add("hours");
  }
  if (facts.trialShiftHours || facts.trialPaid !== "unknown") topics.add("trial");
  if (facts.hasPayslip !== "yes") topics.add("payslip");
  if (facts.superMentioned !== "yes") topics.add("super");
  if (facts.roleTitle || facts.industry !== "other") topics.add("award");
  return [...topics];
}

function rankDocument(
  document: GuidanceDocument,
  query: string,
  queryTokens: Set<string>,
  topics: Set<GuidanceTopic>,
) {
  const normalisedQuery = query.toLowerCase();
  const matchedTerms = document.keywords.filter((keyword) => {
    if (normalisedQuery.includes(keyword.toLowerCase())) return true;
    const keywordTokens = tokenise(keyword);
    return [...keywordTokens].some((token) => queryTokens.has(token));
  });
  const topicMatches = document.topics.filter((topic) => topics.has(topic));
  return {
    score: topicMatches.length * 10 + matchedTerms.length * 3,
    matchedTerms: [...new Set([...topicMatches, ...matchedTerms])],
  };
}

export function retrieveOfficialGuidance({
  query,
  topics,
  language,
  asOf = new Date(),
  limit = 5,
}: {
  query: string;
  topics: GuidanceTopic[];
  language: "zh" | "en";
  asOf?: Date;
  limit?: number;
}): RetrievedGuidance[] {
  const queryTokens = tokenise(query);
  const topicSet = new Set(topics);
  const normalisedQuery = query.toLowerCase();
  for (const document of GUIDANCE_DOCUMENTS) {
    if (
      document.keywords.some((keyword) =>
        normalisedQuery.includes(keyword.toLowerCase()),
      )
    )
      for (const topic of document.topics) topicSet.add(topic);
  }
  const day = asOf.toISOString().slice(0, 10);
  return GUIDANCE_DOCUMENTS.map((document) => {
    const ranked = rankDocument(document, query, queryTokens, topicSet);
    return {
      id: document.id,
      title: language === "zh" ? document.titleZh : document.title,
      authority: document.authority,
      sourceUrl: document.sourceUrl,
      summary: language === "zh" ? document.summaryZh : document.summaryEn,
      reviewedAt: document.reviewedAt,
      reviewDue: document.reviewDue,
      stale: day > document.reviewDue,
      score: ranked.score,
      matchedTerms: ranked.matchedTerms,
    };
  })
    .filter((document) => document.score > 0)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, Math.max(1, Math.min(limit, 8)));
}
