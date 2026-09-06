# Employment Rights Diagnostic Agent - Domain Architecture

## Version: 1.0.0
## Date: 2026-06-01
## Status: Design Phase

---

# Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Domain Model Overview](#2-domain-model-overview)
3. [EmploymentFacts Schema](#3-employmentfacts-schema)
4. [Findings Schema](#4-findings-schema)
5. [Rule Catalog Architecture](#5-rule-catalog-architecture)
6. [Interview Flow Engine](#6-interview-flow-engine)
7. [Fact Extraction Architecture](#7-fact-extraction-architecture)
8. [Database Design](#8-database-design)
9. [Future Expansion Strategy](#9-future-expansion-strategy)

---

# 1. Executive Summary

## 1.1 Purpose

This document defines the core domain architecture for an Employment Rights Diagnostic Agent targeting Australian international students and casual workers. The system helps users understand employment risks and workplace rights through conversational fact collection and rule-based analysis.

## 1.2 Target Users

| Worker Type | Typical Industries | Common Issues |
|-------------|-------------------|---------------|
| International Students | Hospitality, Retail, Cleaning | Visa restrictions, underpayment |
| Casual Workers | Food service, Warehousing | No contracts, missing payslips |
| Gig Workers | Delivery, Services | Misclassification, no super |

## 1.3 Core Challenge

Most users lack formal documentation. The system must work with:
- Verbal agreements
- Chat messages (WeChat, WhatsApp)
- Roster screenshots
- Informal payment records

**Key Principle**: All inputs must be normalized into `EmploymentFacts` - the single source of truth.

---

# 2. Domain Model Overview

## 2.1 Bounded Contexts

```
┌─────────────────────────────────────────────────────────────────┐
│                    Employment Rights Diagnostic                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │   Fact       │    │   Rule       │    │   Finding    │       │
│  │  Collection  │───▶│   Engine     │───▶│  Generation  │       │
│  │   Context    │    │   Context    │    │   Context    │       │
│  └──────────────┘    └──────────────┘    └──────────────┘       │
│         │                   │                   │               │
│         ▼                   ▼                   ▼               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │  Interview   │    │    Rule      │    │   Report     │       │
│  │   Engine     │    │   Catalog    │    │  Generation  │       │
│  └──────────────┘    └──────────────┘    └──────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 2.2 Core Aggregates

| Aggregate | Root Entity | Purpose |
|-----------|-------------|---------|
| EmploymentFacts | EmploymentFact | Single source of truth for all employment data |
| Finding | Finding | Diagnosed employment issues with evidence |
| Rule | Rule | Business rules for detecting issues |
| Interview | Interview | Conversation state and history |
| Evidence | Evidence | Supporting documentation |

## 2.3 Domain Events

```
FactExtracted
FactVerified
FactConflictDetected
RuleEvaluated
FindingGenerated
FindingSeverityUpdated
InterviewQuestionAsked
InterviewCompleted
EvidenceUploaded
```

---

# 3. EmploymentFacts Schema

## 3.1 Design Principles

1. **Completeness**: Track every known and unknown fact
2. **Confidence**: Every fact has a confidence level
3. **Source**: Every fact tracks its origin
4. **Temporality**: Facts can change over time
5. **Extensibility**: New fact types can be added

## 3.2 Employment Information

### 3.2.1 Employer Details

| Field | Purpose | Type | Source | Required | Confidence |
|-------|---------|------|--------|----------|------------|
| `employerName` | Legal trading name | String | User input, ABN lookup | Yes | High/Medium/Low |
| `employerAbn` | Australian Business Number | String (11 digits) | User input, ABR lookup | No | High/Medium/Low |
| `employerAddress` | Primary business location | Address object | User input | No | Medium/Low |
| `employerIndustry` | Industry classification | Enum | User input, inferred | No | Medium |
| `employerSize` | Employee count bracket | Enum | User input | No | Low |

### 3.2.2 Employment Relationship

| Field | Purpose | Type | Source | Required | Confidence |
|-------|---------|------|--------|----------|------------|
| `employmentStartDate` | When work began | Date | User input | Yes | High/Medium/Low |
| `employmentEndDate` | When work ended (if applicable) | Date | User input | No | High/Medium/Low |
| `employmentStatus` | Full-time/Part-time/Casual | Enum | User input | Yes | Medium |
| `employmentType` | Ongoing/Fixed-term/Casual | Enum | User input | Yes | Medium |
| `probationEndDate` | Probation period end | Date | User input | No | Medium/Low |
| `hasWrittenContract` | Contract exists | Boolean | User input | Yes | High/Medium/Low |
| `contractType` | Written/Verbal/None | Enum | User input | Yes | Medium |
| `contractLocation` | Where contract is stored | String | User input | No | Low |

### 3.2.3 Role Information

| Field | Purpose | Type | Source | Required | Confidence |
|-------|---------|------|--------|----------|------------|
| `jobTitle` | Position name | String | User input | Yes | Medium |
| `jobDuties` | Description of work | String[] | User input | No | Medium |
| `skillLevel` | Skill classification | Enum | User input | No | Low |
| `awardCoverage` | Applicable award | String | Rule engine | No | High/Medium/Low |
| `classificationLevel` | Award classification | String | Rule engine | No | Medium |

### 3.2.4 Work Schedule

| Field | Purpose | Type | Source | Required | Confidence |
|-------|---------|------|--------|----------|------------|
| `hoursPerWeek` | Typical weekly hours | Number | User input | Yes | Medium |
| `regularDays` | Usual work days | DayOfWeek[] | User input | No | Medium |
| `startTime` | Typical start time | Time | User input | No | Low |
| `endTime` | Typical end time | Time | User input | No | Low |
| `hasRegularRoster` | Consistent schedule | Boolean | User input | No | Medium |
| `rosterProvided` | Roster given in advance | Boolean | User input | No | Medium |
| `minimumShiftLength` | Shortest shift worked | Duration | User input | No | Medium |

## 3.3 Compensation Information

### 3.3.1 Base Pay

| Field | Purpose | Type | Source | Required | Confidence |
|-------|---------|------|--------|----------|------------|
| `payRate` | Hourly rate | Decimal (AUD) | User input | Yes | High/Medium/Low |
| `payRateType` | Hourly/Weekly/Salary | Enum | User input | Yes | Medium |
| `payFrequency` | Weekly/Fortnightly/Monthly | Enum | User input | Yes | Medium |
| `paymentMethod` | Cash/Bank/Mixed | Enum | User input | Yes | High/Medium/Low |
| `bankAccountUsed` | Payments to bank | Boolean | User input | No | Medium |
| `cashPaymentPercentage` | Portion paid cash | Percentage | User input | No | Medium |

### 3.3.2 Allowances

| Field | Purpose | Type | Source | Required | Confidence |
|-------|---------|------|--------|----------|------------|
| `hasAllowances` | Receives allowances | Boolean | User input | No | Medium |
| `allowanceTypes` | Types received | String[] | User input | No | Low |
| `allowanceAmounts` | Amount per type | Map<String, Decimal> | User input | No | Low |
| `travelAllowance` | Travel payment | Decimal | User input | No | Low |
| `mealAllowance` | Meal payment | Decimal | User input | No | Low |
| `uniformAllowance` | Uniform payment | Decimal | User input | No | Low |

### 3.3.3 Penalty Rates

| Field | Purpose | Type | Source | Required | Confidence |
|-------|---------|------|--------|----------|------------|
| `receivesPenaltyRates` | Gets penalty rates | Boolean | User input | Yes | Medium |
| `weekdayEveningRate` | Evening weekday rate | Decimal | User input | No | Low |
| `saturdayRate` | Saturday rate | Decimal | User input | No | Low |
| `sundayRate` | Sunday rate | Decimal | User input | No | Low |
| `publicHolidayRate` | Public holiday rate | Decimal | User input | No | Low |
| `overtimeRate` | Overtime rate | Decimal | User input | No | Low |

### 3.3.4 Deductions

| Field | Purpose | Type | Source | Required | Confidence |
|-------|---------|------|--------|----------|------------|
| `hasDeductions` | Has pay deductions | Boolean | User input | No | Medium |
| `deductionTypes` | Types of deductions | String[] | User input | No | Low |
| `deductionAmounts` | Amount per type | Map<String, Decimal> | User input | No | Low |
| `uniformDeduction` | Uniform cost | Decimal | User input | No | Low |
| `trainingDeduction` | Training cost | Decimal | User input | No | Low |

## 3.4 Payslip Information

### 3.4.1 Payslip Existence

| Field | Purpose | Type | Source | Required | Confidence |
|-------|---------|------|--------|----------|------------|
| `receivesPayslips` | Gets payslips | Boolean | User input | Yes | High/Medium/Low |
| `payslipFrequency` | How often received | Enum | User input | No | Medium |
| `payslipFormat` | Paper/Digital/Both | Enum | User input | No | Medium |
| `payslipContainsRequired` | Has all required fields | Boolean | Analysis | No | High/Medium/Low |

### 3.4.2 Payslip Content

| Field | Purpose | Type | Source | Required | Confidence |
|-------|---------|------|--------|----------|------------|
| `payslipEmployerName` | Name on payslip | String | Extraction | No | High/Medium/Low |
| `payslipAbn` | ABN on payslip | String | Extraction | No | High |
| `payslipPayPeriod` | Period covered | DateRange | Extraction | No | High/Medium/Low |
| `payslipGrossPay` | Gross amount | Decimal | Extraction | No | High/Medium/Low |
| `payslipNetPay` | Net amount | Decimal | Extraction | No | High/Medium/Low |
| `payslipTaxWithheld` | Tax withheld | Decimal | Extraction | No | High/Medium/Low |
| `payslipSuperContributions` | Super shown | Decimal | Extraction | No | High/Medium/Low |
| `payslipHoursWorked` | Hours shown | Decimal | Extraction | No | High/Medium/Low |
| `payslipLeaveBalances` | Leave shown | LeaveBalance | Extraction | No | Medium |

### 3.4.3 Payslip Compliance

| Field | Purpose | Type | Source | Required | Confidence |
|-------|---------|------|--------|----------|------------|
| `payslipMissingFields` | Required fields missing | String[] | Analysis | No | High |
| `payslipDiscrepancies` | Inconsistencies found | String[] | Analysis | No | High |
| `payslipMatchesContract` | Aligns with contract | Boolean | Analysis | No | Medium |

## 3.5 Super Information

### 3.5.1 Super Entitlement

| Field | Purpose | Type | Source | Required | Confidence |
|-------|---------|------|--------|----------|------------|
| `isSuperEntitled` | Entitled to super | Boolean | Rule engine | Yes | High |
| `superGuaranteeRate` | Expected rate (12%) | Percentage | Rule engine | Yes | High |
| `superThresholdMet` | Above $450 threshold | Boolean | Calculation | No | High |

### 3.5.2 Super Payments

| Field | Purpose | Type | Source | Required | Confidence |
|-------|---------|------|--------|----------|------------|
| `receivesSuper` | Gets super payments | Boolean | User input | Yes | High/Medium/Low |
| `superFundName` | Fund name | String | User input | No | Medium |
| `superFundAbn` | Fund ABN | String | User input | No | Low |
| `superPaymentFrequency` | How often paid | Enum | User input | No | Medium |
| `superLastPaymentDate` | Last payment date | Date | User input | No | Low |
| `superTotalPaid` | Total paid to date | Decimal | User input | No | Low |
| `superExpectedAmount` | Calculated expected | Decimal | Calculation | No | High |

### 3.5.3 Super Compliance

| Field | Purpose | Type | Source | Required | Confidence |
|-------|---------|------|--------|----------|------------|
| `superUnderpayment` | Amount underpaid | Decimal | Calculation | No | High |
| `superLatePayments` | Payments made late | Boolean | Analysis | No | Medium |
| `superNonPayment` | Payments not made | Boolean | Analysis | No | Medium |
| `superChoiceProvided` | Choice of fund offered | Boolean | User input | No | Medium |

## 3.6 Trial Shift Information

### 3.6.1 Trial Details

| Field | Purpose | Type | Source | Required | Confidence |
|-------|---------|------|--------|----------|------------|
| `hadTrialShift` | Did trial work | Boolean | User input | Yes | High/Medium/Low |
| `trialShiftDuration` | How long trial lasted | Duration | User input | No | Medium |
| `trialShiftDate` | When trial occurred | Date | User input | No | Medium |
| `trialShiftPaid` | Was trial paid | Boolean | User input | No | Medium |
| `trialShiftAmount` | Amount paid for trial | Decimal | User input | No | Low |
| `trialShiftTasks` | What work was done | String[] | User input | No | Medium |
| `trialShiftOutcome` | Hired/Not hired/Unknown | Enum | User input | No | High |

### 3.6.2 Trial Compliance

| Field | Purpose | Type | Source | Required | Confidence |
|-------|---------|------|--------|----------|------------|
| `trialShiftExcessive` | Trial too long | Boolean | Rule engine | No | Medium |
| `trialShiftUnpaid` | Trial should be paid | Boolean | Rule engine | No | Medium |
| `trialShiftProductive` | Was productive work | Boolean | Analysis | No | Medium |

## 3.7 Roster Information

### 3.7.1 Roster Details

| Field | Purpose | Type | Source | Required | Confidence |
|-------|---------|------|--------|----------|------------|
| `receivesRoster` | Gets written roster | Boolean | User input | No | Medium |
| `rosterAdvanceNotice` | Days notice given | Number | User input | No | Medium |
| `rosterChangesFrequency` | How often roster changes | Enum | User input | No | Low |
| `rosterCancelledShifts` | Shifts cancelled | Boolean | User input | No | Medium |
| `rosterCancellationNotice` | Notice for cancellations | Duration | User input | No | Low |

### 3.7.2 Roster Compliance

| Field | Purpose | Type | Source | Required | Confidence |
|-------|---------|------|--------|----------|------------|
| `rosterMinimumNotice` | Meets notice requirements | Boolean | Rule engine | No | Medium |
| `rosterCancellationCompensation` | Paid for cancelled shifts | Boolean | User input | No | Low |

## 3.8 Documentation Information

### 3.8.1 Employment Documentation

| Field | Purpose | Type | Source | Required | Confidence |
|-------|---------|------|--------|----------|------------|
| `hasContract` | Has employment contract | Boolean | User input | Yes | High/Medium/Low |
| `contractSigned` | Contract was signed | Boolean | User input | No | Medium |
| `contractCopyReceived` | Received copy | Boolean | User input | No | Medium |
| `hasPositionDescription` | Has job description | Boolean | User input | No | Medium |
| `hasLetterOfOffer` | Has offer letter | Boolean | User input | No | Medium |
| `hasEmployeeHandbook` | Has handbook | Boolean | User input | No | Low |
| `hasPolicies` | Has workplace policies | Boolean | User input | No | Low |

### 3.8.2 Documentation Compliance

| Field | Purpose | Type | Source | Required | Confidence |
|-------|---------|------|--------|----------|------------|
| `documentationComplete` | All required docs present | Boolean | Analysis | No | High |
| `documentationMissing` | Missing documents list | String[] | Analysis | No | High |
| `documentationRequested` | Docs requested from employer | Boolean | User input | No | Medium |

## 3.9 Tax Information

### 3.9.1 Tax Details

| Field | Purpose | Type | Source | Required | Confidence |
|-------|---------|------|--------|----------|------------|
| `tfnProvided` | TFN given to employer | Boolean | User input | Yes | High/Medium/Low |
| `tfnDeclarationSigned` | TFN declaration signed | Boolean | User input | No | Medium |
| `taxFreeThresholdClaimed` | Claimed tax-free threshold | Boolean | User input | No | Low |
| `taxWithheld` | Tax being withheld | Boolean | User input | No | Medium |
| `taxWithheldAmount` | Amount withheld | Decimal | User input | No | Low |
| `paygSummaryReceived` | Got PAYG summary | Boolean | User input | No | Medium |

### 3.9.2 Tax Compliance

| Field | Purpose | Type | Source | Required | Confidence |
|-------|---------|------|--------|----------|------------|
| `taxCompliant` | Meets tax obligations | Boolean | Rule engine | No | Medium |
| `taxAvoidanceRisk` | Risk of tax avoidance | Boolean | Rule engine | No | Medium |

## 3.10 Visa Information

### 3.10.1 Visa Details

| Field | Purpose | Type | Source | Required | Confidence |
|-------|---------|------|--------|----------|------------|
| `visaSubclass` | Visa subclass number | String | User input | Yes | High/Medium/Low |
| `visaExpiryDate` | Visa expiry date | Date | User input | No | Medium |
| `workRightsCondition` | Work rights condition | String | User input | No | Medium |
| `hoursLimit` | Maximum hours allowed | Number | User input | No | Medium |
| `employerRestriction` | Employer restrictions | String | User input | No | Low |

### 3.10.2 Visa Compliance

| Field | Purpose | Type | Source | Required | Confidence |
|-------|---------|------|--------|----------|------------|
| `visaWorkCompliant` | Work complies with visa | Boolean | Rule engine | No | Medium |
| `visaHoursCompliant` | Hours comply with visa | Boolean | Rule engine | No | Medium |
| `visaExpiryRisk` | Risk of visa expiry | Boolean | Rule engine | No | Medium |

## 3.11 Workplace Liability Information

### 3.11.1 Workplace Safety

| Field | Purpose | Type | Source | Required | Confidence |
|-------|---------|------|--------|----------|------------|
| `hasSafetyTraining` | Received safety training | Boolean | User input | No | Medium |
| `hasPpeProvided` | PPE provided | Boolean | User input | No | Medium |
| `hasInjuryReporting` | Injury reporting process | Boolean | User input | No | Low |
| `workplaceHazards` | Known hazards | String[] | User input | No | Low |

### 3.11.2 Workplace Incidents

| Field | Purpose | Type | Source | Required | Confidence |
|-------|---------|------|--------|----------|------------|
| `hadWorkplaceIncident` | Had an incident | Boolean | User input | No | High/Medium/Low |
| `incidentType` | Type of incident | Enum | User input | No | Medium |
| `incidentReported` | Was it reported | Boolean | User input | No | Medium |
| `incidentDate` | When it occurred | Date | User input | No | Medium |
| `incidentOutcome` | What happened | String | User input | No | Low |

### 3.11.3 Discrimination & Harassment

| Field | Purpose | Type | Source | Required | Confidence |
|-------|---------|------|--------|----------|------------|
| `experiencedDiscrimination` | Discrimination occurred | Boolean | User input | No | High/Medium/Low |
| `discriminationType` | Type of discrimination | String[] | User input | No | Medium |
| `experiencedHarassment` | Harassment occurred | Boolean | User input | No | High/Medium/Low |
| `harassmentType` | Type of harassment | String[] | User input | No | Medium |
| `experiencedBullying` | Bullying occurred | Boolean | User input | No | High/Medium/Low |

### 3.11.4 Unfair Dismissal

| Field | Purpose | Type | Source | Required | Confidence |
|-------|---------|------|--------|----------|------------|
| `wasDismissed` | Was dismissed | Boolean | User input | No | High/Medium/Low |
| `dismissalDate` | Date of dismissal | Date | User input | No | Medium |
| `dismissalReason` | Reason given | String | User input | No | Medium |
| `dismissalNoticeGiven` | Notice provided | Boolean | User input | No | Medium |
| `dismissalProcessFollowed` | Proper process used | Boolean | User input | No | Low |

## 3.12 Evidence Information

### 3.12.1 Evidence Collection

| Field | Purpose | Type | Source | Required | Confidence |
|-------|---------|------|--------|----------|------------|
| `evidenceTypes` | Types of evidence | String[] | User input | No | High |
| `evidenceCount` | Number of evidence items | Number | System | No | High |
| `evidenceCompleteness` | Coverage of facts | Percentage | System | No | High |

### 3.12.2 Evidence Details

| Field | Purpose | Type | Source | Required | Confidence |
|-------|---------|------|--------|----------|------------|
| `hasScreenshots` | Has screenshots | Boolean | User input | No | High |
| `hasMessages` | Has chat messages | Boolean | User input | No | High |
| `hasPhotos` | Has photos | Boolean | User input | No | High |
| `hasDocuments` | Has documents | Boolean | User input | No | High |
| `hasWitnesses` | Has witnesses | Boolean | User input | No | Medium |

## 3.13 Unknown/Missing Information

### 3.13.1 Fact Completeness

| Field | Purpose | Type | Source | Required | Confidence |
|-------|---------|------|--------|----------|------------|
| `unknownFacts` | Facts that are unknown | String[] | System | No | High |
| `missingCriticalFacts` | Critical gaps | String[] | System | No | High |
| `factConflicts` | Conflicting information | Conflict[] | System | No | High |
| `overallCompleteness` | Overall data completeness | Percentage | System | No | High |

### 3.13.2 Confidence Tracking

| Field | Purpose | Type | Source | Required | Confidence |
|-------|---------|------|--------|----------|------------|
| `averageConfidence` | Average confidence level | Decimal | System | No | High |
| `lowConfidenceFacts` | Facts needing verification | String[] | System | No | High |
| `verificationNeeded` | Facts requiring proof | String[] | System | No | High |

---

# 4. Findings Schema

## 4.1 Finding Structure

### 4.1.1 Core Fields

| Field | Purpose | Type | Required | Description |
|-------|---------|------|----------|-------------|
| `id` | Unique identifier | UUID | Yes | System-generated unique ID |
| `findingCode` | Short code | String (e.g., "UNDERPAY-001") | Yes | Human-readable code |
| `name` | Finding name | String | Yes | Short descriptive name |
| `description` | Detailed description | String | Yes | Full explanation of finding |
| `severity` | Severity level | Enum | Yes | CRITICAL, HIGH, MEDIUM, LOW |
| `confidence` | Confidence level | Decimal (0-1) | Yes | How certain we are |

### 4.1.2 Legal Basis

| Field | Purpose | Type | Required | Description |
|-------|---------|------|----------|-------------|
| `legalReferences` | Legal citations | LegalReference[] | Yes | Specific laws/regulations |
| `legalSummary` | Plain language summary | String | Yes | What the law says |
| `legalJurisdiction` | Jurisdiction | String | Yes | Federal/State/Territory |

**LegalReference Structure:**
```
{
  type: "ACT" | "REGULATION" | "AWARD" | "DETERMINATION" | "GUIDANCE"
  title: String
  section: String
  url: String (optional)
  description: String
}
```

### 4.1.3 Evidence

| Field | Purpose | Type | Required | Description |
|-------|---------|------|----------|-------------|
| `evidenceChecklist` | Required evidence | EvidenceItem[] | Yes | What evidence is needed |
| `evidenceCollected` | Evidence gathered | EvidenceItem[] | Yes | What we have |
| `evidenceGaps` | Missing evidence | String[] | Yes | What's still needed |

**EvidenceItem Structure:**
```
{
  type: "DOCUMENT" | "SCREENSHOT" | "MESSAGE" | "PHOTO" | "WITNESS" | "RECORD"
  description: String
  status: "REQUIRED" | "COLLECTED" | "MISSING" | "NOT_APPLICABLE"
  confidence: Decimal (0-1)
  source: String (optional)
}
```

### 4.1.4 Source Facts

| Field | Purpose | Type | Required | Description |
|-------|---------|------|----------|-------------|
| `sourceFactIds` | Contributing facts | UUID[] | Yes | Facts that triggered this finding |
| `sourceRuleId` | Rule that generated | UUID | Yes | Rule that created finding |
| `factSummary` | Summary of facts | String | Yes | Plain language fact summary |

### 4.1.5 Recommendations

| Field | Purpose | Type | Required | Description |
|-------|---------|------|----------|-------------|
| `recommendedActions` | Next steps | Action[] | Yes | What user should do |
| `urgency` | How urgent | Enum | Yes | IMMEDIATE, SOON, WHEN_POSSIBLE |
| `timeframe` | Suggested timeframe | String | Yes | When to act |

**Action Structure:**
```
{
  priority: 1-5
  action: String
  description: String
  resources: Resource[]
  estimatedTime: String
  difficulty: "EASY" | "MEDIUM" | "HARD"
}
```

### 4.1.6 Review Status

| Field | Purpose | Type | Required | Description |
|-------|---------|------|----------|-------------|
| `humanReviewRequired` | Needs human review | Boolean | Yes | Whether expert review needed |
| `reviewReason` | Why review needed | String | No | Reason for review |
| `reviewStatus` | Current status | Enum | Yes | PENDING, IN_REVIEW, COMPLETED |
| `reviewerNotes` | Reviewer comments | String | No | Expert notes |
| `reviewedAt` | Review timestamp | DateTime | No | When reviewed |

### 4.1.7 Metadata

| Field | Purpose | Type | Required | Description |
|-------|---------|------|----------|-------------|
| `createdAt` | Creation timestamp | DateTime | Yes | When finding was created |
| `updatedAt` | Last update timestamp | DateTime | Yes | When last modified |
| `version` | Schema version | Integer | Yes | For migrations |
| `tags` | Categorization tags | String[] | No | For filtering/search |
| `relatedFindingIds` | Related findings | UUID[] | No | Connected findings |

## 4.2 Finding Lifecycle

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Generated  │───▶│  Pending    │───▶│  In Review  │───▶│  Completed  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                          │                   │                   │
                          ▼                   ▼                   ▼
                    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
                    │  Dismissed  │    │  Escalated  │    │  Resolved   │
                    └─────────────┘    └─────────────┘    └─────────────┘
```

## 4.3 Severity Levels

| Level | Criteria | User Impact | Action Required |
|-------|----------|-------------|-----------------|
| **CRITICAL** | Immediate financial/legal harm | High financial loss, legal risk | Immediate action required |
| **HIGH** | Significant rights violation | Substantial underpayment, major breach | Action within 1 week |
| **MEDIUM** | Notable compliance issue | Moderate impact, common issue | Action within 1 month |
| **LOW** | Minor issue or best practice | Small impact, improvement opportunity | When convenient |

## 4.4 Example Finding

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "findingCode": "UNDERPAY-001",
  "name": "Below Minimum Wage",
  "description": "Your hourly rate of $18.00 is below the national minimum wage of $23.23 per hour.",
  "severity": "CRITICAL",
  "confidence": 0.95,
  "legalReferences": [
    {
      "type": "ACT",
      "title": "Fair Work Act 2009",
      "section": "Section 284",
      "url": "https://www.legislation.gov.au/Series/C2004A00947",
      "description": "National minimum wage orders"
    }
  ],
  "legalSummary": "Australian law requires all employees to be paid at least the national minimum wage.",
  "legalJurisdiction": "Federal",
  "evidenceChecklist": [
    {
      "type": "DOCUMENT",
      "description": "Employment contract showing pay rate",
      "status": "MISSING",
      "confidence": 0.0
    },
    {
      "type": "DOCUMENT",
      "description": "Payslip showing hourly rate",
      "status": "COLLECTED",
      "confidence": 0.9
    }
  ],
  "evidenceCollected": [],
  "evidenceGaps": ["Employment contract", "Written pay agreement"],
  "sourceFactIds": ["fact-001", "fact-002"],
  "sourceRuleId": "rule-001",
  "factSummary": "User reports earning $18.00 per hour, working 20 hours per week.",
  "recommendedActions": [
    {
      "priority": 1,
      "action": "Calculate underpayment amount",
      "description": "Calculate how much you are owed based on hours worked",
      "resources": [
        {
          "title": "Fair Work Pay Calculator",
          "url": "https://calculate.fairwork.gov.au/",
          "type": "TOOL"
        }
      ],
      "estimatedTime": "15 minutes",
      "difficulty": "EASY"
    }
  ],
  "urgency": "IMMEDIATE",
  "timeframe": "Act within 1 week",
  "humanReviewRequired": false,
  "reviewStatus": "PENDING",
  "createdAt": "2026-06-01T10:00:00Z",
  "updatedAt": "2026-06-01T10:00:00Z",
  "version": 1,
  "tags": ["wage", "underpayment", "critical"]
}
```

---

# 5. Rule Catalog Architecture

## 5.1 Design Principles

1. **Data-Driven**: Rules stored as data, not code
2. **Versioned**: All rules have version history
3. **Extensible**: New rules added without code changes
4. **Auditable**: Full change history tracked
5. **Testable**: Rules can be unit tested independently

## 5.2 Rule Structure

### 5.2.1 Core Fields

| Field | Purpose | Type | Required | Description |
|-------|---------|------|----------|-------------|
| `id` | Unique identifier | UUID | Yes | System-generated |
| `ruleCode` | Short code | String (e.g., "WAGE-001") | Yes | Human-readable code |
| `name` | Rule name | String | Yes | Short descriptive name |
| `description` | Detailed description | String | Yes | What rule checks |
| `category` | Rule category | Enum | Yes | Category classification |
| `version` | Version number | Integer | Yes | Current version |
| `status` | Rule status | Enum | Yes | ACTIVE, DEPRECATED, DRAFT |

### 5.2.2 Conditions

| Field | Purpose | Type | Required | Description |
|-------|---------|------|----------|-------------|
| `conditions` | Evaluation conditions | Condition[] | Yes | When rule triggers |
| `logicOperator` | Condition logic | Enum | Yes | AND, OR |
| `priority` | Evaluation order | Integer | Yes | Higher = first |

**Condition Structure:**
```
{
  factField: String          // Field path in EmploymentFacts
  operator: Enum            // EQ, NEQ, GT, LT, GTE, LTE, IN, NOT_IN, EXISTS, NOT_EXISTS, CONTAINS
  value: Any                // Comparison value
  confidenceThreshold: Decimal  // Minimum confidence required
}
```

### 5.2.3 Fact Dependencies

| Field | Purpose | Type | Required | Description |
|-------|---------|------|----------|-------------|
| `requiredFacts` | Must have facts | String[] | Yes | Facts needed to evaluate |
| `optionalFacts` | Nice to have facts | String[] | No | Facts that improve accuracy |
| `factConfidenceMinimum` | Minimum confidence | Decimal | Yes | Required fact confidence |

### 5.2.4 Finding Production

| Field | Purpose | Type | Required | Description |
|-------|---------|------|----------|-------------|
| `findingTemplate` | Finding template | FindingTemplate | Yes | What finding to create |
| `severityCalculation` | How severity is set | SeverityRule | Yes | How severity determined |
| `confidenceCalculation` | How confidence is set | ConfidenceRule | Yes | How confidence determined |

**FindingTemplate:**
```
{
  findingCode: String
  nameTemplate: String        // Supports {{variable}} interpolation
  descriptionTemplate: String
  legalReferences: LegalReference[]
  recommendedActions: Action[]
}
```

### 5.2.5 Legal References

| Field | Purpose | Type | Required | Description |
|-------|---------|------|----------|-------------|
| `legalReferences` | Legal citations | LegalReference[] | Yes | Supporting legislation |
| `legalSummary` | Plain language | String | Yes | What law says |
| `lastReviewed` | Last review date | Date | Yes | When reviewed |

### 5.2.6 Evidence Requirements

| Field | Purpose | Type | Required | Description |
|-------|---------|------|----------|-------------|
| `requiredEvidence` | Evidence needed | EvidenceRequirement[] | Yes | What evidence required |
| `evidenceWeight` | Evidence importance | Map<String, Decimal> | No | How evidence affects confidence |

### 5.2.7 Metadata

| Field | Purpose | Type | Required | Description |
|-------|---------|------|----------|-------------|
| `createdAt` | Creation timestamp | DateTime | Yes | When created |
| `updatedAt` | Last update timestamp | DateTime | Yes | When modified |
| `createdBy` | Creator | String | Yes | Who created |
| `approvedBy` | Approver | String | No | Who approved |
| `approvedAt` | Approval timestamp | DateTime | No | When approved |
| `changeLog` | Change history | ChangeEntry[] | Yes | All changes |

## 5.3 Rule Categories

| Category | Description | Example Rules |
|----------|-------------|---------------|
| `WAGE` | Wage and pay rules | Minimum wage, penalty rates |
| `SUPER` | Superannuation rules | SG rate, eligibility |
| `LEAVE` | Leave entitlements | Annual leave, sick leave |
| `HOURS` | Working hours rules | Maximum hours, breaks |
| `CONTRACT` | Contract requirements | Written terms, notice |
| `SAFETY` | Workplace safety | PPE, training |
| `DISCRIMINATION` | Discrimination rules | Protected attributes |
| `VISA` | Visa compliance | Work rights, hours |
| `TAX` | Tax obligations | TFN, PAYG |
| `DOCUMENTATION` | Documentation rules | Payslips, records |

## 5.4 Rule Versioning

### 5.4.1 Version Control

```
Rule Version History:
┌─────────────────────────────────────────────────────────────┐
│  Version 1.0 (2026-01-01) - Initial release                │
│  Version 1.1 (2026-03-15) - Updated minimum wage rate      │
│  Version 2.0 (2026-06-01) - Major revision for new law     │
└─────────────────────────────────────────────────────────────┘
```

### 5.4.2 Change Types

| Type | Description | Impact |
|------|-------------|--------|
| `MINOR` | Bug fixes, clarifications | No behavior change |
| `MAJOR` | New conditions, different outcome | Behavior change |
| `BREAKING` | Different structure | Migration required |

### 5.4.3 Legal Update Process

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Law Change │───▶│  Review     │───▶│  Update     │───▶│  Deploy     │
│  Detected   │    │  Required   │    │  Rules      │    │  Version    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## 5.5 Example Rules

### 5.5.1 Under Award Wage Rule

```json
{
  "id": "rule-001",
  "ruleCode": "WAGE-001",
  "name": "Under Award Wage",
  "description": "Detects if employee is paid below the applicable award rate",
  "category": "WAGE",
  "version": 1,
  "status": "ACTIVE",
  "conditions": [
    {
      "factField": "payRate",
      "operator": "LT",
      "value": "{{awardMinimumRate}}",
      "confidenceThreshold": 0.7
    },
    {
      "factField": "employmentStatus",
      "operator": "IN",
      "value": ["FULL_TIME", "PART_TIME", "CASUAL"],
      "confidenceThreshold": 0.8
    }
  ],
  "logicOperator": "AND",
  "priority": 100,
  "requiredFacts": ["payRate", "employmentStatus", "awardCoverage"],
  "optionalFacts": ["classificationLevel", "skillLevel"],
  "factConfidenceMinimum": 0.7,
  "findingTemplate": {
    "findingCode": "UNDERPAY-001",
    "nameTemplate": "Below {{awardName}} Minimum Rate",
    "descriptionTemplate": "Your hourly rate of ${{payRate}} is below the {{awardName}} minimum rate of ${{awardMinimumRate}}.",
    "legalReferences": [
      {
        "type": "ACT",
        "title": "Fair Work Act 2009",
        "section": "Section 284",
        "description": "National minimum wage orders"
      }
    ],
    "recommendedActions": [
      {
        "priority": 1,
        "action": "Calculate underpayment",
        "description": "Use Fair Work Pay Calculator to determine owed amount"
      }
    ]
  },
  "severityCalculation": {
    "method": "PERCENTAGE_BELOW",
    "thresholds": {
      "CRITICAL": 0.20,
      "HIGH": 0.10,
      "MEDIUM": 0.05,
      "LOW": 0.0
    }
  },
  "confidenceCalculation": {
    "method": "WEIGHTED_AVERAGE",
    "weights": {
      "payRate": 0.4,
      "employmentStatus": 0.3,
      "awardCoverage": 0.3
    }
  },
  "legalReferences": [
    {
      "type": "ACT",
      "title": "Fair Work Act 2009",
      "section": "Section 284",
      "url": "https://www.legislation.gov.au/Series/C2004A00947",
      "description": "National minimum wage orders"
    },
    {
      "type": "AWARD",
      "title": "General Retail Industry Award 2020",
      "section": "Schedule B",
      "description": "Minimum rates for retail employees"
    }
  ],
  "legalSummary": "All employees must be paid at least the national minimum wage or their applicable award rate, whichever is higher.",
  "lastReviewed": "2026-06-01",
  "requiredEvidence": [
    {
      "type": "DOCUMENT",
      "description": "Employment contract showing pay rate",
      "required": true
    },
    {
      "type": "DOCUMENT",
      "description": "Payslip showing hourly rate",
      "required": true
    }
  ],
  "createdAt": "2026-01-01T00:00:00Z",
  "updatedAt": "2026-06-01T00:00:00Z",
  "createdBy": "system",
  "approvedBy": "legal-team",
  "approvedAt": "2026-01-15T00:00:00Z",
  "changeLog": [
    {
      "version": 1,
      "date": "2026-01-01",
      "author": "system",
      "description": "Initial rule creation"
    }
  ]
}
```

### 5.5.2 Missing Payslip Rule

```json
{
  "id": "rule-002",
  "ruleCode": "DOC-001",
  "name": "Missing Payslip",
  "description": "Detects if employer is not providing payslips",
  "category": "DOCUMENTATION",
  "version": 1,
  "status": "ACTIVE",
  "conditions": [
    {
      "factField": "receivesPayslips",
      "operator": "EQ",
      "value": false,
      "confidenceThreshold": 0.8
    }
  ],
  "logicOperator": "AND",
  "priority": 90,
  "requiredFacts": ["receivesPayslips"],
  "optionalFacts": ["payslipFrequency", "payslipFormat"],
  "factConfidenceMinimum": 0.8,
  "findingTemplate": {
    "findingCode": "DOC-001",
    "nameTemplate": "Missing Payslips",
    "descriptionTemplate": "Your employer is not providing payslips as required by law.",
    "legalReferences": [
      {
        "type": "ACT",
        "title": "Fair Work Act 2009",
        "section": "Section 536",
        "description": "Requirement to keep employee records and give payslips"
      }
    ],
    "recommendedActions": [
      {
        "priority": 1,
        "action": "Request payslips in writing",
        "description": "Send written request to employer for payslips"
      }
    ]
  },
  "severityCalculation": {
    "method": "FIXED",
    "severity": "HIGH"
  },
  "confidenceCalculation": {
    "method": "FACT_CONFIDENCE",
    "minimumConfidence": 0.8
  },
  "legalReferences": [
    {
      "type": "ACT",
      "title": "Fair Work Act 2009",
      "section": "Section 536",
      "url": "https://www.legislation.gov.au/Series/C2004A00947",
      "description": "Requirement to keep employee records and give payslips"
    }
  ],
  "legalSummary": "Employers must provide payslips to employees within one day of payment.",
  "lastReviewed": "2026-06-01",
  "requiredEvidence": [
    {
      "type": "DOCUMENT",
      "description": "Payslips received",
      "required": false
    },
    {
      "type": "MESSAGE",
      "description": "Request for payslips",
      "required": false
    }
  ],
  "createdAt": "2026-01-01T00:00:00Z",
  "updatedAt": "2026-06-01T00:00:00Z",
  "createdBy": "system",
  "approvedBy": "legal-team",
  "approvedAt": "2026-01-15T00:00:00Z",
  "changeLog": []
}
```

### 5.5.3 Missing Super Rule

```json
{
  "id": "rule-003",
  "ruleCode": "SUPER-001",
  "name": "Missing Superannuation",
  "description": "Detects if employer is not paying superannuation guarantee",
  "category": "SUPER",
  "version": 1,
  "status": "ACTIVE",
  "conditions": [
    {
      "factField": "isSuperEntitled",
      "operator": "EQ",
      "value": true,
      "confidenceThreshold": 0.9
    },
    {
      "factField": "receivesSuper",
      "operator": "EQ",
      "value": false,
      "confidenceThreshold": 0.8
    }
  ],
  "logicOperator": "AND",
  "priority": 95,
  "requiredFacts": ["isSuperEntitled", "receivesSuper"],
  "optionalFacts": ["superFundName", "superPaymentFrequency"],
  "factConfidenceMinimum": 0.8,
  "findingTemplate": {
    "findingCode": "SUPER-001",
    "nameTemplate": "Missing Superannuation Payments",
    "descriptionTemplate": "Your employer is not paying the required superannuation guarantee of {{superGuaranteeRate}}%.",
    "legalReferences": [
      {
        "type": "ACT",
        "title": "Superannuation Guarantee (Administration) Act 1992",
        "section": "Section 19",
        "description": "Requirement to pay superannuation guarantee"
      }
    ],
    "recommendedActions": [
      {
        "priority": 1,
        "action": "Report to ATO",
        "description": "Report unpaid super to the Australian Taxation Office"
      }
    ]
  },
  "severityCalculation": {
    "method": "FIXED",
    "severity": "CRITICAL"
  },
  "confidenceCalculation": {
    "method": "WEIGHTED_AVERAGE",
    "weights": {
      "isSuperEntitled": 0.5,
      "receivesSuper": 0.5
    }
  },
  "legalReferences": [
    {
      "type": "ACT",
      "title": "Superannuation Guarantee (Administration) Act 1992",
      "section": "Section 19",
      "url": "https://www.legislation.gov.au/Series/C2004A01003",
      "description": "Requirement to pay superannuation guarantee"
    }
  ],
  "legalSummary": "Employers must pay 12% superannuation guarantee for employees earning over $450 per month.",
  "lastReviewed": "2026-06-01",
  "requiredEvidence": [
    {
      "type": "DOCUMENT",
      "description": "Super statements showing contributions",
      "required": false
    },
    {
      "type": "DOCUMENT",
      "description": "Payslip showing super contributions",
      "required": false
    }
  ],
  "createdAt": "2026-01-01T00:00:00Z",
  "updatedAt": "2026-06-01T00:00:00Z",
  "createdBy": "system",
  "approvedBy": "legal-team",
  "approvedAt": "2026-01-15T00:00:00Z",
  "changeLog": []
}
```

### 5.5.4 Unpaid Trial Shift Rule

```json
{
  "id": "rule-004",
  "ruleCode": "WAGE-002",
  "name": "Unpaid Trial Shift",
  "description": "Detects if trial shift was unpaid when it should have been paid",
  "category": "WAGE",
  "version": 1,
  "status": "ACTIVE",
  "conditions": [
    {
      "factField": "hadTrialShift",
      "operator": "EQ",
      "value": true,
      "confidenceThreshold": 0.8
    },
    {
      "factField": "trialShiftPaid",
      "operator": "EQ",
      "value": false,
      "confidenceThreshold": 0.8
    },
    {
      "factField": "trialShiftDuration",
      "operator": "GT",
      "value": "PT1H",
      "confidenceThreshold": 0.7
    }
  ],
  "logicOperator": "AND",
  "priority": 85,
  "requiredFacts": ["hadTrialShift", "trialShiftPaid", "trialShiftDuration"],
  "optionalFacts": ["trialShiftTasks", "trialShiftOutcome"],
  "factConfidenceMinimum": 0.7,
  "findingTemplate": {
    "findingCode": "WAGE-002",
    "nameTemplate": "Unpaid Trial Shift",
    "descriptionTemplate": "Your {{trialShiftDuration}} trial shift should have been paid.",
    "legalReferences": [
      {
        "type": "GUIDANCE",
        "title": "Fair Work Ombudsman Guidance",
        "section": "Trial shifts",
        "description": "Guidance on payment for trial shifts"
      }
    ],
    "recommendedActions": [
      {
        "priority": 1,
        "action": "Request payment for trial",
        "description": "Request payment for hours worked during trial"
      }
    ]
  },
  "severityCalculation": {
    "method": "DURATION_BASED",
    "thresholds": {
      "HIGH": "PT4H",
      "MEDIUM": "PT2H",
      "LOW": "PT1H"
    }
  },
  "confidenceCalculation": {
    "method": "WEIGHTED_AVERAGE",
    "weights": {
      "hadTrialShift": 0.3,
      "trialShiftPaid": 0.4,
      "trialShiftDuration": 0.3
    }
  },
  "legalReferences": [
    {
      "type": "GUIDANCE",
      "title": "Fair Work Ombudsman Guidance",
      "section": "Trial shifts",
      "url": "https://www.fairwork.gov.au/",
      "description": "Guidance on payment for trial shifts"
    }
  ],
  "legalSummary": "Trial shifts that involve productive work should generally be paid at the minimum rate.",
  "lastReviewed": "2026-06-01",
  "requiredEvidence": [
    {
      "type": "WITNESS",
      "description": "Witness to trial shift",
      "required": false
    },
    {
      "type": "MESSAGE",
      "description": "Communication about trial",
      "required": false
    }
  ],
  "createdAt": "2026-01-01T00:00:00Z",
  "updatedAt": "2026-06-01T00:00:00Z",
  "createdBy": "system",
  "approvedBy": "legal-team",
  "approvedAt": "2026-01-15T00:00:00Z",
  "changeLog": []
}
```

### 5.5.5 Cash Payment Risk Rule

```json
{
  "id": "rule-005",
  "ruleCode": "TAX-001",
  "name": "Cash Payment Risk",
  "description": "Detects if employee is being paid primarily in cash, indicating potential tax avoidance",
  "category": "TAX",
  "version": 1,
  "status": "ACTIVE",
  "conditions": [
    {
      "factField": "cashPaymentPercentage",
      "operator": "GT",
      "value": 0.5,
      "confidenceThreshold": 0.7
    },
    {
      "factField": "tfnProvided",
      "operator": "EQ",
      "value": false,
      "confidenceThreshold": 0.8
    }
  ],
  "logicOperator": "OR",
  "priority": 80,
  "requiredFacts": ["cashPaymentPercentage"],
  "optionalFacts": ["tfnProvided", "taxWithheld", "paygSummaryReceived"],
  "factConfidenceMinimum": 0.7,
  "findingTemplate": {
    "findingCode": "TAX-001",
    "nameTemplate": "Cash Payment Risk",
    "descriptionTemplate": "Being paid primarily in cash ({{cashPaymentPercentage}}%) may indicate tax avoidance.",
    "legalReferences": [
      {
        "type": "ACT",
        "title": "Income Tax Assessment Act 1997",
        "section": "Section 6-5",
        "description": "Income from employment"
      }
    ],
    "recommendedActions": [
      {
        "priority": 1,
        "action": "Request bank payments",
        "description": "Request all payments be made to bank account"
      },
      {
        "priority": 2,
        "action": "Provide TFN",
        "description": "Provide Tax File Number to employer"
      }
    ]
  },
  "severityCalculation": {
    "method": "PERCENTAGE_BASED",
    "thresholds": {
      "HIGH": 0.8,
      "MEDIUM": 0.5,
      "LOW": 0.3
    }
  },
  "confidenceCalculation": {
    "method": "FACT_CONFIDENCE",
    "minimumConfidence": 0.7
  },
  "legalReferences": [
    {
      "type": "ACT",
      "title": "Income Tax Assessment Act 1997",
      "section": "Section 6-5",
      "url": "https://www.legislation.gov.au/Series/C2004A01035",
      "description": "Income from employment"
    },
    {
      "type": "ACT",
      "title": "Taxation Administration Act 1953",
      "section": "Section 16-140",
      "description": "Obligation to withhold tax"
    }
  ],
  "legalSummary": "Employers must withhold tax from payments and provide payment summaries. Cash payments without proper records may indicate tax avoidance.",
  "lastReviewed": "2026-06-01",
  "requiredEvidence": [
    {
      "type": "DOCUMENT",
      "description": "Payment records or payslips",
      "required": false
    },
    {
      "type": "DOCUMENT",
      "description": "Bank statements showing deposits",
      "required": false
    }
  ],
  "createdAt": "2026-01-01T00:00:00Z",
  "updatedAt": "2026-06-01T00:00:00Z",
  "createdBy": "system",
  "approvedBy": "legal-team",
  "approvedAt": "2026-01-15T00:00:00Z",
  "changeLog": []
}
```

## 5.6 Rule Storage Design

### 5.6.1 Database Schema

```sql
-- Rules table
CREATE TABLE rules (
  id UUID PRIMARY KEY,
  rule_code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  version INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL,
  conditions JSONB NOT NULL,
  logic_operator VARCHAR(3) NOT NULL,
  priority INTEGER NOT NULL,
  required_facts TEXT[] NOT NULL,
  optional_facts TEXT[],
  fact_confidence_minimum DECIMAL(3,2) NOT NULL,
  finding_template JSONB NOT NULL,
  severity_calculation JSONB NOT NULL,
  confidence_calculation JSONB NOT NULL,
  legal_references JSONB NOT NULL,
  legal_summary TEXT NOT NULL,
  last_reviewed DATE NOT NULL,
  required_evidence JSONB NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  created_by VARCHAR(100) NOT NULL,
  approved_by VARCHAR(100),
  approved_at TIMESTAMP
);

-- Rule versions table
CREATE TABLE rule_versions (
  id UUID PRIMARY KEY,
  rule_id UUID NOT NULL,
  version INTEGER NOT NULL,
  change_type VARCHAR(20) NOT NULL,
  change_description TEXT NOT NULL,
  changed_by VARCHAR(100) NOT NULL,
  changed_at TIMESTAMP NOT NULL,
  snapshot JSONB NOT NULL,
  FOREIGN KEY (rule_id) REFERENCES rules(id)
);

-- Rule tags table
CREATE TABLE rule_tags (
  rule_id UUID NOT NULL,
  tag VARCHAR(50) NOT NULL,
  PRIMARY KEY (rule_id, tag),
  FOREIGN KEY (rule_id) REFERENCES rules(id)
);
```

### 5.6.2 Versioning Strategy

1. **Immutable Snapshots**: Each version stores complete rule state
2. **Change Tracking**: All modifications logged with reason
3. **Approval Workflow**: Changes require approval before activation
4. **Rollback Capability**: Can revert to any previous version

---

# 6. Interview Flow Engine

## 6.1 Design Philosophy

The interview engine is a **fact collection system**, not a chatbot. Its goal is to:
1. Identify missing facts
2. Ask the most valuable question
3. Minimize total questions
4. Support multiple languages

## 6.2 Question Model

### 6.2.1 Question Structure

| Field | Purpose | Type | Required | Description |
|-------|---------|------|----------|-------------|
| `id` | Unique identifier | UUID | Yes | System-generated |
| `questionCode` | Short code | String | Yes | Human-readable code |
| `category` | Question category | Enum | Yes | Category classification |
| `priority` | Importance | Integer | Yes | Higher = more important |
| `factTargets` | Facts this question fills | String[] | Yes | EmploymentFacts fields |

### 6.2.2 Question Content

| Field | Purpose | Type | Required | Description |
|-------|---------|------|----------|-------------|
| `questionText` | Question in English | String | Yes | Primary question text |
| `questionTextZh` | Question in Chinese | String | No | Chinese translation |
| `questionTextMixed` | Mixed language version | String | No | Mixed language version |
| `contextText` | Why we're asking | String | No | Explanation for user |
| `contextTextZh` | Chinese context | String | No | Chinese context |
| `examples` | Example answers | String[] | No | Help user understand |
| `examplesZh` | Chinese examples | String[] | No | Chinese examples |

### 6.2.3 Answer Handling

| Field | Purpose | Type | Required | Description |
|-------|---------|------|----------|-------------|
| `answerType` | Expected answer type | Enum | Yes | BOOLEAN, NUMBER, TEXT, ENUM, DATE |
| `answerOptions` | Predefined options | Option[] | No | For ENUM type |
| `validationRules` | Answer validation | ValidationRule[] | No | How to validate |
| `followUpQuestions` | Conditional follow-ups | FollowUp[] | No | Next questions based on answer |

### 6.2.4 Decision Logic

| Field | Purpose | Type | Required | Description |
|-------|---------|------|----------|-------------|
| `skipConditions` | When to skip | Condition[] | No | When not to ask |
| `dependencies` | Required facts | String[] | No | Facts needed first |
| `confidenceImpact` | How answer affects confidence | Decimal | No | Confidence boost |
| `informationGain` | Expected information gain | Decimal | No | How valuable this question is |

## 6.3 Decision Model

### 6.3.1 Question Selection Algorithm

```
Input:
  - Current EmploymentFacts state
  - Missing facts list
  - Question catalog
  - User language preference

Process:
  1. Filter questions where:
     - All dependencies are satisfied
     - Skip conditions are not met
     - Fact targets are still missing

  2. Calculate priority score for each question:
     priorityScore = basePriority * informationGain * (1 - currentConfidence)

  3. Select question with highest priority score

Output:
  - Next question to ask
```

### 6.3.2 Information Gain Calculation

```
informationGain = sum(
  factImportance * (1 - currentConfidence) * factDependencyCount
) for each fact in question.factTargets
```

Where:
- `factImportance`: Weight based on how critical the fact is
- `currentConfidence`: Current confidence level (0-1)
- `factDependencyCount`: Number of rules that depend on this fact

### 6.3.3 Adaptive Questioning

```
If user provides multiple facts in one answer:
  1. Extract all facts from answer
  2. Update EmploymentFacts
  3. Recalculate missing facts
  4. Skip questions that are now answered
  5. Select next most valuable question

If user provides ambiguous answer:
  1. Ask clarifying question
  2. Provide examples
  3. Offer "I don't know" option
```

## 6.4 Fact Completion Model

### 6.4.1 Completeness Tracking

```
Fact Completeness = (
  (criticalFactsAnswered / totalCriticalFacts) * 0.6 +
  (importantFactsAnswered / totalImportantFacts) * 0.3 +
  (optionalFactsAnswered / totalOptionalFacts) * 0.1
) * 100
```

### 6.4.2 Fact Categories

| Category | Weight | Examples |
|----------|--------|----------|
| Critical | 0.6 | Pay rate, employment status, hours |
| Important | 0.3 | Employer details, super, payslips |
| Optional | 0.1 | Workplace incidents, discrimination |

### 6.4.3 Confidence Aggregation

```
overallConfidence = weighted_average(
  fact.confidence * fact.importance
) for each known fact
```

## 6.5 Interview State Model

### 6.5.1 State Structure

| Field | Purpose | Type | Required | Description |
|-------|---------|------|----------|-------------|
| `interviewId` | Unique identifier | UUID | Yes | System-generated |
| `userId` | User identifier | String | Yes | Anonymous user ID |
| `status` | Interview status | Enum | Yes | Current state |
| `language` | User language | Enum | Yes | EN, ZH, MIXED |
| `startedAt` | Start timestamp | DateTime | Yes | When started |
| `completedAt` | Completion timestamp | DateTime | No | When completed |
| `currentPhase` | Current phase | Enum | Yes | What we're asking about |

### 6.5.2 Fact State

| Field | Purpose | Type | Required | Description |
|-------|---------|------|----------|-------------|
| `factsCollected` | Facts gathered | Map<String, FactValue> | Yes | Current facts |
| `factsConfidence` | Confidence levels | Map<String, Decimal> | Yes | Confidence per fact |
| `factsSources` | Fact sources | Map<String, String> | Yes | Where facts came from |
| `missingFacts` | Facts not yet known | String[] | Yes | Still need to collect |
| `conflictingFacts` | Conflicting facts | Conflict[] | No | Facts that disagree |

### 6.5.3 Conversation State

| Field | Purpose | Type | Required | Description |
|-------|---------|------|----------|-------------|
| `questionHistory` | Questions asked | QuestionEntry[] | Yes | All questions and answers |
| `currentQuestion` | Current question | String | No | What we're asking now |
| `questionCount` | Questions asked | Integer | Yes | Total questions asked |
| `turnCount` | Conversation turns | Integer | Yes | Total turns |

### 6.5.4 Interview Phases

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Basic Info │───▶│  Employment │───▶│ Compensation│───▶│  Compliance │
│             │    │  Details    │    │   Details   │    │   Check     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                  │                  │                  │
       ▼                  ▼                  ▼                  ▼
  ┌─────────┐        ┌─────────┐        ┌─────────┐        ┌─────────┐
  │ Visa    │        │ Employer│        │ Pay     │        │ Super   │
  │ Status  │        │ Details │        │ Details │        │ Details │
  └─────────┘        └─────────┘        └─────────┘        └─────────┘
```

## 6.6 Stopping Conditions

### 6.6.1 Natural Stopping Points

| Condition | Threshold | Action |
|-----------|-----------|--------|
| Critical facts complete | 100% | Can proceed to analysis |
| High confidence achieved | >= 0.8 | Can proceed with warnings |
| Minimum facts collected | >= 70% | Can proceed with gaps |
| Question limit reached | >= 20 questions | Stop and analyze |

### 6.6.2 Early Termination

| Condition | Reason | Action |
|-----------|--------|--------|
| User frustration detected | Repeated "I don't know" | Offer to analyze with what we have |
| User requests stop | User explicitly stops | Analyze current state |
| Timeout | 30 minutes inactive | Save state, offer to continue |

## 6.7 Confidence Thresholds

### 6.7.1 Fact Confidence Levels

| Level | Score | Meaning | Source Reliability |
|-------|-------|---------|-------------------|
| High | 0.8-1.0 | Very reliable | Document, verified |
| Medium | 0.5-0.7 | Somewhat reliable | User input, unverified |
| Low | 0.0-0.4 | Uncertain | Inferred, guessed |

### 6.7.2 Overall Confidence

| Level | Score | Meaning | Action |
|-------|-------|---------|--------|
| High | >= 0.8 | Reliable analysis | Proceed with confidence |
| Medium | 0.5-0.7 | Uncertain analysis | Proceed with caveats |
| Low | < 0.5 | Unreliable analysis | Request more information |

## 6.8 Language Support

### 6.8.1 Language Detection

```
Input: User message

Process:
  1. Detect primary language (EN, ZH, MIXED)
  2. If MIXED, identify dominant language
  3. Update interview language preference
  4. Select appropriate question template

Output:
  - Detected language
  - Confidence score
```

### 6.8.2 Mixed Language Handling

```
Example: "I work at restaurant, 每周工作20小时"

Extraction:
  - work_location: "restaurant"
  - hours_per_week: 20

Strategy:
  - Extract facts from both languages
  - Normalize to EmploymentFacts
  - Respond in detected dominant language
```

### 6.8.3 Question Selection by Language

```
If language == "EN":
  Use questionText

If language == "ZH":
  Use questionTextZh if available
  Else use questionText

If language == "MIXED":
  Use questionTextMixed if available
  Else use questionTextZh if available
  Else use questionText
```

## 6.9 Interview Examples

### 6.9.1 Basic Interview Flow

```
Phase 1: Basic Information
├── Q1: "What type of work do you do?" (Category: Employment)
│   └── Answer: "Restaurant worker"
├── Q2: "How long have you been working there?" (Category: Employment)
│   └── Answer: "6 months"
└── Q3: "What is your visa status?" (Category: Visa)
    └── Answer: "Student visa"

Phase 2: Employment Details
├── Q4: "Do you have an employment contract?" (Category: Documentation)
│   └── Answer: "No"
├── Q5: "How many hours do you work per week?" (Category: Hours)
│   └── Answer: "25 hours"
└── Q6: "What days do you usually work?" (Category: Hours)
    └── Answer: "Monday to Friday"

Phase 3: Compensation Details
├── Q7: "What is your hourly rate?" (Category: Compensation)
│   └── Answer: "$18 per hour"
├── Q8: "How are you paid?" (Category: Compensation)
│   └── Answer: "Cash"
└── Q9: "Do you receive penalty rates?" (Category: Compensation)
    └── Answer: "No"

Phase 4: Compliance Check
├── Q10: "Do you receive payslips?" (Category: Documentation)
│   └── Answer: "No"
├── Q11: "Do you receive superannuation?" (Category: Super)
│   └── Answer: "No"
└── Q12: "Did you have a trial shift?" (Category: Employment)
    └── Answer: "Yes, 4 hours unpaid"

Analysis Triggered:
- Critical facts complete: 100%
- Question count: 12
- Overall confidence: 0.75
```

### 6.9.2 Adaptive Interview Example

```
User: "I work at bubble tea shop, 每周工作20小时, $18 per hour"

Extracted Facts:
- work_type: "bubble tea shop"
- hours_per_week: 20
- pay_rate: 18

Updated State:
- Missing facts reduced by 3
- Skip questions about hours and pay
- Next question: "Do you have a contract?"

Q: "Do you have an employment contract?"
User: "No, 我没有合同"

Extracted Facts:
- has_contract: false
- contract_type: "none"

Updated State:
- Missing facts reduced by 1
- Next question: "Do you receive payslips?"
```

---

# 7. Fact Extraction Architecture

## 7.1 Extraction Pipeline

### 7.1.1 Pipeline Overview

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Input     │───▶│  Preprocess │───▶│   Extract   │───▶│   Normalize │
│   Sources   │    │             │    │   Facts     │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                  │                  │                  │
       ▼                  ▼                  ▼                  ▼
  ┌─────────┐        ┌─────────┐        ┌─────────┐        ┌─────────┐
  │ Natural │        │ Clean   │        │ LLM     │        │ Map to  │
  │ Language│        │ Text    │        │ Extract │        │ Facts   │
  │ Chat    │        │ OCR     │        │ Rules   │        │ Schema  │
  │ PDF     │        │ Parse   │        │ NLP     │        │         │
  │ Images  │        │         │        │         │        │         │
  └─────────┘        └─────────┘        └─────────┘        └─────────┘
```

### 7.1.2 Pipeline Stages

| Stage | Input | Output | Tools |
|-------|-------|--------|-------|
| Preprocess | Raw input | Cleaned text | OCR, text extraction |
| Extract | Cleaned text | Raw facts | LLM, NLP |
| Normalize | Raw facts | EmploymentFacts | Schema mapping |
| Validate | EmploymentFacts | Verified facts | Validation rules |

## 7.2 Input Type Handling

### 7.2.1 Natural Language

**Input Example:**
```
"I work at a restaurant in Sydney. I get paid $18 per hour in cash. 
I work about 25 hours a week. No contract, no payslip."
```

**Extraction Process:**
1. Text cleaning and normalization
2. Entity extraction (locations, amounts, times)
3. Relationship extraction (work -> restaurant, pay -> $18/hour)
4. Fact mapping to EmploymentFacts schema

**Extracted Facts:**
```json
{
  "workLocation": "Sydney",
  "employerIndustry": "restaurant",
  "payRate": 18.00,
  "payRateType": "hourly",
  "paymentMethod": "cash",
  "hoursPerWeek": 25,
  "hasContract": false,
  "receivesPayslips": false
}
```

### 7.2.2 Chat Screenshots (WeChat/WhatsApp)

**Input:** Screenshot image of chat conversation

**Extraction Process:**
1. OCR to extract text
2. Message parsing (sender, timestamp, content)
3. Conversation context analysis
4. Fact extraction from messages

**Example Messages:**
```
Employer: "明天早上9点来上班"
Employee: "好的"
Employer: "工资是18块一小时"
```

**Extracted Facts:**
```json
{
  "startTime": "09:00",
  "payRate": 18.00,
  "payRateType": "hourly",
  "language": "Chinese"
}
```

### 7.2.3 PDFs

**Input:** Employment contract, payslip, or other document

**Extraction Process:**
1. PDF text extraction
2. Document type classification
3. Structured data extraction
4. Fact mapping

**Example Contract PDF:**
```
Employment Agreement
...
Position: Restaurant Assistant
Start Date: 1 January 2026
Hours: 20 hours per week
Rate: $22.50 per hour
...
```

**Extracted Facts:**
```json
{
  "jobTitle": "Restaurant Assistant",
  "employmentStartDate": "2026-01-01",
  "hoursPerWeek": 20,
  "payRate": 22.50,
  "payRateType": "hourly",
  "hasContract": true
}
```

### 7.2.4 Images (Rosters, Screenshots)

**Input:** Roster screenshot, timesheet photo

**Extraction Process:**
1. Image preprocessing
2. OCR text extraction
3. Structure recognition (tables, schedules)
4. Fact extraction

**Example Roster Image:**
```
Week 1
Mon 9:00-17:00
Tue 10:00-18:00
Wed OFF
Thu 9:00-17:00
Fri 11:00-19:00
```

**Extracted Facts:**
```json
{
  "hasRegularRoster": true,
  "regularDays": ["Monday", "Tuesday", "Thursday", "Friday"],
  "startTime": "09:00",
  "endTime": "17:00",
  "hoursPerWeek": 32
}
```

### 7.2.5 Contracts

**Input:** Employment contract (PDF or image)

**Extraction Process:**
1. Document classification
2. Key term extraction
3. Obligation identification
4. Compliance checking

**Key Terms Extracted:**
- Position and duties
- Start date and duration
- Hours and schedule
- Compensation and benefits
- Termination conditions
- Probation period

## 7.3 Confidence Scoring

### 7.3.1 Confidence Factors

| Factor | Weight | Description |
|--------|--------|-------------|
| Source reliability | 0.3 | How reliable the source is |
| Extraction clarity | 0.3 | How clear the extraction is |
| Context support | 0.2 | How well it fits context |
| Cross-validation | 0.2 | Agreement with other facts |

### 7.3.2 Source Reliability Scores

| Source | Base Score | Factors |
|--------|------------|---------|
| Written contract | 0.95 | Official document |
| Payslip | 0.90 | Official document |
| Bank statement | 0.85 | Financial record |
| Chat message | 0.60 | Informal, context-dependent |
| Verbal statement | 0.40 | Unreliable, no proof |
| Inferred | 0.30 | Assumed from context |

### 7.3.3 Confidence Calculation

```
confidence = (
  sourceReliability * 0.3 +
  extractionClarity * 0.3 +
  contextSupport * 0.2 +
  crossValidation * 0.2
)
```

### 7.3.4 Confidence Levels

| Level | Score | Meaning |
|-------|-------|---------|
| High | >= 0.8 | Reliable, can be used directly |
| Medium | 0.5-0.7 | Uncertain, may need verification |
| Low | < 0.5 | Unreliable, needs verification |

## 7.4 Conflict Resolution

### 7.4.1 Conflict Types

| Type | Example | Resolution |
|------|---------|------------|
| Direct conflict | "I work 20 hours" vs "I work 30 hours" | Ask clarifying question |
| Temporal conflict | "Started in January" vs "Started in March" | Ask for specific date |
| Source conflict | Contract says $22, user says $18 | Prefer contract, ask user to verify |
| Ambiguity | "I get paid cash" (100% or partial?) | Ask for clarification |

### 7.4.2 Resolution Strategies

```
Strategy 1: Source Priority
  - Official documents > Chat messages > Verbal statements
  - Higher confidence wins

Strategy 2: Temporal Priority
  - More recent information wins
  - Ask user to confirm

Strategy 3: User Confirmation
  - Present conflicting facts to user
  - Ask which is correct
  - Update confidence based on response

Strategy 4: Cross-Validation
  - Check if facts are logically consistent
  - Flag inconsistencies for review
```

### 7.4.3 Conflict Detection

```
Input: Two facts about the same field

Process:
  1. Check if facts are for same entity/time period
  2. Compare values
  3. If different:
     a. Check source reliability
     b. Check temporal relevance
     c. Flag as conflict if no clear winner
  4. If same:
     a. Increase confidence
     b. Record cross-validation

Output:
  - Conflict status
  - Resolution recommendation
  - Updated confidence
```

## 7.5 Human Verification Strategy

### 7.5.1 Verification Triggers

| Trigger | Condition | Action |
|---------|-----------|--------|
| Low confidence | < 0.5 | Request verification |
| Critical fact | High importance | Request verification |
| Conflict detected | Conflicting facts | Request clarification |
| Ambiguous extraction | Uncertain extraction | Request confirmation |

### 7.5.2 Verification Methods

| Method | When | User Experience |
|--------|------|-----------------|
| Direct question | Low confidence | "Is your hourly rate $18?" |
| Confirmation | Medium confidence | "I understood your rate is $18. Is that correct?" |
| Clarification | Ambiguous | "Do you work 20 or 25 hours per week?" |
| Evidence request | Critical fact | "Can you provide your contract or payslip?" |

### 7.5.3 Verification Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Extract    │───▶│  Check      │───▶│  Request    │───▶│  Update     │
│  Fact       │    │  Confidence │    │  Verify     │    │  Fact       │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                  │                  │                  │
       ▼                  ▼                  ▼                  ▼
  ┌─────────┐        ┌─────────┐        ┌─────────┐        ┌─────────┐
  │ Raw     │        │ Confidence│       │ User    │        │ Verified│
  │ Extract │        │ Score     │       │ Response│        │ Fact    │
  └─────────┘        └─────────┘        └─────────┘        └─────────┘
```

## 7.6 Unknown Fact Handling

### 7.6.1 Unknown Fact Types

| Type | Example | Handling |
|------|---------|----------|
| Explicit unknown | "I don't know" | Record as unknown, ask later |
| Implicit unknown | No response | Record as unknown, ask differently |
| Partially known | "About 20 hours" | Record with low confidence |
| Inferred | Likely from context | Record as inferred with low confidence |

### 7.6.2 Unknown Fact Strategies

```
Strategy 1: Ask Later
  - Mark fact as unknown
  - Continue with other questions
  - Return to unknown facts later

Strategy 2: Ask Differently
  - Rephrase question
  - Provide examples
  - Offer "I don't know" option

Strategy 3: Infer from Context
  - Use other facts to infer
  - Mark as inferred with low confidence
  - Ask for confirmation

Strategy 4: Accept Unknown
  - Proceed with analysis
  - Note gaps in report
  - Suggest ways to find information
```

### 7.6.3 Completeness Tracking

```
unknownFacts = list of facts marked as unknown
missingCriticalFacts = unknown facts that are critical
factConflicts = conflicting facts
overallCompleteness = (known facts / total facts) * 100
```

---

# 8. Database Design

## 8.1 Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Database Schema                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐       ┌──────────────┐       ┌──────────────┐            │
│  │   Users      │       │  Interviews  │       │EmploymentFacts│           │
│  │              │       │              │       │              │            │
│  │ id (PK)      │◀──┐   │ id (PK)      │       │ id (PK)      │           │
│  │ anonymous_id │   └──▶│ user_id (FK) │       │interview_id  │           │
│  │ language     │       │ status       │       │fact_field    │           │
│  │ created_at   │       │ language     │       │fact_value    │           │
│  └──────────────┘       │ started_at   │       │confidence    │           │
│                         │ completed_at │       │source        │           │
│                         └──────────────┘       │verified      │           │
│                                │               └──────────────┘           │
│                                │                        │                  │
│                                ▼                        ▼                  │
│                         ┌──────────────┐       ┌──────────────┐           │
│                         │  Questions   │       │  Findings    │           │
│                         │              │       │              │           │
│                         │ id (PK)      │       │ id (PK)      │           │
│                         │question_code │       │finding_code  │           │
│                         │ category     │       │interview_id  │           │
│                         │priority      │       │severity      │           │
│                         │fact_targets  │       │confidence    │           │
│                         │question_text │       │legal_refs    │           │
│                         │question_text_│       │evidence      │           │
│                         │  zh          │       │actions       │           │
│                         └──────────────┘       │review_status │           │
│                                │               └──────────────┘           │
│                                │                        │                  │
│                                ▼                        ▼                  │
│                         ┌──────────────┐       ┌──────────────┐           │
│                         │QuestionHistory│      │   Rules      │           │
│                         │              │       │              │           │
│                         │ id (PK)      │       │ id (PK)      │           │
│                         │interview_id  │       │rule_code     │           │
│                         │question_id   │       │name          │           │
│                         │answer        │       │category      │           │
│                         │answered_at   │       │version       │           │
│                         │confidence    │       │status        │           │
│                         └──────────────┘       │conditions    │           │
│                                                │finding_tpl   │           │
│                                                │legal_refs    │           │
│                                                └──────────────┘           │
│                                                        │                  │
│                                                        ▼                  │
│                                                ┌──────────────┐           │
│                                                │ RuleVersions │           │
│                                                │              │           │
│                                                │ id (PK)      │           │
│                                                │rule_id (FK)  │           │
│                                                │version       │           │
│                                                │change_type   │           │
│                                                │snapshot      │           │
│                                                │changed_by    │           │
│                                                │changed_at    │           │
│                                                └──────────────┘           │
│                                                                            │
│  ┌──────────────┐       ┌──────────────┐       ┌──────────────┐           │
│  │  Evidence    │       │ FactSources  │       │   Tags       │           │
│  │              │       │              │       │              │           │
│  │ id (PK)      │       │ id (PK)      │       │ id (PK)      │           │
│  │interview_id  │       │fact_id (FK)  │       │name          │           │
│  │ type         │       │source_type   │       └──────────────┘           │
│  │ description  │       │source_id     │               │                  │
│  │ file_url     │       │confidence    │               ▼                  │
│  │ confidence   │       └──────────────┘       ┌──────────────┐           │
│  └──────────────┘                              │  RuleTags    │           │
│                                                │              │           │
│                                                │rule_id (FK)  │           │
│                                                │tag_id (FK)   │           │
│                                                └──────────────┘           │
│                                                                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 8.2 Core Tables

### 8.2.1 Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anonymous_id VARCHAR(255) UNIQUE NOT NULL,
  preferred_language VARCHAR(10) DEFAULT 'EN',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_active_at TIMESTAMP
);
```

### 8.2.2 Interviews Table

```sql
CREATE TABLE interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'IN_PROGRESS',
  language VARCHAR(10) NOT NULL DEFAULT 'EN',
  current_phase VARCHAR(50),
  question_count INTEGER DEFAULT 0,
  turn_count INTEGER DEFAULT 0,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 8.2.3 EmploymentFacts Table

```sql
CREATE TABLE employment_facts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id UUID NOT NULL,
  fact_field VARCHAR(255) NOT NULL,
  fact_value JSONB NOT NULL,
  confidence DECIMAL(3,2) NOT NULL,
  source VARCHAR(50) NOT NULL,
  source_reference TEXT,
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP,
  verified_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (interview_id) REFERENCES interviews(id),
  UNIQUE(interview_id, fact_field)
);
```

### 8.2.4 Rules Table

```sql
CREATE TABLE rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  conditions JSONB NOT NULL,
  logic_operator VARCHAR(3) NOT NULL,
  priority INTEGER NOT NULL,
  required_facts TEXT[] NOT NULL,
  optional_facts TEXT[],
  fact_confidence_minimum DECIMAL(3,2) NOT NULL,
  finding_template JSONB NOT NULL,
  severity_calculation JSONB NOT NULL,
  confidence_calculation JSONB NOT NULL,
  legal_references JSONB NOT NULL,
  legal_summary TEXT NOT NULL,
  last_reviewed DATE NOT NULL,
  required_evidence JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(100) NOT NULL,
  approved_by VARCHAR(100),
  approved_at TIMESTAMP
);
```

### 8.2.5 Findings Table

```sql
CREATE TABLE findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  finding_code VARCHAR(50) NOT NULL,
  interview_id UUID NOT NULL,
  rule_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  severity VARCHAR(20) NOT NULL,
  confidence DECIMAL(3,2) NOT NULL,
  legal_references JSONB NOT NULL,
  legal_summary TEXT NOT NULL,
  legal_jurisdiction VARCHAR(100) NOT NULL,
  evidence_checklist JSONB NOT NULL,
  evidence_collected JSONB,
  evidence_gaps TEXT[],
  source_fact_ids UUID[],
  fact_summary TEXT NOT NULL,
  recommended_actions JSONB NOT NULL,
  urgency VARCHAR(20) NOT NULL,
  timeframe VARCHAR(100) NOT NULL,
  human_review_required BOOLEAN DEFAULT FALSE,
  review_reason TEXT,
  review_status VARCHAR(20) DEFAULT 'PENDING',
  reviewer_notes TEXT,
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  version INTEGER DEFAULT 1,
  tags TEXT[],
  related_finding_ids UUID[],
  FOREIGN KEY (interview_id) REFERENCES interviews(id),
  FOREIGN KEY (rule_id) REFERENCES rules(id)
);
```

### 8.2.6 Questions Table

```sql
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_code VARCHAR(50) UNIQUE NOT NULL,
  category VARCHAR(50) NOT NULL,
  priority INTEGER NOT NULL,
  fact_targets TEXT[] NOT NULL,
  question_text TEXT NOT NULL,
  question_text_zh TEXT,
  question_text_mixed TEXT,
  context_text TEXT,
  context_text_zh TEXT,
  examples TEXT[],
  examples_zh TEXT[],
  answer_type VARCHAR(20) NOT NULL,
  answer_options JSONB,
  validation_rules JSONB,
  follow_up_questions JSONB,
  skip_conditions JSONB,
  dependencies TEXT[],
  confidence_impact DECIMAL(3,2),
  information_gain DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 8.3 Indexes

```sql
-- Performance indexes
CREATE INDEX idx_interviews_user_id ON interviews(user_id);
CREATE INDEX idx_interviews_status ON interviews(status);
CREATE INDEX idx_employment_facts_interview_id ON employment_facts(interview_id);
CREATE INDEX idx_employment_facts_field ON employment_facts(fact_field);
CREATE INDEX idx_findings_interview_id ON findings(interview_id);
CREATE INDEX idx_findings_severity ON findings(severity);
CREATE INDEX idx_findings_review_status ON findings(review_status);
CREATE INDEX idx_rules_category ON rules(category);
CREATE INDEX idx_rules_status ON rules(status);
CREATE INDEX idx_questions_category ON questions(category);
CREATE INDEX idx_questions_priority ON questions(priority);
```

## 8.4 Data Retention

| Data Type | Retention Period | Reason |
|-----------|------------------|--------|
| User data | 2 years | Legal requirement |
| Interview data | 2 years | Legal requirement |
| Employment facts | 2 years | Legal requirement |
| Findings | 7 years | Legal requirement |
| Rules | Indefinite | Audit trail |
| Evidence | 2 years | Storage management |

---

# 9. Future Expansion Strategy

## 9.1 Planned Expansions

### 9.1.1 Additional Worker Types

| Worker Type | Specific Rules | New Facts |
|-------------|----------------|-----------|
| Gig Workers | Contractor vs Employee | ABN, invoicing |
| Farm Workers | Seasonal work | Piece rates, accommodation |
| Hospitality | Tips, split shifts | Tip pooling, penalties |
| Construction | Site allowances | RDOs, site rates |

### 9.1.2 Additional Jurisdictions

| Jurisdiction | Specific Laws | Implementation |
|--------------|---------------|----------------|
| Victoria | Long service leave | State-specific rules |
| NSW | Retail trading hours | State-specific rules |
| Queensland | Portable leave | State-specific rules |

### 9.1.3 Additional Features

| Feature | Description | Priority |
|---------|-------------|----------|
| Union referral | Connect with relevant unions | High |
| Legal aid referral | Connect with legal services | High |
| Document templates | Generate request letters | Medium |
| Pay calculator | Calculate owed amounts | Medium |
| Timeline tracking | Track employment history | Low |

## 9.2 Technical Expansions

### 9.2.1 New Fact Types

```typescript
// Example: Gig Worker Facts
interface GigWorkerFacts extends EmploymentFacts {
  hasAbn: boolean;
  invoicingFrequency: 'WEEKLY' | 'FORTNIGHTLY' | 'MONTHLY';
  platformName: string;
  contractorType: 'INDEPENDENT' | 'DEPENDENT';
  providesOwnEquipment: boolean;
  hasMultipleClients: boolean;
}
```

### 9.2.2 New Rule Categories

```typescript
// Example: Gig Worker Rules
const gigWorkerRules: Rule[] = [
  {
    ruleCode: 'GIG-001',
    name: 'Sham Contracting',
    category: 'GIG',
    conditions: [
      { factField: 'contractorType', operator: 'EQ', value: 'DEPENDENT' }
    ],
    findingTemplate: {
      findingCode: 'GIG-001',
      nameTemplate: 'Sham Contracting Risk',
      descriptionTemplate: 'You may be classified as a contractor but treated as an employee.'
    }
  }
];
```

### 9.2.3 New Question Types

```typescript
// Example: Gig Worker Questions
const gigWorkerQuestions: Question[] = [
  {
    questionCode: 'GIG-001',
    category: 'GIG',
    factTargets: ['hasAbn', 'contractorType'],
    questionText: 'Do you have an Australian Business Number (ABN)?',
    questionTextZh: '你有澳大利亚商业号码（ABN）吗？',
    answerType: 'BOOLEAN'
  }
];
```

## 9.3 Integration Expansions

### 9.3.1 External Services

| Service | Purpose | Priority |
|---------|---------|----------|
| Fair Work API | Award rates lookup | High |
| ATO API | Super verification | Medium |
| ABN Lookup | Employer verification | Medium |
| Translation API | Real-time translation | Low |

### 9.3.2 Third-Party Integrations

| Integration | Purpose | Priority |
|-------------|---------|----------|
| Legal databases | Case law reference | High |
| Union databases | Member benefits | Medium |
| Government portals | Claim submission | Medium |

## 9.4 Scalability Considerations

### 9.4.1 Performance

| Component | Current Load | Expected Load | Strategy |
|-----------|--------------|---------------|----------|
| Database | 1000 users | 100,000 users | Sharding |
| Rule engine | 50 rules | 500 rules | Caching |
| Interview engine | 100 concurrent | 10,000 concurrent | Load balancing |

### 9.4.2 Data Volume

| Data Type | Current Size | Expected Size | Strategy |
|-----------|--------------|---------------|----------|
| Employment facts | 10MB | 1GB | Archiving |
| Evidence files | 100MB | 10GB | S3 storage |
| Interview logs | 50MB | 5GB | Log rotation |

---

# Appendix A: Glossary

| Term | Definition |
|------|------------|
| EmploymentFacts | Single source of truth for all employment data |
| Finding | A diagnosed employment issue with evidence |
| Rule | Business logic for detecting issues |
| Interview | A fact collection conversation |
| Confidence | How certain we are about a fact (0-1) |
| Severity | How serious an issue is (CRITICAL/HIGH/MEDIUM/LOW) |

# Appendix B: Legal References

| Law | Relevance |
|-----|-----------|
| Fair Work Act 2009 | National employment standards |
| Superannuation Guarantee (Administration) Act 1992 | Super requirements |
| Income Tax Assessment Act 1997 | Tax obligations |
| Migration Act 1958 | Visa work rights |
| Work Health and Safety Act 2011 | Workplace safety |

# Appendix C: Decision Trees

## Fact Extraction Decision Tree

```
Input Type?
├── Natural Language
│   └── Extract entities and relationships
├── Chat Screenshot
│   ├── OCR → Text
│   └── Extract from conversation
├── PDF
│   ├── Text extraction
│   └── Document classification
├── Image
│   ├── OCR → Text
│   └── Structure recognition
└── Contract
    ├── Key term extraction
    └── Obligation identification
```

## Question Selection Decision Tree

```
Missing Facts?
├── Yes
│   ├── Filter by dependencies
│   ├── Calculate priority scores
│   └── Select highest priority
└── No
    └── Proceed to analysis
```

---

*Document Version: 1.0.0*
*Last Updated: 2026-06-01*
*Status: Design Phase*
