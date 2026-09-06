"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  CircleAlert,
  Languages,
  Radar,
  ShieldAlert,
} from "lucide-react";
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
    panelTitle: "机会筛查工作台",
    panelSubtitle: "把岗位拆成风险、证据和下一步",
    stageLabels: ["诈骗信号", "工资基准", "证据缺口", "行动策略"],
    decisionLabels: ["不要继续", "先确认", "短期过渡", "相对可继续"],
    sourceLabel: "来源锚点",
    sources: ["Fair Work", "ATO", "Scamwatch"],
    toggle: "English",
    toggleLabel: "Switch to English",
  },
  en: {
    back: "Back home",
    eyebrow: "Part-time opportunity checker",
    title: "Should I continue with this part-time job?",
    description:
      "Screen scam signals, pay, payslips, super, visa-hour limits, and practical pressure before deciding whether to stop, verify first, use it as a short-term bridge, or continue.",
    panelTitle: "Opportunity screening desk",
    panelSubtitle: "Break the role into risk, evidence, and action",
    stageLabels: ["Scam signals", "Pay benchmark", "Evidence gaps", "Action strategy"],
    decisionLabels: ["Do not continue", "Verify first", "Short-term bridge", "Relatively okay"],
    sourceLabel: "Source anchors",
    sources: ["Fair Work", "ATO", "Scamwatch"],
    toggle: "中文",
    toggleLabel: "切换到中文",
  },
} as const;

export function OpportunityPageClient() {
  const [language, setLanguage] = useState<OpportunityLanguage>("zh");
  const t = pageCopy[language];

  return (
    <div className="min-h-screen bg-[#f6f7f2]">
      <div className="container px-4 py-8 md:px-6 md:py-10">
        <div className="mb-6 flex items-center justify-between gap-4">
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
            className="border-slate-300 bg-white/80 shadow-sm"
            onClick={() =>
              setLanguage((current) => (current === "zh" ? "en" : "zh"))
            }
          >
            <Languages className="mr-2 h-4 w-4" />
            {t.toggle}
          </Button>
        </div>

        <section className="mb-8 overflow-hidden rounded-lg border border-slate-900 bg-slate-950 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-6 md:p-8 lg:p-10">
              <div className="mb-6 inline-flex items-center gap-2 border border-teal-300/40 bg-teal-300/10 px-3 py-1 text-xs font-semibold uppercase text-teal-100">
                <Radar className="h-3.5 w-3.5" />
                {t.eyebrow}
              </div>
              <h1 className="max-w-3xl text-4xl font-semibold md:text-5xl">
                {t.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
                {t.description}
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-4">
                {t.stageLabels.map((label, index) => (
                  <div
                    key={label}
                    className="border border-white/10 bg-white/[0.04] p-3"
                  >
                    <div className="text-xs text-slate-400">0{index + 1}</div>
                    <div className="mt-2 text-sm font-medium text-slate-100">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 bg-[#111827] p-6 md:p-8 lg:border-l lg:border-t-0">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-100">
                    {t.panelTitle}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">{t.panelSubtitle}</p>
                </div>
                <ShieldAlert className="h-8 w-8 text-amber-300" />
              </div>

              <div className="space-y-3">
                {t.decisionLabels.map((label, index) => {
                  const palette = [
                    "border-red-400/40 bg-red-400/10 text-red-100",
                    "border-amber-300/40 bg-amber-300/10 text-amber-100",
                    "border-sky-300/40 bg-sky-300/10 text-sky-100",
                    "border-emerald-300/40 bg-emerald-300/10 text-emerald-100",
                  ][index];

                  return (
                    <div
                      key={label}
                      className={`flex items-center justify-between border px-4 py-3 ${palette}`}
                    >
                      <span className="text-sm font-medium">{label}</span>
                      {index === 3 ? (
                        <BadgeCheck className="h-4 w-4" />
                      ) : (
                        <CircleAlert className="h-4 w-4" />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-semibold uppercase text-slate-400">
                  {t.sourceLabel}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {t.sources.map((source) => (
                    <span
                      key={source}
                      className="border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-slate-200"
                    >
                      {source}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <OpportunityChecker language={language} />
      </div>
    </div>
  );
}
