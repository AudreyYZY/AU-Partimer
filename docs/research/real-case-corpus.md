# Real Case Corpus for AU-Partimer

This file tracks real, source-backed cases and regulator guidance that can be
used to calibrate AU-Partimer rules. It is not legal advice and should not be
used as a substitute for checking the current law, awards, visa conditions, or
the facts of an individual matter.

## How To Use This Corpus

- Use these cases to design red-flag rules, test scenarios, and evidence prompts.
- Keep source URLs attached to every derived test case.
- Do not display these cases as proof that a user's case has the same legal outcome.
- Mark allegations and final court/enforceable-undertaking outcomes separately.
- Re-check source pages before using them in production documentation.

## Case Seeds

| ID | Source Type | Scenario | Useful Risk Signals | Rules To Calibrate | Source |
|----|-------------|----------|---------------------|--------------------|--------|
| FWO-2026-CARLUCCIS | Fair Work Ombudsman Enforceable Undertaking | Melbourne restaurant back-paid more than $194,000 to 38 workers, including visa holders; underpayments related to flat rates, penalties, overtime, leave loading, and casual loading. | Flat rates treated as enough for all entitlements; restaurant kitchen/front-of-house roles; visa-holder and junior worker vulnerability. | Underpayment, casual loading, penalty/overtime prompt, evidence collection. | [Fair Work Ombudsman: Carlucci's / Luck Bird EU](https://www.fairwork.gov.au/newsroom/media-releases/2026-media-releases/april-2026/20260416-luck-bird-eu-media-release) |
| FWO-2026-MISO | Fair Work Ombudsman litigation, allegations | Sydney restaurant litigation alleging migrant workers were underpaid more than $162,000 after low flat rates and alleged record-keeping breaches. | Low flat hourly rates, overtime/penalty shortfalls, prior notice history, vulnerable migrant workers. | Underpayment severity, flat-rate warning, record-keeping risk. | [Fair Work Ombudsman: Miso World Square litigation](https://www.fairwork.gov.au/newsroom/media-releases/2026-media-releases/february-2026/20260226-sadamatsu-litigation-media-release) |
| FWO-2025-DINTAIFUNG | Fair Work Ombudsman case study | Visa-holder restaurant worker received $62,000 after lawsuit involving deliberate underpayment findings affecting mostly migrant workers. | Worker needed job despite low pay; long hours; migrant worker vulnerability; large employer does not guarantee compliance. | Harm-reduction logic, underpayment, evidence prompts. | [Fair Work Ombudsman: Din Tai Fung case study](https://www.fairwork.gov.au/newsroom/media-releases/2025-media-releases/july-2025/20250709-din-tai-fung-case-study-media-release) |
| FWO-2025-MRVIET | Fair Work Ombudsman penalties | Vietnamese eateries ordered to pay penalties and compensation after migrant workers were underpaid and some were required to spend their own money. | Low hourly rates, false records, no meal breaks, workers required to pay/spend money because of workplace mistakes. | Underpayment, unlawful deduction/spend requirement, record manipulation. | [Fair Work Ombudsman: Mr Viet penalties](https://www.fairwork.gov.au/newsroom/media-releases/2025-media-releases/may-2025/20250505-mr-viet-penalties-media-release) |
| FWO-2019-PHATELEPHANT | Fair Work Ombudsman Enforceable Undertaking | Brisbane restaurant underpaid three international students using low flat rates below Restaurant Industry Award entitlements. | Student visa workers, low flat rates, weekend penalty rates, record-keeping and break issues. | Student-worker messaging, underpayment, records, breaks. | [Fair Work Ombudsman: Phat Elephant EU](https://www.fairwork.gov.au/newsroom/media-releases/2019-media-releases/february-2019/20190222-phat-elephant-eu-media-release) |
| FWO-2015-GLORIAJEANS | Fair Work Ombudsman penalty | Melbourne cafe operators penalised after international students were paid very low flat rates; pay slips, breaks, and records were also breached. | Low cash-like flat rates, young/international student vulnerability, lack of records. | Underpayment severity, payslip/record prompts, youth/age caveat. | [Fair Work Ombudsman: Gloria Jeans Caulfield penalty](https://www.fairwork.gov.au/newsroom/media-releases/2015-media-releases/february-2015/20150202-primeage-penalty-presser) |
| FWO-VISA-LEON | Fair Work Ombudsman guidance example | FWO guidance explains a student visa worker who worked beyond visa hours and was still entitled to pay for all time worked. | Visa breach risk should not erase wage entitlement; employer may use visa fear to avoid payment. | Separate visa risk from wage entitlement; avoid victim-blaming. | [Fair Work Ombudsman: Visa holders and migrants](https://www.fairwork.gov.au/find-help-for/visa-holders-migrants) |
| SCAMWATCH-JOBSCAMS | Scamwatch guidance and scam patterns | Job scams often involve quick hiring, private messaging, upfront payment, task-based work, crypto top-ups, money transfers, packages, or early identity requests. | Upfront payment, crypto, money mule risk, WhatsApp/Telegram/SMS, too-good-to-be-true income, early identity documents. | STOP decision overrides, scam red flags, protect-yourself checklist. | [Scamwatch: Jobs and employment scams](https://www.scamwatch.gov.au/types-of-scams/jobs-and-employment-scams) |
| ACCC-2025-SCAMS | ACCC / National Anti-Scam Centre data | Scamwatch reported about $174 million in scam losses in the first half of 2025, with higher growth in reports involving losses among people who speak English as a second language. | Scam exposure affects multilingual users; verification steps should be simple and prominent. | UX priority, bilingual warnings, no-fast-decision safeguards. | [ACCC: Scams Awareness Week 2025](https://www.accc.gov.au/media-release/national-anti-scam-centre-calls-for-continued-action-this-scams-awareness-week-as-scam-losses-trend-up-at-174m) |

## Test Labels Derived From These Cases

Use these labels when building regression tests:

- `severe_scam_upfront_payment`: any job asking users to pay before earning should return `STOP`.
- `severe_scam_money_mule`: jobs involving receiving/transferring money or crypto should return `STOP`.
- `underpayment_flat_rate`: flat rates below the current benchmark should trigger a pay risk and official calculator prompt.
- `records_missing`: no payslip or weak written records should increase evidence risk.
- `visa_wage_separation`: student visa hour concerns should not erase the user's wage entitlement.
- `cash_pressure_bridge`: where the user has no alternatives and urgent income pressure, the tool may recommend short-term safeguards only when there is no severe scam or visa risk.

## Gaps To Fill

- More non-hospitality cases: cleaning, retail, warehouse, delivery, gig work.
- Current tribunal or court decisions with detailed fact patterns and outcomes.
- Real anonymized user interviews, with consent, to test whether recommendations are understandable and realistic.
- False-positive cases: legitimate jobs that still use informal channels but can be verified.
