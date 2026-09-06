# Source Authority Framework

## Version: 1.0.0
## Date: 2026-06-01
## Status: Design Phase

---

## 1. Core Principle

**Every conclusion in the system must be traceable to a verifiable, authoritative source.**

The system does not generate legal opinions. It maps facts to official sources and presents the relevant guidance.

---

## 2. Source Authority Hierarchy

### 2.1 Authority Levels

| Level | Name | Description | User-facing treatment | Update Frequency |
|-------|------|-------------|-----------------------|------------------|
| 1 | Primary Legislation | Acts of Parliament, Regulations | Show as primary source | When amended |
| 2 | Regulator Guidance | Fair Work Ombudsman, ATO official guidance | Show as official guidance | Quarterly review |
| 3 | Court/Tribunal Decisions | Federal Court, Fair Work Commission decisions | Show as case/decision source | Per decision |
| 4 | Award Instruments | Modern Awards, Enterprise Agreements | Show as award/agreement source | Annual review |
| 5 | Professional Commentary | Law firm publications, legal analysis | Show only as commentary | When published |
| 6 | Community Content | Forum posts, social media | Do not use for legal conclusions | Not tracked |

Numeric trust scores must not be displayed to users or used as a substitute for
source citations. The product should show the authority label, jurisdiction,
effective date, last verification date, and source link.

### 2.2 Source Types

```typescript
enum SourceType {
  // Level 1: Primary Legislation
  FEDERAL_ACT = "federal_act",
  STATE_ACT = "state_act",
  REGULATION = "regulation",
  DETERMINATION = "determination",

  // Level 2: Regulator Guidance
  FAIR_WORK_GUIDANCE = "fair_work_guidance",
  ATO_GUIDANCE = "ato_guidance",
  SAFEWORK_GUIDANCE = "safework_guidance",
  HOME_AFFAIRS_GUIDANCE = "home_affairs_guidance",

  // Level 3: Court/Tribunal
  FEDERAL_COURT = "federal_court",
  FAIR_WORK_COMMISSION = "fair_work_commission",
  STATE_TRIBUNAL = "state_tribunal",

  // Level 4: Awards
  MODERN_AWARD = "modern_award",
  ENTERPRISE_AGREEMENT = "enterprise_agreement",

  // Level 5: Professional Commentary
  LAW_FIRM_PUBLICATION = "law_firm_publication",
  LEGAL_ANALYSIS = "legal_analysis",

  // Level 6: Community Content
  COMMUNITY_FORUM = "community_forum",
  SOCIAL_MEDIA = "social_media"
}
```

---

## 3. Source Record Structure

### 3.1 Legal Source Record

```typescript
interface LegalSource {
  // Identity
  id: string;                          // UUID
  sourceType: SourceType;

  // Authority
  authorityLevel: 1 | 2 | 3 | 4 | 5 | 6;
  authorityLabel: string;              // e.g., "primary source"

  // Reference
  title: string;                       // e.g., "Fair Work Act 2009"
  section: string;                     // e.g., "Section 284"
  url: string;                         // Direct link to source
  jurisdiction: Jurisdiction;

  // Validity
  effectiveDate: Date;                 // When this became law/guidance
  lastVerifiedAt: Date;                // When we last confirmed it's current
  expiresAt: Date | null;              // If known (e.g., temporary determination)
  status: "current" | "amended" | "repealed" | "superseded";

  // Update Tracking
  lastUpdatedAt: Date;                 // Source's last update date
  nextReviewAt: Date;                  // When we should review again
  reviewFrequency: "daily" | "weekly" | "monthly" | "quarterly" | "annually";

  // Content
  summary: string;                     // Plain language summary
  fullText: string | null;             // Full text if available
  keyRequirements: string[];           // Extracted requirements

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  verifiedBy: string | null;
}
```

### 3.2 Jurisdiction

```typescript
enum Jurisdiction {
  FEDERAL = "federal",
  NSW = "nsw",
  VIC = "vic",
  QLD = "qld",
  SA = "sa",
  WA = "wa",
  TAS = "tas",
  NT = "nt",
  ACT = "act"
}
```

---

## 4. Source Validation Rules

### 4.1 Entry Rules

| Rule | Description | Enforcement |
|------|-------------|-------------|
| No AI Sources | AI-generated content cannot be source | System rejects |
| Must Have URL | All sources must have verifiable URL | Required field |
| Must Have Date | All sources must have effective date | Required field |
| Must Have Jurisdiction | All sources must specify jurisdiction | Required field |
| Authority Level Required | All sources must have authority level | Required field |

### 4.2 Update Rules

| Rule | Description | Enforcement |
|------|-------------|-------------|
| Periodic Review | All sources reviewed per schedule | Automated |
| Link Validation | URLs checked for validity | Weekly |
| Amendment Tracking | Changes to legislation tracked | Daily for Level 1 |
| Expiry Handling | Expired sources flagged | Automated |

### 4.3 Conflict Resolution

When sources conflict:

```
1. Higher authority level wins
2. If same level, more recent wins
3. If same date, federal wins over state
4. If still ambiguous, flag for human review
```

---

## 5. Source Categories for Employment Law

### 5.1 Federal Sources

| Source | Type | Authority | Update Frequency |
|--------|------|-----------|------------------|
| Fair Work Act 2009 | Federal Act | 1 | When amended |
| Fair Work Regulations 2009 | Regulation | 1 | When amended |
| Superannuation Guarantee Act 1992 | Federal Act | 1 | When amended |
| Migration Act 1958 | Federal Act | 1 | When amended |
| Fair Work Ombudsman Guidance | Regulator | 2 | Quarterly |
| ATO Guidance | Regulator | 2 | Quarterly |
| Modern Awards | Award | 4 | Annual |

### 5.2 State Sources

| Source | Type | Authority | Update Frequency |
|--------|------|-----------|------------------|
| Work Health and Safety Acts | State Act | 1 | When amended |
| Workers Compensation Acts | State Act | 1 | When amended |
| Long Service Leave Acts | State Act | 1 | When amended |
| State Tribunal Decisions | Tribunal | 3 | Per decision |

### 5.3 Key Awards for Target Industries

| Award | Industries Covered | Authority |
|-------|-------------------|-----------|
| Hospitality Industry (General) Award 2020 | Restaurants, cafes | 4 |
| Fast Food Industry Award 2020 | Fast food, bubble tea | 4 |
| General Retail Industry Award 2020 | Retail stores | 4 |
| Storage Services and Wholesale Award 2020 | Warehousing | 4 |
| Cleaning Services Award 2020 | Cleaning | 4 |

---

## 6. Source Retrieval Process

### 6.1 How the System Uses Sources

```
User Input
    ↓
EmploymentFacts
    ↓
Rule Engine evaluates facts
    ↓
Rule triggers Finding
    ↓
Finding includes LegalSource references
    ↓
User sees Finding + Source citations
```

### 6.2 Source Display to User

Every Finding must display:

```
[Finding Name]

[Description]

Source:
- Fair Work Act 2009, Section 284
  https://www.legislation.gov.au/...
  Last verified: 2026-06-01

- Fair Work Ombudsman: Minimum Wages Guide
  https://www.fairwork.gov.au/...
  Last updated: 2026-05-15
```

### 6.3 Source Confidence

Source confidence is communicated through evidence, not decimal scores:

```
Primary source + current + human verified
Official guidance + current + human verified
Official source + review overdue
Commentary only
Not acceptable for legal conclusion
```

---

## 7. What the System Does NOT Do

| Activity | Status | Reason |
|----------|--------|--------|
| Generate legal opinions | NOT PERMITTED | System is not a lawyer |
| Interpret ambiguous law | NOT PERMITTED | Flag for human review |
| Predict court outcomes | NOT PERMITTED | Not possible |
| Give advice beyond sources | NOT PERMITTED | Only present official guidance |
| Use AI as source | NOT PERMITTED | No verifiable authority |

---

## 8. Example Source Records

### 8.1 Fair Work Act - Minimum Wage

```json
{
  "id": "src-001",
  "sourceType": "FEDERAL_ACT",
  "authorityLevel": 1,
  "authorityLabel": "primary source",
  "title": "Fair Work Act 2009",
  "section": "Section 284 - National minimum wage orders",
  "url": "https://www.legislation.gov.au/Series/C2004A00947",
  "jurisdiction": "FEDERAL",
  "effectiveDate": "2009-07-01",
  "lastVerifiedAt": "2026-06-01",
  "expiresAt": null,
  "status": "current",
  "lastUpdatedAt": "2024-07-01",
  "nextReviewAt": "2026-07-01",
  "reviewFrequency": "annually",
  "summary": "Establishes the national minimum wage, which is reviewed annually by the Fair Work Commission.",
  "keyRequirements": [
    "All employees must be paid at least the national minimum wage",
    "The national minimum wage is set by the Fair Work Commission",
    "As of 1 July 2026, the national minimum wage is $26.44 per hour"
  ],
  "createdAt": "2026-01-01",
  "updatedAt": "2026-06-01",
  "createdBy": "system",
  "verifiedBy": "legal-review"
}
```

### 8.2 Fair Work Ombudsman - Payslip Requirements

```json
{
  "id": "src-002",
  "sourceType": "FAIR_WORK_GUIDANCE",
  "authorityLevel": 2,
  "authorityLabel": "official source",
  "title": "Fair Work Ombudsman - Payslips",
  "section": "Payslip requirements",
  "url": "https://www.fairwork.gov.au/pay/payslips",
  "jurisdiction": "FEDERAL",
  "effectiveDate": "2009-07-01",
  "lastVerifiedAt": "2026-06-01",
  "expiresAt": null,
  "status": "current",
  "lastUpdatedAt": "2026-03-15",
  "nextReviewAt": "2026-09-01",
  "reviewFrequency": "quarterly",
  "summary": "Employers must provide payslips to employees within one day of payment. Payslips must contain specific information.",
  "keyRequirements": [
    "Payslips must be provided within one day of payment",
    "Payslips must show: employer name, employee name, pay period, gross and net amounts, tax withheld, superannuation contributions",
    "Failure to provide payslips is a breach of the Fair Work Act"
  ],
  "createdAt": "2026-01-01",
  "updatedAt": "2026-06-01",
  "createdBy": "system",
  "verifiedBy": "legal-review"
}
```

### 8.3 Hospitality Award - Penalty Rates

```json
{
  "id": "src-003",
  "sourceType": "MODERN_AWARD",
  "authorityLevel": 4,
  "authorityLabel": "official source",
  "title": "Hospitality Industry (General) Award 2020",
  "section": "Clause 23 - Penalty rates",
  "url": "https://www.fwc.gov.au/awards-agreements/awards/modern-awards/hospitality-industry-general-award-2020",
  "jurisdiction": "FEDERAL",
  "effectiveDate": "2020-02-04",
  "lastVerifiedAt": "2026-06-01",
  "expiresAt": null,
  "status": "current",
  "lastUpdatedAt": "2026-07-01",
  "nextReviewAt": "2026-07-01",
  "reviewFrequency": "annually",
  "summary": "Sets penalty rates for hospitality employees working evenings, weekends, and public holidays.",
  "keyRequirements": [
    "Casual employees working Monday-Friday before 7pm: base rate + 25% casual loading",
    "Casual employees working Saturday: base rate × 1.25 + 25% casual loading",
    "Casual employees working Sunday: base rate × 1.50 + 25% casual loading",
    "Casual employees working public holidays: base rate × 2.50 + 25% casual loading"
  ],
  "createdAt": "2026-01-01",
  "updatedAt": "2026-06-01",
  "createdBy": "system",
  "verifiedBy": "legal-review"
}
```

---

## 9. Source Update Architecture

### 9.1 Update Sources

| Source | Update Method | Frequency |
|--------|--------------|-----------|
| Federal Legislation | API monitoring | Daily |
| Fair Work Ombudsman | Web scraping | Weekly |
| ATO | Web scraping | Weekly |
| Modern Awards | FWC RSS | Daily |
| Court Decisions | AustLII | Daily |

### 9.2 Update Process

```
1. Monitor source for changes
2. Detect change (new version, amendment, repeal)
3. Fetch updated content
4. Compare with current version
5. If significant change:
   a. Flag for human review
   b. Update source record
   c. Review affected Rules
   d. Update affected Findings
6. Log change in audit trail
```

### 9.3 Update Notifications

```
When a source is updated:
- Affected Rules are flagged
- Affected Findings are flagged
- System administrators notified
- Review queue updated
```

---

## 10. Audit Trail

### 10.1 What is Logged

| Event | Data Logged |
|-------|-------------|
| Source added | Source record, timestamp, added by |
| Source updated | Changes, timestamp, updated by |
| Source verified | Verification result, timestamp, verified by |
| Source used in Finding | Finding ID, Source ID, timestamp |
| Source conflict detected | Conflict details, resolution |

### 10.2 Audit Record Structure

```typescript
interface SourceAuditRecord {
  id: string;
  sourceId: string;
  eventType: "added" | "updated" | "verified" | "used" | "conflict" | "expired";
  timestamp: Date;
  performedBy: string;
  details: Record<string, any>;
  previousState: Record<string, any> | null;
  newState: Record<string, any>;
}
```

---

## Appendix A: Official Source URLs

### Federal

| Source | URL |
|--------|-----|
| Fair Work Act 2009 | https://www.legislation.gov.au/Series/C2004A00947 |
| Fair Work Ombudsman | https://www.fairwork.gov.au/ |
| Fair Work Commission | https://www.fwc.gov.au/ |
| Australian Taxation Office | https://www.ato.gov.au/ |
| Department of Home Affairs | https://www.homeaffairs.gov.au/ |
| Safe Work Australia | https://www.safeworkaustralia.gov.au/ |

### Awards

| Award | URL |
|-------|-----|
| Hospitality Award 2020 | https://www.fwc.gov.au/awards-agreements/awards/modern-awards/hospitality-industry-general-award-2020 |
| Fast Food Award 2020 | https://www.fwc.gov.au/awards-agreements/awards/modern-awards/fast-food-industry-award-2020 |
| General Retail Award 2020 | https://www.fwc.gov.au/awards-agreements/awards/modern-awards/general-retail-industry-award-2020 |
| Storage Services Award 2020 | https://www.fwc.gov.au/awards-agreements/awards/modern-awards/storage-services-and-wholesale-award-2020 |
| Cleaning Services Award 2020 | https://www.fwc.gov.au/awards-agreements/awards/modern-awards/cleaning-services-award-2020 |

---

*Document Version: 1.0.0*
*Last Updated: 2026-06-01*
*Status: Design Phase*
