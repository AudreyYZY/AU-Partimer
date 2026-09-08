"use client";

import { useEffect, useRef, useState } from "react";
import {
  Plus,
  Trash2,
  Download,
  Upload,
  Search,
  ArrowRight,
  ClipboardCheck,
  FileText,
  CalendarDays,
  MessageSquare,
  GitCompareArrows,
  BriefcaseBusiness,
  Printer,
  Check,
  Loader2,
} from "lucide-react";
import { useLanguagePreference } from "@/hooks/use-language-preference";
import { useCaseVault } from "@/hooks/use-case-vault";
import { boundedChatHistory } from "@/lib/chat-history";
import {
  createCase,
  factsSchema,
  shiftSchema,
  fortnightWindows,
  effectiveHourlyPay,
  type WorkCase,
  type CaseFacts,
} from "@/lib/case-model";
import { assessOpportunity } from "@/services/opportunity/decision-engine";
import { OPPORTUNITY_RULESET_VERSION } from "@/lib/constants";
import { CaseReport } from "./case-report";
import { RemoteBackup } from "./remote-backup";
import {
  actionCopy,
  fieldCopy,
  options,
  yesNoOptions,
  optionLabel,
  decisionCopy,
  text,
  type Language,
} from "@/lib/workspace-copy";
import type { OpportunityReport } from "@/types/opportunity";
import type { EmployerVerificationResult } from "@/services/verification/abn";

type Tab = "details" | "evidence" | "hours" | "actions" | "chat" | "compare";
type Vault = ReturnType<typeof useCaseVault>;
function exportFile(value: unknown, name: string) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(value, null, 2)], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function Workspace({
  initialTab = "details",
  initialPhase = "considering",
}: {
  initialTab?: Tab;
  initialPhase?: WorkCase["phase"];
}) {
  const [language] = useLanguagePreference();
  const t = (zh: string, en: string) => text(language, zh, en);
  const vault = useCaseVault();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState(() => ({
    ...createCase("Untitled"),
    phase: initialPhase,
  }));
  const [error, setError] = useState("");
  const importInput = useRef<HTMLInputElement>(null);
  const current =
    vault.cases.find((c) => c.id === activeId) ?? vault.cases[0] ?? draft;
  const add = () => {
    if (vault.cases.length >= 20) {
      setError(
        t(
          "最多保留20个案例，请先导出并整理。",
          "Keep up to 20 cases. Export and archive a case first.",
        ),
      );
      return;
    }
    const c = createCase("Untitled");
    vault.put(c);
    setActiveId(c.id);
  };
  return (
    <div className="workspace">
      <aside className="case-sidebar">
        <div className="sidebar-title">
          <span>{t("我的工作机会", "My opportunities")}</span>
          <button
            className="icon-button"
            onClick={add}
            title={t("新建机会", "New opportunity")}
            aria-label={t("新建机会", "New opportunity")}
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="case-nav">
          {vault.cases.map((c) => (
            <button
              key={c.id}
              className={current.id === c.id ? "case-link active" : "case-link"}
              onClick={() => setActiveId(c.id)}
            >
              <BriefcaseBusiness size={16} />
              <span>
                {c.title === "Untitled"
                  ? t("未命名机会", "Untitled opportunity")
                  : c.title}
                <small>
                  {c.phase === "working"
                    ? t("已经入职", "Working")
                    : t("考虑中", "Considering")}
                </small>
              </span>
            </button>
          ))}
          {!vault.cases.length && (
            <p className="muted">{t("新机会", "New opportunity")}</p>
          )}
        </div>
        <div className="vault-tools">
          <RemoteBackup
            cases={vault.cases}
            restore={(c) => {
              try {
                vault.put(c);
              } catch {
                setError(t("案例数量已达上限。", "Case limit reached."));
              }
            }}
            language={language}
          />
          <label className="checkbox-line">
            <input
              type="checkbox"
              checked={vault.persist}
              onChange={(e) => vault.setPersist(e.target.checked)}
            />
            {t("在此设备保存案例", "Keep cases on this device")}
          </label>
          <p className="micro">
            {vault.persist
              ? t(
                  "同一浏览器可恢复；共用设备请关闭保存。",
                  "Recoverable in this browser. Turn off on shared devices.",
                )
              : t(
                  "关闭页面后未保存的内容可能丢失。",
                  "Unsaved work may be lost when this page closes.",
                )}
          </p>
          <div className="toolbar">
            <button
              className="icon-button"
              title={t("导出全部案例", "Export all cases")}
              aria-label={t("导出全部案例", "Export all cases")}
              onClick={() =>
                exportFile(
                  { version: 1, cases: vault.cases },
                  "au-partimer-cases.json",
                )
              }
            >
              <Download size={17} />
            </button>
            <button
              className="icon-button"
              title={t("导入案例", "Import cases")}
              aria-label={t("导入案例", "Import cases")}
              onClick={() => importInput.current?.click()}
            >
              <Upload size={17} />
            </button>
            <input
              ref={importInput}
              type="file"
              accept=".json"
              hidden
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                try {
                  if (f.size > 2_000_000) throw new Error();
                  vault.importCases(JSON.parse(await f.text()));
                  setError("");
                } catch {
                  setError(
                    t(
                      "导入失败：文件格式、大小或案例数量不符合要求。",
                      "Import failed: invalid format, size or case count.",
                    ),
                  );
                }
                e.target.value = "";
              }}
            />
          </div>
          {(error || vault.error) && (
            <p role="alert" className="error">
              {error ||
                t(
                  "浏览器保存失败，请导出备份。",
                  "Browser storage failed. Export a backup.",
                )}
            </p>
          )}
        </div>
      </aside>
      <CaseEditor
        key={current.id}
        workCase={current}
        vault={vault}
        language={language}
        initialTab={initialTab}
        onDelete={() => {
          vault.remove(current.id);
          setActiveId(null);
          setDraft(createCase("Untitled"));
        }}
      />
    </div>
  );
}

function CaseEditor({
  workCase: c,
  vault,
  language,
  initialTab,
  onDelete,
}: {
  workCase: WorkCase;
  vault: Vault;
  language: Language;
  initialTab: Tab;
  onDelete: () => void;
}) {
  const t = (zh: string, en: string) => text(language, zh, en);
  const [tab, setTab] = useState<Tab>(initialTab);
  const [report, setReport] = useState<OpportunityReport | null>(null);
  const [reportInput, setReportInput] = useState("");
  const [registry, setRegistry] = useState<EmployerVerificationResult | null>(
    null,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const currentRef = useRef(c);
  useEffect(() => {
    currentRef.current = c;
  }, [c]);
  const update = (next: WorkCase) => {
    vault.put(next);
    setReport(null);
  };
  const setFact = (key: keyof CaseFacts, value: unknown) => {
    const facts = { ...c.facts, [key]: value };
    if (key === "employerNameOrAbn" || key === "state") {
      facts.employerIdentityStatus = "unknown";
      setRegistry(null);
    }
    const factEvidence = { ...c.factEvidence };
    delete factEvidence[key];
    update({ ...c, facts: factsSchema.parse(facts), factEvidence });
  };
  const verify = async () => {
    const query = c.facts.employerNameOrAbn?.trim();
    if (!query) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/verification/abn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          state: c.facts.state === "unknown" ? undefined : c.facts.state,
        }),
        signal: AbortSignal.timeout(12000),
      });
      const data = await response.json();
      if (!response.ok && response.status !== 501) throw new Error();
      if (
        currentRef.current.facts.employerNameOrAbn?.trim() === query &&
        currentRef.current.facts.state === c.facts.state
      )
        setRegistry(data);
    } catch {
      setError(
        t(
          "注册信息暂时无法查询，请稍后再试或到 ABN Lookup 核查。",
          "Registry lookup unavailable. Retry or check ABN Lookup directly.",
        ),
      );
    } finally {
      setBusy(false);
    }
  };
  const analyze = () => {
    const result = assessOpportunity(c.facts);
    vault.put({
      ...c,
      snapshots: [
        ...c.snapshots,
        {
          at: result.meta.generatedAt,
          rulesetVersion: result.meta.rulesetVersion,
          decision: result.decision,
          facts: c.facts,
          factEvidence: c.factEvidence,
          signalIds: result.riskSignals.map((s) => s.id),
        },
      ].slice(-20),
    });
    setReport(result);
    setReportInput(JSON.stringify(c.facts));
  };
  const tabs: [Tab, string, string, typeof FileText][] = [
    ["details", "岗位信息", "Job details", BriefcaseBusiness],
    ["evidence", "材料", "Evidence", FileText],
    ["hours", "工时", "Hours", CalendarDays],
    ["actions", "待办", "Actions", ClipboardCheck],
    ["chat", "具体问题", "Situation", MessageSquare],
    ["compare", "机会对比", "Compare", GitCompareArrows],
  ];
  const renderField = (key: keyof CaseFacts) => {
    const value = c.facts[key];
    const label = fieldCopy[key];
    if (!label) return null;
    const opts =
      options[key] ??
      ([
        "hasPayslip",
        "superMentioned",
        "hasWrittenAgreement",
        "trialPaid",
      ].includes(key)
        ? yesNoOptions
        : null);
    const numeric = [
      "age",
      "offeredHourlyRate",
      "weeklyHours",
      "trialShiftHours",
      "commuteMinutes",
      "commuteCostPerShift",
      "shiftHours",
      "employmentDurationWeeks",
    ].includes(key);
    return (
      <label className="field" key={key}>
        <span>{label[language === "zh" ? 0 : 1]}</span>
        {opts ? (
          <select
            aria-label={label[language === "zh" ? 0 : 1]}
            value={String(value ?? "unknown")}
            onChange={(e) => setFact(key, e.target.value)}
          >
            {opts.map(([v, zh]) => (
              <option key={v} value={v}>
                {key === "visaType" && v === "none"
                  ? t(zh, "Citizen / permanent resident")
                  : optionLabel(v, zh, language)}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={numeric ? "number" : "text"}
            min="0"
            step={key === "age" ? "1" : "any"}
            max={key === "age" ? 100 : undefined}
            key={numeric ? String(key) + ":" + String(value) : key}
            {...(numeric
              ? { defaultValue: value === undefined ? "" : String(value) }
              : { value: value === undefined ? "" : String(value) })}
            placeholder={t("不确定可留空", "Leave blank if unknown")}
            maxLength={200}
            onChange={
              numeric
                ? () => setReport(null)
                : (e) => setFact(key, e.target.value)
            }
            onBlur={(e) => {
              if (!numeric) return;
              try {
                setFact(
                  key,
                  numeric
                    ? e.target.value === ""
                      ? undefined
                      : Number(e.target.value)
                    : e.target.value,
                );
                setError("");
              } catch {
                setFact(key, undefined);
                setError(
                  t(
                    "无效数值已清空，请输入有效范围内的值。",
                    "Invalid value cleared. Enter a value within the supported range.",
                  ),
                );
              }
            }}
          />
        )}
      </label>
    );
  };
  const boolField = (key: keyof CaseFacts, zh: string, en: string) => (
    <label className="field" key={key}>
      <span>{t(zh, en)}</span>
      <select
        aria-label={t(zh, en)}
        value={
          c.facts[key] === undefined ? "unknown" : c.facts[key] ? "yes" : "no"
        }
        onChange={(e) =>
          setFact(
            key,
            e.target.value === "unknown" ? undefined : e.target.value === "yes",
          )
        }
      >
        {yesNoOptions.map(([v, label]) => (
          <option key={v} value={v}>
            {optionLabel(v, label, language)}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <div className="case-main">
      <header className="case-top">
        <div>
          <div className="eyebrow">
            {t("工作决策档案", "WORK DECISION FILE")}
          </div>
          <input
            className="case-title"
            aria-label={t("案例名称", "Case name")}
            placeholder={t("为这个机会命名", "Name this opportunity")}
            value={c.title === "Untitled" ? "" : c.title}
            maxLength={120}
            onChange={(e) =>
              update({ ...c, title: e.target.value || "Untitled" })
            }
          />
        </div>
        <div className="toolbar">
          <select
            aria-label={t("工作阶段", "Work stage")}
            value={c.phase}
            onChange={(e) =>
              update({ ...c, phase: e.target.value as WorkCase["phase"] })
            }
          >
            <option value="considering">{t("考虑中", "Considering")}</option>
            <option value="working">{t("已经入职", "Working")}</option>
          </select>
          <button
            className="icon-button"
            title={t("导出此案例", "Export this case")}
            aria-label={t("导出此案例", "Export this case")}
            onClick={() =>
              exportFile({ version: 1, cases: [c] }, "au-partimer-case.json")
            }
          >
            <Download size={17} />
          </button>
          <button
            className="icon-button"
            title={t("打印报告", "Print report")}
            aria-label={t("打印报告", "Print report")}
            onClick={() => window.print()}
          >
            <Printer size={17} />
          </button>
          <button
            className="icon-button"
            title={t("删除案例", "Delete case")}
            aria-label={t("删除案例", "Delete case")}
            onClick={() => setDeleteConfirm(true)}
          >
            <Trash2 size={17} />
          </button>
        </div>
      </header>
      {deleteConfirm && (
        <div className="notice">
          <span>
            {t(
              "删除这个案例及其本地记录？",
              "Delete this case and its local records?",
            )}
          </span>
          <button onClick={onDelete}>{t("确认删除", "Delete")}</button>
          <button onClick={() => setDeleteConfirm(false)}>
            {t("取消", "Cancel")}
          </button>
        </div>
      )}
      <nav className="workspace-tabs" aria-label={t("案例视图", "Case views")}>
        {tabs.map(([id, zh, en, Icon]) => (
          <button
            key={id}
            aria-current={tab === id ? "page" : undefined}
            onClick={() => setTab(id)}
          >
            <Icon size={16} />
            {t(zh, en)}
          </button>
        ))}
      </nav>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <div className={tab === "details" ? "case-columns" : "case-content"}>
        {tab === "details" && (
          <>
            <div className="details-pane">
              <section className="form-section">
                <h2>{t("工作与身份", "Work and identity")}</h2>
                <div className="field-grid">
                  {(
                    [
                      "employerNameOrAbn",
                      "roleTitle",
                      "state",
                      "age",
                      "visaType",
                      "industry",
                      "employmentType",
                    ] as const
                  ).map(renderField)}
                  {c.facts.visaType === "500" && (
                    <>
                      {boolField(
                        "isStudyPeriod",
                        "课程是否正在进行",
                        "Is your course in session?",
                      )}
                      {boolField(
                        "visaHoursException",
                        "是否已核实适用工时限制例外",
                        "Have you confirmed an applicable work-hours exception?",
                      )}
                    </>
                  )}
                </div>
                <div className="lookup-row">
                  <button
                    onClick={verify}
                    disabled={busy || !c.facts.employerNameOrAbn}
                    className="secondary"
                  >
                    <Search size={16} />
                    {busy
                      ? t("查询中", "Checking")
                      : t("查询注册记录", "Check registry")}
                  </button>
                  <a
                    href="https://abr.business.gov.au/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    ABN Lookup
                  </a>
                </div>
                {registry && (
                  <div className="registry-result">
                    <strong>
                      {registry.status === "record_found"
                        ? t(
                            "找到候选注册记录",
                            "Candidate registry records found",
                          )
                        : registry.status === "manual_required"
                          ? t(
                              "请到官方登记册核查",
                              "Check the official register",
                            )
                          : t("未返回匹配记录", "No matching records returned")}
                    </strong>
                    {registry.matches.map((m, i) => (
                      <p key={i}>
                        {m.name} · {m.abn} ·{" "}
                        {m.status === "Active"
                          ? t("有效", "Active")
                          : m.status === "Cancelled"
                            ? t("已注销", "Cancelled")
                            : m.status || t("状态未知", "Unknown status")}{" "}
                        · {m.state}
                      </p>
                    ))}
                    <p>
                      {t(
                        "注册记录不等于招聘真实。仍需独立确认注册状态、地址和招聘者关联。",
                        "A registry record does not establish a genuine job. Independently check registration status, address and recruiter connection.",
                      )}
                    </p>
                  </div>
                )}
                <div className="field-grid">
                  {renderField("employerIdentityStatus")}
                </div>
              </section>
              <section className="form-section">
                <h2>
                  {c.phase === "working"
                    ? t(
                        "实际工资与工作安排",
                        "Actual pay and work arrangements",
                      )
                    : t("薪酬与试工", "Pay and trial terms")}
                </h2>
                <div className="field-grid">
                  {(
                    [
                      "offeredHourlyRate",
                      "weeklyHours",
                      "paymentMethod",
                      "hasPayslip",
                      "superMentioned",
                      "hasWrittenAgreement",
                      "trialShiftHours",
                      "trialPaid",
                    ] as const
                  ).map(renderField)}
                  {boolField(
                    "trialSupervised",
                    "试工是否直接受监督",
                    "Direct supervision during trial?",
                  )}
                  {c.phase === "working" &&
                    renderField("employmentDurationWeeks")}
                </div>
              </section>
              <section className="form-section">
                <h2>{t("招聘风险核查", "Recruitment checks")}</h2>
                <div className="field-grid">
                  {renderField("contactChannel")}
                  {boolField(
                    "requiresUpfrontPayment",
                    "是否要求先付款",
                    "Asked to pay before earning?",
                  )}
                  {boolField(
                    "asksForBankOrCrypto",
                    "是否涉及代收转账或加密货币",
                    "Asked to move money or use crypto?",
                  )}
                  {boolField(
                    "asksForIdentityDocsEarly",
                    "是否过早索要身份证件",
                    "Identity documents requested early?",
                  )}
                  {boolField(
                    "urgentStartOrPressure",
                    "是否被催促立即决定",
                    "Pressured to decide immediately?",
                  )}
                </div>
              </section>
              <section className="form-section">
                <h2>{t("现实条件", "Practical constraints")}</h2>
                <div className="field-grid">
                  {(
                    [
                      "cashPressure",
                      "hasOtherOptions",
                      "commuteMinutes",
                      "commuteCostPerShift",
                      "shiftHours",
                    ] as const
                  ).map(renderField)}
                </div>
                <p className="micro">
                  {t(
                    "通勤收益比较仅用于决策，不是法定工资计算。",
                    "Commute-adjusted earnings support comparison; they are not a legal pay calculation.",
                  )}
                </p>
              </section>
              <button className="primary analyze-button" onClick={analyze}>
                {t("检查当前信息", "Check current information")}
                <ArrowRight size={17} />
              </button>
            </div>
            <aside className="report-pane">
              {report && reportInput === JSON.stringify(c.facts) ? (
                <>
                  <CaseReport report={report} language={language} />
                  {c.factEvidence.offeredHourlyRate && (
                    <p className="micro">
                      {t("时薪证据", "Hourly-pay evidence")}:{" "}
                      {
                        c.evidence.find(
                          (e) => e.id === c.factEvidence.offeredHourlyRate,
                        )?.name
                      }
                    </p>
                  )}
                </>
              ) : (
                <div className="report-empty">
                  <ClipboardCheck size={28} />
                  <h2>{t("本次检查", "Current assessment")}</h2>
                  <p>
                    {t(
                      "尚未生成当前信息的报告。",
                      "No report for the current information yet.",
                    )}
                  </p>
                  <p className="micro">
                    {t(
                      "信息变更后，需要重新检查。",
                      "Reassess after changing information.",
                    )}
                  </p>
                  {!!c.snapshots.length && (
                    <div className="history">
                      <h3>{t("历史检查", "Assessment history")}</h3>
                      {c.snapshots
                        .slice(-5)
                        .reverse()
                        .map((s, i) => (
                          <p key={i}>
                            {s.at.slice(0, 10)} ·{" "}
                            {
                              decisionCopy[s.decision][
                                language === "zh" ? 0 : 1
                              ]
                            }
                            <small>
                              {s.rulesetVersion}
                              {s.rulesetVersion !== OPPORTUNITY_RULESET_VERSION
                                ? t("（旧版）", " (older rules)")
                                : ""}
                            </small>
                          </p>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </aside>
          </>
        )}
        {tab === "evidence" && (
          <EvidencePanel workCase={c} update={update} language={language} />
        )}
        {tab === "hours" && (
          <HoursPanel
            workCase={c}
            allCases={vault.cases}
            update={update}
            language={language}
          />
        )}
        {tab === "actions" && (
          <section>
            <h2>{t("下一步行动", "Next actions")}</h2>
            <label className="field">
              <span>
                {t("待向雇主确认的问题", "Questions for the employer")}
              </span>
              <textarea
                rows={3}
                maxLength={4000}
                value={c.questions}
                onChange={(e) => update({ ...c, questions: e.target.value })}
              />
            </label>
            <div className="field-grid">
              <label className="field">
                <span>{t("下次复查日期", "Next review date")}</span>
                <input
                  type="date"
                  value={c.reviewDate ?? ""}
                  onChange={(e) =>
                    update({ ...c, reviewDate: e.target.value || undefined })
                  }
                />
              </label>
              <label className="field">
                <span>
                  {t("需要暂停或退出的条件", "Conditions to pause or leave")}
                </span>
                <textarea
                  maxLength={2000}
                  rows={2}
                  value={c.exitConditions}
                  onChange={(e) =>
                    update({ ...c, exitConditions: e.target.value })
                  }
                />
              </label>
            </div>
            <div className="action-list">
              {actionCopy.map(([id, zh, en]) => (
                <label key={id}>
                  <input
                    type="checkbox"
                    checked={c.actions[id] ?? false}
                    onChange={(e) =>
                      vault.put({
                        ...c,
                        actions: { ...c.actions, [id]: e.target.checked },
                      })
                    }
                  />
                  <span>{t(zh, en)}</span>
                  <Check size={16} />
                </label>
              ))}
            </div>
            <p>
              {t(
                "急需收入时，先明确首次结薪检查点与退出条件；身份核验和资金保护仍须完成。",
                "When income is urgent, set a first-pay review and exit conditions. Identity checks and protection of money remain necessary.",
              )}
            </p>
            <a
              href="https://www.fairwork.gov.au/tools-and-resources/record-my-hours-app"
              target="_blank"
              rel="noreferrer"
            >
              Fair Work Record My Hours
            </a>
          </section>
        )}
        {tab === "chat" && (
          <SituationPanel language={language} workCase={c} update={update} />
        )}
        {tab === "compare" && (
          <section>
            <h2>{t("真实机会对比", "Compare your opportunities")}</h2>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    {[
                      t("机会", "Opportunity"),
                      t("税前时薪", "Gross hourly pay"),
                      t("通勤后收益／小时", "Commute-adjusted earnings/hour"),
                      t("身份资料", "Identity information"),
                      t("材料数", "Evidence"),
                    ].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(vault.cases.length ? vault.cases : [c]).map((job) => (
                    <tr key={job.id}>
                      <td>
                        {job.title === "Untitled"
                          ? t("未命名", "Untitled")
                          : job.title}
                      </td>
                      <td>
                        {job.facts.offeredHourlyRate === undefined
                          ? t("未知", "Unknown")
                          : "$" + job.facts.offeredHourlyRate.toFixed(2)}
                      </td>
                      <td>
                        {effectiveHourlyPay(job.facts) === null
                          ? t(
                              "缺少通勤或班次信息",
                              "Commute or shift details missing",
                            )
                          : "$" + effectiveHourlyPay(job.facts)!.toFixed(2)}
                      </td>
                      <td>
                        {job.facts.employerIdentityStatus === "verified"
                          ? t(
                              "用户报告已核验",
                              "User reports independent check",
                            )
                          : t("待核验", "Needs checking")}
                      </td>
                      <td>{job.evidence.filter((e) => e.confirmed).length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="micro">
              {t(
                "比较你提供的真实机会，不根据公司规模推断岗位更安全。",
                "Compares opportunities you provide; company size is not proof of safety.",
              )}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}

function EvidencePanel({
  workCase: c,
  update,
  language,
}: {
  workCase: WorkCase;
  update: (c: WorkCase) => void;
  language: Language;
}) {
  const t = (zh: string, en: string) => text(language, zh, en);
  const [draft, setDraft] = useState("");
  const [name, setName] = useState("");
  const [confirmedRate, setConfirmedRate] = useState("");
  const [method, setMethod] = useState<"manual" | "text" | "pdf">("manual");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  return (
    <section>
      <h2>{t("材料与事实确认", "Evidence and fact confirmation")}</h2>
      <div className="toolbar">
        <button
          className="secondary"
          disabled={busy}
          onClick={() => fileInput.current?.click()}
        >
          <Upload size={16} />
          {busy ? t("提取中", "Extracting") : t("读取材料", "Read document")}
        </button>
        <span className="micro">PDF / TXT · 2 MB</span>
      </div>
      <input
        ref={fileInput}
        type="file"
        accept=".pdf,.txt"
        hidden
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          setBusy(true);
          setError("");
          try {
            if (f.size > 2_000_000) throw new Error();
            const data = new FormData();
            data.append("file", f);
            const r = await fetch("/api/documents/upload", {
              method: "POST",
              body: data,
              signal: AbortSignal.timeout(15000),
            });
            const result = await r.json();
            if (!r.ok) throw new Error();
            if (!result.extractedText) {
              setError(
                t(
                  "材料没有可读取文本。扫描件和图片识别暂未开放，请手动填写已确认的内容。",
                  "No readable text. Scans and image OCR are unavailable; enter confirmed details manually.",
                ),
              );
            } else {
              setDraft(result.extractedText);
              setName(f.name);
              setMethod(f.type === "application/pdf" ? "pdf" : "text");
            }
            if (result.truncated)
              setError(
                t(
                  "文字过长，已截断。请核对原文件，分段整理遗漏内容。",
                  "Text was truncated. Check the original and add omitted details separately.",
                ),
              );
          } catch {
            setError(
              t(
                "无法提取这个文件，请检查大小和格式，或手动填写。",
                "Could not extract this file. Check size and format or enter details manually.",
              ),
            );
          } finally {
            setBusy(false);
            e.target.value = "";
          }
        }}
      />
      <label className="field">
        <span>{t("材料名称", "Evidence name")}</span>
        <input
          value={name}
          maxLength={200}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label className="field">
        <span>{t("已确认的原文或摘要", "Confirmed text or excerpt")}</span>
        <textarea
          rows={8}
          maxLength={16000}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
      </label>
      <p className="micro">
        {t(
          "核对金额、日期和身份信息后再保存。材料不会自动变成已确认的岗位事实；请在岗位信息中填写已核对的值。",
          "Check amounts, dates and identifiers before saving. Evidence does not automatically become job facts; enter checked values in Job details.",
        )}
      </p>
      <label className="field">
        <span>
          {t(
            "原文中已核实的税前时薪（可选）",
            "Confirmed gross hourly rate in the text (optional)",
          )}
        </span>
        <input
          type="number"
          min="0"
          max="1000"
          step=".01"
          value={confirmedRate}
          onChange={(e) => setConfirmedRate(e.target.value)}
        />
      </label>
      <button
        className="primary"
        disabled={!name.trim() || !draft.trim() || c.evidence.length >= 20}
        onClick={() => {
          const id = crypto.randomUUID();
          const rate = confirmedRate === "" ? undefined : Number(confirmedRate);
          if (
            rate !== undefined &&
            (!Number.isFinite(rate) || rate < 0 || rate > 1000)
          ) {
            setError(t("请检查时薪。", "Check the hourly rate."));
            return;
          }
          update({
            ...c,
            evidence: [
              ...c.evidence,
              {
                id,
                name: name.trim(),
                text: draft,
                method,
                confirmed: true,
                createdAt: new Date().toISOString(),
              },
            ],
            facts:
              rate === undefined
                ? c.facts
                : { ...c.facts, offeredHourlyRate: rate },
            factEvidence:
              rate === undefined
                ? c.factEvidence
                : { ...c.factEvidence, offeredHourlyRate: id },
          });
          setDraft("");
          setName("");
          setMethod("manual");
          setConfirmedRate("");
        }}
      >
        <Check size={16} />
        {t("确认并加入案例", "Confirm and add to case")}
      </button>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      <div className="evidence-list">
        {c.evidence.map((e) => (
          <details key={e.id}>
            <summary>
              <FileText size={16} />
              {e.name}
              <small>{e.createdAt.slice(0, 10)}</small>
            </summary>
            <pre>{e.text}</pre>
            <button
              className="secondary"
              onClick={() =>
                update({
                  ...c,
                  evidence: c.evidence.filter((item) => item.id !== e.id),
                  factEvidence: Object.fromEntries(
                    Object.entries(c.factEvidence).filter(
                      ([, id]) => id !== e.id,
                    ),
                  ),
                })
              }
            >
              <Trash2 size={14} />
              {t("移除", "Remove")}
            </button>
          </details>
        ))}
      </div>
    </section>
  );
}

function HoursPanel({
  workCase: c,
  allCases,
  update,
  language,
}: {
  workCase: WorkCase;
  allCases: WorkCase[];
  update: (c: WorkCase) => void;
  language: Language;
}) {
  const t = (zh: string, en: string) => text(language, zh, en);
  const [date, setDate] = useState("");
  const [hours, setHours] = useState("");
  const [paid, setPaid] = useState("");
  const [error, setError] = useState("");
  const allShifts = (allCases.length ? allCases : [c]).flatMap(
    (job) => job.shifts,
  );
  const windows = fortnightWindows(allShifts);
  const max = Math.max(0, ...windows.map((w) => w.hours));
  return (
    <section>
      <h2>{t("工时与实际收款", "Hours and actual receipts")}</h2>
      <form
        className="shift-form"
        onSubmit={(e) => {
          e.preventDefault();
          const parsed = shiftSchema.safeParse({
            id: crypto.randomUUID(),
            date,
            hours: Number(hours),
            paid: paid === "" ? undefined : Number(paid),
          });
          if (!parsed.success || c.shifts.length >= 366) {
            setError(t("请检查日期和工时。", "Check the date and hours."));
            return;
          }
          const totalForDay = allShifts
            .filter((s) => s.date === date)
            .reduce((n, s) => n + s.hours, 0);
          if (totalForDay + parsed.data.hours > 24) {
            setError(
              t(
                "同一天的总工时不能超过24小时。",
                "Combined hours cannot exceed 24 in a day.",
              ),
            );
            return;
          }
          update({
            ...c,
            shifts: [...c.shifts, parsed.data],
            facts: { ...c.facts, fortnightHours: undefined },
          });
          setHours("");
          setPaid("");
          setError("");
        }}
      >
        <label className="field">
          <span>{t("日期", "Date")}</span>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <label className="field">
          <span>
            {t("工作小时（扣除休息）", "Hours worked (excluding breaks)")}
          </span>
          <input
            type="number"
            min=".25"
            max="24"
            step=".25"
            required
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
        </label>
        <label className="field">
          <span>{t("实收金额（可选）", "Amount received (optional)")}</span>
          <input
            type="number"
            min="0"
            step=".01"
            value={paid}
            onChange={(e) => setPaid(e.target.value)}
          />
        </label>
        <button className="primary">
          <Plus size={16} />
          {t("记录班次", "Add shift")}
        </button>
      </form>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>{t("日期", "Date")}</th>
              <th>{t("工时", "Hours")}</th>
              <th>{t("实收", "Received")}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {c.shifts.map((s) => (
              <tr key={s.id}>
                <td>{s.date}</td>
                <td>{s.hours}</td>
                <td>{s.paid === undefined ? "—" : "$" + s.paid.toFixed(2)}</td>
                <td>
                  <button
                    className="icon-button"
                    aria-label={t("删除班次", "Delete shift")}
                    title={t("删除班次", "Delete shift")}
                    onClick={() =>
                      update({
                        ...c,
                        shifts: c.shifts.filter((v) => v.id !== s.id),
                        facts: { ...c.facts, fortnightHours: undefined },
                      })
                    }
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3>{t("全部案例的双周工时", "Fortnight hours across all cases")}</h3>
      <div className="window-list">
        {windows.map((w) => (
          <div key={w.start} className={w.hours > 48 ? "over-hours" : ""}>
            <span>{w.start}</span>
            <strong>{w.hours} h</strong>
          </div>
        ))}
      </div>
      <p className="micro">
        {t(
          "每个周一开始的14天窗口；只包含你已记录的班次，不证明全部工作已覆盖。",
          "Each Monday starts a 14-day window. Only entered shifts are included; completeness is not established.",
        )}
      </p>
      <label className="checkbox-line">
        <input
          type="checkbox"
          disabled={!allShifts.length}
          checked={c.facts.fortnightHours !== undefined}
          onChange={(e) =>
            update({
              ...c,
              facts: {
                ...c.facts,
                fortnightHours: e.target.checked ? max : undefined,
              },
            })
          }
        />
        {t(
          "我已记录相关期间所有工作的完整排班，用于本次筛查",
          "I have recorded complete rosters for all jobs in the relevant period for this assessment",
        )}
      </label>
      {c.facts.visaType === "500" && (
        <a
          href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500"
          target="_blank"
          rel="noreferrer"
        >
          {t(
            "核对具体签证条件与例外",
            "Check individual visa conditions and exceptions",
          )}
        </a>
      )}
    </section>
  );
}

function SituationPanel({
  language,
  workCase: c,
  update,
}: {
  language: Language;
  workCase: WorkCase;
  update: (c: WorkCase) => void;
}) {
  const t = (zh: string, en: string) => text(language, zh, en);
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >(c.messages);
  const requestRef = useRef<AbortController | null>(null);
  const latestCase = useRef(c);
  useEffect(() => {
    latestCase.current = c;
  }, [c]);
  useEffect(() => () => requestRef.current?.abort(), []);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <section className="situation-panel">
      <h2>{t("具体工作问题", "A specific workplace issue")}</h2>
      <p className="micro">
        {t(
          "发送的文字会交由 AI 服务处理。请去除证件号码、银行资料等不必要信息。对话会加入此案例，是否留在设备上取决于保存设置。",
          "Messages are sent to the AI service. Remove unnecessary identifiers and banking details. Conversations join this case; device retention follows your save setting.",
        )}
      </p>
      <div className="conversation" aria-live="polite">
        {messages.map((m, i) => (
          <article key={i} className={"message " + m.role}>
            <strong>
              {m.role === "user" ? t("你", "You") : t("分析助手", "Assistant")}
            </strong>
            <p>{m.content}</p>
          </article>
        ))}
      </div>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!input.trim() || busy) return;
          setBusy(true);
          setError("");
          const next = [
            ...messages,
            { role: "user" as const, content: input.trim() },
          ].slice(-18);
          const controller = new AbortController();
          requestRef.current = controller;
          try {
            const r = await fetch("/api/chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                messages: boundedChatHistory(next),
                language,
                flowType: "SITUATION_ANALYZER",
              }),
              signal: AbortSignal.any([
                controller.signal,
                AbortSignal.timeout(50000),
              ]),
            });
            const data = await r.json();
            if (controller.signal.aborted) return;
            if (!r.ok) throw new Error(data.error);
            const completed = [
              ...next,
              {
                role: "assistant" as const,
                content: (
                  data.text ||
                  t(
                    "已完成工具检查，但解释未生成。请补充关键事实后重试。",
                    "Tool checks completed without an explanation. Confirm the missing facts and retry.",
                  )
                ).slice(0, 12000),
              },
            ];
            setMessages(completed);
            update({ ...latestCase.current, messages: completed });
            setInput("");
          } catch {
            if (controller.signal.aborted) return;
            setError(
              t(
                "分析服务暂不可用或已达到使用限额。你的输入已保留；可以继续使用岗位筛查。",
                "Analysis is unavailable or usage is limited. Your input is preserved; job screening remains available.",
              ),
            );
          } finally {
            setBusy(false);
          }
        }}
      >
        <label className="field">
          <span>{t("描述发生的事情", "Describe what happened")}</span>
          <textarea
            rows={4}
            maxLength={4000}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </label>
        <button className="primary" disabled={busy || !input.trim()}>
          {busy ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <ArrowRight size={16} />
          )}{" "}
          {t("发送并分析", "Send for analysis")}
        </button>
      </form>
    </section>
  );
}
