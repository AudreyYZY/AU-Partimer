# 澳洲留学生兼职就业权益模拟案例集

## Synthetic Employment Rights Demo Cases - Australian International Students

**Total Cases: 100**

> These cases are synthetic demo scenarios. They are useful for UI testing,
> interview-flow design, and rule-engine examples, but they are not verified
> real cases and must not be used as legal authority or evidence.
>
> For source-backed real case seeds, use
> [`docs/research/real-case-corpus.md`](../research/real-case-corpus.md).

---

## 行业分布 Industry Distribution

| # | Industry | Cases | File |
|---|----------|-------|------|
| 1 | 餐饮 Restaurant | 20 | [01-restaurant.md](./01-restaurant.md) |
| 2 | 奶茶店 Bubble Tea | 20 | [02-bubble-tea.md](./02-bubble-tea.md) |
| 3 | 仓库 Warehouse | 20 | [03-warehouse.md](./03-warehouse.md) |
| 4 | 清洁 Cleaning | 20 | [04-cleaning.md](./04-cleaning.md) |
| 5 | 零售 Retail | 20 | [05-retail.md](./05-retail.md) |

---

## 问题类型分布 Issue Type Distribution

| Issue Type | Cases | Severity Range |
|------------|-------|----------------|
| 低于最低工资 Under Minimum Wage | 25 | CRITICAL |
| 无合同 No Contract | 30 | HIGH |
| 无工资单 No Payslip | 35 | HIGH |
| 无养老金 No Super | 28 | CRITICAL |
| 无薪试工 Unpaid Trial | 18 | HIGH |
| 现金支付风险 Cash Payment Risk | 22 | MEDIUM-HIGH |
| 超时工作 Excessive Hours | 15 | MEDIUM |
| 无罚款率 No Penalty Rates | 20 | HIGH |
| 签证违规 Visa Breach | 12 | CRITICAL |
| 安全问题 Safety Issues | 10 | MEDIUM-HIGH |
| 歧视/骚扰 Discrimination | 8 | HIGH-CRITICAL |
| 不公平解雇 Unfair Dismissal | 6 | HIGH |

---

## 案例结构说明 Case Structure

每个案例包含以下10个部分：

1. **用户真实描述** - 模拟用户在系统中的原始输入
2. **已知事实** - 从用户输入中提取的EmploymentFacts
3. **缺失事实** - 需要进一步收集的信息
4. **Agent应该追问的问题** - Interview Engine应提出的问题
5. **最终EmploymentFacts** - 完整的事实模型
6. **Findings** - 系统诊断出的问题
7. **Severity** - 问题严重程度
8. **Legal Basis** - 法律依据
9. **Recommended Actions** - 建议采取的行动
10. **Evidence Checklist** - 证据清单

---

## 严重程度定义 Severity Definitions

| Level | 中文 | Definition |
|-------|------|------------|
| CRITICAL | 严重 | Immediate financial/legal harm, requires urgent action |
| HIGH | 高 | Significant rights violation, action within 1 week |
| MEDIUM | 中 | Notable compliance issue, action within 1 month |
| LOW | 低 | Minor issue or best practice improvement |

---

## 置信度定义 Confidence Definitions

| Level | Score | Meaning |
|-------|-------|---------|
| High | 0.8-1.0 | Reliable source (document, verified) |
| Medium | 0.5-0.7 | User input, unverified |
| Low | 0.0-0.4 | Inferred, guessed |

---

*Generated: 2026-06-01*
*Version: 1.0.0*
