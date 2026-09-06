import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  ClipboardCheck,
  FileSearch,
  Gauge,
  MessageSquareText,
  SearchCheck,
  Shield,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NATIONAL_MIN_WAGE_CASUAL_HOURLY,
  NATIONAL_MIN_WAGE_EFFECTIVE_FROM,
  NATIONAL_MIN_WAGE_HOURLY,
  OPPORTUNITY_RULESET_VERSION,
  STUDENT_VISA_500_MAX_HOURS_FORTNIGHT,
} from "@/lib/constants";

const FLOWS = [
  {
    title: "兼职机会判断",
    stage: "求职前",
    status: "核心可用",
    description: "判断要不要继续聊、先核实什么、有没有更低风险的同类岗位。",
    icon: SearchCheck,
    href: "/opportunity",
    accent: "bg-teal-500",
  },
  {
    title: "工作权益体检",
    stage: "已入职",
    status: "规则可用",
    description: "检查工资、工时、工资单、养老金、试工和学生签工时。",
    icon: ClipboardCheck,
    href: "/diagnostic/health-check",
    accent: "bg-sky-500",
  },
  {
    title: "具体情况分析",
    stage: "遇到事件",
    status: "需配置 LLM",
    description: "通过追问整理被扣钱、赔偿、改排班、威胁辞退等具体情况。",
    icon: MessageSquareText,
    href: "/diagnostic/analyze",
    accent: "bg-emerald-500",
  },
  {
    title: "文件材料检查",
    stage: "有材料",
    status: "纯文本 MVP",
    description: "上传校验和纯文本提取已可用；PDF/图片 OCR 明确标记暂不支持。",
    icon: FileSearch,
    href: "/diagnostic/documents",
    accent: "bg-amber-500",
  },
] as const;

const CONTROL_POINTS = [
  ["诈骗硬红旗", "先交钱、加密货币、代收转账、过早索要身份文件会覆盖普通评分。"],
  [
    "工资基准",
    `2026-07-01 起成人基准 $${NATIONAL_MIN_WAGE_HOURLY.toFixed(2)}/h，casual $${NATIONAL_MIN_WAGE_CASUAL_HOURLY.toFixed(2)}/h。`,
  ],
  [
    "签证工时",
    `学生签 500 上课期间按连续 14 天核对，当前上限 ${STUDENT_VISA_500_MAX_HOURS_FORTNIGHT} 小时。`,
  ],
  ["现实压力", "没有其他选择且急需收入时，输出短期保护策略和退出条件，而不是简单劝退。"],
] as const;

const RELIABILITY_LEVELS = [
  {
    label: "高可信",
    text: "明确诈骗信号、全国最低工资基准、工资单要求、学生签工时、证据缺口。",
  },
  {
    label: "中可信",
    text: "是否短期过渡、先问哪些问题、同类替代岗位方向。",
  },
  {
    label: "暂不声称可信",
    text: "精确 award rate、雇主真实性自动验证、PDF/图片 OCR、个案法律胜算。",
  },
] as const;

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6f7f2] text-slate-950">
      <section className="border-b border-slate-900 bg-slate-950 text-white">
        <div className="container grid gap-8 px-4 py-10 md:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:py-14">
          <div className="flex flex-col justify-between gap-10">
            <div>
              <div className="inline-flex items-center gap-2 border border-teal-300/40 bg-teal-300/10 px-3 py-1 text-xs font-semibold uppercase text-teal-100">
                <Shield className="h-3.5 w-3.5" />
                AU-Partimer Agent
              </div>
              <h1 className="mt-6 max-w-3xl text-4xl font-semibold md:text-6xl">
                兼职机会的风险、证据和下一步，一次整理清楚
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
                面向澳大利亚兼职求职者和留学生。它不替你做人生决定，而是把诈骗、工资、工资单、养老金、签证工时和现实现金压力分开判断。
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="rounded-md bg-teal-400 text-slate-950 hover:bg-teal-300"
              >
                <Link href="/opportunity" className="flex items-center">
                  判断一个兼职
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-md border-white/20 bg-transparent text-white hover:bg-white hover:text-slate-950"
              >
                <Link href="/diagnostic/health-check">检查当前工作</Link>
              </Button>
            </div>
          </div>

          <div className="border border-white/10 bg-[#111827] p-4 shadow-[12px_12px_0_rgba(20,184,166,0.18)] md:p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-sm font-semibold text-slate-100">Agent 状态面板</p>
                <p className="mt-1 text-xs text-slate-400">
                  规则版本 {OPPORTUNITY_RULESET_VERSION}
                </p>
              </div>
              <Gauge className="h-8 w-8 text-teal-300" />
            </div>

            <div className="mt-4 grid gap-3">
              {CONTROL_POINTS.map(([title, text], index) => (
                <div
                  key={title}
                  className="grid grid-cols-[44px_1fr] border border-white/10"
                >
                  <div className="grid place-items-center border-r border-white/10 bg-white/[0.04] text-sm font-semibold text-teal-100">
                    0{index + 1}
                  </div>
                  <div className="p-3">
                    <div className="text-sm font-semibold text-white">{title}</div>
                    <div className="mt-1 text-xs leading-5 text-slate-400">
                      {text}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="border border-white/10 bg-black/20 p-3">
                <div className="text-slate-400">工资基准生效</div>
                <div className="mt-1 font-semibold text-white">
                  {NATIONAL_MIN_WAGE_EFFECTIVE_FROM}
                </div>
              </div>
              <div className="border border-white/10 bg-black/20 p-3">
                <div className="text-slate-400">输出原则</div>
                <div className="mt-1 font-semibold text-white">筛查，不判案</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container px-4 py-10 md:px-6">
        <div className="mb-5">
          <h2 className="text-2xl font-semibold">选择当前阶段</h2>
          <p className="mt-1 text-sm text-slate-600">
            四个入口处理不同阶段的问题，状态会明确显示。
          </p>
        </div>

        <div className="overflow-hidden border border-slate-900 bg-white">
          {FLOWS.map((flow, index) => (
            <Link
              key={flow.href}
              href={flow.href}
              className="grid gap-4 border-b border-slate-200 p-4 transition-colors last:border-b-0 hover:bg-slate-50 md:grid-cols-[180px_1fr_160px_40px] md:items-center"
            >
              <div className="flex items-center gap-3">
                <span className={`h-9 w-1.5 ${flow.accent}`} />
                <div>
                  <div className="text-xs font-semibold text-slate-500">
                    0{index + 1} · {flow.stage}
                  </div>
                  <div className="font-semibold">{flow.title}</div>
                </div>
              </div>
              <p className="text-sm leading-6 text-slate-600">{flow.description}</p>
              <div className="inline-flex w-fit items-center gap-2 border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                <flow.icon className="h-3.5 w-3.5" />
                {flow.status}
              </div>
              <ArrowRight className="hidden h-4 w-4 justify-self-end text-slate-400 md:block" />
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="container grid gap-8 px-4 py-10 md:px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="inline-flex items-center gap-2 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
              <BadgeCheck className="h-3.5 w-3.5 text-teal-700" />
              可信度边界
            </div>
            <h2 className="mt-4 text-2xl font-semibold">准确，不等于装作全知</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              企业级版本最重要的是可追溯和可评估：每个判断要知道依据、缺失事实、规则版本、适用边界和下一步核查动作。
            </p>
          </div>

          <div className="grid gap-3">
            {RELIABILITY_LEVELS.map((item) => (
              <div
                key={item.label}
                className="grid gap-2 border-l-4 border-slate-900 bg-[#fbfbf7] p-4 sm:grid-cols-[128px_1fr]"
              >
                <div className="font-semibold">{item.label}</div>
                <div className="text-sm leading-6 text-slate-600">{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container grid gap-6 px-4 py-10 md:px-6 lg:grid-cols-3">
        <div className="border border-red-200 bg-red-50 p-4 text-red-950">
          <ShieldAlert className="mb-3 h-6 w-6" />
          <h3 className="font-semibold">不能漏报的情况</h3>
          <p className="mt-2 text-sm leading-6">
            先交钱、代收转账、加密货币充值、学生签明显超时、低于全国最低基准。
          </p>
        </div>
        <div className="border border-amber-200 bg-amber-50 p-4 text-amber-950">
          <AlertTriangle className="mb-3 h-6 w-6" />
          <h3 className="font-semibold">必须说清的限制</h3>
          <p className="mt-2 text-sm leading-6">
            工具不能替代 Fair Work、VEVO、律师或 migration agent；也不能自动证明雇主违法。
          </p>
        </div>
        <div className="border border-teal-200 bg-teal-50 p-4 text-teal-950">
          <FileSearch className="mb-3 h-6 w-6" />
          <h3 className="font-semibold">下一步产品化</h3>
          <p className="mt-2 text-sm leading-6">
            扩充真实案例集、接入 award rate 查询、OCR 证据抽取、雇主 ABN/官网验证和评估报表。
          </p>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="container flex flex-col gap-3 px-4 py-6 text-sm text-slate-600 md:px-6">
          <p>
            只提供一般信息，不构成法律建议。具体问题请联系 Fair Work Ombudsman：
            <a href="tel:131394" className="font-medium underline">
              13 13 94
            </a>
            。
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
              工资计算器
            </a>
            <a
              href="https://www.scamwatch.gov.au/types-of-scams/jobs-and-employment-scams"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Scamwatch 求职诈骗
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
