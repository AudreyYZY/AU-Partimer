"use client";

import { useState } from "react";
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
import { AU_STATES } from "@/lib/constants";
import type { OpportunityFacts, OpportunityReport } from "@/types/opportunity";

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

export function OpportunityChecker() {
  const [form, setForm] = useState<FormState>(initialState);
  const [report, setReport] = useState<OpportunityReport | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        throw new Error("Unable to assess this opportunity");
      }

      setReport(await response.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
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
            兼职机会快速判断
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="工作州"
              value={form.state}
              onValueChange={(value) => update("state", value as FormState["state"])}
              options={AU_STATES.map((state) => ({ value: state, label: state }))}
            />
            <SelectField
              label="签证/身份"
              value={form.visaType}
              onValueChange={(value) =>
                update("visaType", value as FormState["visaType"])
              }
              options={[
                { value: "500", label: "学生签 500" },
                { value: "417", label: "Working Holiday 417" },
                { value: "462", label: "Work and Holiday 462" },
                { value: "other", label: "其他签证" },
                { value: "none", label: "PR/公民/无签证限制" },
              ]}
            />
            {form.visaType === "500" && (
              <div className="flex items-center gap-3 rounded-md border p-3 sm:col-span-2">
                <Checkbox
                  checked={form.isStudyPeriod}
                  onCheckedChange={(checked) => update("isStudyPeriod", checked === true)}
                />
                <Label className="text-sm">现在是上课期间</Label>
              </div>
            )}
          </section>

          <Separator />

          <section className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="行业"
              value={form.industry}
              onValueChange={(value) =>
                update("industry", value as FormState["industry"])
              }
              options={[
                { value: "restaurant", label: "餐厅" },
                { value: "cafe", label: "咖啡店" },
                { value: "hotpot", label: "火锅/中餐" },
                { value: "bubble_tea", label: "奶茶店" },
                { value: "catering", label: "餐饮活动" },
                { value: "retail", label: "零售" },
                { value: "cleaning", label: "清洁" },
                { value: "warehouse", label: "仓库" },
                { value: "delivery", label: "外卖/配送" },
                { value: "other", label: "其他" },
              ]}
            />
            <SelectField
              label="雇佣类型"
              value={form.employmentType}
              onValueChange={(value) =>
                update("employmentType", value as FormState["employmentType"])
              }
              options={[
                { value: "casual", label: "Casual" },
                { value: "part_time", label: "Part-time" },
                { value: "full_time", label: "Full-time" },
                { value: "unknown", label: "不确定" },
              ]}
            />
            <TextField
              label="岗位名称"
              value={form.roleTitle ?? ""}
              placeholder="Waiter, kitchen hand, picker..."
              onChange={(value) => update("roleTitle", value)}
            />
            <TextField
              label="时薪 before tax"
              value={form.offeredHourlyRate}
              placeholder="例如 25"
              type="number"
              onChange={(value) => update("offeredHourlyRate", value)}
            />
            <TextField
              label="预计每周工时"
              value={form.weeklyHours}
              placeholder="例如 20"
              type="number"
              onChange={(value) => update("weeklyHours", value)}
            />
            <TextField
              label="通勤分钟"
              value={form.commuteMinutes}
              placeholder="单程，例如 35"
              type="number"
              onChange={(value) => update("commuteMinutes", value)}
            />
          </section>

          <Separator />

          <section className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="付款方式"
              value={form.paymentMethod}
              onValueChange={(value) =>
                update("paymentMethod", value as FormState["paymentMethod"])
              }
              options={[
                { value: "bank", label: "银行转账" },
                { value: "cash", label: "现金" },
                { value: "mixed", label: "现金 + 银行" },
                { value: "unknown", label: "还没说" },
              ]}
            />
            <SelectField
              label="是否给 payslip"
              value={form.hasPayslip}
              onValueChange={(value) =>
                update("hasPayslip", value as FormState["hasPayslip"])
              }
              options={yesNoUnknownOptions}
            />
            <SelectField
              label="是否提到 super"
              value={form.superMentioned}
              onValueChange={(value) =>
                update("superMentioned", value as FormState["superMentioned"])
              }
              options={yesNoUnknownOptions}
            />
            <SelectField
              label="是否有书面确认"
              value={form.hasWrittenAgreement}
              onValueChange={(value) =>
                update(
                  "hasWrittenAgreement",
                  value as FormState["hasWrittenAgreement"]
                )
              }
              options={yesNoUnknownOptions}
            />
            <TextField
              label="试工/培训小时"
              value={form.trialShiftHours}
              placeholder="没有就留空或填 0"
              type="number"
              onChange={(value) => update("trialShiftHours", value)}
            />
            <SelectField
              label="试工是否付钱"
              value={form.trialPaid}
              onValueChange={(value) =>
                update("trialPaid", value as FormState["trialPaid"])
              }
              options={yesNoUnknownOptions}
            />
          </section>

          <Separator />

          <section className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="主要联系渠道"
              value={form.contactChannel}
              onValueChange={(value) =>
                update("contactChannel", value as FormState["contactChannel"])
              }
              options={[
                { value: "job_platform", label: "招聘平台" },
                { value: "official_email", label: "公司邮箱" },
                { value: "phone", label: "电话" },
                { value: "wechat", label: "微信" },
                { value: "whatsapp", label: "WhatsApp" },
                { value: "telegram", label: "Telegram" },
                { value: "sms", label: "短信" },
                { value: "other", label: "其他" },
              ]}
            />
            <SelectField
              label="手上其他机会"
              value={form.hasOtherOptions}
              onValueChange={(value) =>
                update("hasOtherOptions", value as FormState["hasOtherOptions"])
              }
              options={[
                { value: "none", label: "没有" },
                { value: "some", label: "有 1-2 个" },
                { value: "several", label: "有几个" },
              ]}
            />
            <SelectField
              label="现金压力"
              value={form.cashPressure}
              onValueChange={(value) =>
                update("cashPressure", value as FormState["cashPressure"])
              }
              options={[
                { value: "low", label: "低" },
                { value: "medium", label: "中" },
                { value: "high", label: "高，需要尽快有收入" },
              ]}
            />
          </section>

          <section className="grid gap-3">
            <FlagCheckbox
              checked={form.requiresUpfrontPayment}
              label="对方要求先交钱、押金、充值、培训费或买设备"
              onCheckedChange={(checked) => update("requiresUpfrontPayment", checked)}
            />
            <FlagCheckbox
              checked={form.asksForBankOrCrypto}
              label="工作涉及银行卡、转账、收钱、代买东西或加密货币"
              onCheckedChange={(checked) => update("asksForBankOrCrypto", checked)}
            />
            <FlagCheckbox
              checked={form.asksForIdentityDocsEarly}
              label="还没确认真实性就要求护照、驾照、Medicare、银行卡或税号"
              onCheckedChange={(checked) =>
                update("asksForIdentityDocsEarly", checked)
              }
            />
            <FlagCheckbox
              checked={form.urgentStartOrPressure}
              label="催你马上决定、马上开始、不要问太多"
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
                分析中
              </>
            ) : (
              "判断这个机会"
            )}
          </Button>
        </CardContent>
      </Card>

      <DecisionPanel report={report} />
    </div>
  );
}

function DecisionPanel({ report }: { report: OpportunityReport | null }) {
  if (!report) {
    return (
      <div className="grid gap-4">
        <Card className="border-dashed">
          <CardContent className="flex min-h-[260px] flex-col items-center justify-center gap-4 p-8 text-center">
            <ShieldAlert className="h-12 w-12 text-muted-foreground" />
            <div>
              <h2 className="text-xl font-semibold">还没有生成判断</h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                填完左边的信息后，这里会显示继续策略、关键风险、该问雇主的问题和更低风险的替代方向。
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
            <h2 className="text-2xl font-bold">{report.decisionLabel}</h2>
          </div>
          <div className="flex gap-2">
            {severeCount > 0 && <Badge className="bg-red-600">{severeCount} severe</Badge>}
            {highCount > 0 && <Badge className="bg-orange-500">{highCount} high</Badge>}
          </div>
        </div>
        <p className="text-sm leading-6">{report.summary}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="h-5 w-5" />
            风险信号
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {report.riskSignals.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              没有发现明显严重风险。仍建议保存招聘记录和上班前确认工资、排班、payslip。
            </p>
          ) : (
            report.riskSignals.map((signal) => (
              <div key={signal.id} className="rounded-md border p-3">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="font-medium">{signal.title}</h3>
                  <Badge className={riskBandStyles[signal.band]}>{signal.band}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{signal.explanation}</p>
                {signal.sourceUrl && (
                  <a
                    className="mt-2 inline-flex text-xs font-medium text-primary underline"
                    href={signal.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {signal.sourceName}
                  </a>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <HelpCircle className="h-5 w-5" />
            先问雇主这些问题
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2">
            {report.questionsForEmployer.map((question, index) => (
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
            保护自己
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {report.safeguards.map((item) => (
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
            更低风险的同类方向
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {report.alternatives.map((alternative) => (
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

      {report.missingChecks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">还缺的信息</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {report.missingChecks.map((item) => (
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

const yesNoUnknownOptions = [
  { value: "yes", label: "是" },
  { value: "no", label: "否" },
  { value: "unknown", label: "不知道" },
];

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
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select
        value={value}
        onValueChange={(nextValue) => {
          if (nextValue !== null) onValueChange(nextValue);
        }}
      >
        <SelectTrigger>
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
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
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
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-md border p-3 text-sm">
      <Checkbox
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(value === true)}
      />
      <span>{label}</span>
    </label>
  );
}
