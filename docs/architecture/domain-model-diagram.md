# Domain Model Diagram

## Employment Rights Diagnostic Agent - Core Domain Model

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           EMPLOYMENT RIGHTS DIAGNOSTIC AGENT                              │
│                                    DOMAIN MODEL                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                          │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐   │
│  │                              INTERVIEW CONTEXT                                     │   │
│  │                                                                                    │   │
│  │   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐       │   │
│  │   │   User      │    │  Interview  │    │  Question   │    │   Answer    │       │   │
│  │   │             │    │             │    │   History   │    │   Record    │       │   │
│  │   │ • id        │───▶│ • id        │───▶│ • question  │───▶│ • answer    │       │   │
│  │   │ • language  │    │ • status    │    │ • timestamp │    │ • confidence│       │   │
│  │   │ • created   │    │ • phase     │    │ • category  │    │ • source    │       │   │
│  │   └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘       │   │
│  │                                                                                    │   │
│  └──────────────────────────────────────────────────────────────────────────────────┘   │
│                                              │                                          │
│                                              ▼                                          │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐   │
│  │                              FACT COLLECTION                                      │   │
│  │                                                                                    │   │
│  │   ┌─────────────────────────────────────────────────────────────────────────┐     │   │
│  │   │                         EMPLOYMENT FACTS                                 │     │   │
│  │   │                           (Aggregate Root)                               │     │   │
│  │   │                                                                          │     │   │
│  │   │  ┌─────────────────────────────────────────────────────────────────┐    │     │   │
│  │   │  │  Employment Information                                         │    │     │   │
│  │   │  │  • employerName (String)                                        │    │     │   │
│  │   │  │  • employerAbn (String)                                         │    │     │   │
│  │   │  │  • employmentStartDate (Date)                                   │    │     │   │
│  │   │  │  • employmentStatus (Enum: FULL_TIME|PART_TIME|CASUAL)         │    │     │   │
│  │   │  │  • hasWrittenContract (Boolean)                                 │    │     │   │
│  │   │  │  • jobTitle (String)                                            │    │     │   │
│  │   │  │  • hoursPerWeek (Number)                                        │    │     │   │
│  │   │  └─────────────────────────────────────────────────────────────────┘    │     │   │
│  │   │                                                                          │     │   │
│  │   │  ┌─────────────────────────────────────────────────────────────────┐    │     │   │
│  │   │  │  Compensation Information                                       │    │     │   │
│  │   │  │  • payRate (Decimal)                                            │    │     │   │
│  │   │  │  • payRateType (Enum: HOURLY|WEEKLY|SALARY)                    │    │     │   │
│  │   │  │  • paymentMethod (Enum: CASH|BANK|MIXED)                       │    │     │   │
│  │   │  │  • receivesPenaltyRates (Boolean)                               │    │     │   │
│  │   │  │  • penaltyRates (Map<String, Decimal>)                         │    │     │   │
│  │   │  └─────────────────────────────────────────────────────────────────┘    │     │   │
│  │   │                                                                          │     │   │
│  │   │  ┌─────────────────────────────────────────────────────────────────┐    │     │   │
│  │   │  │  Documentation Information                                      │    │     │   │
│  │   │  │  • receivesPayslips (Boolean)                                   │    │     │   │
│  │   │  │  • hasContract (Boolean)                                        │    │     │   │
│  │   │  │  • hasLetterOfOffer (Boolean)                                   │    │     │   │
│  │   │  │  • documentationComplete (Boolean)                              │    │     │   │
│  │   │  └─────────────────────────────────────────────────────────────────┘    │     │   │
│  │   │                                                                          │     │   │
│  │   │  ┌─────────────────────────────────────────────────────────────────┐    │     │   │
│  │   │  │  Superannuation Information                                     │    │     │   │
│  │   │  │  • isSuperEntitled (Boolean)                                    │    │     │   │
│  │   │  │  • receivesSuper (Boolean)                                      │    │     │   │
│  │   │  │  • superFundName (String)                                       │    │     │   │
│  │   │  │  • superExpectedAmount (Decimal)                                │    │     │   │
│  │   │  │  • superUnderpayment (Decimal)                                  │    │     │   │
│  │   │  └─────────────────────────────────────────────────────────────────┘    │     │   │
│  │   │                                                                          │     │   │
│  │   │  ┌─────────────────────────────────────────────────────────────────┐    │     │   │
│  │   │  │  Visa Information                                               │    │     │   │
│  │   │  │  • visaSubclass (String)                                        │    │     │   │
│  │   │  │  • visaExpiryDate (Date)                                        │    │     │   │
│  │   │  │  • hoursLimit (Number)                                          │    │     │   │
│  │   │  │  • visaWorkCompliant (Boolean)                                  │    │     │   │
│  │   │  └─────────────────────────────────────────────────────────────────┘    │     │   │
│  │   │                                                                          │     │   │
│  │   │  ┌─────────────────────────────────────────────────────────────────┐    │     │   │
│  │   │  │  Evidence Information                                           │    │     │   │
│  │   │  │  • evidenceTypes (String[])                                     │    │     │   │
│  │   │  │  • evidenceCount (Number)                                       │    │     │   │
│  │   │  │  • hasScreenshots (Boolean)                                     │    │     │   │
│  │   │  │  • hasMessages (Boolean)                                        │    │     │   │
│  │   │  │  • hasDocuments (Boolean)                                       │    │     │   │
│  │   │  └─────────────────────────────────────────────────────────────────┘    │     │   │
│  │   │                                                                          │     │   │
│  │   │  ┌─────────────────────────────────────────────────────────────────┐    │     │   │
│  │   │  │  Confidence Tracking                                            │    │     │   │
│  │   │  │  • overallCompleteness (Percentage)                             │    │     │   │
│  │   │  │  • averageConfidence (Decimal)                                  │    │     │   │
│  │   │  │  • unknownFacts (String[])                                      │    │     │   │
│  │   │  │  • factConflicts (Conflict[])                                   │    │     │   │
│  │   │  └─────────────────────────────────────────────────────────────────┘    │     │   │
│  │   │                                                                          │     │   │
│  │   └─────────────────────────────────────────────────────────────────────────┘     │   │
│  │                                                                                    │   │
│  └──────────────────────────────────────────────────────────────────────────────────┘   │
│                                              │                                          │
│                                              ▼                                          │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐   │
│  │                              RULE ENGINE                                          │   │
│  │                                                                                    │   │
│  │   ┌─────────────────────────────────────────────────────────────────────────┐     │   │
│  │   │                           RULE CATALOG                                    │     │   │
│  │   │                                                                          │     │   │
│  │   │   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                 │     │   │
│  │   │   │    Rule     │    │   Rule      │    │   Rule      │                 │     │   │
│  │   │   │   Version   │    │  Condition  │    │  Template   │                 │     │   │
│  │   │   │             │    │             │    │             │                 │     │   │
│  │   │   │ • id        │    │ • field     │    │ • code      │                 │     │   │
│  │   │   │ • version   │    │ • operator  │    │ • name      │                 │     │   │
│  │   │   │ • status    │    │ • value     │    │ • severity  │                 │     │   │
│  │   │   │ • changes   │    │ • threshold │    │ • legal_ref │                 │     │   │
│  │   │   └─────────────┘    └─────────────┘    └─────────────┘                 │     │   │
│  │   │                                                                          │     │   │
│  │   │   Rule Categories:                                                       │     │   │
│  │   │   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │     │   │
│  │   │   │    WAGE     │ │    SUPER    │ │   HOURS     │ │    TAX      │       │     │   │
│  │   │   └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │     │   │
│  │   │   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │     │   │
│  │   │   │    LEAVE    │ │   SAFETY    │ │    VISA     │ │    DOCS     │       │     │   │
│  │   │   └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │     │   │
│  │   │                                                                          │     │   │
│  │   └─────────────────────────────────────────────────────────────────────────┘     │   │
│  │                                                                                    │   │
│  └──────────────────────────────────────────────────────────────────────────────────┘   │
│                                              │                                          │
│                                              ▼                                          │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐   │
│  │                              FINDINGS                                              │   │
│  │                                                                                    │   │
│  │   ┌─────────────────────────────────────────────────────────────────────────┐     │   │
│  │   │                           FINDING                                         │     │   │
│  │   │                                                                          │     │   │
│  │   │   ┌─────────────────────────────────────────────────────────────────┐   │     │   │
│  │   │   │  Core Fields                                                    │   │     │   │
│  │   │   │  • id (UUID)                                                    │   │     │   │
│  │   │   │  • findingCode (String)                                         │   │     │   │
│  │   │   │  • name (String)                                                │   │     │   │
│  │   │   │  • severity (Enum: CRITICAL|HIGH|MEDIUM|LOW)                   │   │     │   │
│  │   │   │  • confidence (Decimal: 0-1)                                    │   │     │   │
│  │   │   │  • urgency (Enum: IMMEDIATE|SOON|WHEN_POSSIBLE)                │   │     │   │
│  │   │   └─────────────────────────────────────────────────────────────────┘   │     │   │
│  │   │                                                                          │     │   │
│  │   │   ┌─────────────────────────────────────────────────────────────────┐   │     │   │
│  │   │   │  Legal Basis                                                    │   │     │   │
│  │   │   │  • legalReferences (LegalReference[])                           │   │     │   │
│  │   │   │  • legalSummary (String)                                        │   │     │   │
│  │   │   │  • legalJurisdiction (String)                                   │   │     │   │
│  │   │   └─────────────────────────────────────────────────────────────────┘   │     │   │
│  │   │                                                                          │     │   │
│  │   │   ┌─────────────────────────────────────────────────────────────────┐   │     │   │
│  │   │   │  Evidence                                                       │   │     │   │
│  │   │   │  • evidenceChecklist (EvidenceItem[])                           │   │     │   │
│  │   │   │  • evidenceCollected (EvidenceItem[])                           │   │     │   │
│  │   │   │  • evidenceGaps (String[])                                      │   │     │   │
│  │   │   └─────────────────────────────────────────────────────────────────┘   │     │   │
│  │   │                                                                          │     │   │
│  │   │   ┌─────────────────────────────────────────────────────────────────┐   │     │   │
│  │   │   │  Recommendations                                                │   │     │   │
│  │   │   │  • recommendedActions (Action[])                                │   │     │   │
│  │   │   │  • timeframe (String)                                           │   │     │   │
│  │   │   └─────────────────────────────────────────────────────────────────┘   │     │   │
│  │   │                                                                          │     │   │
│  │   │   ┌─────────────────────────────────────────────────────────────────┐   │     │   │
│  │   │   │  Review Status                                                  │   │     │   │
│  │   │   │  • humanReviewRequired (Boolean)                                │   │     │   │
│  │   │   │  • reviewStatus (Enum: PENDING|IN_REVIEW|COMPLETED)            │   │     │   │
│  │   │   │  • reviewerNotes (String)                                       │   │     │   │
│  │   │   └─────────────────────────────────────────────────────────────────┘   │     │   │
│  │   │                                                                          │     │   │
│  │   └─────────────────────────────────────────────────────────────────────────┘     │   │
│  │                                                                                    │   │
│  └──────────────────────────────────────────────────────────────────────────────────┘   │
│                                              │                                          │
│                                              ▼                                          │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐   │
│  │                              EVIDENCE                                              │   │
│  │                                                                                    │   │
│  │   ┌─────────────────────────────────────────────────────────────────────────┐     │   │
│  │   │                           EVIDENCE                                       │     │   │
│  │   │                                                                          │     │   │
│  │   │   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                 │     │   │
│  │   │   │  Document   │    │  Screenshot │    │  Message    │                 │     │   │
│  │   │   │             │    │             │    │             │                 │     │   │
│  │   │   │ • type      │    │ • image_url │    │ • platform  │                 │     │   │
│  │   │   │ • file_url  │    │ • ocr_text  │    │ • messages  │                 │     │   │
│  │   │   │ • extracted │    │ • extracted │    │ • extracted │                 │     │   │
│  │   │   │   facts     │    │   facts     │    │   facts     │                 │     │   │
│  │   │   └─────────────┘    └─────────────┘    └─────────────┘                 │     │   │
│  │   │                                                                          │     │   │
│  │   │   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                 │     │   │
│  │   │   │   Photo     │    │   Witness   │    │   Record    │                 │     │   │
│  │   │   │             │    │             │    │             │                 │     │   │
│  │   │   │ • image_url │    │ • name      │    │ • type      │                 │     │   │
│  │   │   │ • location  │    │ • statement │    │ • source    │                 │     │   │
│  │   │   │ • timestamp │    │ • contact   │    │ • data      │                 │     │   │
│  │   │   └─────────────┘    └─────────────┘    └─────────────┘                 │     │   │
│  │   │                                                                          │     │   │
│  │   └─────────────────────────────────────────────────────────────────────────┘     │   │
│  │                                                                                    │   │
│  └──────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   User      │    │  Interview  │    │   Facts     │    │  Findings   │
│   Input     │───▶│   Engine    │───▶│  Extraction │───▶│ Generation  │
│             │    │             │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                  │                  │                  │
       │                  │                  │                  │
       ▼                  ▼                  ▼                  ▼
  ┌─────────┐        ┌─────────┐        ┌─────────┐        ┌─────────┐
  │ Natural │        │ Question│        │Employment│        │  Rule   │
  │ Language│        │Selection│        │  Facts   │        │ Engine  │
  │ Chat    │        │         │        │          │        │         │
  │ PDF     │        │ Adaptive│        │ Normalize│        │ Evaluate│
  │ Images  │        │ Flow    │        │          │        │         │
  └─────────┘        └─────────┘        └─────────┘        └─────────┘
```

## Aggregate Relationships

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              AGGREGATE RELATIONSHIPS                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   User (1) ──────────────────────── (N) Interview                            │
│                                                                              │
│   Interview (1) ─────────────────── (N) EmploymentFacts                      │
│                                                                              │
│   Interview (1) ─────────────────── (N) Findings                             │
│                                                                              │
│   Interview (1) ─────────────────── (N) Evidence                             │
│                                                                              │
│   Rule (1) ──────────────────────── (N) Findings                             │
│                                                                              │
│   Rule (1) ──────────────────────── (N) RuleVersions                         │
│                                                                              │
│   Finding (N) ───────────────────── (N) EmploymentFacts                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Bounded Contexts

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              BOUNDED CONTEXTS                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌──────────────────────────────────────────────────────────────────────┐  │
│   │  FACT COLLECTION CONTEXT                                             │  │
│   │                                                                        │  │
│   │  Aggregates: User, Interview, EmploymentFacts                         │  │
│   │  Services: InterviewEngine, FactExtractor                             │  │
│   │  Events: FactExtracted, FactVerified, InterviewCompleted              │  │
│   │                                                                        │  │
│   └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│   ┌──────────────────────────────────────────────────────────────────────┐  │
│   │  RULE ENGINE CONTEXT                                                 │  │
│   │                                                                        │  │
│   │  Aggregates: Rule, RuleVersion                                        │  │
│   │  Services: RuleEngine, RuleValidator                                  │  │
│   │  Events: RuleEvaluated, RuleUpdated                                   │  │
│   │                                                                        │  │
│   └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│   ┌──────────────────────────────────────────────────────────────────────┐  │
│   │  FINDING GENERATION CONTEXT                                          │  │
│   │                                                                        │  │
│   │  Aggregates: Finding, Evidence                                        │  │
│   │  Services: FindingGenerator, EvidenceManager                          │  │
│   │  Events: FindingGenerated, FindingSeverityUpdated                     │  │
│   │                                                                        │  │
│   └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Value Objects

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              VALUE OBJECTS                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│   │  Address    │    │  Money      │    │  DateRange  │    │  Duration   │  │
│   │             │    │             │    │             │    │             │  │
│   │ • street    │    │ • amount    │    │ • start     │    │ • hours     │  │
│   │ • city      │    │ • currency  │    │ • end       │    │ • minutes   │  │
│   │ • state     │    │             │    │             │    │             │  │
│   │ • postcode  │    │             │    │             │    │             │  │
│   └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘  │
│                                                                              │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│   │  Confidence │    │  Severity   │    │  Urgency    │    │  Status     │  │
│   │             │    │             │    │             │    │             │  │
│   │ • score     │    │ • level     │    │ • level     │    │ • state     │  │
│   │ • factors   │    │ • criteria  │    │ • timeframe │    │ • timestamp │  │
│   └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Domain Events

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DOMAIN EVENTS                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Fact Collection Events:                                                    │
│   ├── FactExtracted(factId, field, value, confidence, source)               │
│   ├── FactVerified(factId, verifiedBy, verifiedAt)                          │
│   ├── FactConflictDetected(factId1, factId2, conflictType)                  │
│   └── InterviewCompleted(interviewId, factsCollected, findingsGenerated)    │
│                                                                              │
│   Rule Engine Events:                                                        │
│   ├── RuleEvaluated(ruleId, interviewId, triggered, factsUsed)              │
│   ├── RuleUpdated(ruleId, version, changeType)                              │
│   └── RuleDeprecated(ruleId, reason)                                        │
│                                                                              │
│   Finding Events:                                                            │
│   ├── FindingGenerated(findingId, ruleId, severity, confidence)             │
│   ├── FindingSeverityUpdated(findingId, oldSeverity, newSeverity)           │
│   ├── FindingReviewed(findingId, reviewer, status)                          │
│   └── FindingDismissed(findingId, reason)                                   │
│                                                                              │
│   Evidence Events:                                                           │
│   ├── EvidenceUploaded(evidenceId, type, interviewId)                       │
│   ├── EvidenceVerified(evidenceId, verifiedBy)                              │
│   └── EvidenceLinked(evidenceId, findingId)                                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```
