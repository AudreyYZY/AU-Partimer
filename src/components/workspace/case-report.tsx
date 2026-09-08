"use client";
import { ExternalLink, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { OpportunityReport } from "@/types/opportunity";
import {
  decisionCopy,
  signalCopy,
  missingCheckCopy,
  text,
  type Language,
} from "@/lib/workspace-copy";

export function CaseReport({
  report,
  language,
}: {
  report: OpportunityReport;
  language: Language;
}) {
  const t = (zh: string, en: string) => text(language, zh, en);
  return (
    <section className="case-report" aria-live="polite">
      <div className={"report-heading decision-" + report.decision}>
        <AlertTriangle size={20} />
        <h2>{decisionCopy[report.decision][language === "zh" ? 0 : 1]}</h2>
      </div>
      <p className="muted">
        {t(
          "基于你提供的信息进行筛查，尚未独立证明岗位真实或完全合规。",
          "Screening of your statements; job authenticity and full compliance are not independently established.",
        )}
      </p>
      <dl className="report-meta">
        <div>
          <dt>{t("信息完整度", "Information completeness")}</dt>
          <dd>{report.confidence.evidenceCompleteness}%</dd>
        </div>
        <div>
          <dt>{t("独立核验", "Independent verification")}</dt>
          <dd>{t("尚未由本工具完成", "Not established by this tool")}</dd>
        </div>
      </dl>
      <p className="micro">
        {t(
          "完整度不是准确率，也不是安全概率。",
          "Completeness is not accuracy or a probability of safety.",
        )}
      </p>
      {report.missingChecks.length > 0 && (
        <div className="notice">
          <strong>{t("还有待确认的信息", "Information still needed")}</strong>
          <p>
            {t(
              "年龄与适用工资、雇主身份、书面条款、试工条件，以及学生签全部工作排班均可能影响结果。请补充未填写或不确定的项目。",
              "Confirm missing or uncertain age, pay, identity, written terms, trial conditions and all-job rosters before relying on the result.",
            )}
          </p>
          <ul>
            {report.missingChecks.map((m) => (
              <li key={m}>
                {language === "zh"
                  ? (missingCheckCopy[m] ?? "请进一步核查适用条件")
                  : m}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="signal-list">
        {report.riskSignals.map((signal) => (
          <article key={signal.id} className={"signal signal-" + signal.band}>
            <span className="signal-band">
              {language === "zh"
                ? {
                    severe: "紧急",
                    high: "优先核查",
                    medium: "需要核查",
                    low: "注意",
                  }[signal.band]
                : signal.band}
            </span>
            <h3>
              {language === "zh"
                ? (signalCopy[signal.id]?.[0] ?? "需要进一步核查")
                : signal.title}
            </h3>
            <p>
              {language === "zh"
                ? (signalCopy[signal.id]?.[1] ?? "请核对官方信息。")
                : signal.explanation}
            </p>
            {signal.sourceUrl && (
              <a href={signal.sourceUrl} target="_blank" rel="noreferrer">
                {t("查看依据", "Source")} <ExternalLink size={12} />
              </a>
            )}
          </article>
        ))}
      </div>
      {!report.riskSignals.length && (
        <p className="empty-inline">
          <CheckCircle2 size={18} />
          {t(
            "未触发当前覆盖的风险规则。仍需核对适用工资与事实。",
            "No covered risk rules triggered. Pay applicability and facts still need confirmation.",
          )}
        </p>
      )}
      <div className="report-foot">
        <p>
          {t("工资核查", "Pay check")}:{" "}
          {t(
            "仅成人全国筛查基准；精确等级工资尚未计算。",
            "National adult benchmark only; classification rates not calculated.",
          )}
        </p>
        <a
          href={report.awardCheck.payCalculatorUrl}
          target="_blank"
          rel="noreferrer"
        >
          {t("打开官方工资计算器", "Open Fair Work pay calculator")}{" "}
          <ExternalLink size={12} />
        </a>
        <p className="micro">
          {t("规则版本", "Ruleset")} {report.meta.rulesetVersion} ·{" "}
          {t("复核期限", "Review due")} {report.meta.reviewDue}
        </p>
        {report.meta.sourceReviewOverdue && (
          <p role="alert">
            {t(
              "来源复核已到期，请先重新核对官方规则。",
              "Source review is overdue. Recheck official rules.",
            )}
          </p>
        )}
      </div>
    </section>
  );
}
