# Legal Knowledge Schema

## Version: 1.0.0
## Date: 2026-06-01
## Status: Design Phase

---

## 1. Purpose

This schema defines how legal knowledge is structured in the system. It ensures:

- Every legal requirement is traceable to a source
- Every source is verifiable
- Every Finding can show its legal basis
- Updates to law propagate correctly

---

## 2. Core Entities

### 2.1 LegalSource

The origin of a legal requirement.

```typescript
interface LegalSource {
  id: string;
  sourceType: SourceType;
  authorityLevel: 1 | 2 | 3 | 4 | 5 | 6;
  authorityLabel: string;

  // Reference
  title: string;
  section: string;
  url: string;
  jurisdiction: Jurisdiction;

  // Validity
  effectiveDate: Date;
  lastVerifiedAt: Date;
  status: "current" | "amended" | "repealed" | "superseded";

  // Content
  summary: string;
  fullText: string | null;
  keyRequirements: string[];

  // Update
  lastUpdatedAt: Date;
  nextReviewAt: Date;
  reviewFrequency: string;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}
```

### 2.2 LegalRequirement

A specific obligation extracted from a source.

```typescript
interface LegalRequirement {
  id: string;
  sourceId: string;                    // Links to LegalSource

  // What is required
  requirementType: RequirementType;
  description: string;
  plainLanguageSummary: string;

  // Who it applies to
  appliesTo: {
    employmentStatus: EmploymentStatus[];
    industries: string[];
    visaSubclasses: string[] | null;   // null = all
    ageRange: { min: number | null; max: number | null };
    state: Jurisdiction[] | null;      // null = federal (all)
  };

  // The requirement
  threshold: {
    type: "amount" | "percentage" | "duration" | "boolean" | "enum";
    value: number | string | boolean;
    unit: string | null;               // e.g., "$/hour", "%", "hours"
    comparison: "gte" | "lte" | "eq" | "neq" | "gt" | "lt";
  };

  // Effective period
  effectiveFrom: Date;
  effectiveTo: Date | null;

  // Status
  status: "active" | "pending" | "expired" | "superseded";

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  verifiedBy: string | null;
  verifiedAt: Date | null;
}
```

### 2.3 RequirementType

```typescript
enum RequirementType {
  // Wage
  MINIMUM_WAGE = "minimum_wage",
  CASUAL_LOADING = "casual_loading",
  PENALTY_RATE = "penalty_rate",
  OVERTIME_RATE = "overtime_rate",
  ALLOWANCE = "allowance",

  // Super
  SUPER_GUARANTEE = "super_guarantee",
  SUPER_CHOICE = "super_choice",

  // Leave
  ANNUAL_LEAVE = "annual_leave",
  SICK_LEAVE = "sick_leave",
  LONG_SERVICE_LEAVE = "long_service_leave",
  PUBLIC_HOLIDAY = "public_holiday",

  // Hours
  MAXIMUM_HOURS = "maximum_hours",
  BREAK_ENTITLEMENT = "break_entitlement",
  NOTICE_PERIOD = "notice_period",

  // Documentation
  PAYSLIP_REQUIREMENT = "payslip_requirement",
  CONTRACT_REQUIREMENT = "contract_requirement",
  RECORD_KEEPING = "record_keeping",

  // Safety
  SAFE_WORKPLACE = "safe_workplace",
  PPE_REQUIREMENT = "ppe_requirement",
  TRAINING_REQUIREMENT = "training_requirement",

  // Visa
  WORK_HOURS_LIMIT = "work_hours_limit",
  WORK_CONDITIONS = "work_conditions"
}
```

### 2.4 LegalFinding

A conclusion that maps facts to legal requirements.

```typescript
interface LegalFinding {
  id: string;
  findingCode: string;

  // What was found
  title: string;
  description: string;
  plainLanguageExplanation: string;

  // Legal basis
  requirementIds: string[];            // Links to LegalRequirement
  sourceIds: string[];                 // Links to LegalSource

  // Facts that triggered this
  factIds: string[];                   // Links to EmploymentFacts
  ruleId: string;                      // Links to Rule

  // Classification
  findingType: FindingType;
  confidence: number;                  // 0.0 - 1.0

  // Sources (for display)
  sources: FindingSource[];

  // Status
  status: "active" | "under_review" | "resolved" | "dismissed";

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  reviewedBy: string | null;
  reviewedAt: Date | null;
}
```

### 2.5 FindingType

```typescript
enum FindingType {
  // Violations
  BELOW_MINIMUM_WAGE = "below_minimum_wage",
  MISSING_SUPER = "missing_super",
  MISSING_PAYSLIP = "missing_payslip",
  MISSING_PENALTY_RATE = "missing_penalty_rate",
  UNPAID_OVERTIME = "unpaid_overtime",
  UNPAID_TRIAL = "unpaid_trial",
  UNPAID_TRAINING = "unpaid_training",
  UNLAWFUL_DEDUCTION = "unlawful_deduction",

  // Risks
  VISA_BREACH = "visa_breach",
  SHAM_CONTRACTING = "sham_contracting",
  CASH_PAYMENT_RISK = "cash_payment_risk",
  UNSAFE_WORKPLACE = "unsafe_workplace",

  // Entitlements
  ANNUAL_LEAVE_DENIED = "annual_leave_denied",
  SICK_LEAVE_DENIED = "sick_leave_denied",
  SUPER_CHOICE_DENIED = "super_choice_denied",

  // Issues
  ADVERSE_ACTION = "adverse_action",
  DISCRIMINATION = "discrimination",
  WORKPLACE_BULLYING = "workplace_bullying",
  UNFAIR_DISMISSAL = "unfair_dismissal"
}
```

### 2.6 FindingSource

Source citation for a Finding.

```typescript
interface FindingSource {
  sourceId: string;                    // Links to LegalSource
  sourceType: SourceType;
  authorityLevel: number;
  title: string;
  section: string;
  url: string;
  jurisdiction: Jurisdiction;
  lastVerifiedAt: Date;

  // What this source says about this finding
  relevance: string;                   // e.g., "Section 284 requires..."
  quotedText: string | null;           // Direct quote if applicable
}
```

---

## 3. Relationships

```
LegalSource (1) ──────────────── (N) LegalRequirement
     │                                      │
     │                                      │
     │                                      ▼
     │                              LegalFinding
     │                                      │
     │                                      │
     ▼                                      ▼
FindingSource ◄────────────────────── EmploymentFacts
```

### 3.1 How a Finding is Created

```
1. EmploymentFacts collected
2. Rule evaluates facts
3. Rule triggers if conditions met
4. Rule references LegalRequirement
5. LegalRequirement links to LegalSource
6. Finding created with:
   - Finding description
   - LegalRequirement reference
   - LegalSource citation
   - EmploymentFacts evidence
```

---

## 4. Example: Minimum Wage Finding

### 4.1 LegalSource

```json
{
  "id": "src-fw-act-284",
  "sourceType": "FEDERAL_ACT",
  "authorityLevel": 1,
  "authorityLabel": "primary source",
  "title": "Fair Work Act 2009",
  "section": "Section 284",
  "url": "https://www.legislation.gov.au/Series/C2004A00947",
  "jurisdiction": "FEDERAL",
  "effectiveDate": "2009-07-01",
  "lastVerifiedAt": "2026-06-01",
  "status": "current",
  "summary": "Establishes the national minimum wage.",
  "keyRequirements": [
    "All employees must be paid at least the national minimum wage",
    "The national minimum wage is reviewed annually by the Fair Work Commission"
  ]
}
```

### 4.2 LegalRequirement

```json
{
  "id": "req-min-wage-2025",
  "sourceId": "src-fw-act-284",
  "requirementType": "MINIMUM_WAGE",
  "description": "National minimum wage as of 1 July 2026",
  "plainLanguageSummary": "All employees must be paid at least $26.44 per hour. Casual employees must receive at least $33.05 per hour (includes 25% casual loading).",
  "appliesTo": {
    "employmentStatus": ["full_time", "part_time", "casual"],
    "industries": ["all"],
    "visaSubclasses": null,
    "ageRange": { "min": 21, "max": null },
    "state": null
  },
  "threshold": {
    "type": "amount",
    "value": 26.44,
    "unit": "$/hour",
    "comparison": "gte"
  },
  "effectiveFrom": "2026-07-01",
  "effectiveTo": null,
  "status": "active"
}
```

### 4.3 LegalFinding

```json
{
  "id": "finding-001",
  "findingCode": "BELOW_MIN_WAGE",
  "title": "Below National Minimum Wage",
  "description": "Your hourly rate is below the national minimum wage.",
  "plainLanguageExplanation": "Australian law requires all employees to be paid at least $26.44 per hour (or $33.05 per hour for casual employees including casual loading). Your reported rate is below this minimum.",
  "requirementIds": ["req-min-wage-2025"],
  "sourceIds": ["src-fw-act-284"],
  "factIds": ["fact-pay-rate", "fact-employment-status"],
  "ruleId": "rule-min-wage",
  "findingType": "BELOW_MINIMUM_WAGE",
  "confidence": 0.95,
  "sources": [
    {
      "sourceId": "src-fw-act-284",
      "sourceType": "FEDERAL_ACT",
      "authorityLevel": 1,
      "title": "Fair Work Act 2009",
      "section": "Section 284",
      "url": "https://www.legislation.gov.au/Series/C2004A00947",
      "jurisdiction": "FEDERAL",
      "lastVerifiedAt": "2026-06-01",
      "relevance": "Section 284 establishes the national minimum wage, which is currently $26.44 per hour.",
      "quotedText": "The FWC must make a national minimum wage order that sets a single national minimum wage..."
    }
  ],
  "status": "active"
}
```

---

## 5. Example: Penalty Rates Finding

### 5.1 LegalSource

```json
{
  "id": "src-hosp-award-23",
  "sourceType": "MODERN_AWARD",
  "authorityLevel": 4,
  "authorityLabel": "official source",
  "title": "Hospitality Industry (General) Award 2020",
  "section": "Clause 23 - Penalty rates",
  "url": "https://www.fwc.gov.au/awards-agreements/awards/modern-awards/hospitality-industry-general-award-2020",
  "jurisdiction": "FEDERAL",
  "effectiveDate": "2020-02-04",
  "lastVerifiedAt": "2026-06-01",
  "status": "current",
  "summary": "Sets penalty rates for hospitality employees.",
  "keyRequirements": [
    "Casual Saturday: base rate × 1.25 + 25% casual loading",
    "Casual Sunday: base rate × 1.50 + 25% casual loading",
    "Casual Public Holiday: base rate × 2.50 + 25% casual loading"
  ]
}
```

### 5.2 LegalRequirement

```json
{
  "id": "req-hosp-penalty-saturday",
  "sourceId": "src-hosp-award-23",
  "requirementType": "PENALTY_RATE",
  "description": "Saturday penalty rate for casual hospitality employees",
  "plainLanguageSummary": "Casual employees in hospitality must be paid 125% of their base rate on Saturdays, plus the 25% casual loading.",
  "appliesTo": {
    "employmentStatus": ["casual"],
    "industries": ["hospitality"],
    "visaSubclasses": null,
    "ageRange": { "min": null, "max": null },
    "state": null
  },
  "threshold": {
    "type": "percentage",
    "value": 125,
    "unit": "%",
    "comparison": "gte"
  },
  "effectiveFrom": "2020-02-04",
  "effectiveTo": null,
  "status": "active"
}
```

---

## 6. Example: Superannuation Finding

### 6.1 LegalSource

```json
{
  "id": "src-sg-act-19",
  "sourceType": "FEDERAL_ACT",
  "authorityLevel": 1,
  "authorityLabel": "primary source",
  "title": "Superannuation Guarantee (Administration) Act 1992",
  "section": "Section 19",
  "url": "https://www.legislation.gov.au/Series/C2004A01003",
  "jurisdiction": "FEDERAL",
  "effectiveDate": "1992-07-01",
  "lastVerifiedAt": "2026-06-01",
  "status": "current",
  "summary": "Employers must pay superannuation guarantee for eligible employees.",
  "keyRequirements": [
    "Employers must pay superannuation guarantee for employees earning over $450 per month",
    "The superannuation guarantee rate is currently 12%",
    "Super must be paid at least quarterly"
  ]
}
```

### 6.2 LegalRequirement

```json
{
  "id": "req-sg-rate-2025",
  "sourceId": "src-sg-act-19",
  "requirementType": "SUPER_GUARANTEE",
  "description": "Superannuation guarantee rate as of 1 July 2026",
  "plainLanguageSummary": "Employers must pay 12% superannuation guarantee for employees who earn $450 or more per month (before tax).",
  "appliesTo": {
    "employmentStatus": ["full_time", "part_time", "casual"],
    "industries": ["all"],
    "visaSubclasses": null,
    "ageRange": { "min": 18, "max": null },
    "state": null
  },
  "threshold": {
    "type": "percentage",
    "value": 12,
    "unit": "%",
    "comparison": "gte"
  },
  "effectiveFrom": "2026-07-01",
  "effectiveTo": null,
  "status": "active"
}
```

---

## 7. Example: Visa Hours Limit

### 7.1 LegalSource

```json
{
  "id": "src-migration-act",
  "sourceType": "FEDERAL_ACT",
  "authorityLevel": 1,
  "authorityLabel": "primary source",
  "title": "Migration Act 1958",
  "section": "Schedule 8 - Visa conditions",
  "url": "https://www.legislation.gov.au/Series/C2004A01035",
  "jurisdiction": "FEDERAL",
  "effectiveDate": "1958-10-08",
  "lastVerifiedAt": "2026-06-01",
  "status": "current",
  "summary": "Sets conditions for visa holders including work restrictions.",
  "keyRequirements": [
    "Student visa (subclass 500) holders can work up to 48 hours per fortnight during study periods",
    "Work restrictions apply during study periods only"
  ]
}
```

### 7.2 LegalRequirement

```json
{
  "id": "req-student-visa-hours",
  "sourceId": "src-migration-act",
  "requirementType": "WORK_HOURS_LIMIT",
  "description": "Student visa work hours limit",
  "plainLanguageSummary": "Student visa (subclass 500) holders can work a maximum of 48 hours per fortnight during study periods. There are no work restrictions during scheduled course breaks.",
  "appliesTo": {
    "employmentStatus": ["full_time", "part_time", "casual"],
    "industries": ["all"],
    "visaSubclasses": ["500"],
    "ageRange": { "min": null, "max": null },
    "state": null
  },
  "threshold": {
    "type": "duration",
    "value": 48,
    "unit": "hours/fortnight",
    "comparison": "lte"
  },
  "effectiveFrom": "2023-07-01",
  "effectiveTo": null,
  "status": "active"
}
```

---

## 8. Schema Validation Rules

### 8.1 Required Fields

Every LegalSource must have:
- id, sourceType, authorityLevel
- title, section, url, jurisdiction
- effectiveDate, lastVerifiedAt, status

Every LegalRequirement must have:
- id, sourceId, requirementType
- description, plainLanguageSummary
- appliesTo, threshold
- effectiveFrom, status

Every LegalFinding must have:
- id, findingCode, title, description
- requirementIds, sourceIds
- factIds, ruleId
- findingType, confidence
- sources (at least one)

### 8.2 Referential Integrity

```
LegalRequirement.sourceId → LegalSource.id (must exist)
LegalFinding.requirementIds → LegalRequirement.id (must exist)
LegalFinding.sourceIds → LegalSource.id (must exist)
FindingSource.sourceId → LegalSource.id (must exist)
```

### 8.3 Authority Validation

```
If authorityLevel = 1:
  - sourceType must be FEDERAL_ACT, STATE_ACT, REGULATION, or DETERMINATION
  - authorityLabel must identify the source as primary

If authorityLevel = 4:
  - sourceType must be MODERN_AWARD or ENTERPRISE_AGREEMENT
  - authorityLabel must identify the source as an award or agreement
```

---

## 9. What This Schema Prevents

| Problem | Prevention |
|---------|------------|
| AI-generated legal claims | All claims must link to LegalSource |
| Outdated information | lastVerifiedAt + reviewFrequency enforced |
| Jurisdiction errors | jurisdiction field required |
| Ambiguous requirements | threshold field is specific |
| Missing citations | sources array required in Finding |

---

*Document Version: 1.0.0*
*Last Updated: 2026-06-01*
*Status: Design Phase*
