# AU-Partimer

A bilingual, case-based workspace for Australian part-time job decisions.

**Controlled-pilot software, not a certified legal or migration adviser.**
The product helps people identify evidence gaps, compare actual offers and plan
their next action. It does not prove a recruiter is genuine or calculate a legal
underpayment from an industry label.

## Current workflow

One case follows an opportunity from considering a role to working and reviewing pay.
The old entry URLs remain available, but they now open the same workspace.

- Job details: deterministic risk signals, unknown-fact gates, rule version and source review deadline.
- Evidence: bounded text/PDF extraction, manual review and confirmed hourly-pay provenance.
- Hours: shift records and overlapping Monday-starting fortnight totals across cases.
- Actions: saved checklist, questions, review date and exit conditions.
- Agent: LangGraph workflow for rules, missing-fact planning, reviewed official-source retrieval and optional grounded model explanation.
- Compare: user-provided offers, gross pay and commute-adjusted earnings. No invented safer jobs.
- Chinese/English switching, opt-in browser persistence, validated JSON export/import.
- Optional encrypted, session-owned server backups with stale-write protection.

ABN search returns candidate registration records, **not identity verification**.
Images/scanned PDFs are explicitly unsupported for OCR. Extraction alone is not analysis.
Exact award rates, ASIC automation, durable agent checkpoints, account recovery and independently measured legal
accuracy remain out of scope for this release.

## Run locally

Use Node.js 22.12+ (CI uses Node 22).

```sh
npm ci
npm run dev -- --port 3001
```

Open [localhost:3001](http://localhost:3001). Local screening requires no API key
or database. Configure optional services using the names in [.env.example](.env.example).
Do not commit your actual environment file.

For a **new, empty PostgreSQL database**:

```sh
npm run db:validate
npm run db:deploy
npm run build
npm start -- --port 3001
```

Existing databases must be inspected and baselined first. The seed intentionally
does not insert illustrative wage rates. Production online routes require a
configured pilot access token and database-backed budgets.

## Verify

```sh
npm run lint
npm run typecheck
npm test
npm run evaluate
TEST_DATABASE_URL=postgresql://... npm run test:db
npx playwright install chromium
npm run test:e2e
npm run build
npm audit --omit=dev --audit-level=high
```

Integration tests use a migrated disposable database, never a production database.
Browser tests cover Chromium desktop and a mobile viewport; they are not physical
device or Safari certification. CI reproduces these checks with PostgreSQL.

`npm run release:check` intentionally rejects the bundled regression corpus:
there is no independently double-reviewed holdout set. An engineering test pass
is not legal accuracy. See the [validation protocol](docs/research/validation-protocol.md).

## Architecture

```text
Case facts -> LangGraph assessment -> human fact gate -> action plan
Question + report -> topic/lexical retrieval -> approved official records
Report + records -> optional grounded model -> deterministic fallback -> trace
Upload -> byte/type/time/process limits -> extracted draft -> human confirmation
Browser vault -> explicit opt-in -> local storage / JSON export
Optional server backup -> access gate -> owner scoping -> AES-GCM -> PostgreSQL
```

Next.js App Router, TypeScript, React, Zod, LangGraph, Prisma/PostgreSQL, AI SDK
and json-rules-engine. No raw uploaded file is stored by the upload endpoint.
See the [operations guide](docs/operations/runbook.md) and
[agent architecture](docs/architecture/05-agent-retrieval-workflow.md), and
[engineering/interview walkthrough](docs/engineering-walkthrough.md).

## Reliability boundaries

Information completeness is not a probability of safety. Missing age, pay,
employment or identity information cannot produce a confident positive assessment.
Financial urgency does not override scam protection. A low-pay transition plan
does not make the pay lawful.

The [Fair Work national benchmark](https://www.fairwork.gov.au/pay-and-wages/minimum-wages)
is not a universal legal floor: applicable award, introductory and special rates
can differ. Confirm classification and applicability using official tools.
The current rules are not a historical payroll calculator.

Public regulatory examples in [the source corpus](docs/research/real-case-corpus.md)
support regression design, not independent validation or reproduction of court outcomes.

## 中文说明

AU-Partimer 将求职前筛查、入职后记录、材料确认和具体问题分析汇入同一个案例。
目标不是替用户拒绝工作，而是说明哪些事实还不知道、下一步查什么，以及收入紧张时如何保护自己。

当前适合受控试点和工程演示，不能宣传为已验证法律准确率的成熟商业产品。
真实用户任务测试、专家独立标注、正式账户与保留政策、凭证齐备的线上服务验收仍需完成。
详细边界见能力页面和部署文档。

## Open production roadmap

- [#1 Independent expert-labelled holdout](https://github.com/AudreyYZY/AU-Partimer/issues/1)
- [#2 Award classification and exact rates](https://github.com/AudreyYZY/AU-Partimer/issues/2)
- [#3 Durable agent checkpoints and authentication](https://github.com/AudreyYZY/AU-Partimer/issues/3)
- [#4 Knowledge freshness and retrieval evaluation](https://github.com/AudreyYZY/AU-Partimer/issues/4)
- [#5 Consented worker pilot](https://github.com/AudreyYZY/AU-Partimer/issues/5)
- [#6 Sandboxed OCR](https://github.com/AudreyYZY/AU-Partimer/issues/6)
- [#7 Legacy engine consolidation](https://github.com/AudreyYZY/AU-Partimer/issues/7)

## License

Private. All rights reserved.
