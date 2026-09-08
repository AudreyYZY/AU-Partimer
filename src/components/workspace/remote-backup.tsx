"use client";
import { useState } from "react";
import { Cloud, Download, Trash2 } from "lucide-react";
import { caseSchema, type WorkCase } from "@/lib/case-model";
import { text, type Language } from "@/lib/workspace-copy";

export function RemoteBackup({
  cases,
  restore,
  language,
}: {
  cases: WorkCase[];
  restore: (c: WorkCase) => void;
  language: Language;
}) {
  const t = (zh: string, en: string) => text(language, zh, en);
  const [open, setOpen] = useState(false),
    [token, setToken] = useState(""),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  const [remote, setRemote] = useState<
    { case: WorkCase; remoteRevision: number }[]
  >([]);
  const [connected, setConnected] = useState(false);
  async function connect() {
    setBusy(true);
    setMessage("");
    setConnected(false);
    setRemote([]);
    try {
      if (token) {
        const access = await fetch("/api/access", {
          method: "POST",
          signal: AbortSignal.timeout(15000),
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        if (!access.ok) throw new Error();
      }
      const health = await fetch("/api/health", {
        signal: AbortSignal.timeout(15000),
      });
      if (!health.ok) throw new Error();
      const capability = await health.json();
      setToken("");
      if (!capability.capabilities.remoteBackup) {
        setMessage(
          t(
            "服务器备份未启用。有效口令已用于在线服务；具体分析仍取决于服务配置。",
            "Server backup is disabled. A valid token grants online-service access; analysis still depends on provider configuration.",
          ),
        );
        return;
      }
      const r = await fetch("/api/cases", {
        signal: AbortSignal.timeout(15000),
      });
      if (!r.ok) throw new Error();
      const data = await r.json();
      setRemote(
        data.cases.map((r: { case: unknown; remoteRevision: number }) => ({
          ...r,
          case: caseSchema.parse(r.case),
        })),
      );
      setConnected(true);
      setToken("");
    } catch {
      setMessage(
        t(
          "服务器备份未启用、会话已过期或口令无效。本设备的案例未受影响。",
          "Remote backup is disabled, session expired or access denied. Local cases are unaffected.",
        ),
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="remote-backup">
      <button className="secondary" onClick={() => setOpen(!open)}>
        <Cloud size={15} />
        {t("在线服务与备份", "Online services")}
      </button>
      {open && (
        <div>
          <p className="micro">
            {t(
              "可选试点功能。备份加密保存并与本浏览器会话关联；丢失会话后无法通过账号找回，请同时导出备份。",
              "Optional pilot. Encrypted backups are tied to this browser session. No account recovery after session loss; also export a backup.",
            )}
          </p>
          <label className="field">
            <span>{t("试点访问口令", "Pilot access token")}</span>
            <input
              type="password"
              autoComplete="off"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              maxLength={256}
            />
          </label>
          <button disabled={busy} className="secondary" onClick={connect}>
            {t("连接并读取备份", "Connect and load backups")}
          </button>
          {connected && (
            <button
              className="secondary"
              disabled={busy || !cases.length}
              onClick={async () => {
                setBusy(true);
                try {
                  const updated = [...remote];
                  for (const c of cases) {
                    const old = updated.find((r) => r.case.id === c.id);
                    const r = await fetch("/api/cases", {
                      method: "PUT",
                      signal: AbortSignal.timeout(15000),
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        case: c,
                        expectedRevision: old?.remoteRevision ?? 0,
                      }),
                    });
                    if (!r.ok) throw new Error();
                    const result = await r.json();
                    const next = {
                      case: c,
                      remoteRevision: result.remoteRevision,
                    };
                    const index = updated.findIndex((v) => v.case.id === c.id);
                    if (index < 0) updated.push(next);
                    else updated[index] = next;
                    setRemote([...updated]);
                  }
                  setMessage(t("备份已更新。", "Backups updated."));
                } catch {
                  setMessage(
                    t(
                      "部分备份可能未完成，或服务器版本已变更。请重新读取备份，确认内容后再操作。",
                      "Some backups may be incomplete or changed remotely. Reload and review before retrying.",
                    ),
                  );
                } finally {
                  setBusy(false);
                }
              }}
            >
              {t("加密备份当前案例", "Back up current cases")}
            </button>
          )}
          {remote.map((r) => (
            <div key={r.case.id} className="backup-row">
              <span>
                {r.case.title === "Untitled"
                  ? t("未命名", "Untitled")
                  : r.case.title}
              </span>
              <button
                className="icon-button"
                disabled={busy}
                title={t("恢复为新的本地副本", "Restore as a new local copy")}
                aria-label={t(
                  "恢复为新的本地副本",
                  "Restore as a new local copy",
                )}
                onClick={() => restore({ ...r.case, id: crypto.randomUUID() })}
              >
                <Download size={14} />
              </button>
              <button
                className="icon-button"
                disabled={busy}
                title={t("删除服务器副本", "Delete server copy")}
                aria-label={t("删除服务器副本", "Delete server copy")}
                onClick={async () => {
                  setBusy(true);
                  try {
                    const response = await fetch("/api/cases", {
                      method: "DELETE",
                      signal: AbortSignal.timeout(15000),
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ id: r.case.id }),
                    });
                    if (!response.ok) throw new Error();
                    setRemote(remote.filter((v) => v.case.id !== r.case.id));
                  } catch {
                    setMessage(
                      t(
                        "服务器副本未能删除，请重试。",
                        "Server copy could not be deleted. Retry.",
                      ),
                    );
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {message && (
            <p role="status" className="micro">
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
