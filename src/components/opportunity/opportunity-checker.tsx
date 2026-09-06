"use client";

import { useId, useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  BriefcaseBusiness,
  ClipboardList,
  HelpCircle,
  Loader2,
  ShieldAlert,
  WalletCards,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  AU_STATES,
  NATIONAL_MIN_WAGE_CASUAL_HOURLY,
  NATIONAL_MIN_WAGE_HOURLY,
} from "@/lib/constants";
import type { OpportunityFacts, OpportunityReport } from "@/types/opportunity";

export type OpportunityLanguage = "zh" | "en";

type FormState = Omit<
  OpportunityFacts,
  "offeredHourlyRate" | "weeklyHours" | "trialShiftHours" | "commuteMinutes"
> & {
  offeredHourlyRate: string;
  weeklyHours: string;
  trialShiftHours: string;
  commuteMinutes: string;
};

const initialState: FormState = {
  state: "NSW",
  visaType: "500",
  isStudyPeriod: true,
  industry: "restaurant",
  roleTitle: "",
  employmentType: "casual",
  offeredHourlyRate: "",
  weeklyHours: "",
  paymentMethod: "unknown",
  hasPayslip: "unknown",
  superMentioned: "unknown",
  hasWrittenAgreement: "unknown",
  trialShiftHours: "",
  trialPaid: "unknown",
  contactChannel: "wechat",
  requiresUpfrontPayment: false,
  asksForBankOrCrypto: false,
  asksForIdentityDocsEarly: false,
  urgentStartOrPressure: false,
  hasOtherOptions: "none",
  cashPressure: "medium",
  commuteMinutes: "",
};

const decisionStyles = {
  STOP: "border-red-300 bg-red-50 text-red-900",
  VERIFY_FIRST: "border-amber-300 bg-amber-50 text-amber-950",
  SHORT_TERM_WITH_SAFEGUARDS: "border-blue-300 bg-blue-50 text-blue-950",
  PROCEED: "border-green-300 bg-green-50 text-green-950",
} as const;

const riskBandStyles = {
  severe: "bg-red-600 text-white",
  high: "bg-orange-500 text-white",
  medium: "bg-amber-200 text-amber-950",
  low: "bg-slate-100 text-slate-700",
} as const;

const copy = {
  zh: {
    formTitle: "兼职机会快速判断",
    fields: {
      state: "工作州",
      visaType: "签证/身份",
      isStudyPeriod: "现在是上课期间",
      industry: "行业",
      employmentType: "雇佣类型",
      roleTitle: "岗位名称",
      offeredHourlyRate: "税前时薪",
      weeklyHours: "预计每周工时",
      commuteMinutes: "单程通勤分钟",
      paymentMethod: "付款方式",
      hasPayslip: "是否提供工资单",
      superMentioned: "是否提到养老金",
      hasWrittenAgreement: "是否有书面确认",
      trialShiftHours: "试工/培训小时",
      trialPaid: "试工是否付钱",
      contactChannel: "主要联系渠道",
      hasOtherOptions: "手上其他机会",
      cashPressure: "现金压力",
    },
    placeholders: {
      roleTitle: "服务员、厨房帮工、拣货员...",
      offeredHourlyRate: "例如 25",
      weeklyHours: "例如 20",
      commuteMinutes: "例如 35",
      trialShiftHours: "没有就留空或填 0",
    },
    flags: {
      requiresUpfrontPayment: "对方要求先交钱、押金、充值、培训费或买设备",
      asksForBankOrCrypto: "工作涉及银行卡、转账、收钱、代买东西或加密货币",
      asksForIdentityDocsEarly: "还没确认真实性就要求护照、驾照、Medicare、银行卡或税号",
      urgentStartOrPressure: "催你马上决定、马上开始、不要问太多",
    },
    actions: {
      submit: "判断这个机会",
      submitting: "分析中",
      error: "暂时无法分析这个机会，请稍后再试。",
    },
    emptyTitle: "还没有生成判断",
    emptyText:
      "填完左边的信息后，这里会显示继续策略、关键风险、该问雇主的问题和更低风险的替代方向。",
    sections: {
      signals: "风险信号",
      questions: "先问雇主这些问题",
      safeguards: "保护自己",
      alternatives: "更低风险的同类方向",
      missing: "还缺的信息",
    },
    noSignals:
      "没有发现明显严重风险。仍建议保存招聘记录，并在上班前确认工资、排班和工资单。",
    bands: {
      severe: "严重",
      high: "高",
      medium: "中",
      low: "低",
    },
    decisions: {
      STOP: "不要继续",
      VERIFY_FIRST: "先确认再继续",
      SHORT_TERM_WITH_SAFEGUARDS: "可短期过渡，但要保护自己",
      PROCEED: "相对可继续",
    },
  },
  en: {
    formTitle: "Part-time opportunity check",
    fields: {
      state: "Work state",
      visaType: "Visa/status",
      isStudyPeriod: "It is currently a study period",
      industry: "Industry",
      employmentType: "Employment type",
      roleTitle: "Role title",
      offeredHourlyRate: "Hourly rate before tax",
      weeklyHours: "Expected weekly hours",
      commuteMinutes: "One-way commute minutes",
      paymentMethod: "Payment method",
      hasPayslip: "Payslips provided",
      superMentioned: "Super mentioned",
      hasWrittenAgreement: "Written confirmation",
      trialShiftHours: "Trial/training hours",
      trialPaid: "Trial is paid",
      contactChannel: "Main contact channel",
      hasOtherOptions: "Other opportunities",
      cashPressure: "Cash pressure",
    },
    placeholders: {
      roleTitle: "Waiter, kitchen hand, picker...",
      offeredHourlyRate: "e.g. 25",
      weeklyHours: "e.g. 20",
      commuteMinutes: "e.g. 35",
      trialShiftHours: "Leave blank or enter 0",
    },
    flags: {
      requiresUpfrontPayment: "They ask for a deposit, fee, recharge, training payment, or equipment purchase",
      asksForBankOrCrypto: "The work involves bank accounts, transfers, receiving money, buying items, or crypto",
      asksForIdentityDocsEarly: "They ask for passport, licence, Medicare, bank, or tax details before verification",
      urgentStartOrPressure: "They pressure you to decide or start immediately and not ask questions",
    },
    actions: {
      submit: "Check this opportunity",
      submitting: "Checking",
      error: "Unable to assess this opportunity right now. Please try again.",
    },
    emptyTitle: "No decision yet",
    emptyText:
      "After you enter the job details, this panel will show a continue strategy, key risks, employer questions, and safer similar options.",
    sections: {
      signals: "Risk signals",
      questions: "Questions to ask first",
      safeguards: "Protect yourself",
      alternatives: "Lower-risk similar options",
      missing: "Missing information",
    },
    noSignals:
      "No obvious severe signal was found. Still keep job records and confirm pay, roster, and payslips before starting.",
    bands: {
      severe: "Severe",
      high: "High",
      medium: "Medium",
      low: "Low",
    },
    decisions: {
      STOP: "Do not continue",
      VERIFY_FIRST: "Verify before continuing",
      SHORT_TERM_WITH_SAFEGUARDS: "Short-term only, with safeguards",
      PROCEED: "Relatively okay to continue",
    },
  },
} as const;

const optionLabels = {
  zh: {
    visaType: {
      "500": "学生签 500",
      "417": "打工度假 417",
      "462": "打工与度假 462",
      other: "其他签证",
      none: "PR/公民/无签证限制",
    },
    industry: {
      restaurant: "餐厅",
      cafe: "咖啡店",
      hotpot: "火锅/中餐",
      bubble_tea: "奶茶店",
      catering: "餐饮活动",
      retail: "零售",
      cleaning: "清洁",
      warehouse: "仓库",
      delivery: "外卖/配送",
      other: "其他",
    },
    employmentType: {
      casual: "临时工 Casual",
      part_time: "兼职 Part-time",
      full_time: "全职 Full-time",
      unknown: "不确定",
    },
    paymentMethod: {
      bank: "银行转账",
      cash: "现金",
      mixed: "现金 + 银行",
      unknown: "还没说",
    },
    yesNoUnknown: {
      yes: "是",
      no: "否",
      unknown: "不知道",
    },
    contactChannel: {
      job_platform: "招聘平台",
      official_email: "公司邮箱",
      phone: "电话",
      wechat: "微信",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
      sms: "短信",
      other: "其他",
    },
    hasOtherOptions: {
      none: "没有",
      some: "有 1-2 个",
      several: "有几个",
    },
    cashPressure: {
      low: "低",
      medium: "中",
      high: "高，需要尽快有收入",
    },
  },
  en: {
    visaType: {
      "500": "Student visa 500",
      "417": "Working Holiday 417",
      "462": "Work and Holiday 462",
      other: "Other visa",
      none: "PR/citizen/no work limit",
    },
    industry: {
      restaurant: "Restaurant",
      cafe: "Cafe",
      hotpot: "Hotpot/Chinese restaurant",
      bubble_tea: "Bubble tea",
      catering: "Catering event",
      retail: "Retail",
      cleaning: "Cleaning",
      warehouse: "Warehouse",
      delivery: "Delivery",
      other: "Other",
    },
    employmentType: {
      casual: "Casual",
      part_time: "Part-time",
      full_time: "Full-time",
      unknown: "Not sure",
    },
    paymentMethod: {
      bank: "Bank transfer",
      cash: "Cash",
      mixed: "Cash + bank",
      unknown: "Not discussed",
    },
    yesNoUnknown: {
      yes: "Yes",
      no: "No",
      unknown: "Not sure",
    },
    contactChannel: {
      job_platform: "Job platform",
      official_email: "Company email",
      phone: "Phone",
      wechat: "WeChat",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
      sms: "SMS",
      other: "Other",
    },
    hasOtherOptions: {
      none: "None",
      some: "1-2 options",
      several: "Several options",
    },
    cashPressure: {
      low: "Low",
      medium: "Medium",
      high: "High, need income soon",
    },
  },
} as const;

export function OpportunityChecker({ language }: { language: OpportunityLanguage }) {
  const [form, setForm] = useState<FormState>(initialState);
  const [report, setReport] = useState<OpportunityReport | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = copy[language];
  const labels = optionLabels[language];
  const studyPeriodId = useId();

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/opportunity/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error(t.actions.error);
      }

      setReport(await response.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : t.actions.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)]">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BriefcaseBusiness className="h-5 w-5" />
            {t.formTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label={t.fields.state}
              value={form.state}
              onValueChange={(value) => update("state", value as FormState["state"])}
              options={AU_STATES.map((state) => ({ value: state, label: state }))}
            />
            <SelectField
              label={t.fields.visaType}
              value={form.visaType}
              onValueChange={(value) =>
                update("visaType", value as FormState["visaType"])
              }
              options={toOptions(labels.visaType)}
            />
            {form.visaType === "500" && (
              <div className="flex items-center gap-3 rounded-md border p-3 sm:col-span-2">
                <Checkbox
                  id={studyPeriodId}
                  checked={form.isStudyPeriod}
                  onCheckedChange={(checked) => update("isStudyPeriod", checked === true)}
                />
                <Label htmlFor={studyPeriodId} className="text-sm">
                  {t.fields.isStudyPeriod}
                </Label>
              </div>
            )}
          </section>

          <Separator />

          <section className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label={t.fields.industry}
              value={form.industry}
              onValueChange={(value) =>
                update("industry", value as FormState["industry"])
              }
              options={toOptions(labels.industry)}
            />
            <SelectField
              label={t.fields.employmentType}
              value={form.employmentType}
              onValueChange={(value) =>
                update("employmentType", value as FormState["employmentType"])
              }
              options={toOptions(labels.employmentType)}
            />
            <TextField
              label={t.fields.roleTitle}
              value={form.roleTitle ?? ""}
              placeholder={t.placeholders.roleTitle}
              onChange={(value) => update("roleTitle", value)}
            />
            <TextField
              label={t.fields.offeredHourlyRate}
              value={form.offeredHourlyRate}
              placeholder={t.placeholders.offeredHourlyRate}
              type="number"
              onChange={(value) => update("offeredHourlyRate", value)}
            />
            <TextField
              label={t.fields.weeklyHours}
              value={form.weeklyHours}
              placeholder={t.placeholders.weeklyHours}
              type="number"
              onChange={(value) => update("weeklyHours", value)}
            />
            <TextField
              label={t.fields.commuteMinutes}
              value={form.commuteMinutes}
              placeholder={t.placeholders.commuteMinutes}
              type="number"
              onChange={(value) => update("commuteMinutes", value)}
            />
          </section>

          <Separator />

          <section className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label={t.fields.paymentMethod}
              value={form.paymentMethod}
              onValueChange={(value) =>
                update("paymentMethod", value as FormState["paymentMethod"])
              }
              options={toOptions(labels.paymentMethod)}
            />
            <SelectField
              label={t.fields.hasPayslip}
              value={form.hasPayslip}
              onValueChange={(value) =>
                update("hasPayslip", value as FormState["hasPayslip"])
              }
              options={toOptions(labels.yesNoUnknown)}
            />
            <SelectField
              label={t.fields.superMentioned}
              value={form.superMentioned}
              onValueChange={(value) =>
                update("superMentioned", value as FormState["superMentioned"])
              }
              options={toOptions(labels.yesNoUnknown)}
            />
            <SelectField
              label={t.fields.hasWrittenAgreement}
              value={form.hasWrittenAgreement}
              onValueChange={(value) =>
                update(
                  "hasWrittenAgreement",
                  value as FormState["hasWrittenAgreement"]
                )
              }
              options={toOptions(labels.yesNoUnknown)}
            />
            <TextField
              label={t.fields.trialShiftHours}
              value={form.trialShiftHours}
              placeholder={t.placeholders.trialShiftHours}
              type="number"
              onChange={(value) => update("trialShiftHours", value)}
            />
            <SelectField
              label={t.fields.trialPaid}
              value={form.trialPaid}
              onValueChange={(value) =>
                update("trialPaid", value as FormState["trialPaid"])
              }
              options={toOptions(labels.yesNoUnknown)}
            />
          </section>

          <Separator />

          <section className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label={t.fields.contactChannel}
              value={form.contactChannel}
              onValueChange={(value) =>
                update("contactChannel", value as FormState["contactChannel"])
              }
              options={toOptions(labels.contactChannel)}
            />
            <SelectField
              label={t.fields.hasOtherOptions}
              value={form.hasOtherOptions}
              onValueChange={(value) =>
                update("hasOtherOptions", value as FormState["hasOtherOptions"])
              }
              options={toOptions(labels.hasOtherOptions)}
            />
            <SelectField
              label={t.fields.cashPressure}
              value={form.cashPressure}
              onValueChange={(value) =>
                update("cashPressure", value as FormState["cashPressure"])
              }
              options={toOptions(labels.cashPressure)}
            />
          </section>

          <section className="grid gap-3">
            <FlagCheckbox
              checked={form.requiresUpfrontPayment}
              label={t.flags.requiresUpfrontPayment}
              onCheckedChange={(checked) => update("requiresUpfrontPayment", checked)}
            />
            <FlagCheckbox
              checked={form.asksForBankOrCrypto}
              label={t.flags.asksForBankOrCrypto}
              onCheckedChange={(checked) => update("asksForBankOrCrypto", checked)}
            />
            <FlagCheckbox
              checked={form.asksForIdentityDocsEarly}
              label={t.flags.asksForIdentityDocsEarly}
              onCheckedChange={(checked) =>
                update("asksForIdentityDocsEarly", checked)
              }
            />
            <FlagCheckbox
              checked={form.urgentStartOrPressure}
              label={t.flags.urgentStartOrPressure}
              onCheckedChange={(checked) => update("urgentStartOrPressure", checked)}
            />
          </section>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <Button className="w-full" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.actions.submitting}
              </>
            ) : (
              t.actions.submit
            )}
          </Button>
        </CardContent>
      </Card>

      <DecisionPanel form={form} language={language} report={report} />
    </div>
  );
}

function DecisionPanel({
  form,
  language,
  report,
}: {
  form: FormState;
  language: OpportunityLanguage;
  report: OpportunityReport | null;
}) {
  const t = copy[language];

  if (!report) {
    return (
      <div className="grid gap-4">
        <Card className="border-dashed">
          <CardContent className="flex min-h-[260px] flex-col items-center justify-center gap-4 p-8 text-center">
            <ShieldAlert className="h-12 w-12 text-muted-foreground" />
            <div>
              <h2 className="text-xl font-semibold">{t.emptyTitle}</h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                {t.emptyText}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const severeCount = report.riskSignals.filter(
    (signal) => signal.band === "severe"
  ).length;
  const highCount = report.riskSignals.filter((signal) => signal.band === "high").length;
  const localizedQuestions = buildLocalizedQuestions(form, report, language);
  const localizedSafeguards = buildLocalizedSafeguards(form, report, language);
  const localizedAlternatives = buildLocalizedAlternatives(form.industry, language);
  const localizedMissingChecks = buildLocalizedMissingChecks(form, language);

  return (
    <div className="space-y-4">
      <div className={`rounded-lg border p-5 ${decisionStyles[report.decision]}`}>
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {report.decision === "PROCEED" ? (
              <BadgeCheck className="h-6 w-6" />
            ) : (
              <ShieldAlert className="h-6 w-6" />
            )}
            <h2 className="text-2xl font-bold">{t.decisions[report.decision]}</h2>
          </div>
          <div className="flex gap-2">
            {severeCount > 0 && (
              <Badge className="bg-red-600">
                {severeCount} {t.bands.severe}
              </Badge>
            )}
            {highCount > 0 && (
              <Badge className="bg-orange-500">
                {highCount} {t.bands.high}
              </Badge>
            )}
          </div>
        </div>
        <p className="text-sm leading-6">
          {buildLocalizedDecisionSummary(report, form, language)}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="h-5 w-5" />
            {t.sections.signals}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {report.riskSignals.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t.noSignals}
            </p>
          ) : (
            report.riskSignals.map((signal) => {
              const localizedSignal = localizeSignal(signal, form, language);

              return (
                <div key={signal.id} className="rounded-md border p-3">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <h3 className="font-medium">{localizedSignal.title}</h3>
                    <Badge className={riskBandStyles[signal.band]}>
                      {t.bands[signal.band]}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {localizedSignal.explanation}
                  </p>
                  {signal.sourceUrl && (
                    <a
                      className="mt-2 inline-flex text-xs font-medium text-primary underline"
                      href={signal.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {localizedSignal.sourceName ?? signal.sourceName}
                    </a>
                  )}
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <HelpCircle className="h-5 w-5" />
            {t.sections.questions}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2">
            {localizedQuestions.map((question, index) => (
              <li key={question} className="flex gap-3 text-sm">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                  {index + 1}
                </span>
                <span>{question}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ClipboardList className="h-5 w-5" />
            {t.sections.safeguards}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {localizedSafeguards.map((item) => (
              <li key={item} className="flex gap-2 text-sm">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <WalletCards className="h-5 w-5" />
            {t.sections.alternatives}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {localizedAlternatives.map((alternative) => (
            <div key={alternative.title} className="rounded-md border p-3">
              <h3 className="font-medium">{alternative.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {alternative.whySafer}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {alternative.whatToSearch.map((term) => (
                  <Badge key={term} variant="outline">
                    {term}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {localizedMissingChecks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t.sections.missing}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {localizedMissingChecks.map((item) => (
                <li key={item} className="text-sm text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function toOptions(options: Record<string, string>) {
  return Object.entries(options).map(([value, label]) => ({ value, label }));
}

function buildLocalizedDecisionSummary(
  report: OpportunityReport,
  form: FormState,
  language: OpportunityLanguage
) {
  const issueCount =
    report.riskSignals.filter((signal) => ["severe", "high"].includes(signal.band))
      .length || report.riskSignals.length;
  const industryLabel = optionLabels[language].industry[form.industry];

  if (language === "en") {
    switch (report.decision) {
      case "STOP":
        return "This opportunity has signals that are not worth testing in practice. Do not pay money, send identity documents, move funds, receive transfers, or start a roster that may affect your visa conditions.";
      case "SHORT_TERM_WITH_SAFEGUARDS":
        return "If you need income urgently and have no better option, treat this as a short-term bridge only. Get key terms in writing first, keep evidence from day one, and keep looking for a lower-risk alternative.";
      case "VERIFY_FIRST":
        return `This opportunity still has ${issueCount} key risk or information gap. Confirm pay, payslips, super, trial terms, employer identity, and roster before deciding whether to try it.`;
      case "PROCEED":
        return `Based on what you entered, this ${industryLabel.toLowerCase()} opportunity has no obvious severe signal. Still keep records and confirm pay, roster, and payslips before starting.`;
    }
  }

  switch (report.decision) {
    case "STOP":
      return "这个机会出现了不适合试错的风险信号。先不要付款、不要交身份文件、不要转账或代收钱，也不要开始任何可能影响签证条件的排班。";
    case "SHORT_TERM_WITH_SAFEGUARDS":
      return "如果你现在确实需要稳定收入，而且暂时没有其他选择，可以把它当作短期过渡，但要先拿到关键书面确认，并从第一天开始保留证据，同时继续找更低风险的替代机会。";
    case "VERIFY_FIRST":
      return `这个机会还有 ${issueCount} 个关键风险或信息缺口。先问清楚工资、工资单、养老金、试工、雇主身份和排班，再决定是否去试。`;
    case "PROCEED":
      return `基于你提供的信息，这个${industryLabel}机会没有明显的严重风险信号。仍建议保存聊天记录，并在上班前确认工资、排班和工资单。`;
  }
}

function localizeSignal(
  signal: OpportunityReport["riskSignals"][number],
  form: FormState,
  language: OpportunityLanguage
) {
  const offeredRate = Number(form.offeredHourlyRate);
  const relevantMinimum =
    form.employmentType === "casual"
      ? NATIONAL_MIN_WAGE_CASUAL_HOURLY
      : NATIONAL_MIN_WAGE_HOURLY;
  const payBenchmark =
    Number.isFinite(offeredRate) && offeredRate > 0
      ? language === "zh"
        ? `你填写的时薪是 $${offeredRate.toFixed(2)}/h，低于当前成人${
            form.employmentType === "casual" ? "临时工 " : ""
          }全国最低基准 $${relevantMinimum.toFixed(2)}/h。具体 award、年龄、等级、职责和 penalty rates 可能改变最低应付金额，所以这里是高优先级核查项，不是最终法律结论。`
        : `The offered rate is $${offeredRate.toFixed(2)}/hr, below the current adult national ${
            form.employmentType === "casual" ? "casual " : ""
          }minimum benchmark of $${relevantMinimum.toFixed(2)}/hr. Exact award rates can depend on age, classification, duties, and penalty rates, so treat this as a high-priority check item rather than a final legal conclusion.`
      : signal.explanation;

  const zh: Record<string, { title: string; explanation: string; sourceName?: string }> = {
    "upfront-payment": {
      title: "上工前要求先交钱",
      explanation:
        "如果一个工作要求先交押金、充值、培训费、设备费、PayID 转账或加密货币充值，属于非常强的求职诈骗信号。",
      sourceName: "Scamwatch 求职诈骗",
    },
    "bank-crypto": {
      title: "工作涉及转账、银行卡或加密货币",
      explanation:
        "代收钱、转账、收包裹、代买东西、使用加密货币或充值账户，可能让求职者卷入欺诈或 money mule 风险。",
      sourceName: "Scamwatch 求职诈骗",
    },
    "informal-channel": {
      title: "招聘主要发生在非正式聊天渠道",
      explanation:
        "微信、WhatsApp、Telegram、短信等渠道不代表一定是假，但如果缺少官方邮箱、平台记录或可核验雇主信息，需要先独立核实。",
      sourceName: "Scamwatch 求职诈骗",
    },
    "identity-docs-early": {
      title: "过早索要身份或银行信息",
      explanation:
        "护照、驾照、Medicare、银行卡、TFN 等信息，只应在你确认雇主真实、岗位真实、录用流程合理之后再提供。",
      sourceName: "Scamwatch 求职诈骗",
    },
    pressure: {
      title: "催促你马上决定或不要多问",
      explanation:
        "催促、制造稀缺感、阻止你问工资和雇主信息，是常见操控模式。正规雇主应能回答基本工作条件问题。",
      sourceName: "Scamwatch 反诈骗方法",
    },
    "below-minimum-benchmark": {
      title: "工资低于当前全国最低基准",
      explanation: payBenchmark,
      sourceName: "Fair Work Ombudsman",
    },
    "cash-payment": {
      title: "现金或混合付款需要特别留证据",
      explanation:
        "现金付款不一定违法，但如果没有工资单、排班记录和书面工资条款，就很难证明工时、税前工资、税和养老金。",
      sourceName: "Fair Work Ombudsman",
    },
    "no-payslip": {
      title: "没有工资单安排",
      explanation:
        "雇主通常需要在发薪日后 1 个工作日内提供工资单。没有工资单也会让工资和养老金核查更困难。",
      sourceName: "Fair Work Ombudsman",
    },
    "super-not-mentioned": {
      title: "没有提到养老金",
      explanation:
        "符合条件的雇员通常应在工资之外获得养老金。开始前要问清楚，开始后通过 super fund 或 myGov 核对。",
      sourceName: "ATO",
    },
    "no-written-terms": {
      title: "工作条件还没有书面确认",
      explanation:
        "开始前尽量拿到雇主名称、ABN、工作地点、岗位、税前时薪、发薪周期、试工条款和工资单安排的书面确认。",
    },
    "unpaid-trial": {
      title: "无薪试工需要谨慎核查",
      explanation:
        "短时间无薪试工只在真正用于展示技能、且被直接监督时才可能合理。较长或实际产生劳动成果的试工可能需要付薪。",
      sourceName: "Fair Work Ombudsman",
    },
    "student-hours": {
      title: "学生签工时可能超过限制",
      explanation:
        "学生签工作限制按连续 14 天周期计算，不只是简单周平均。需要看完整两周排班再判断。",
      sourceName: "Department of Home Affairs",
    },
    "long-commute": {
      title: "通勤过长会降低真实收益",
      explanation:
        "通勤太长会把看似稳定的兼职变成很低的实际时薪，尤其是短班、晚班或交通不稳定的工作。",
    },
  };

  const en: Record<string, { title: string; explanation: string; sourceName?: string }> = {
    "below-minimum-benchmark": {
      title: "Pay is below the current national benchmark",
      explanation: payBenchmark,
      sourceName: "Fair Work Ombudsman",
    },
  };

  return language === "zh"
    ? zh[signal.id] ?? signal
    : en[signal.id] ?? signal;
}

function buildLocalizedQuestions(
  form: FormState,
  report: OpportunityReport,
  language: OpportunityLanguage
) {
  const hasScamSignal = report.riskSignals.some((signal) => signal.category === "scam");

  if (language === "en") {
    const questions = [
      "Could you confirm the legal employer name, ABN if available, and workplace address?",
      "Could you confirm the hourly rate before tax, pay cycle, and whether payslips are provided?",
      "Could you confirm whether super is paid on top of wages and which employment type this role is?",
    ];

    if (form.trialShiftHours && form.trialPaid !== "yes") {
      questions.push(
        "Is the trial or training shift paid? If unpaid, how long is it, what tasks will I do, and who will supervise it?"
      );
    }

    if (form.visaType === "500") {
      questions.push(
        "Could you send the expected roster for each 14-day fortnight so I can check my student visa work limit?"
      );
    }

    if (hasScamSignal) {
      questions.push(
        "Can I verify this role through your official company email, website, or the original job platform listing?"
      );
    }

    return questions;
  }

  const questions = [
    "可以确认一下雇主的正式名称、ABN（如有）和工作地址吗？",
    "可以确认税前时薪、发薪周期，以及是否每次发薪都会提供工资单吗？",
    "养老金是否在工资之外支付？这个岗位的雇佣类型是 casual、part-time 还是 contractor？",
  ];

  if (form.trialShiftHours && form.trialPaid !== "yes") {
    questions.push("试工或培训是否付薪？如果不付薪，时长多久、做什么任务、谁现场监督？");
  }

  if (form.visaType === "500") {
    questions.push("可以发一下连续两个星期的预计排班吗？我需要核对学生签 14 天工时限制。");
  }

  if (hasScamSignal) {
    questions.push("我可以通过公司官方邮箱、官网或原招聘平台链接核实这个岗位吗？");
  }

  return questions;
}

function buildLocalizedSafeguards(
  form: FormState,
  report: OpportunityReport,
  language: OpportunityLanguage
) {
  const hasVisaSignal = report.riskSignals.some((signal) => signal.category === "visa");

  if (language === "en") {
    const safeguards = [
      "Do not pay any deposit, recharge fee, training fee, equipment payment, or crypto top-up to start work.",
      "Keep screenshots of the job ad, recruiter profile, pay discussion, roster, and every shift worked.",
      "Write your own shift log after every shift: date, start time, finish time, break, location, and pay received.",
      "Ask for pay by bank transfer and a payslip for each pay period.",
    ];

    if (form.cashPressure === "high" && form.hasOtherOptions === "none") {
      safeguards.push(
        "Set a review point after the first one or two pay cycles. If pay, payslips, or roster promises are not met, plan to exit."
      );
    }

    if (hasVisaSignal) {
      safeguards.push(
        "Track work hours across rolling 14-day fortnights, including unpaid work experience unless it is a mandatory course requirement."
      );
    }

    if (form.asksForIdentityDocsEarly) {
      safeguards.push(
        "Do not send passport, licence, Medicare, banking, or tax details until you have independently verified the employer."
      );
    }

    return safeguards;
  }

  const safeguards = [
    "不要为了开始工作支付押金、充值费、培训费、设备费或加密货币充值。",
    "保存招聘广告、招聘者主页、工资沟通、排班和每次上班记录的截图。",
    "每次下班后自己记录：日期、开始时间、结束时间、休息、地点和实际收到的钱。",
    "尽量要求银行转账发薪，并要求每个发薪周期都有工资单。",
  ];

  if (form.cashPressure === "high" && form.hasOtherOptions === "none") {
    safeguards.push("把它设为短期过渡：一到两个发薪周期后复盘。工资、工资单或排班承诺没兑现，就准备退出。");
  }

  if (hasVisaSignal) {
    safeguards.push("按连续 14 天周期记录工时；除非是课程强制要求，否则无薪工作经历也要谨慎计算。");
  }

  if (form.asksForIdentityDocsEarly) {
    safeguards.push("在独立核实雇主前，不要发送护照、驾照、Medicare、银行或税号信息。");
  }

  return safeguards;
}

function buildLocalizedAlternatives(
  industry: OpportunityFacts["industry"],
  language: OpportunityLanguage
) {
  const common =
    language === "zh"
      ? [
          {
            title: "校内岗位",
            whySafer: "大学或校内雇主更容易核实，工资单、排班和雇主信息通常更清楚。",
            whatToSearch: ["campus casual", "student ambassador", "library assistant"],
          },
          {
            title: "有正式 payroll 的大型雇主",
            whySafer: "大型雇主不是零风险，但工资单、排班系统和养老金流程通常更标准。",
            whatToSearch: ["casual team member", "night fill", "customer assistant"],
          },
        ]
      : [
          {
            title: "Campus jobs",
            whySafer:
              "University or campus employers are easier to verify and usually have clearer payroll processes.",
            whatToSearch: ["campus casual", "student ambassador", "library assistant"],
          },
          {
            title: "Large employers with payroll systems",
            whySafer:
              "Bigger employers are not risk-free, but payslips, rosters, and super are usually more standardized.",
            whatToSearch: ["casual team member", "night fill", "customer assistant"],
          },
        ];

  if (["restaurant", "cafe", "hotpot", "bubble_tea", "catering"].includes(industry)) {
    return [
      language === "zh"
        ? {
            title: "连锁快餐或咖啡店 casual",
            whySafer: "工作内容相近，但更可能有正式排班、工资单和 payroll 流程。",
            whatToSearch: ["crew member casual", "cafe all-rounder payroll", "food service assistant"],
          }
        : {
            title: "Chain fast food or cafe casual",
            whySafer:
              "Similar customer-service or food-prep work, with a higher chance of written rosters and formal payroll.",
            whatToSearch: ["crew member casual", "cafe all-rounder payroll", "food service assistant"],
          },
      ...common,
    ];
  }

  if (["warehouse", "delivery"].includes(industry)) {
    return [
      language === "zh"
        ? {
            title: "零售配送中心或超市夜班补货",
            whySafer: "同样偏体力劳动，但通常通过官方雇主入口或较容易核实的劳务公司招聘。",
            whatToSearch: ["warehouse team member", "pick packer agency", "night fill casual"],
          }
        : {
            title: "Retail distribution centre or supermarket night fill",
            whySafer:
              "Similar physical work, but often advertised through official employer portals or known labour-hire agencies.",
            whatToSearch: ["warehouse team member", "pick packer agency", "night fill casual"],
          },
      ...common,
    ];
  }

  if (industry === "cleaning") {
    return [
      language === "zh"
        ? {
            title: "可核实的清洁公司或 facilities 岗位",
            whySafer: "公司或设施岗位更容易核实，也更可能提供排班、工资单和保险覆盖。",
            whatToSearch: ["cleaning attendant payroll", "facilities cleaner casual", "school cleaner casual"],
          }
        : {
            title: "Registered cleaning agency or facilities role",
            whySafer:
              "Agency or facility roles are easier to verify and more likely to provide rosters, payslips, and workplace insurance coverage.",
            whatToSearch: ["cleaning attendant payroll", "facilities cleaner casual", "school cleaner casual"],
          },
      ...common,
    ];
  }

  if (industry === "retail") {
    return [
      language === "zh"
        ? {
            title: "超市、药房或连锁零售 casual",
            whySafer: "零售经验相近，award 覆盖和工资记录通常更清楚。",
            whatToSearch: ["retail assistant casual", "supermarket team member", "pharmacy assistant casual"],
          }
        : {
            title: "Supermarket, pharmacy, or chain retail casual",
            whySafer:
              "Similar retail experience, usually with clearer award coverage and payroll records.",
            whatToSearch: ["retail assistant casual", "supermarket team member", "pharmacy assistant casual"],
          },
      ...common,
    ];
  }

  return common;
}

function buildLocalizedMissingChecks(form: FormState, language: OpportunityLanguage) {
  const missing: string[] = [];

  if (!form.roleTitle) {
    missing.push(language === "zh" ? "准确岗位名称和主要职责" : "Exact role title and main duties");
  }
  if (form.employmentType === "unknown") {
    missing.push(
      language === "zh"
        ? "雇佣类型：casual、part-time、full-time 还是 contractor"
        : "Employment type: casual, part-time, full-time, or contractor"
    );
  }
  if (!form.offeredHourlyRate) {
    missing.push(language === "zh" ? "税前时薪" : "Hourly rate before tax");
  }
  if (!form.weeklyHours) {
    missing.push(language === "zh" ? "预计工时和具体排班" : "Expected hours and exact roster");
  }
  if (form.hasPayslip === "unknown") {
    missing.push(language === "zh" ? "是否会提供工资单" : "Whether payslips will be provided");
  }
  if (form.superMentioned === "unknown") {
    missing.push(language === "zh" ? "养老金是否在工资之外支付" : "Whether super will be paid on top of wages");
  }
  if (form.hasWrittenAgreement === "unknown") {
    missing.push(language === "zh" ? "雇主和工资条款的书面确认" : "Written confirmation of employer and pay terms");
  }

  return missing;
}

function SelectField({
  label,
  value,
  options,
  onValueChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onValueChange: (value: string | null) => void;
}) {
  const id = useId();

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select
        value={value}
        onValueChange={(nextValue) => {
          if (nextValue !== null) onValueChange(nextValue);
        }}
      >
        <SelectTrigger id={id}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function TextField({
  label,
  value,
  placeholder,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  type?: "text" | "number";
  onChange: (value: string) => void;
}) {
  const id = useId();

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        min={type === "number" ? 0 : undefined}
        step={type === "number" ? "0.01" : undefined}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function FlagCheckbox({
  checked,
  label,
  onCheckedChange,
}: {
  checked: boolean;
  label: string;
  onCheckedChange: (checked: boolean) => void;
}) {
  const id = useId();

  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-3 rounded-md border p-3 text-sm"
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(value === true)}
      />
      <span>{label}</span>
    </label>
  );
}
