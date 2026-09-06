"use client";

import { AlertTriangle } from "lucide-react";
import { useLanguagePreference } from "@/hooks/use-language-preference";

const copy = {
  zh: {
    lead: "这不是法律建议。",
    body: "这个工具只用于帮你识别兼职和工作权益风险；具体法律建议请联系",
    suffix: "。",
  },
  en: {
    lead: "This is not legal advice.",
    body: "This tool only helps identify part-time work and employment rights risks. For legal advice, contact",
    suffix: ".",
  },
} as const;

export function DisclaimerBanner() {
  const [language] = useLanguagePreference();
  const t = copy[language];

  return (
    <div className="border-b bg-amber-50 dark:bg-amber-950/30">
      <div className="container flex items-center gap-2 px-4 py-2 text-xs text-amber-800 dark:text-amber-200 md:px-6 md:text-sm">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <p>
          <strong>{t.lead}</strong>{" "}
          {t.body}{" "}
          <a
            href="https://www.fairwork.gov.au"
            className="underline font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            Fair Work Ombudsman
          </a>{" "}
          <strong>13 13 94</strong>
          {t.suffix}
        </p>
      </div>
    </div>
  );
}
