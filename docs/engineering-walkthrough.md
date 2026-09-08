# Engineering and interview walkthrough

## Problem and product judgment

Users cannot always decline a low-paid job. Optimize for informed action, evidence
preservation and reduced irreversible harm, not the percentage of users rejecting offers.
STOP targets the risky arrangement; it is not a verdict about the entire employer.
A safer-looking brand is not evidence that a specific offer is genuine.

## Decisions worth discussing

1. Rules versus generation: structured screening remains available without an LLM.
   Tools receive bounded schemas; the model collects/explains facts, never computes
   authoritative award classifications from guesses.
2. Unknowns are first-class: no wage, age or identity confirmation means verification
   is still needed. Filling a form does not make the facts independently verified.
3. One case instead of four silos: facts, material, hours, actions and assessment
   snapshots remain connected through the considering/working stages.
4. Privacy before convenience: local storage is optional; backup is explicit,
   encrypted and scoped by a random owner cookie. No cross-device recovery is claimed.
5. Concurrency and cost: expected revisions prevent stale writes; database increments
   enforce shared request budgets. Provider time, tool steps and output are bounded.
6. Document containment: bounded input plus a short-lived Node subprocess. Heap/time
   limits reduce resource exposure, but do not constitute an OS security sandbox.
7. Evaluation honesty: source-family splits prevent related variants contaminating
   holdout. Report false-proceed, recall intervals and abstentions, not just agreement.
8. Dependency risk: scoped deepmerge-ts/mysql2 overrides repair Prisma transitive
   advisories. The v8 deepmerge Map semantic change does not affect this repository's
   plain-object Prisma config. Validate/generate/migrate/build tests guard compatibility.
   Remove overrides after upstream dependencies adopt patched versions.
9. Agent orchestration: a typed LangGraph makes assessment, planning, human input,
   retrieval and explanation observable steps. It is not a wrapper around one model call.
10. Retrieval before generation: approved official summaries are ranked by case
    topics and query terms, returned directly to the UI, and checked for review expiry.
    A vector database is deferred until a bilingual benchmark shows it improves retrieval.
11. Graceful degradation: missing model credentials or provider failures select a
    deterministic explanation. The safety workflow does not disappear with the model.

## Demo sequence

- Start with an incomplete offer. Show the missing facts, not a reassuring score.
- Confirm an age and pay quote. Show a benchmark signal and its applicability limit.
- Search a cancelled registry fixture. Show that identity status is not promoted.
- Add a confirmed message excerpt and pay fact; inspect provenance and export.
- Record shifts across jobs and a year boundary. Explicitly confirm roster completeness.
- Edit a shift and show the previously confirmed total becoming unconfirmed.
- Change language, reload an opted-in case, record questions and first-pay actions.
- Run the Agent without an API key; inspect its conditional human-input branch,
  source provenance and execution trace. Then show OCR's fail-closed state.
- Run the real PostgreSQL owner/revision tests and the intentionally failing expert gate.

## Evidence, not claims

Unit, integration and browser tests establish software behavior within tested conditions.
Bundled regulator-derived labels were authored during development, not by independent
experts. Do not claim legal accuracy, real users, retention, reduced harm or commercial
revenue without corresponding evidence.

The current architecture supports a controlled pilot. A public commercial launch still
requires account/access recovery design, retention enforcement, incident ownership,
provider smoke tests, human validation and usability evidence. Global pilot quotas are
not a tenant billing system. Browser storage is not encrypted. Node heap limits do not
bound every native allocation. UI mobile emulation is not a physical-device audit.

The project now contains a real state graph and retrieval-augmented explanation path,
but not a durable autonomous agent. Graph state is request-scoped, retrieval uses a
small curated corpus, and the older chat/rule path remains until issue #7 is complete.
These boundaries are useful interview material because the design separates orchestration,
decision policy, retrieval, generation and evidence rather than calling any LLM request an agent.

## Sources for technical choices

- [deepmerge-ts v8 changes](https://github.com/RebeccaStevens/deepmerge-ts/releases/tag/v8.0.0)
- Local installed Next.js documentation under node_modules/next/dist/docs.
- Repository tests and the operations/validation guides are the reproducible evidence.
