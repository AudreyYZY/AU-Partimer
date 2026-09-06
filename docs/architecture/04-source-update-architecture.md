# Source Update Architecture

## Version: 1.0.0
## Date: 2026-06-01
## Status: Design Phase

---

## 1. Purpose

This document defines how the system stays current with changes to Australian employment law. Laws change, awards are updated, and guidance evolves. The system must detect, process, and propagate these changes.

---

## 2. Core Principle

**The system's legal knowledge must be current and verifiable. Outdated information is worse than no information.**

---

## 3. Update Sources

### 3.1 Federal Legislation

| Source | Monitor Method | Frequency | URL Pattern |
|--------|----------------|-----------|-------------|
| Fair Work Act 2009 | Federal Register of Legislation API | Daily | legislation.gov.au |
| Fair Work Regulations | Federal Register of Legislation API | Daily | legislation.gov.au |
| Superannuation Guarantee Act | Federal Register of Legislation API | Daily | legislation.gov.au |
| Migration Act 1958 | Federal Register of Legislation API | Daily | legislation.gov.au |

### 3.2 Fair Work Ombudsman

| Source | Monitor Method | Frequency | URL Pattern |
|--------|----------------|-----------|-------------|
| Pay guides | Web scraping | Weekly | fairwork.gov.au/pay |
| Award summaries | Web scraping | Weekly | fairwork.gov.au/awards |
| Fact sheets | Web scraping | Weekly | fairwork.gov.au/tools-and-resources |
| News/updates | RSS feed | Daily | fairwork.gov.au/news |

### 3.3 Fair Work Commission

| Source | Monitor Method | Frequency | URL Pattern |
|--------|----------------|-----------|-------------|
| Award decisions | RSS feed | Daily | fwc.gov.au |
| Annual wage review | RSS feed | Daily | fwc.gov.au |
| Modern awards | API/RSS | Daily | fwc.gov.au/awards-agreements |

### 3.4 Australian Taxation Office

| Source | Monitor Method | Frequency | URL Pattern |
|--------|----------------|-----------|-------------|
| Super guarantee rates | Web scraping | Monthly | ato.gov.au |
| Tax tables | Web scraping | Monthly | ato.gov.au |
| Employer obligations | Web scraping | Monthly | ato.gov.au |

### 3.5 State Sources

| Source | Monitor Method | Frequency |
|--------|----------------|-----------|
| Work Health and Safety Acts | State legislation registers | Monthly |
| Workers Compensation Acts | State legislation registers | Monthly |
| Long Service Leave Acts | State legislation registers | Monthly |

---

## 4. Update Detection

### 4.1 Change Detection Methods

```typescript
enum ChangeDetectionMethod {
  RSS_FEED = "rss_feed",              // Monitor RSS for new items
  API_POLLING = "api_polling",         // Poll API for changes
  WEB_SCRAPING = "web_scraping",       // Scrape pages for changes
  HASH_COMPARISON = "hash_comparison", // Compare content hashes
  MANUAL = "manual"                    // Human-initiated check
}
```

### 4.2 Change Types

```typescript
enum ChangeType {
  NEW_SOURCE = "new_source",           // New legislation/guidance
  AMENDMENT = "amendment",             // Existing source amended
  REPEAL = "repeal",                   // Source repealed/removed
  RATE_CHANGE = "rate_change",         // Numerical value changed
  GUIDANCE_UPDATE = "guidance_update",  // Interpretation changed
  DEADLINE_CHANGE = "deadline_change"  // Effective date changed
}
```

### 4.3 Change Detection Process

```
1. Scheduled job runs
2. Fetch current state from source
3. Compare with stored state
4. If different:
   a. Identify change type
   b. Log change details
   c. Create update task
   d. Notify administrators
5. If same:
   a. Update lastCheckedAt timestamp
   b. Log no change
```

---

## 5. Update Processing

### 5.1 Processing Pipeline

```
Detect Change
    ↓
Classify Change
    ↓
Fetch New Content
    ↓
Parse Content
    ↓
Identify Affected Records
    ↓
Create Update Plan
    ↓
Review (if needed)
    ↓
Apply Update
    ↓
Propagate to Rules
    ↓
Propagate to Findings
    ↓
Log Update
```

### 5.2 Update Priority

| Change Type | Priority | Auto-Apply | Human Review |
|-------------|----------|------------|--------------|
| Rate Change | Critical | No | Yes |
| Amendment | High | No | Yes |
| New Source | Medium | No | Yes |
| Guidance Update | Medium | No | Yes |
| Repeal | High | No | Yes |

### 5.3 Update Review Queue

```typescript
interface UpdateTask {
  id: string;
  changeType: ChangeType;
  priority: "critical" | "high" | "medium" | "low";

  // What changed
  sourceId: string;
  sourceTitle: string;
  changeDescription: string;

  // Old and new values
  previousValue: any;
  newValue: any;

  // Impact
  affectedRequirements: string[];
  affectedRules: string[];
  affectedFindings: string[];

  // Processing
  status: "pending" | "in_review" | "approved" | "rejected" | "applied";
  assignedTo: string | null;
  reviewedBy: string | null;
  reviewedAt: Date | null;
  reviewNotes: string | null;

  // Metadata
  detectedAt: Date;
  detectedBy: string;                  // System or user
  appliedAt: Date | null;
}
```

---

## 6. Rate Change Example

### 6.1 Scenario

Fair Work Commission announces new national minimum wage: $26.44 → $27.00 effective 1 July 2026.

### 6.2 Detection

```
1. RSS feed from Fair Work Commission shows new decision
2. System detects: "Annual Wage Review 2025-26"
3. System identifies: National minimum wage rate change
4. System creates UpdateTask:
   - changeType: RATE_CHANGE
   - priority: CRITICAL
   - sourceId: "src-fw-act-284"
   - previousValue: 26.44
   - newValue: 27.00
   - affectedRequirements: ["req-min-wage-2025"]
   - affectedRules: ["rule-min-wage"]
```

### 6.3 Processing

```
1. Administrator reviews UpdateTask
2. Administrator verifies source (Fair Work Commission decision)
3. Administrator approves update
4. System applies:
   a. Updates LegalRequirement threshold: 26.44 → 27.00
   b. Updates LegalRequirement effectiveFrom: "2026-07-01"
   c. Creates new LegalRequirement for new rate
   d. Marks old LegalRequirement as "superseded"
   e. Updates Rule conditions
   f. Flags existing Findings for review
5. System logs all changes
```

### 6.4 Propagation

```
When minimum wage changes:

1. LegalRequirement updated
   ↓
2. Rule "rule-min-wage" updated
   ↓
3. All active Findings of type "BELOW_MINIMUM_WAGE" flagged
   ↓
4. Users notified: "Minimum wage has changed. Your finding may be affected."
   ↓
5. System recalculates findings with new rate
```

---

## 7. Award Update Example

### 7.1 Scenario

Hospitality Award penalty rates change for casual employees on Sundays.

### 7.2 Detection

```
1. Fair Work Commission RSS shows award variation
2. System detects: "Hospitality Industry (General) Award 2020 - Variation"
3. System identifies: Clause 23 penalty rates changed
4. System creates UpdateTask
```

### 7.3 Processing

```
1. Administrator reviews UpdateTask
2. Administrator verifies source (FWC decision)
3. Administrator approves update
4. System applies:
   a. Updates LegalRequirement for Sunday penalty rate
   b. Updates affected Rules
   c. Flags affected Findings
5. System logs all changes
```

---

## 8. Guidance Update Example

### 8.1 Scenario

Fair Work Ombudsman updates guidance on trial shifts.

### 8.2 Detection

```
1. Weekly web scraping detects page change
2. System compares old and new content
3. System identifies: Trial shift guidance updated
4. System creates UpdateTask
```

### 8.3 Processing

```
1. Administrator reviews UpdateTask
2. Administrator compares old and new guidance
3. Administrator updates LegalSource summary
4. Administrator updates LegalRequirement if needed
5. System logs all changes
```

---

## 9. Update Architecture Components

### 9.1 Component Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Update Architecture                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐   │
│  │   Monitors   │    │   Processors │    │   Propagators│   │
│  │              │    │              │    │              │   │
│  │ • RSS        │───▶│ • Classifier │───▶│ • Rules      │   │
│  │ • API        │    │ • Parser     │    │ • Findings   │   │
│  │ • Scraper    │    │ • Validator  │    │ • Users      │   │
│  └──────────────┘    └──────────────┘    └──────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 9.2 Monitor Component

```typescript
interface SourceMonitor {
  id: string;
  sourceId: string;
  monitorType: ChangeDetectionMethod;
  url: string;
  schedule: string;                    // Cron expression
  lastCheckedAt: Date | null;
  lastChangeAt: Date | null;
  status: "active" | "paused" | "error";
  errorMessage: string | null;
}
```

### 9.3 Processor Component

```typescript
interface UpdateProcessor {
  id: string;
  changeType: ChangeType;
  processorFunction: string;           // Function name
  autoApply: boolean;
  requiresReview: boolean;
  reviewRole: string;                  // Who should review
}
```

### 9.4 Propagator Component

```typescript
interface UpdatePropagator {
  id: string;
  sourceId: string;
  targetType: "requirement" | "rule" | "finding";
  targetIds: string[];
  propagationFunction: string;
  lastPropagatedAt: Date | null;
}
```

---

## 10. Update Scheduling

### 10.1 Schedule Overview

| Source | Check Frequency | Time (AEST) | Priority |
|--------|-----------------|-------------|----------|
| Federal Legislation | Daily | 06:00 | High |
| Fair Work Ombudsman | Weekly | Sunday 02:00 | Medium |
| Fair Work Commission | Daily | 06:00 | High |
| ATO | Monthly | 1st 02:00 | Medium |
| State Legislation | Monthly | 1st 04:00 | Low |

### 10.2 Schedule Configuration

```typescript
interface UpdateSchedule {
  id: string;
  sourceId: string;
  schedule: string;                    // Cron expression
  timezone: string;                    // "Australia/Sydney"
  enabled: boolean;
  lastRunAt: Date | null;
  nextRunAt: Date | null;
  runHistory: ScheduleRun[];
}

interface ScheduleRun {
  id: string;
  scheduleId: string;
  startedAt: Date;
  completedAt: Date | null;
  status: "success" | "failure" | "partial";
  changesDetected: number;
  errors: string[];
}
```

---

## 11. Update Audit Trail

### 11.1 What is Logged

| Event | Data Logged |
|-------|-------------|
| Check performed | Source, timestamp, result |
| Change detected | Change details, timestamp |
| Update task created | Task details, priority |
| Update reviewed | Reviewer, decision, notes |
| Update applied | Changes made, timestamp |
| Propagation triggered | Targets affected, timestamp |

### 11.2 Audit Record Structure

```typescript
interface UpdateAuditRecord {
  id: string;
  sourceId: string;
  eventType: "check" | "change_detected" | "task_created" | "reviewed" | "applied" | "propagated";
  timestamp: Date;
  performedBy: string;                 // "system" or user ID
  details: Record<string, any>;
  previousState: Record<string, any> | null;
  newState: Record<string, any>;
}
```

---

## 12. Error Handling

### 12.1 Error Types

| Error | Handling | Recovery |
|-------|----------|----------|
| Source unavailable | Log error, retry later | Automatic retry |
| Parse error | Flag for manual review | Manual intervention |
| Ambiguous change | Flag for manual review | Manual intervention |
| Conflicting sources | Flag for manual review | Manual intervention |

### 12.2 Error Recovery

```
1. Error occurs during update
2. System logs error details
3. System creates error task
4. System notifies administrators
5. System retries if transient error
6. System pauses monitor if persistent error
7. Administrator investigates and resolves
8. Administrator resumes monitor
```

---

## 13. Update Notifications

### 13.1 Notification Types

| Type | Recipients | Trigger |
|------|------------|---------|
| Rate change detected | Legal team | New rate announced |
| Update applied | Legal team, developers | Update processed |
| Update requires review | Legal team | Complex change |
| Error occurred | Developers | Processing error |
| Findings affected | Users | Their findings changed |

### 13.2 Notification Structure

```typescript
interface UpdateNotification {
  id: string;
  notificationType: string;
  recipients: string[];
  subject: string;
  body: string;
  priority: "critical" | "high" | "medium" | "low";
  sentAt: Date;
  readAt: Date | null;
}
```

---

## 14. Manual Update Process

### 14.1 When Manual Update is Needed

- Complex legal changes
- New award created
- Major legislative reform
- Ambiguous guidance

### 14.2 Manual Update Steps

```
1. Legal expert identifies change
2. Legal expert creates update document
3. Legal expert submits to system
4. System creates UpdateTask
5. System validates update
6. Legal expert reviews and approves
7. System applies update
8. System propagates to Rules and Findings
9. System logs update
```

### 14.3 Manual Update Interface

```
Update Form:
- Source: [dropdown]
- Change Type: [dropdown]
- Effective Date: [date picker]
- Description: [text area]
- New Value: [input]
- Supporting Documentation: [file upload]
- Notes: [text area]
```

---

## 15. Update Testing

### 15.1 Test Scenarios

| Scenario | Test | Expected Result |
|----------|------|-----------------|
| Rate change | Update minimum wage | All affected Findings updated |
| New award | Add new award | System can reference new award |
| Award amendment | Change penalty rates | Affected Findings recalculated |
| Guidance update | Update payslip guidance | System reflects new guidance |

### 15.2 Test Process

```
1. Create test environment
2. Apply update to test
3. Verify affected records
4. Verify propagation
5. Verify user notifications
6. If successful, apply to production
7. Verify production
```

---

## 16. Rollback

### 16.1 When to Rollback

- Update applied incorrectly
- Update based on incorrect source
- Update causes system errors

### 16.2 Rollback Process

```
1. Identify update to rollback
2. Retrieve previous state from audit trail
3. Apply previous state
4. Re-propagate to Rules and Findings
5. Notify affected users
6. Log rollback
```

---

## 17. Future Enhancements

### 17.1 Planned Features

| Feature | Description | Priority |
|---------|-------------|----------|
| AI-assisted change detection | Use NLP to identify relevant changes | Medium |
| Automated rate extraction | Extract rates from documents automatically | Medium |
| Predictive updates | Predict upcoming changes based on patterns | Low |
| User-contributed updates | Users flag outdated information | Medium |

### 17.2 Integration Roadmap

| Phase | Integration | Timeline |
|-------|-------------|----------|
| 1 | Federal Register API | Q3 2026 |
| 2 | Fair Work Ombudsman RSS | Q3 2026 |
| 3 | Fair Work Commission RSS | Q4 2026 |
| 4 | ATO web scraping | Q4 2026 |
| 5 | State legislation registers | Q1 2027 |

---

*Document Version: 1.0.0*
*Last Updated: 2026-06-01*
*Status: Design Phase*
