// Rule definitions for the employment rights diagnostic engine
// These rules are the SOURCE OF TRUTH for legal determinations
// LLM explains these findings - it does NOT create them

import {
  NATIONAL_MIN_WAGE_CASUAL_HOURLY,
  NATIONAL_MIN_WAGE_EFFECTIVE_FROM,
  NATIONAL_MIN_WAGE_HOURLY,
  SUPER_GUARANTEE_RATE_CURRENT,
} from "@/lib/constants";

export interface StoredRule {
  id: string;
  name: string;
  description: string;
  category: string;
  conditions: Record<string, unknown>;
  event: {
    type: string;
    params: Record<string, unknown>;
  };
  legalRef: string;
  sourceUrl?: string;
}

/**
 * Get all active rules for the rule engine
 * In MVP, rules are defined here. Future: load from database.
 */
export async function getActiveRules(): Promise<StoredRule[]> {
  return [...WAGE_RULES, ...SUPER_RULES, ...PAYSLIP_RULES, ...TRIAL_RULES, ...HOURS_RULES, ...VISA_RULES, ...CASH_RULES];
}

// ─── Wages Rules ──────────────────────────────────────

const WAGE_RULES: StoredRule[] = [
  {
    id: "MIN_WAGE_2026",
    name: "National Minimum Wage Check",
    description: "Checks if hourly rate meets the national minimum wage benchmark (from 1 July 2026)",
    category: "wages",
    conditions: {
      all: [
        { fact: "hourlyRate", operator: "lessThan", value: NATIONAL_MIN_WAGE_HOURLY },
        { fact: "employmentType", operator: "notEqual", value: "casual" },
      ],
    },
    event: {
      type: "UNDERPAYMENT",
      params: {
        severity: "CRITICAL",
        title: "可能低于当前最低工资基准",
        explanationTemplate:
          `你填写的时薪 \${hourlyRate} 低于当前成人全国最低工资基准 $${NATIONAL_MIN_WAGE_HOURLY.toFixed(2)}/h（${NATIONAL_MIN_WAGE_EFFECTIVE_FROM} 起）。具体最低应付工资还需要结合 award 覆盖、年龄、等级、职责和排班核对。`,
        legalRef: "Fair Work Act 2009, s.284-294; National Minimum Wage Order 2026",
        recommendedAction:
          "先用 Fair Work Pay Calculator 核对 award、年龄工资和岗位等级，再把它作为最终欠薪结论。",
        evidenceToCollect: [
          "显示工资到账的银行记录",
          "排班表或工时记录",
          "关于工资标准的聊天记录",
          "任何工资相关书面协议",
        ],
      },
    },
    legalRef: "Fair Work Act 2009, s.284-294",
    sourceUrl: "https://www.fairwork.gov.au/pay-and-wages/minimum-wages",
  },
  {
    id: "CASUAL_MIN_RATE_2026",
    name: "Casual Minimum Rate Check",
    description: "Checks if casual hourly rate includes the mandatory 25% loading",
    category: "wages",
    conditions: {
      all: [
        { fact: "employmentType", operator: "equal", value: "casual" },
        { fact: "hourlyRate", operator: "lessThan", value: NATIONAL_MIN_WAGE_CASUAL_HOURLY },
      ],
    },
    event: {
      type: "UNDERPAYMENT",
      params: {
        severity: "CRITICAL",
        title: "可能低于当前 casual 工资基准",
        explanationTemplate:
          `你填写的 casual 时薪 \${hourlyRate} 低于当前成人 casual 全国最低基准 $${NATIONAL_MIN_WAGE_CASUAL_HOURLY.toFixed(2)}/h，该基准包含 25% casual loading。具体 award rate 还需要结合年龄、岗位等级、职责和排班核对。`,
        legalRef: "Fair Work Act 2009; Modern Award casual loading provisions",
        recommendedAction:
          "核对适用 award 和岗位等级。Casual 通常应包含 loading，但准确最低工资需要用官方工资计算器确认。",
        evidenceToCollect: [
          "显示工资到账的银行记录",
          "显示工时的排班表",
          "讨论工资标准的聊天记录",
          "合同或 offer letter",
        ],
      },
    },
    legalRef: "Fair Work Act 2009",
    sourceUrl: "https://www.fairwork.gov.au/pay-and-wages/minimum-wages",
  },
];

// ─── Superannuation Rules ─────────────────────────────

const SUPER_RULES: StoredRule[] = [
  {
    id: "MISSING_SUPER_2026",
    name: "Missing Superannuation Check",
    description: "Checks if employer is paying mandatory superannuation",
    category: "super",
    conditions: {
      all: [
        { fact: "hasSuper", operator: "equal", value: false },
        { fact: "employmentDurationWeeks", operator: "greaterThan", value: 0 },
      ],
    },
    event: {
      type: "MISSING_SUPER",
      params: {
        severity: "CRITICAL",
        title: "可能缺少养老金",
        explanationTemplate:
          `雇主可能没有为你支付应有养老金。当前 super guarantee 为符合条件收入的 ${(SUPER_GUARANTEE_RATE_CURRENT * 100).toFixed(0)}%。请通过工资单、super fund 或 myGov 核对到账。`,
        legalRef: "Superannuation Guarantee (Administration) Act 1992",
        recommendedAction:
          "检查你的 super 账户（myGov/ATO）并向雇主书面询问。如确认未支付，可以向 ATO 查询或报告。",
        evidenceToCollect: [
          "显示或未显示养老金的工资单",
          "super fund 账户记录",
          "雇佣合同或 offer letter",
          "显示税前工资的银行记录",
        ],
      },
    },
    legalRef: "Superannuation Guarantee (Administration) Act 1992",
    sourceUrl: "https://www.ato.gov.au/businesses-and-organisations/super-for-employers",
  },
];

// ─── Payslip Rules ────────────────────────────────────

const PAYSLIP_RULES: StoredRule[] = [
  {
    id: "NO_PAYSLIP_2026",
    name: "No Payslips Check",
    description: "Checks if employer is providing mandatory payslips",
    category: "payslip",
    conditions: {
      all: [
        { fact: "hasPayslip", operator: "equal", value: false },
        { fact: "employmentDurationWeeks", operator: "greaterThan", value: 1 },
      ],
    },
    event: {
      type: "PAYSLIP_VIOLATION",
      params: {
        severity: "HIGH",
        title: "没有提供工资单",
        explanationTemplate:
          "雇主通常需要在发薪日后 1 个工作日内提供工资单。不提供工资单会让工资、工时、税和养老金都更难核对。",
        legalRef: "Fair Work Act 2009, Section 536",
        recommendedAction:
          "用邮件或短信向雇主索要工资单，并保存请求记录。如果被拒绝，可联系 Fair Work Ombudsman。",
        evidenceToCollect: [
          "索要工资单的聊天或邮件记录",
          "显示收款的银行记录",
          "排班表或工时记录",
          "任何关于雇佣关系的书面沟通",
        ],
      },
    },
    legalRef: "Fair Work Act 2009, Section 536",
    sourceUrl: "https://www.fairwork.gov.au/pay-and-wages/payslips-and-record-keeping",
  },
];

// ─── Trial Shift Rules ────────────────────────────────

const TRIAL_RULES: StoredRule[] = [
  {
    id: "LONG_UNPAID_TRIAL_2026",
    name: "Long Unpaid Trial Shift Check",
    description: "Checks if unpaid trial shift exceeds reasonable duration",
    category: "trial",
    conditions: {
      all: [
        { fact: "trialShiftHours", operator: "greaterThan", value: 4 },
        { fact: "trialPaid", operator: "equal", value: false },
      ],
    },
    event: {
      type: "ILLEGAL_TRIAL",
      params: {
        severity: "CRITICAL",
        title: "可能存在无薪试工风险",
        explanationTemplate:
          "你填写的无薪试工/培训为 ${trialShiftHours} 小时，需要谨慎核查。短时间无薪试工只有在真正用于展示技能且被直接监督时才可能合理；较长或实际产生劳动成果的工作可能需要付薪。",
        legalRef: "Fair Work Act 2009; Fair Work Ombudsman Guidance on Work Trials",
        recommendedAction:
          "保存试工时长、任务、监督方式和结果的证据。先查 Fair Work 无薪试工指引，必要时联系 Fair Work。",
        evidenceToCollect: [
          "关于试工安排的聊天记录",
          "显示试工时间的排班或通知",
          "试工期间实际工作的证据",
          "其他员工或现场人员的说明",
        ],
      },
    },
    legalRef: "Fair Work Act 2009",
    sourceUrl: "https://www.fairwork.gov.au",
  },
  {
    id: "REPEATED_TRIAL_2026",
    name: "Repeated Trial Shift Check",
    description: "Checks for multiple unpaid trial shifts",
    category: "trial",
    conditions: {
      all: [
        { fact: "trialRepeated", operator: "equal", value: true },
        { fact: "trialPaid", operator: "equal", value: false },
      ],
    },
    event: {
      type: "ILLEGAL_TRIAL",
      params: {
        severity: "CRITICAL",
        title: "多次无薪试工",
        explanationTemplate:
          "多次无薪试工是明显风险信号，因为重复或产生劳动成果的工作更不像单纯展示技能。",
        legalRef: "Fair Work Act 2009; Fair Work Ombudsman Guidance on Work Trials",
        recommendedAction:
          "保存所有试工记录。若这些班次应被视为工作，你可能需要按适用 award rate 追讨工资。",
        evidenceToCollect: [
          "每次试工的聊天记录",
          "显示试工时间的排班或安排",
          "实际工作的证据",
          "关于录用可能性的沟通记录",
        ],
      },
    },
    legalRef: "Fair Work Act 2009",
    sourceUrl: "https://www.fairwork.gov.au",
  },
];

// ─── Hours Rules ──────────────────────────────────────

const HOURS_RULES: StoredRule[] = [
  {
    id: "EXCESSIVE_HOURS_2026",
    name: "Excessive Weekly Hours Check",
    description: "Checks if weekly hours exceed maximum ordinary hours",
    category: "hours",
    conditions: {
      all: [
        { fact: "weeklyHours", operator: "greaterThan", value: 38 },
      ],
    },
    event: {
      type: "OVERTIME_CONCERN",
      params: {
        severity: "MEDIUM",
        title: "每周工时超过 38 小时",
        explanationTemplate:
          "你填写每周工作 ${weeklyHours} 小时。标准 ordinary hours 通常是每周 38 小时，但加班费和 penalty rules 需要结合适用 award、协议和排班模式核对。",
        legalRef: "Fair Work Act 2009, Section 62 (National Employment Standards)",
        recommendedAction:
          "核对超过 38 小时的部分是否需要加班费，并保存全部工时记录。",
        evidenceToCollect: [
          "工时表或自己的工时记录",
          "显示排班的 roster",
          "用于核对工资和工时的银行记录",
          "关于额外班次或加班的聊天记录",
        ],
      },
    },
    legalRef: "Fair Work Act 2009, Section 62",
    sourceUrl: "https://www.fairwork.gov.au",
  },
];

// ─── Visa Rules ───────────────────────────────────────

const VISA_RULES: StoredRule[] = [
  {
    id: "STUDENT_VISA_HOURS_2026",
    name: "Student Visa Work Hours Check",
    description: "Checks if student visa holder exceeds work hour limit",
    category: "visa",
    conditions: {
      all: [
        { fact: "visaType", operator: "equal", value: "500" },
        { fact: "isStudyPeriod", operator: "equal", value: true },
        { fact: "weeklyHours", operator: "greaterThan", value: 24 },
      ],
    },
    event: {
      type: "VISA_RISK",
      params: {
        severity: "HIGH",
        title: "学生签工时可能超限",
        explanationTemplate:
          "你填写在学生签 500 且上课期间每周工作 ${weeklyHours} 小时。学生签工时限制按连续 14 天周期计算，不能只看简单周平均，需要核对完整排班。",
        legalRef: "Migration Regulations 1994, Schedule 8, Condition 8104",
        recommendedAction:
          "核对你的签证条件。上课期间通常需要控制在 14 天工时限制内；如担心合规风险，请考虑寻求移民建议。",
        evidenceToCollect: [
          "显示所有班次的 roster",
          "工时记录",
          "显示工时的工资单",
          "学校 enrolment 或上课期间证明",
        ],
      },
    },
    legalRef: "Migration Regulations 1994, Schedule 8, Condition 8104",
    sourceUrl: "https://immi.homeaffairs.gov.au",
  },
];

// ─── Cash Payment Rules ───────────────────────────────

const CASH_RULES: StoredRule[] = [
  {
    id: "CASH_NO_RECORDS_2026",
    name: "Cash Payment Without Records Check",
    description: "Flags cash payment without payslips as a risk indicator",
    category: "wages",
    conditions: {
      all: [
        { fact: "paymentMethod", operator: "equal", value: "cash" },
        { fact: "hasPayslip", operator: "equal", value: false },
      ],
    },
    event: {
      type: "CASH_PAYMENT_RISK",
      params: {
        severity: "HIGH",
        title: "现金付款但没有记录",
        explanationTemplate:
          "如果现金发薪且没有工资单，这是较高风险安排。它可能意味着工资没有正式记录，也会让你之后证明雇佣关系、工时或欠薪更困难。",
        legalRef: "Fair Work Act 2009; Taxation Administration Act 1953",
        recommendedAction:
          "要求工资单和书面雇佣确认。自己记录工时和收款情况，必要时联系 Fair Work Ombudsman。",
        evidenceToCollect: [
          "自己的工时记录（日记、排班照片等）",
          "如果现金存入银行，保存存款记录",
          "关于发薪安排的聊天记录",
          "任何能证明雇佣关系的材料",
        ],
      },
    },
    legalRef: "Fair Work Act 2009",
    sourceUrl: "https://www.fairwork.gov.au",
  },
];
