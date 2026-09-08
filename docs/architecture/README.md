# Employment Rights Diagnostic Agent - Architecture Documentation

## Quick Reference

### Documents

| Document | Description | Location |
|----------|-------------|----------|
| Domain Architecture | Complete architecture design | [domain-architecture.md](./domain-architecture.md) |
| Domain Model Diagram | Visual domain model | [domain-model-diagram.md](./domain-model-diagram.md) |
| Agent and retrieval workflow | Implemented LangGraph, retrieval and trust boundaries | [05-agent-retrieval-workflow.md](./05-agent-retrieval-workflow.md) |

---

## Architecture Overview

### Core Principle

**Confirmed case facts are the decision input; unknowns remain unknown.**

Inputs must be confirmed into case facts before they affect a decision. Text PDFs
can be extracted as drafts. Images and scanned PDFs are not yet supported; they
must not be described as implemented fact extraction.

### Bounded Contexts

```
┌─────────────────────────────────────────────────────────────────┐
│                    Employment Rights Diagnostic                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │   Fact       │    │   Rule       │    │   Finding    │       │
│  │  Collection  │───▶│   Engine     │───▶│  Generation  │       │
│  └──────────────┘    └──────────────┘    └──────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Key Aggregates

| Aggregate | Purpose |
|-----------|---------|
| EmploymentFacts | Single source of truth for all employment data |
| Finding | Diagnosed employment issues with evidence |
| Rule | Business rules for detecting issues |
| Interview | Conversation state and history |
| Evidence | Supporting documentation |

---

## Quick Start

### 1. EmploymentFacts Schema

**Location**: [domain-architecture.md#3-employmentfacts-schema](./domain-architecture.md#3-employmentfacts-schema)

**Key Sections**:
- Employment Information
- Compensation Information
- Documentation Information
- Superannuation Information
- Visa Information
- Evidence Information

**Confidence Levels**: High (0.8-1.0), Medium (0.5-0.7), Low (0.0-0.4)

### 2. Findings Schema

**Location**: [domain-architecture.md#4-findings-schema](./domain-architecture.md#4-findings-schema)

**Severity Levels**:
- CRITICAL: Immediate financial/legal harm
- HIGH: Significant rights violation
- MEDIUM: Notable compliance issue
- LOW: Minor issue or best practice

### 3. Rule Catalog

**Location**: [domain-architecture.md#5-rule-catalog-architecture](./domain-architecture.md#5-rule-catalog-architecture)

**Rule Categories**: WAGE, SUPER, HOURS, TAX, LEAVE, SAFETY, VISA, DOCS

**Example Rules**:
- Under Award Wage (WAGE-001)
- Missing Payslip (DOC-001)
- Missing Super (SUPER-001)
- Unpaid Trial Shift (WAGE-002)
- Cash Payment Risk (TAX-001)

### 4. Interview Engine

**Location**: [domain-architecture.md#6-interview-flow-engine](./domain-architecture.md#6-interview-flow-engine)

**Key Features**:
- Adaptive questioning
- Information gain calculation
- Multi-language support (EN, ZH, Mixed)
- Confidence tracking

### 5. Fact Extraction

**Location**: [domain-architecture.md#7-fact-extraction-architecture](./domain-architecture.md#7-fact-extraction-architecture)

**Supported Inputs**:
- Natural language
- Chat screenshots (WeChat, WhatsApp)
- PDFs (contracts, payslips)
- Images (rosters, timesheets)

---

## Implementation Guide

### Phase 1: Core Domain

1. Implement EmploymentFacts aggregate
2. Implement basic rule engine
3. Implement simple interview flow
4. Implement basic fact extraction

### Phase 2: Enhanced Features

1. Add all rule categories
2. Implement adaptive questioning
3. Add multi-language support
4. Implement evidence management

### Phase 3: Advanced Features

1. Add advanced NLP extraction
2. Implement conflict resolution
3. Add human verification workflows
4. Implement reporting and analytics

---

## Database Tables

### Core Tables

| Table | Purpose |
|-------|---------|
| users | User accounts |
| interviews | Interview sessions |
| employment_facts | Employment facts (EAV pattern) |
| rules | Business rules |
| findings | Generated findings |
| questions | Interview questions |
| evidence | Supporting evidence |

### Key Indexes

```sql
CREATE INDEX idx_employment_facts_interview_id ON employment_facts(interview_id);
CREATE INDEX idx_findings_interview_id ON findings(interview_id);
CREATE INDEX idx_rules_category ON rules(category);
```

---

## Domain Events

### Fact Events
- FactExtracted
- FactVerified
- FactConflictDetected

### Rule Events
- RuleEvaluated
- RuleUpdated

### Finding Events
- FindingGenerated
- FindingSeverityUpdated

---

## Legal References

| Law | Relevance |
|-----|-----------|
| Fair Work Act 2009 | National employment standards |
| Superannuation Guarantee Act 1992 | Super requirements |
| Income Tax Assessment Act 1997 | Tax obligations |
| Migration Act 1958 | Visa work rights |

---

## Confidence Scoring

### Source Reliability

| Source | Base Score |
|--------|------------|
| Written contract | 0.95 |
| Payslip | 0.90 |
| Bank statement | 0.85 |
| Chat message | 0.60 |
| Verbal statement | 0.40 |

### Confidence Calculation

```
confidence = (
  sourceReliability * 0.3 +
  extractionClarity * 0.3 +
  contextSupport * 0.2 +
  crossValidation * 0.2
)
```

---

## Future Expansion

### Planned Features

| Feature | Priority |
|---------|----------|
| Union referral | High |
| Legal aid referral | High |
| Document templates | Medium |
| Pay calculator | Medium |

### Additional Worker Types

| Worker Type | Key Rules |
|-------------|-----------|
| Gig Workers | Sham contracting |
| Farm Workers | Piece rates |
| Hospitality | Tips, split shifts |

---

## Glossary

| Term | Definition |
|------|------------|
| EmploymentFacts | Single source of truth for all employment data |
| Finding | A diagnosed employment issue with evidence |
| Rule | Business logic for detecting issues |
| Interview | A fact collection conversation |
| Confidence | How certain we are about a fact (0-1) |
| Severity | How serious an issue is |

---

## Contact

For questions about this architecture, please refer to the detailed documentation in [domain-architecture.md](./domain-architecture.md).
