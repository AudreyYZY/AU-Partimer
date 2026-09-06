"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  OpportunityChecker,
  type OpportunityLanguage,
} from "@/components/opportunity/opportunity-checker";

const pageCopy = {
  zh: {
    back: "返回首页",
    eyebrow: "兼职机会判断",
    title: "这个兼职要不要继续？",
    description:
      "先判断诈骗、薪资、工资单、养老金、签证工时和现实压力，再决定是停止、先确认、短期过渡，还是继续推进。",
    toggle: "English",
    toggleLabel: "Switch to English",
  },
  en: {
    back: "Back home",
    eyebrow: "Part-time opportunity checker",
    title: "Should I continue with this part-time job?",
    description:
      "Screen scam signals, pay, payslips, super, visa-hour limits, and practical pressure before deciding whether to stop, verify first, use it as a short-term bridge, or continue.",
    toggle: "中文",
    toggleLabel: "切换到中文",
  },
} as const;

export function OpportunityPageClient() {
  const [language, setLanguage] = useState<OpportunityLanguage>("zh");
  const t = pageCopy[language];

  return (
    <div className="container px-4 py-8 md:px-6 md:py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          {t.back}
        </Link>

        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label={t.toggleLabel}
          onClick={() => setLanguage((current) => (current === "zh" ? "en" : "zh"))}
        >
          <Languages className="mr-2 h-4 w-4" />
          {t.toggle}
        </Button>
      </div>

      <div className="mb-8">
        <p className="text-sm font-medium text-muted-foreground">{t.eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          {t.title}
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">{t.description}</p>
      </div>

      <OpportunityChecker language={language} />
    </div>
  );
}
