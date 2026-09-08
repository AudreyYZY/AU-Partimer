"use client";
import { useLanguagePreference } from "@/hooks/use-language-preference";
import { text } from "@/lib/workspace-copy";
import {
  OPPORTUNITY_RULESET_VERSION,
  SOURCE_REVIEW_DUE,
} from "@/lib/constants";
export default function AboutPage() {
  const [language] = useLanguagePreference();
  const t = (zh: string, en: string) => text(language, zh, en);
  return (
    <div className="case-main" style={{ maxWidth: 1000 }}>
      <h1 className="text-2xl font-semibold">
        {t("能力与验证状态", "Capabilities and validation")}
      </h1>
      <p className="my-4">
        {t(
          "本工具用于筛查和整理行动，不证明岗位安全，也不提供个案法律结论。",
          "This tool supports screening and actions. It does not establish job safety or provide individual legal determinations.",
        )}
      </p>
      <table className="w-full text-sm">
        <tbody>
          {[
            [
              t("岗位风险与行动", "Job screening and actions"),
              t(
                "确定性规则，保留未知状态",
                "Deterministic rules with explicit unknowns",
              ),
            ],
            [
              t("注册信息", "Registry information"),
              t(
                "需要服务配置；候选记录不代表招聘者已核验",
                "Requires service configuration; records do not verify recruiters",
              ),
            ],
            [
              t("工资", "Pay"),
              t(
                "成人全国基准；精确适用工资尚未计算",
                "Adult national benchmark; exact applicable rates not calculated",
              ),
            ],
            [
              t("材料", "Documents"),
              t(
                "文字和文字型 PDF；人工确认；不支持图片识别",
                "Text and text PDFs; human confirmation; no image OCR",
              ),
            ],
            [
              t("专家验证", "Expert validation"),
              t(
                "尚未完成独立专家标注与盲测",
                "Independent expert labels and holdout validation outstanding",
              ),
            ],
            [
              t("真实用户效果", "Real-user outcomes"),
              t("尚未完成真实用户试点", "Real-user pilot outstanding"),
            ],
          ].map(([name, status]) => (
            <tr key={name}>
              <th className="border-b py-4 text-left pr-6 font-medium">
                {name}
              </th>
              <td className="border-b py-4">{status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="micro">
        {t("规则版本", "Ruleset")}: {OPPORTUNITY_RULESET_VERSION} ·{" "}
        {t("复核期限", "Review due")}: {SOURCE_REVIEW_DUE}
      </p>
      <p className="mt-6">
        {t(
          "默认不保留案例；开启本设备保存后，材料、工时和对话将留在本浏览器。服务器备份需单独启用。",
          "Cases are not retained by default. Device saving keeps evidence, hours and conversations in this browser. Server backup requires separate activation.",
        )}
      </p>
      <p className="mt-4">
        {t("工时、材料和法规核对入口：", "Official resources:")}{" "}
        <a className="underline" href="https://www.fairwork.gov.au">
          Fair Work
        </a>{" "}
        ·{" "}
        <a className="underline" href="https://abr.business.gov.au/">
          ABN Lookup
        </a>{" "}
        ·{" "}
        <a
          className="underline"
          href="https://www.scamwatch.gov.au/types-of-scams/jobs-and-employment-scams"
        >
          Scamwatch
        </a>
      </p>
    </div>
  );
}
