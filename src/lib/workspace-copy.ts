export type Language = "zh" | "en";
export const text = (language: Language, zh: string, en: string) =>
  language === "zh" ? zh : en;
export const decisionCopy = {
  STOP: ["先暂停高风险安排", "Pause the risky arrangement"],
  VERIFY_FIRST: ["先补充信息与核验", "Verify before proceeding"],
  SHORT_TERM_WITH_SAFEGUARDS: [
    "需要过渡保护方案",
    "Plan a protected transition",
  ],
  PROCEED: ["未发现已覆盖的重大风险", "No major covered risks identified"],
} as const;
export const signalCopy: Record<string, [string, string]> = {
  "upfront-payment": [
    "开始赚钱前要求付款",
    "先暂停付款，独立联系真实雇主确认招聘。不要因已经投入时间而继续转账。",
  ],
  "bank-crypto": [
    "涉及代收转账或加密货币",
    "暂停资金操作，不借出账户。已发生损失时尽快联系银行并向 Scamwatch 报告。",
  ],
  "informal-channel": [
    "沟通渠道需要独立核验",
    "使用你自己找到的官方电话或邮箱核对招聘者。聊天软件本身不能证明真假。",
  ],
  "employer-identity-missing": [
    "雇主身份尚未确认",
    "核对法律实体、注册状态、工作地址和招聘者关联。注册记录不能证明招聘真实。",
  ],
  "identity-docs-early": [
    "过早索要身份证件",
    "在招聘者身份得到独立确认前，暂缓交护照、税号或银行资料。",
  ],
  pressure: [
    "被催促立即决定",
    "先取得书面岗位、薪酬和试工安排，再决定是否继续。",
  ],
  "below-minimum-benchmark": [
    "低于成人全国工资筛查基准",
    "这只是成人全国基准。适用工资仍取决于岗位覆盖、等级、协议和排班，请核对官方工资计算器；部分适用工资可能低于此基准。",
  ],
  "cash-payment": [
    "现金付款需要完整记录",
    "现金付款不自动意味着违法。要求工资单，记录每次工时和实收金额。",
  ],
  "no-payslip": [
    "缺少工资单安排",
    "确认发薪日与工资单提供方式，保存书面请求和收款记录。",
  ],
  "super-not-mentioned": [
    "养老金安排需要确认",
    "询问养老金是否在工资之外支付，以及基金、缴付安排和适用条件。",
  ],
  "no-written-terms": [
    "缺少书面工作条款",
    "取得雇主实体、岗位、税前工资、发薪周期和试工条件的书面确认。",
  ],
  "unpaid-trial": [
    "无薪试工需要核查",
    "核对是否仅展示必要技能、是否全程直接监督，以及是否实际替代正常工作。不能用固定小时数判定合法。",
  ],
  "student-hours": [
    "需要核对学生签双周工时",
    "按每个周一开始的14天窗口汇总全部工作，核对具体签证条件与适用例外。单周工时不能证明双周超限。",
  ],
  "long-commute": [
    "通勤可能明显降低实际收入",
    "比较每班工时、往返时间、交通费用和晚班可达性。实际收益不等于法定时薪。",
  ],
};
export const actionCopy = [
  [
    "identity",
    "确认雇主实体与招聘者关联",
    "Confirm employer entity and recruiter connection",
  ],
  [
    "pay",
    "取得书面工资、发薪日和试工安排",
    "Get written pay, payday and trial terms",
  ],
  [
    "award",
    "核对官方适用工资与等级",
    "Confirm award coverage and classification",
  ],
  ["hours", "保存全部工时与排班", "Keep all shift and roster records"],
  [
    "first-pay",
    "核对首次结薪、工资单与实收金额",
    "Check first payment, payslip and actual receipts",
  ],
  [
    "review",
    "确认退出条件与下一次复查时间",
    "Set exit conditions and a review date",
  ],
] as const;
export const fieldCopy: Record<string, [string, string]> = {
  employerNameOrAbn: ["雇主名称或 ABN", "Employer name or ABN"],
  roleTitle: ["岗位与主要职责", "Role and main duties"],
  state: ["工作州或领地", "State or territory"],
  age: ["年龄", "Age"],
  visaType: ["签证类别", "Visa category"],
  industry: ["行业", "Industry"],
  employmentType: ["雇佣类型", "Employment type"],
  offeredHourlyRate: ["税前时薪（澳元）", "Hourly pay before tax (AUD)"],
  weeklyHours: ["预计每周工时", "Expected weekly hours"],
  paymentMethod: ["付款方式", "Payment method"],
  hasPayslip: ["工资单", "Payslips"],
  superMentioned: ["养老金安排", "Super arrangements"],
  hasWrittenAgreement: ["书面工作条款", "Written terms"],
  employerIdentityStatus: ["独立身份核验", "Independent identity check"],
  trialShiftHours: ["试工时长", "Trial hours"],
  trialPaid: ["试工是否付薪", "Paid trial"],
  contactChannel: ["招聘沟通渠道", "Recruitment channel"],
  cashPressure: ["当前收入压力", "Income pressure"],
  hasOtherOptions: ["其他工作机会", "Other work options"],
  commuteMinutes: ["单程通勤分钟", "One-way commute (minutes)"],
  commuteCostPerShift: [
    "每班往返交通费（澳元）",
    "Return travel cost per shift (AUD)",
  ],
  shiftHours: ["每班付薪工时", "Paid hours per shift"],
  employmentDurationWeeks: ["已工作周数", "Weeks employed"],
};
export const options: Record<string, [string, string][]> = {
  state: ["unknown", "NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"].map(
    (s) => [s, s === "unknown" ? "不确定" : s],
  ),
  visaType: [
    ["none", "公民／永久居民"],
    ["500", "学生签 500"],
    ["417", "工作假期 417"],
    ["462", "工作假期 462"],
    ["other", "其他"],
  ],
  industry: [
    ["other", "其他／不确定"],
    ["restaurant", "餐厅"],
    ["cafe", "咖啡店"],
    ["bubble_tea", "饮品店"],
    ["retail", "零售"],
    ["cleaning", "清洁"],
    ["warehouse", "仓储"],
    ["delivery", "配送"],
  ],
  employmentType: [
    ["unknown", "不确定"],
    ["casual", "临时雇员"],
    ["part_time", "兼职雇员"],
    ["full_time", "全职雇员"],
  ],
  paymentMethod: [
    ["unknown", "不确定"],
    ["bank", "银行转账"],
    ["cash", "现金"],
    ["mixed", "混合"],
  ],
  employerIdentityStatus: [
    ["unknown", "未核验"],
    ["provided_unverified", "已取得资料，尚未独立确认"],
    ["verified", "已独立确认实体、地址和招聘者"],
    ["not_provided", "对方未提供"],
  ],
  contactChannel: [
    ["other", "其他"],
    ["official_email", "官方邮箱"],
    ["phone", "电话"],
    ["job_platform", "招聘平台"],
    ["wechat", "微信"],
    ["whatsapp", "WhatsApp"],
    ["telegram", "Telegram"],
    ["sms", "短信"],
  ],
  cashPressure: [
    ["medium", "一般"],
    ["high", "急需收入"],
    ["low", "较低"],
  ],
  hasOtherOptions: [
    ["some", "有一些"],
    ["none", "暂时没有"],
    ["several", "有多个"],
  ],
};
export const yesNoOptions: [string, string][] = [
  ["unknown", "不确定"],
  ["yes", "有／是"],
  ["no", "没有／否"],
];
export function optionLabel(value: string, zh: string, language: Language) {
  if (language === "zh") return zh;
  const english: Record<string, string> = {
    none: "None",
    unknown: "Not sure",
    yes: "Yes",
    no: "No",
    bank: "Bank transfer",
    cash: "Cash",
    mixed: "Mixed",
    verified: "Entity, address and recruiter independently checked",
    provided_unverified: "Details provided; not independently checked",
    not_provided: "Not provided",
    "500": "Student visa 500",
    "417": "Working holiday 417",
    "462": "Work and holiday 462",
    high: "Urgent income need",
    medium: "Moderate",
    low: "Low",
    some: "Some",
    several: "Several",
  };
  return english[value] ?? value.replaceAll("_", " ");
}

export const missingCheckCopy: Record<string, string> = {
  "Work state or territory": "工作所在州或领地",
  "Recruitment payment, identity and pressure screening":
    "是否要求付款、证件、转账，或催促立即决定",
  "Applicable work rights and visa conditions": "适用的工作权利和签证条件",
  "Age and eligibility for the adult wage benchmark":
    "年龄及成人工资基准是否适用",
  "Junior rates require official age and award classification checks":
    "青年工资需核对年龄和适用岗位等级",
  "Payment method": "付款方式",
  "All jobs' hours in Monday-starting 14-day periods and applicable visa conditions":
    "所有工作在每个周一开始的14天内的工时，以及个人签证条件",
  "Trial pay, actual duties and direct supervision":
    "试工是否付薪、实际任务与直接监督情况",
  "Exact role title and main duties": "具体岗位和主要职责",
  "Employment type: casual, part-time, full-time, or contractor":
    "雇佣类型：临时、兼职、全职或承包人",
  "Hourly rate before tax": "税前时薪",
  "Expected weekly hours and exact roster": "每周工时与完整排班",
  "Whether payslips will be provided": "是否提供工资单",
  "Whether super will be paid on top of wages": "养老金是否在工资之外支付",
  "Written confirmation of employer and pay terms":
    "雇主实体与工资条款的书面确认",
  "Independently verifiable employer name, ABN, website, or workplace address":
    "独立核实雇主名称、ABN、地址和招聘者关联",
  "Source review is overdue; current rules need independent confirmation":
    "来源复核期限已过，需重新核对当前规则",
  "Whether the student course is in session": "学生课程是否处于上课期间",
  "The requested date predates the bundled wage benchmark":
    "所评估日期早于内置工资基准，不支持历史工资判断",
};
