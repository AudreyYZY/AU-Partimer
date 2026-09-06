"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  ClipboardCheck,
  FileSearch,
  Gauge,
  Languages,
  MessageSquareText,
  SearchCheck,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NATIONAL_MIN_WAGE_CASUAL_HOURLY,
  NATIONAL_MIN_WAGE_EFFECTIVE_FROM,
  NATIONAL_MIN_WAGE_HOURLY,
  OPPORTUNITY_RULESET_VERSION,
  STUDENT_VISA_500_MAX_HOURS_FORTNIGHT,
} from "@/lib/constants";
import { useLanguagePreference } from "@/hooks/use-language-preference";

const copy = {
  zh: {
    toggle: "English",
    toggleLabel: "Switch to English",
    badge: "AU-Partimer Agent",
    title: "兼职机会风险评估工作台",
    description:
      "面向澳大利亚兼职求职者和留学生。系统把岗位风险拆成诈骗、工资、证据、签证工时和现实压力，输出可追溯的筛查建议。",
    primaryAction: "判断一个兼职",
    secondaryAction: "检查当前工作",
    statusTitle: "规则与能力状态",
    ruleset: "规则版本",
    wageEffective: "工资基准生效",
    outputPrinciple: "输出原则",
    triageOnly: "筛查，不判案",
    flowTitle: "选择当前阶段",
    flowDescription: "四个入口对应不同使用场景，未完成能力会明确标记。",
    reliabilityTitle: "可信度边界",
    reliabilityHeading: "准确性来自可追溯，而不是装作全知",
    reliabilityText:
      "每次机会判断都会返回风险分、证据完整度、来源覆盖、规则版本和限制说明。它可以帮助筛查和准备问题，但不能替代 Fair Work、VEVO、律师或 migration agent。",
    highReliability: "高可信",
    mediumReliability: "中可信",
    unsupportedReliability: "暂不声称可信",
    releaseGateTitle: "企业级上线门槛",
    footer:
      "只提供一般信息，不构成法律建议。具体问题请联系 Fair Work Ombudsman：",
    flows: [
      {
        title: "兼职机会判断",
        stage: "求职前",
        status: "核心可用",
        description: "判断要不要继续聊、先核实什么、有没有更低风险的同类岗位。",
      },
      {
        title: "工作权益体检",
        stage: "已入职",
        status: "规则可用",
        description: "检查工资、工时、工资单、养老金、试工和学生签工时。",
      },
      {
        title: "具体情况分析",
        stage: "遇到事件",
        status: "需配置 LLM",
        description: "通过追问整理被扣钱、赔偿、改排班、威胁辞退等具体情况。",
      },
      {
        title: "文件材料检查",
        stage: "有材料",
        status: "文本抽取可用",
        description: "上传校验、纯文本和可复制文字 PDF 抽取已可用；扫描件和图片 OCR 仍需配置与评估。",
      },
    ],
    controls: [
      ["诈骗硬红旗", "先交钱、加密货币、代收转账、过早索要身份文件会覆盖普通评分。"],
      [
        "工资基准",
        `成人基准 $${NATIONAL_MIN_WAGE_HOURLY.toFixed(2)}/h，casual $${NATIONAL_MIN_WAGE_CASUAL_HOURLY.toFixed(2)}/h。`,
      ],
      [
        "签证工时",
        `学生签 500 上课期间按连续 14 天核对，当前上限 ${STUDENT_VISA_500_MAX_HOURS_FORTNIGHT} 小时。`,
      ],
      ["现实压力", "没有其他选择且急需收入时，输出短期保护策略和退出条件。"],
    ],
    reliability: [
      ["高可信", "明确诈骗信号、全国最低工资基准、工资单要求、学生签工时、证据缺口。"],
      ["中可信", "是否短期过渡、先问哪些问题、同类替代岗位方向。"],
      ["暂不声称可信", "精确 award rate、扫描件/图片 OCR、招聘者本人真实性、个案法律胜算。"],
    ],
    gates: [
      "严重诈骗样例不能被判成可以继续",
      "学生签明显超时不能被忽略",
      "低于当前全国最低基准不能漏报",
      "没有证据时不能给确定违法结论",
    ],
  },
  en: {
    toggle: "中文",
    toggleLabel: "切换到中文",
    badge: "AU-Partimer Agent",
    title: "Part-Time Job Risk Assessment Workbench",
    description:
      "Built for part-time job seekers and international students in Australia. It separates scam, pay, evidence, visa-hour, and practical-pressure risks into traceable screening recommendations.",
    primaryAction: "Check a job",
    secondaryAction: "Check current work",
    statusTitle: "Rules and capability status",
    ruleset: "Ruleset",
    wageEffective: "Wage benchmark effective",
    outputPrinciple: "Output principle",
    triageOnly: "Screening, not adjudication",
    flowTitle: "Choose your current stage",
    flowDescription:
      "Each entry handles a different scenario. Incomplete capabilities are marked clearly.",
    reliabilityTitle: "Reliability boundary",
    reliabilityHeading: "Accuracy comes from traceability, not pretending to know everything",
    reliabilityText:
      "Every opportunity report returns a risk score, evidence completeness, source coverage, ruleset version, and limitation notes. It can help screen and prepare questions, but it cannot replace Fair Work, VEVO, a lawyer, or a migration agent.",
    highReliability: "High confidence",
    mediumReliability: "Medium confidence",
    unsupportedReliability: "Not claimed reliable yet",
    releaseGateTitle: "Enterprise release gates",
    footer:
      "General information only, not legal advice. For specific matters, contact the Fair Work Ombudsman:",
    flows: [
      {
        title: "Opportunity Checker",
        stage: "Before starting",
        status: "Core available",
        description:
          "Decide whether to keep talking, what to verify first, and what safer similar options to search for.",
      },
      {
        title: "Employment Health Check",
        stage: "Already working",
        status: "Rules available",
        description:
          "Check pay, hours, payslips, super, trial shifts, and student visa work-hour risks.",
      },
      {
        title: "Situation Analyzer",
        stage: "Specific issue",
        status: "Needs LLM config",
        description:
          "Collect facts around deductions, compensation demands, roster changes, unpaid trials, or threats.",
      },
      {
        title: "Document Review",
        stage: "Have files",
        status: "Text extraction available",
        description:
          "Upload validation, plain text, and text-based PDF extraction are available. Scanned PDFs and image OCR still need configuration and evaluation.",
      },
    ],
    controls: [
      [
        "Hard scam stops",
        "Upfront payment, crypto, money transfers, and early identity requests override ordinary scoring.",
      ],
      [
        "Pay benchmark",
        `Adult benchmark $${NATIONAL_MIN_WAGE_HOURLY.toFixed(2)}/hr, casual $${NATIONAL_MIN_WAGE_CASUAL_HOURLY.toFixed(2)}/hr.`,
      ],
      [
        "Visa hours",
        `Student visa 500 work limits are checked across a rolling 14-day fortnight, currently ${STUDENT_VISA_500_MAX_HOURS_FORTNIGHT} hours.`,
      ],
      [
        "Practical pressure",
        "When the user has no alternative and needs income, the report gives safeguards and exit conditions.",
      ],
    ],
    reliability: [
      [
        "High confidence",
        "Clear scam signals, national minimum wage benchmarks, payslip requirements, student visa hours, and evidence gaps.",
      ],
      [
        "Medium confidence",
        "Short-term bridge decisions, employer questions, and lower-risk similar job directions.",
      ],
      [
        "Not claimed reliable yet",
        "Precise award rates, scanned PDF/image OCR, recruiter identity authenticity, and legal outcome prediction.",
      ],
    ],
    gates: [
      "Severe scam fixtures must never return proceed",
      "Clear student visa hour risks must not be ignored",
      "Below-benchmark pay must not be missed",
      "Insufficient evidence must not produce a definitive legal conclusion",
    ],
  },
} as const;

const flowMeta = [
  { icon: SearchCheck, href: "/opportunity", accent: "border-l-teal-600" },
  { icon: ClipboardCheck, href: "/diagnostic/health-check", accent: "border-l-sky-600" },
  { icon: MessageSquareText, href: "/diagnostic/analyze", accent: "border-l-emerald-600" },
  { icon: FileSearch, href: "/diagnostic/documents", accent: "border-l-amber-600" },
] as const;

export default function Home() {
  const [language, setLanguage] = useLanguagePreference();
  const t = copy[language];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="container px-4 py-6 md:px-6">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Shield className="h-4 w-4 text-teal-700" />
              {t.badge}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-label={t.toggleLabel}
              className="rounded-md border-slate-300 bg-white"
              onClick={() => setLanguage(language === "zh" ? "en" : "zh")}
            >
              <Languages className="mr-2 h-4 w-4" />
              {t.toggle}
            </Button>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.96fr)_minmax(420px,1.04fr)] lg:items-start">
            <div>
              <h1 className="max-w-3xl text-4xl font-semibold md:text-5xl">
                {t.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
                {t.description}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="rounded-md bg-slate-950 text-white hover:bg-slate-800"
                >
                  <Link href="/opportunity" className="flex items-center">
                    {t.primaryAction}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-md">
                  <Link href="/diagnostic/health-check">{t.secondaryAction}</Link>
                </Button>
              </div>
            </div>

            <div className="border border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
                <div className="font-semibold">{t.statusTitle}</div>
                <Gauge className="h-5 w-5 text-slate-500" />
              </div>
              <dl className="grid grid-cols-2 border-b border-slate-200 text-sm">
                <div className="border-r border-slate-200 p-4">
                  <dt className="text-xs font-medium text-slate-500">{t.ruleset}</dt>
                  <dd className="mt-1 font-semibold">{OPPORTUNITY_RULESET_VERSION}</dd>
                </div>
                <div className="p-4">
                  <dt className="text-xs font-medium text-slate-500">
                    {t.wageEffective}
                  </dt>
                  <dd className="mt-1 font-semibold">{NATIONAL_MIN_WAGE_EFFECTIVE_FROM}</dd>
                </div>
              </dl>
              <div className="divide-y divide-slate-200">
                {t.controls.map(([title, text]) => (
                  <div key={title} className="grid gap-2 px-4 py-3 md:grid-cols-[150px_1fr]">
                    <div className="text-sm font-semibold">{title}</div>
                    <div className="text-sm leading-6 text-slate-600">{text}</div>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-200 bg-white px-4 py-3 text-sm">
                <span className="font-medium text-slate-500">{t.outputPrinciple}: </span>
                <span className="font-semibold">{t.triageOnly}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container px-4 py-8 md:px-6">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold">{t.flowTitle}</h2>
          <p className="mt-1 text-sm text-slate-600">{t.flowDescription}</p>
        </div>

        <div className="grid gap-3">
          {t.flows.map((flow, index) => {
            const meta = flowMeta[index];
            const Icon = meta.icon;

            return (
              <Link
                key={meta.href}
                href={meta.href}
                className={`grid gap-4 border border-l-4 border-slate-200 bg-white p-4 transition-colors hover:border-slate-300 hover:bg-slate-50 ${meta.accent} md:grid-cols-[190px_1fr_170px_32px] md:items-center`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-slate-600" />
                  <div>
                    <div className="text-xs font-medium text-slate-500">
                      0{index + 1} · {flow.stage}
                    </div>
                    <div className="font-semibold">{flow.title}</div>
                  </div>
                </div>
                <p className="text-sm leading-6 text-slate-600">{flow.description}</p>
                <div className="w-fit border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                  {flow.status}
                </div>
                <ArrowRight className="hidden h-4 w-4 justify-self-end text-slate-400 md:block" />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="container grid gap-8 px-4 py-8 md:px-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
              <BadgeCheck className="h-4 w-4 text-teal-700" />
              {t.reliabilityTitle}
            </div>
            <h2 className="mt-3 text-2xl font-semibold">{t.reliabilityHeading}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{t.reliabilityText}</p>
          </div>

          <div className="divide-y divide-slate-200 border border-slate-200">
            {t.reliability.map(([label, text]) => (
              <div key={label} className="grid gap-2 bg-slate-50 p-4 sm:grid-cols-[170px_1fr]">
                <div className="font-semibold">{label}</div>
                <div className="text-sm leading-6 text-slate-600">{text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container px-4 py-8 md:px-6">
        <div className="border border-slate-200 bg-white">
          <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <h2 className="font-semibold">{t.releaseGateTitle}</h2>
          </div>
          <div className="grid gap-0 divide-y divide-slate-200 md:grid-cols-4 md:divide-x md:divide-y-0">
            {t.gates.map((gate) => (
              <div key={gate} className="p-4 text-sm leading-6 text-slate-700">
                {gate}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="container flex flex-col gap-3 px-4 py-6 text-sm text-slate-600 md:px-6">
          <p>
            {t.footer}{" "}
            <a href="tel:131394" className="font-medium underline">
              13 13 94
            </a>
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://www.fairwork.gov.au"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Fair Work Ombudsman
            </a>
            <a
              href="https://calculate.fairwork.gov.au"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Pay Calculator
            </a>
            <a
              href="https://www.scamwatch.gov.au/types-of-scams/jobs-and-employment-scams"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Scamwatch
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
