import { SOURCE_REVIEW_DUE } from "@/lib/constants";

export type GuidanceTopic =
  | "scam"
  | "identity"
  | "pay"
  | "payslip"
  | "super"
  | "trial"
  | "visa"
  | "hours"
  | "award";

export interface GuidanceDocument {
  id: string;
  title: string;
  titleZh: string;
  authority: string;
  sourceUrl: string;
  topics: GuidanceTopic[];
  keywords: string[];
  summaryZh: string;
  summaryEn: string;
  reviewedAt: string;
  reviewDue: string;
}

const reviewedAt = "2026-09-08";

export const GUIDANCE_DOCUMENTS: readonly GuidanceDocument[] = [
  {
    id: "SCAMWATCH-JOB-SCAMS",
    title: "Jobs and employment scams",
    titleZh: "求职与就业诈骗",
    authority: "Scamwatch",
    sourceUrl:
      "https://www.scamwatch.gov.au/types-of-scams/jobs-and-employment-scams",
    topics: ["scam", "identity"],
    keywords: [
      "upfront payment",
      "crypto",
      "bank transfer",
      "identity document",
      "pressure",
      "job scam",
      "付款",
      "转账",
      "加密货币",
      "证件",
      "诈骗",
    ],
    summaryZh:
      "求职诈骗常见信号包括先付款、代收或转移资金、过早索取敏感资料，以及催促立即行动。遇到这些信号时先停止资金和证件操作，并通过独立渠道核验。",
    summaryEn:
      "Common job-scam signals include upfront payments, moving money, early requests for sensitive data and pressure to act. Pause money and identity actions and verify through an independent channel.",
    reviewedAt,
    reviewDue: SOURCE_REVIEW_DUE,
  },
  {
    id: "ABR-ABN-LOOKUP",
    title: "ABN Lookup",
    titleZh: "ABN 注册信息查询",
    authority: "Australian Business Register",
    sourceUrl: "https://abr.business.gov.au/",
    topics: ["identity"],
    keywords: ["abn", "business name", "entity", "employer", "雇主", "企业", "注册"],
    summaryZh:
      "ABN Lookup 可用于查找公开注册记录，但找到同名实体不能证明当前招聘者与该实体有关联；仍需独立核对地址、域名、联系人和书面条款。",
    summaryEn:
      "ABN Lookup can find public registration records, but a matching entity does not prove the recruiter is connected to it. Independently check the address, domain, contact and written terms.",
    reviewedAt,
    reviewDue: SOURCE_REVIEW_DUE,
  },
  {
    id: "FWO-MINIMUM-WAGES",
    title: "Minimum wages",
    titleZh: "最低工资",
    authority: "Fair Work Ombudsman",
    sourceUrl: "https://www.fairwork.gov.au/pay-and-wages/minimum-wages",
    topics: ["pay", "award"],
    keywords: ["pay", "wage", "hourly", "minimum", "rate", "工资", "时薪", "最低工资"],
    summaryZh:
      "最低工资取决于适用的 award、协议、年龄、等级和雇佣类型。全国成人最低工资只能作为筛查基准，不能替代具体岗位的法定工资计算。",
    summaryEn:
      "Minimum pay can depend on the applicable award, agreement, age, classification and employment type. The national adult minimum is a screening benchmark, not an exact legal rate for every job.",
    reviewedAt,
    reviewDue: SOURCE_REVIEW_DUE,
  },
  {
    id: "FWO-PACT",
    title: "Pay and Conditions Tool",
    titleZh: "工资与雇佣条件工具",
    authority: "Fair Work Ombudsman",
    sourceUrl: "https://calculate.fairwork.gov.au/FindYourAward",
    topics: ["pay", "award"],
    keywords: ["award", "classification", "penalty", "allowance", "pay calculator", "等级", "加班", "津贴"],
    summaryZh:
      "PACT 用于查找可能适用的 award 并计算等级工资、penalty 和 allowance。使用前需要确认主要职责、雇佣类型、年龄和工作时间。",
    summaryEn:
      "PACT helps identify an award and calculate classification rates, penalties and allowances. It requires confirmed duties, employment type, age and working times.",
    reviewedAt,
    reviewDue: SOURCE_REVIEW_DUE,
  },
  {
    id: "FWO-PAY-SLIPS",
    title: "Pay slips",
    titleZh: "工资单",
    authority: "Fair Work Ombudsman",
    sourceUrl: "https://www.fairwork.gov.au/pay-and-wages/paying-wages/pay-slips",
    topics: ["payslip", "pay"],
    keywords: ["payslip", "pay slip", "record", "cash", "工资单", "现金", "记录"],
    summaryZh:
      "工资单是核对工时、税前工资、扣款和养老金的重要证据。现金支付本身不等于违法，但不提供工资单或记录会增加追索风险。",
    summaryEn:
      "Pay slips are important evidence for hours, gross pay, deductions and super. Cash payment is not automatically unlawful, but missing slips or records increases recovery risk.",
    reviewedAt,
    reviewDue: SOURCE_REVIEW_DUE,
  },
  {
    id: "FWO-UNPAID-TRIALS",
    title: "Unpaid work trials",
    titleZh: "无薪试工",
    authority: "Fair Work Ombudsman",
    sourceUrl:
      "https://www.fairwork.gov.au/starting-employment/unpaid-work/unpaid-trials",
    topics: ["trial", "pay"],
    keywords: ["trial", "unpaid", "pay", "supervised", "demonstrate skills", "试工", "无薪", "工资", "监督"],
    summaryZh:
      "无薪试工是否合理取决于是否仅为展示岗位所需技能、持续时间是否必要、是否直接监督，以及是否产生了本应由员工完成的生产性工作。不能只靠固定小时数判断。",
    summaryEn:
      "Whether an unpaid trial is reasonable depends on demonstrating necessary skills, only lasting as long as needed, direct supervision and whether productive employee work was performed. A fixed hour limit alone is not decisive.",
    reviewedAt,
    reviewDue: SOURCE_REVIEW_DUE,
  },
  {
    id: "ATO-SUPER-GUARANTEE",
    title: "Super guarantee",
    titleZh: "养老金保障缴付",
    authority: "Australian Taxation Office",
    sourceUrl:
      "https://www.ato.gov.au/tax-rates-and-codes/key-superannuation-rates-and-thresholds/super-guarantee",
    topics: ["super", "pay"],
    keywords: ["super", "superannuation", "retirement", "养老金"],
    summaryZh:
      "养老金义务取决于工作安排和资格。应书面确认养老金是否在工资之外支付、基金信息和缴付记录，并通过 myGov/ATO 核对实际入账。",
    summaryEn:
      "Super obligations depend on the work arrangement and eligibility. Confirm whether super is paid on top, the fund details and contribution records, then check actual deposits through myGov/ATO.",
    reviewedAt,
    reviewDue: SOURCE_REVIEW_DUE,
  },
  {
    id: "DHA-STUDENT-500",
    title: "Student visa (subclass 500)",
    titleZh: "学生签证（500 类别）",
    authority: "Department of Home Affairs",
    sourceUrl:
      "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500",
    topics: ["visa", "hours"],
    keywords: ["student visa", "500", "fortnight", "48 hours", "work condition", "学生签", "双周", "工时"],
    summaryZh:
      "学生签工作限制应按个人签证条件、课程期间和所有工作合并核对。工具中的双周汇总只是辅助记录，不替代 VEVO 或 Home Affairs 的个人条件确认。",
    summaryEn:
      "Student work limits must be checked against the person's visa conditions, study period and all jobs combined. The tool's fortnight total is a record aid, not a substitute for VEVO or Home Affairs confirmation.",
    reviewedAt,
    reviewDue: SOURCE_REVIEW_DUE,
  },
  {
    id: "FWO-RECORD-MY-HOURS",
    title: "Record My Hours app",
    titleZh: "工时记录应用",
    authority: "Fair Work Ombudsman",
    sourceUrl:
      "https://www.fairwork.gov.au/tools-and-resources/record-my-hours-app",
    topics: ["hours", "pay"],
    keywords: ["hours", "roster", "timesheet", "record", "工时", "排班", "记录"],
    summaryZh:
      "持续记录实际上下班时间、休息、工资单和收款，有助于在首次结薪时发现差异并保留证据。",
    summaryEn:
      "Keeping actual start and finish times, breaks, pay slips and receipts helps detect first-pay discrepancies and preserve evidence.",
    reviewedAt,
    reviewDue: SOURCE_REVIEW_DUE,
  },
];
