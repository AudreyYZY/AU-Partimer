# Independent validation and user pilot

## What the current evaluation establishes

The bundled cases are engineering regression examples adapted from regulator
material. Their expected decisions were chosen during development. They are not
independent expert labels. Run `npm run evaluate` to reproduce agreement with
these labels. An agreement score is not legal accuracy.

## Collecting independent labels

Export an array conforming to `evaluationCaseSchema` in `src/lib/evaluation.ts`.
Each record identifies source family, source type, facts, as-of date, split,
expected signals, expected decision, reviewer IDs and adjudication status.

1. Recruit two qualified domain reviewers and document their scope of expertise.
2. Freeze the rubric before showing either reviewer model outputs.
3. Reviewers independently label supported signals, missing facts and appropriate
   actions; mark ambiguous decisions for adjudication.
4. Record disagreement and adjudication separately from raw labels.
5. Split by original source family, not merely individual scenario. Variants of a
   development case must not enter the holdout set.
6. Include lawful informal recruitment, juniors, unusual rosters, unknown facts,
   cancelled registrations, service errors, urgent income needs and non-hospitality work.
7. Preserve the original date and jurisdiction. Do not apply today's rates to a
   historical case and present it as a reproduction of the legal outcome.

Run:

```sh
npm run evaluate -- --input=/path/to/reviewer-cases.json --out=/path/to/results.json
npm run release:check -- --input=/path/to/reviewer-cases.json
```

The release command requires 100 independently double-reviewed and adjudicated
holdout examples and no bundled test failures. This is an internal starting gate,
not a certification threshold. Reviewer qualifications, recruitment, rubric
quality and legal applicability still need human verification. IDs alone cannot
prove independent expert review.

## Measures

- Report decision confusion matrix, dangerous false-proceed count, stop recall,
  Wilson interval, missing-signal failures and verify-first rate.
- Review false positives as well as false negatives; abstaining on every case is
  not a useful product.
- Keep model extraction evaluation separate: amount/date accuracy, unsupported
  claims, source faithfulness, refusal and tool-failure behavior.
- Keep machine, regression and human-review outcomes explicitly distinct.

## User pilot

Start with 8-12 consented participants in the intended audience, then iterate.
This is a usability discovery sample, not statistical proof of safety or demand.
Use de-identified scenarios and allow participation without uploading documents.
Never record passport numbers, bank details or full visa documents for research.

Tasks: assess an offer, ask an employer a question, confirm a pay fact from text,
record two jobs' rosters, compare alternatives and review the first payment.

Measure task completion, time to useful action, correct understanding of unknowns,
unnecessary alarm, abandonment, evidence saved and action completed. Ask what
participants did when income pressure constrained their options. Agreement with
the tool or rejecting a job is not the success metric.

Track consent, withdrawal and deletion separately from response data. Conduct
follow-up only with explicit participant consent. Publish no invented quotes,
participant counts, testimonials or conversion statistics.
