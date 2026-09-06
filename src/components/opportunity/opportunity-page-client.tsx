"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Languages,
  Scale,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NATIONAL_MIN_WAGE_CASUAL_HOURLY,
  NATIONAL_MIN_WAGE_EFFECTIVE_FROM,
  OPPORTUNITY_RULESET_VERSION,
} from "@/lib/constants";
import {
  OpportunityChecker,
  type OpportunityLanguage,
} from "@/components/opportunity/opportunity-checker";
import { useLanguagePreference } from "@/hooks/use-language-preference";

const pageCopy = {
  zh: {
    back: "返回首页",
    eyebrow: "求职前风险筛查",
    title: "兼职机会判断",
    description:
      "用于入职前快速判断一个岗位是否值得继续。系统会把诈骗、薪资、工资单、养老金、签证工时和现实压力拆开，给出可追溯的下一步建议。",
    toggle: "English",
    toggleLabel: "Switch to English",
    meta: [
      ["规则版本", OPPORTUNITY_RULESET_VERSION],
      ["工资基准生效", NATIONAL_MIN_WAGE_EFFECTIVE_FROM],
      ["成人 casual 基准", `$${NATIONAL_MIN_WAGE_CASUAL_HOURLY.toFixed(2)}/h`],
    ],
    scopeTitle: "本页适合判断",
    scope: ["是否继续和对方沟通", "开始前必须核实的问题", "现金压力高时的保护措施", "更低风险的同类岗位方向"],
    limitTitle: "本页不会判断",
    limits: ["雇主是否一定违法", "精确 award rate", "签证个案后果", "雇主真实性自动验证"],
  },
  en: {
    back: "Back home",
    eyebrow: "Pre-start risk screening",
    title: "Part-Time Opportunity Checker",
    description:
      "Use this before starting a role. The system separates scam, pay, payslip, super, visa-hour, and practical-pressure risks into traceable next-step recommendations.",
    toggle: "中文",
    toggleLabel: "切换到中文",
    meta: [
      ["Ruleset", OPPORTUNITY_RULESET_VERSION],
      ["Wage benchmark effective", NATIONAL_MIN_WAGE_EFFECTIVE_FROM],
      ["Adult casual benchmark", `$${NATIONAL_MIN_WAGE_CASUAL_HOURLY.toFixed(2)}/hr`],
    ],
    scopeTitle: "This page is for",
    scope: [
      "Whether to keep engaging",
      "What to verify before starting",
      "Safeguards under income pressure",
      "Lower-risk similar job directions",
    ],
    limitTitle: "This page does not determine",
    limits: [
      "Whether the employer definitely broke the law",
      "Exact award-specific rates",
      "Individual visa consequences",
      "Automatic employer verification",
    ],
  },
} as const;

export function OpportunityPageClient() {
  const [language, setLanguage] = useLanguagePreference();
  const t = pageCopy[language];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container px-4 py-6 md:px-6 md:py-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-950"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            {t.back}
          </Link>

          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-label={t.toggleLabel}
            className="rounded-md border-slate-300 bg-white"
            onClick={() =>
              setLanguage(language === "zh" ? "en" : "zh")
            }
          >
            <Languages className="mr-2 h-4 w-4" />
            {t.toggle}
          </Button>
        </div>

        <section className="mb-6 border border-slate-200 bg-white">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="p-5 md:p-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
                <Scale className="h-4 w-4 text-teal-700" />
                {t.eyebrow}
              </div>
              <h1 className="mt-3 text-3xl font-semibold text-slate-950 md:text-4xl">
                {t.title}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
                {t.description}
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {t.meta.map(([label, value]) => (
                  <div key={label} className="border border-slate-200 bg-slate-50 p-3">
                    <div className="text-xs font-medium text-slate-500">{label}</div>
                    <div className="mt-1 text-sm font-semibold text-slate-950">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 bg-slate-50 p-5 lg:border-l lg:border-t-0">
              <div className="grid gap-4">
                <ChecklistBlock
                  icon={<BadgeCheck className="h-4 w-4 text-teal-700" />}
                  title={t.scopeTitle}
                  items={t.scope}
                />
                <ChecklistBlock
                  icon={<ShieldAlert className="h-4 w-4 text-amber-700" />}
                  title={t.limitTitle}
                  items={t.limits}
                />
              </div>
            </div>
          </div>
        </section>

        <OpportunityChecker language={language as OpportunityLanguage} />
      </div>
    </div>
  );
}

function ChecklistBlock({
  icon,
  title,
  items,
}: {
  icon: ReactNode;
  title: string;
  items: readonly string[];
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
        {icon}
        {title}
      </div>
      <ul className="space-y-1.5 text-sm leading-6 text-slate-600">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-slate-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
