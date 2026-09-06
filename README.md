# AU-Partimer: 澳大利亚兼职风险与权益 Agent

AU-Partimer 是一个面向澳大利亚兼职求职者、留学生、casual workers 和 migrant workers 的风险判断工具。它的目标不是替用户做决定，而是在用户投入时间、交身份信息、开始试工或接受低薪工作前，帮他们把风险、证据缺口和下一步问题整理清楚。

**这不是法律建议。** 这是一个实用 triage 工具：把用户提供的事实映射到官方来源支持的风险信号、规则检查和保守行动建议。

## 四个模式

### 1. 兼职机会判断

适合还没入职、刚看到招聘信息、正在决定要不要继续聊或试工的用户。

输出内容：
- 继续策略：不要继续、先确认再继续、短期过渡但要保护自己、相对可继续
- 风险分、可信度、证据完整度、来源覆盖率和规则版本
- 诈骗、工资、工资单、养老金、签证工时和现实可行性风险
- 开始前应该问雇主的问题
- 急需收入时的 harm-reduction 保护措施
- 更低风险的同类岗位搜索方向
- 中文/英文一键切换

### 2. 工作权益体检

适合已经开始工作的用户。通过结构化表单检查现有工作安排。

输出内容：
- 按严重程度排序的 findings
- 每个问题的依据、解释、建议行动和证据清单
- 当前已覆盖：工资低于基准、缺少工资单、缺少养老金、无薪试工、工时、学生签工时、现金无记录

### 3. 具体情况分析

适合用户遇到某个具体 workplace problem，例如被扣钱、被要求赔偿、突然改排班、威胁辞退。

当前状态：
- 页面和 prompt 已中文化
- 依赖 `OPENAI_API_KEY`，可选 `OPENAI_MODEL`
- 如果没有配置 LLM key，会明确返回“LLM 未配置”，不会假装已经完成分析

### 4. 文件材料检查

适合用户有工资单、合同、招聘广告或聊天截图时使用。

当前状态：
- 已完成上传校验和纯文本提取
- PDF/图片会返回 `UNSUPPORTED_ANALYSIS`
- OCR、工资单结构化解析、截图证据抽取还未完成
- 当前不能把文件模式视为完整分析功能

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL + Prisma |
| UI | Tailwind CSS + shadcn/ui |
| LLM | Vercel AI SDK + OpenAI-compatible provider |
| Rule Engine | json-rules-engine |
| Auth | Not enabled in MVP |
| Deployment | Vercel |

## Architecture

```
求职前：Opportunity Facts → Decision Engine → Risk Signals → Safeguards → Alternatives
工作中：Workplace Facts → Rule Engine → Findings → Report
自然语言：User Situation → LLM Fact Collection → Rule Engine → Explanation
文件材料：Upload → Validation/Text Extraction → Structured Evidence (planned)
```

**核心原则：** 确定性规则负责风险信号和 findings。LLM 只能帮助收集事实、追问和解释结果，不能创造法律依据。

## 可信度边界

- 高可信：明确诈骗信号、全国最低工资基准、工资单要求、当前 super guarantee、明显证据缺口。
- 中可信：是否“值得继续”、是否短期过渡、同类岗位替代方向。这些是决策建议，不是法律结论。
- 低可信或未完成：具体 award rate 精确计算、PDF/图片 OCR、雇主真实性自动验证、个案法律胜算判断。
- 当前工资基准必须随 Fair Work 更新维护。
- Award-specific pay rates 取决于年龄、职责、等级、行业覆盖和排班，不能假装只靠一个行业字段就能算准。
- 合成案例和 AI 生成案例只能用于测试，不能作为法律来源。
- 先交钱、加密货币充值、代收转账、过早索要身份文件等高风险诈骗信号应覆盖普通评分。
- 如果用户现金压力高且没有其他机会，产品应提供保护措施和退出条件，而不是简单劝退。
- 每份机会判断报告都会返回 `riskScore`、`confidence`、`meta.rulesetVersion`、`meta.effectiveFrom` 和当前工资基准。

## 评估指标

建议用三类指标衡量这个 agent 是否靠谱：

1. 规则准确率：用人工标注案例测试 STOP / VERIFY_FIRST / SHORT_TERM_WITH_SAFEGUARDS / PROCEED 是否符合专家预期。
2. 证据完整度：报告是否明确列出缺失事实、来源链接、雇主问题和用户需要保存的证据。
3. 行动有效性：用户看完后是否知道下一步问什么、查哪里、保存什么、什么情况下退出。

最低上线门槛：
- 严重诈骗样例不能被判成“可以继续”
- 学生签明显超时不能被忽略
- 低于当前全国最低基准不能漏报
- 没有证据时不能给确定违法结论
- 现金压力高时必须给短期保护策略，而不是只有拒绝建议
- 真实案例抽象出的回归样例必须通过 `npm test`

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (or use Prisma Postgres)

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and configure:
   ```bash
   cp .env.example .env
   ```

4. Set up the database:
   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `OPENAI_API_KEY` | Enables Situation Analyzer LLM chat |
| `OPENAI_MODEL` | Optional model override; defaults to `gpt-5-mini` |
| `OPENAI_BASE_URL` | Optional OpenAI-compatible base URL override |

## Legal Data Sources

- [Fair Work Ombudsman](https://www.fairwork.gov.au)
- [Fair Work Commission](https://www.fwc.gov.au)
- [Australian Taxation Office](https://www.ato.gov.au)
- [Department of Home Affairs](https://immi.homeaffairs.gov.au)
- [Scamwatch](https://www.scamwatch.gov.au)

## Real Case Corpus

真实案例和官方材料整理在 `docs/research/real-case-corpus.md`。这些材料用于设计规则、构造测试样例和校验风险标签，不应被复制成“个案法律结论”。

评估方法和企业级上线门槛整理在 `docs/research/evaluation-framework.md`。

## Important Contacts

- **Fair Work Ombudsman:** 13 13 94
- **Translating & Interpreting Service:** 13 14 50

## Disclaimer

This tool provides general information only and does not constitute legal advice. For specific legal advice, please consult a qualified lawyer or contact the Fair Work Ombudsman on 13 13 94.

## License

Private — All rights reserved.
