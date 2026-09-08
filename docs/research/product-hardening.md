# Product hardening

This work follows the September 2026 code audit. Passing regression tests does
not establish legal accuracy or product-market fit.

## Delivery sequence

1. Reliability: missing facts, conservative decisions, registry identity,
   benchmark-only award tools, bounded tool execution and rule regression tests.
2. Workflow: one recoverable case, confirmed evidence, work records, actions,
   opportunity comparison and consistent English/Chinese presentation.
3. Operations: database validation, access boundaries, request budgets, timeouts,
   bounded document extraction, health reporting and continuous integration.
4. Evaluation: independent labels, holdout evaluation, user-study protocol,
   release gates and an honest interview demonstration.

## September 2026 agent increment

Completed in this increment:

- typed LangGraph assessment, planning, human-attention, retrieval and explanation nodes;
- curated official-source retrieval with review metadata and stale-source disclosure;
- deterministic operation when an LLM is unconfigured or unavailable;
- user-visible plan, execution trace and source provenance;
- bounded case-level run history without automatically sending stored evidence;
- regression tests for workflow branching, privacy boundary and retrieval ordering.

This does not close the external acceptance work below. The production roadmap is
tracked in GitHub issues #1 through #7 and linked from the repository README.

## External acceptance work

- Live ABN and LLM integration require valid service credentials.
- Production database deployment and backup restoration require a real database.
- Legal/domain reviewers must supply independent labels and adjudicate conflicts.
- Participants must consent to real user studies; no simulated feedback counts.

These are release prerequisites where applicable, not completed results.
