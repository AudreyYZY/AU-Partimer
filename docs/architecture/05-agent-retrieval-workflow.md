# Agent and retrieval workflow

## Purpose

The agent turns one saved job case into a bounded decision workflow. It is not an
open-ended autonomous legal adviser. Deterministic policy remains the decision
authority; generation is an optional explanation layer.

```text
question + confirmed case facts
              |
              v
     [assess: deterministic rules]
              |
              v
     [make_plan: gaps + checks]
          /             \
 missing facts       no required gap
       |                   |
       v                   |
 [human_input marker]      |
          \               /
           v             v
      [retrieve official guidance]
              |
              v
 [explain: model when configured,
  deterministic fallback otherwise]
              |
              v
 result + sources + trace + bounded run record
```

The graph is implemented with LangGraph `StateGraph` and a Zod state schema in
`src/services/agent/workflow.ts`. The conditional edge makes missing facts a
first-class branch. It does not silently fill them. Each run exposes a trace for
assessment, planning, human attention, retrieval and explanation.

## Retrieval, not retrieval theatre

`src/services/agent/knowledge-base.ts` contains short, reviewed summaries linked
to official Fair Work, Scamwatch, ABR, ATO and Home Affairs pages. Every record
has an ID, authority, URL, topics, keywords, review date and review deadline.

`src/services/agent/retrieval.ts` combines structured case topics with lexical
matches. This is deliberately a small, inspectable retrieval layer rather than a
vector database added for appearance. Retrieved records augment the optional
model prompt and are also returned separately to the UI, so source links do not
depend on generated citation text.

The current tests verify expected source ordering and stale-source disclosure.
They do not establish retrieval quality on a representative bilingual corpus.
Issue [#4](https://github.com/AudreyYZY/AU-Partimer/issues/4) tracks ingestion,
freshness automation, Recall@k/MRR evaluation and an embeddings benchmark.

## Trust boundaries

- The deterministic opportunity report owns the decision and risk signals.
- The model may explain but must not change the decision or invent an award rate.
- Employer text and user questions are untrusted input, not system instructions.
- Employer identity is redacted from the model prompt; stored evidence text is
  not sent by the agent endpoint.
- Only approved knowledge records are returned as sources.
- Model failure uses a complete deterministic explanation instead of failing the
  whole workflow.
- Source review expiry is visible; it is never silently ignored.

## State and persistence

LangGraph state currently lives for one API request. The browser case stores only
the bounded conversation and ten compact run records: request ID, time, decision,
mode, source IDs and trace. Questions are not duplicated into run records; full reports and raw evidence are not copied into the
run log.

This is stateful orchestration, but not durable LangGraph pause/resume. There is no
persistent checkpointer or authenticated thread identity. Issue
[#3](https://github.com/AudreyYZY/AU-Partimer/issues/3) owns that production step.

## Failure modes

| Failure | Behaviour |
| --- | --- |
| No `OPENAI_API_KEY` | Rules, planning, retrieval and deterministic explanation still complete |
| Model timeout/provider error | Same deterministic fallback; trace marks `fallback` |
| Missing facts | Result is `needs_user_input`; facts are not inferred |
| Source review overdue | Source is marked stale and the ruleset prevents an unqualified proceed result |
| Invalid/oversized request | API rejects it before graph execution |
| API budget exhausted | Returns `429`; case input remains in the editor |

## Production gaps

This architecture improves technical depth and auditability, but commercial
readiness still depends on independent legal labels (#1), exact award-rate work
(#2), durable authenticated state (#3), measured retrieval quality (#4), real
worker testing (#5), safe OCR (#6), and removal of the legacy duplicate decision
path (#7).
