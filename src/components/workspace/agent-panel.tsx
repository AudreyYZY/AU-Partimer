"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, CheckCircle2, CircleAlert, Loader2, Send } from "lucide-react";
import { boundedChatHistory } from "@/lib/chat-history";
import type { WorkCase } from "@/lib/case-model";
import {
  missingCheckCopy,
  text,
  type Language,
} from "@/lib/workspace-copy";
import type { AgentWorkflowResult } from "@/services/agent/types";

export function AgentPanel({
  language,
  workCase: c,
  update,
}: {
  language: Language;
  workCase: WorkCase;
  update: (workCase: WorkCase) => void;
}) {
  const t = (zh: string, en: string) => text(language, zh, en);
  const [messages, setMessages] = useState(c.messages);
  const [result, setResult] = useState<AgentWorkflowResult | null>(null);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const requestRef = useRef<AbortController | null>(null);
  const latestCase = useRef(c);
  useEffect(() => {
    latestCase.current = c;
  }, [c]);
  useEffect(() => () => requestRef.current?.abort(), []);

  const localiseMissing = (value: string) =>
    language === "zh" ? missingCheckCopy[value] ?? value : value;

  return (
    <section className="agent-panel">
      <div className="agent-heading">
        <div>
          <p className="eyebrow">LANGGRAPH WORKFLOW</p>
          <h2>{t("岗位决策 Agent", "Job decision agent")}</h2>
        </div>
        <Bot size={24} aria-hidden="true" />
      </div>
      <p className="micro">
        {t(
          "Agent 会先运行版本化规则，再检索已复核的官方资料，最后生成说明。没有模型时仍可完成确定性分析；材料原文不会自动发送。请勿输入证件号或银行资料。",
          "The agent runs versioned rules, retrieves reviewed official guidance, then explains the result. Deterministic analysis still works without a model; evidence text is not sent automatically. Do not enter identity or banking details.",
        )}
      </p>

      {result && (
        <div className="agent-result" aria-live="polite">
          <div className="agent-status-row">
            <span className={`agent-status decision-${result.decision}`}>
              {result.status === "needs_user_input"
                ? t("需要人工确认", "Human confirmation needed")
                : t("本轮已完成", "Run completed")}
            </span>
            <span className="agent-mode">
              {result.explanationMode === "model"
                ? t("模型解释", "Model explanation")
                : t("确定性解释", "Deterministic explanation")}
            </span>
          </div>
          {!!result.missingFacts.length && (
            <div className="agent-block">
              <h3>{t("先补充这些事实", "Confirm these facts first")}</h3>
              <ul>
                {result.missingFacts.slice(0, 8).map((fact) => (
                  <li key={fact}>{localiseMissing(fact)}</li>
                ))}
              </ul>
            </div>
          )}
          <details className="agent-block">
            <summary>{t("查看执行计划", "View execution plan")}</summary>
            <ol>
              {result.plan.map((item) => (
                <li key={item.id}>
                  {item.required ? <CircleAlert size={14} /> : <CheckCircle2 size={14} />}
                  <span>{item.label}</span>
                </li>
              ))}
            </ol>
          </details>
          <details className="agent-block">
            <summary>{t("查看运行轨迹", "View run trace")}</summary>
            <ol className="agent-trace">
              {result.trace.map((item, index) => (
                <li key={`${item.node}-${index}`}>
                  <code>{item.node}</code>
                  <span>{item.detail}</span>
                </li>
              ))}
            </ol>
          </details>
          <div className="agent-block">
            <h3>{t("本轮检索来源", "Retrieved sources")}</h3>
            <div className="agent-sources">
              {result.sources.map((source) => (
                <a
                  key={source.id}
                  href={source.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>{source.authority}</span>
                  <strong>{source.title}</strong>
                  <small>
                    {t("复核至", "Reviewed until")} {source.reviewDue}
                    {source.stale ? ` · ${t("已过期", "Overdue")}` : ""}
                  </small>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="conversation" aria-live="polite">
        {messages.map((message, index) => (
          <article key={index} className={`message ${message.role}`}>
            <strong>
              {message.role === "user" ? t("你", "You") : t("Agent", "Agent")}
            </strong>
            <p>{message.content}</p>
          </article>
        ))}
      </div>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (!input.trim() || busy) return;
          setBusy(true);
          setError("");
          const question = input.trim();
          const next = [
            ...messages,
            { role: "user" as const, content: question },
          ].slice(-18);
          const controller = new AbortController();
          requestRef.current = controller;
          try {
            const response = await fetch("/api/agent/run", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                caseId: c.id,
                language,
                question,
                facts: c.facts,
                history: boundedChatHistory(messages).slice(-12),
              }),
              signal: AbortSignal.any([
                controller.signal,
                AbortSignal.timeout(45000),
              ]),
            });
            const data = (await response.json()) as AgentWorkflowResult & {
              error?: string;
            };
            if (controller.signal.aborted) return;
            if (!response.ok) throw new Error(data.error);
            const completed = [
              ...next,
              { role: "assistant" as const, content: data.answer.slice(0, 12000) },
            ].slice(-20);
            setMessages(completed);
            setResult(data);
            update({
              ...latestCase.current,
              messages: completed,
              agentRuns: [
                ...latestCase.current.agentRuns,
                {
                  id: data.requestId,
                  at: data.report.meta.generatedAt,
                  status: data.status,
                  explanationMode: data.explanationMode,
                  decision: data.decision,
                  sourceIds: data.sources.map((source) => source.id),
                  trace: data.trace,
                },
              ].slice(-10),
            });
            setInput("");
          } catch {
            if (controller.signal.aborted) return;
            setError(
              t(
                "Agent 暂时无法完成这一轮。你的输入仍在编辑框中，岗位信息和本地规则筛查不受影响。",
                "The agent could not complete this run. Your input remains in the editor; job details and local rule screening are unaffected.",
              ),
            );
          } finally {
            setBusy(false);
          }
        }}
      >
        <label className="field">
          <span>{t("你想判断什么", "What do you want to decide?")}</span>
          <textarea
            rows={4}
            maxLength={4000}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={t(
              "例如：对方让我明天先无薪试工，我现在很需要收入，应该先确认什么？",
              "For example: they want an unpaid trial tomorrow and I need income. What should I confirm first?",
            )}
          />
        </label>
        <button className="primary" disabled={busy || !input.trim()}>
          {busy ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          {busy ? t("正在执行", "Running") : t("运行 Agent", "Run agent")}
        </button>
      </form>
    </section>
  );
}
