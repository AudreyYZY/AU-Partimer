# AU-Partimer Evaluation Framework

This framework defines how to measure whether AU-Partimer is safe enough to
use as a practical screening agent. The goal is not to prove legal correctness.
The goal is to reduce harmful misses, make uncertainty visible, and keep every
recommendation traceable to source-backed rules.

## Product Reliability Targets

| Area | Target | Why It Matters |
|------|--------|----------------|
| Severe scam recall | 100% on curated tests | Upfront payment, crypto top-up, money transfer, and early identity collection should never be marked safe. |
| Student visa hour recall | 100% on curated tests | A clear 48-hour fortnight issue should not be hidden by income pressure. |
| Below-benchmark wage recall | 95%+ on adult benchmark tests | Low wage signals should be surfaced even when award-specific calculation is not available. |
| Unsupported feature honesty | 100% | PDF/OCR, award-rate precision, and employer verification must say unsupported unless implemented. |
| Evidence completeness | Reported on every result | Users need to know whether the recommendation is based on enough facts. |
| Source traceability | 90%+ of risk signals | Each major signal should carry a source URL or source ID. |

## Dataset Design

Use three datasets, kept separate:

- `official_cases`: real Fair Work, Home Affairs, ATO, ACCC, and Scamwatch cases or guidance.
- `synthetic_edge_cases`: invented scenarios that isolate one rule at a time.
- `user_research_cases`: anonymized consent-based user stories collected during product testing.

Do not mix these labels. Official cases support rule calibration. Synthetic
cases are useful for regression testing but should never be described as legal
evidence.

## Case Labels

Each case should include:

- `id`
- `sourceUrl`
- `sourceType`
- `factPattern`
- `expectedDecision`
- `expectedSignals`
- `mustAskQuestions`
- `mustShowLimitations`
- `notesForHumanReviewer`

## Decision-Level Acceptance Criteria

`STOP` is required when:

- The opportunity asks for money before earning.
- The work involves moving money, receiving packages, buying goods, bank account use, crypto, or account top-ups.
- A student visa 500 scenario clearly exceeds 48 hours per rolling 14-day fortnight during a study period.

`SHORT_TERM_WITH_SAFEGUARDS` is allowed only when:

- There is high cash pressure and no better option.
- There is no severe scam signal.
- There is no clear visa stop signal.
- The report includes written-term questions, evidence steps, and a short review/exit point.

`VERIFY_FIRST` is required when:

- There are high pay or documentation risks but no immediate stop signal.
- There are too many missing facts for a confident recommendation.

`PROCEED` is allowed only when:

- No severe or high signal is present.
- Required facts are mostly complete.
- The report still tells the user to keep evidence and verify pay, roster, and payslips.

## Human Review Loop

For enterprise use, a subject-matter reviewer should regularly inspect:

- New rules before release.
- Any case where the expected decision changes.
- Source URLs and effective dates after Fair Work annual updates.
- False positives reported by users.
- Cases where the user ignored a warning because income pressure was high.

## Current Known Gaps

- Award-specific rates are not calculated.
- Junior, apprentice, trainee, disability, penalty, allowance, and enterprise agreement rates are not covered.
- ABN lookup and employer identity verification are not implemented.
- PDF/image OCR is intentionally unsupported.
- LLM-based specific situation analysis requires `OPENAI_API_KEY` and should be evaluated separately from deterministic rules.
