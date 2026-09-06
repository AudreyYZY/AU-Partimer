# Evidence Model

## Version: 1.0.0
## Date: 2026-06-01
## Status: Design Phase

---

## 1. Purpose

This model defines how evidence is structured, validated, and linked to EmploymentFacts. Evidence is the bridge between what users claim and what the system can verify.

---

## 2. Core Principle

**Evidence supports facts. Facts are used by rules. Rules produce findings.**

```
Evidence → EmploymentFacts → Rule → Finding → LegalSource
```

Evidence itself is NOT a source of legal authority. It is a source of factual claims.

---

## 3. Evidence Types

### 3.1 Type Hierarchy

```typescript
enum EvidenceType {
  // Documents
  EMPLOYMENT_CONTRACT = "employment_contract",
  PAYSLIP = "payslip",
  BANK_STATEMENT = "bank_statement",
  SUPER_STATEMENT = "super_statement",
  TAX_SUMMARY = "tax_summary",
  LETTER_OF_OFFER = "letter_of_offer",
  ROSTER = "roster",
  TIMESHEET = "timesheet",
  SAFETY_DOCUMENT = "safety_document",

  // Communications
  EMAIL = "email",
  WECHAT_MESSAGE = "wechat_message",
  WHATSAPP_MESSAGE = "whatsapp_message",
  SMS = "sms",
  TEXT_MESSAGE = "text_message",

  // Images
  PHOTO = "photo",
  SCREENSHOT = "screenshot",
  SCANNED_DOCUMENT = "scanned_document",

  // Other
  WITNESS_STATEMENT = "witness_statement",
  AUDIO_RECORDING = "audio_recording",
  VIDEO_RECORDING = "video_recording",
  NOTES = "notes"
}
```

### 3.2 Evidence Categories

| Category | Types | Reliability | Use Case |
|----------|-------|-------------|----------|
| Official Document | Contract, Payslip, Bank Statement | High | Proves terms, payments |
| Digital Communication | Email, WeChat, WhatsApp | Medium | Proves agreements, discussions |
| Image | Photo, Screenshot | Medium | Proves conditions, schedules |
| Personal Record | Notes, Witness Statement | Low | Supports other evidence |

---

## 4. Evidence Record Structure

### 4.1 Core Structure

```typescript
interface Evidence {
  // Identity
  id: string;                          // UUID
  evidenceType: EvidenceType;
  category: "document" | "communication" | "image" | "other";

  // Content
  description: string;                 // What this evidence shows
  fileName: string | null;             // Original file name
  fileUrl: string | null;              // Storage URL
  mimeType: string | null;             // File type
  fileSize: number | null;             // In bytes

  // Extracted Data
  extractedText: string | null;        // OCR or text extraction
  extractedFacts: ExtractedFact[];     // Facts derived from this evidence

  // Source
  sourceType: "user_upload" | "system_generated" | "third_party";
  uploadedBy: string;                  // User ID
  uploadedAt: Date;

  // Validation
  validationStatus: "pending" | "validated" | "rejected" | "needs_review";
  validatedBy: string | null;
  validatedAt: Date | null;
  validationNotes: string | null;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}
```

### 4.2 Extracted Fact

```typescript
interface ExtractedFact {
  id: string;
  evidenceId: string;                  // Links to Evidence

  // What was extracted
  factField: string;                   // EmploymentFacts field
  extractedValue: any;                 // Raw extracted value
  normalizedValue: any;                // Normalized for EmploymentFacts

  // Confidence
  extractionConfidence: number;        // 0.0 - 1.0
  extractionMethod: "ocr" | "nlp" | "manual" | "pattern_match";

  // Validation
  validated: boolean;
  validatedBy: string | null;
  validatedAt: Date | null;

  // Source within document
  location: {
    page: number | null;
    lineNumber: number | null;
    coordinates: { x: number; y: number; width: number; height: number } | null;
  } | null;
}
```

---

## 5. Evidence-to-Fact Mapping

### 5.1 How Evidence Becomes Facts

```
User uploads evidence
    ↓
System extracts text (OCR/NLP)
    ↓
System identifies potential facts
    ↓
System creates ExtractedFact records
    ↓
System links ExtractedFact to EmploymentFacts
    ↓
EmploymentFacts updated with source reference
```

### 5.2 Fact Source Tracking

```typescript
interface FactSource {
  factId: string;                      // EmploymentFact ID
  evidenceId: string;                  // Evidence ID
  extractedFactId: string;             // ExtractedFact ID

  // How confident we are in this source
  sourceReliability: number;           // Based on EvidenceType
  extractionConfidence: number;        // From ExtractedFact
  overallConfidence: number;           // Combined score

  // Verification
  verified: boolean;
  verifiedBy: string | null;
  verifiedAt: Date | null;
}
```

### 5.3 Source Reliability by Evidence Type

| Evidence Type | Base Reliability | Reason |
|---------------|------------------|--------|
| Employment Contract | 0.95 | Official document, signed |
| Payslip | 0.90 | Official document, employer issued |
| Bank Statement | 0.90 | Official financial record |
| Super Statement | 0.90 | Official financial record |
| Email | 0.75 | Written, timestamped |
| WeChat/WhatsApp | 0.65 | Written, but informal |
| Screenshot | 0.60 | Can be manipulated |
| Photo | 0.55 | Can be manipulated |
| Witness Statement | 0.50 | Subjective, unverified |
| Notes | 0.40 | Self-reported, unverified |

---

## 6. Evidence Validation

### 6.1 Validation Levels

| Level | Description | Who Performs |
|-------|-------------|--------------|
| Auto | Basic checks (file type, size) | System |
| Extraction | Text/data extraction verified | System + Human |
| Factual | Facts cross-checked with other evidence | System |
| Human | Expert review | Legal professional |

### 6.2 Validation Rules

```typescript
interface ValidationRule {
  id: string;
  evidenceType: EvidenceType;
  ruleType: "format" | "content" | "consistency" | "cross_reference";

  // What to check
  check: string;                       // Description of check
  checkFunction: string;               // Function name

  // Result
  passMessage: string;
  failMessage: string;

  // Severity
  severity: "error" | "warning" | "info";
}
```

### 6.3 Example Validation Rules

| Evidence | Rule | Check | Severity |
|----------|------|-------|----------|
| Payslip | Format | Has employer name, pay period, amounts | Error |
| Payslip | Content | Gross > Net (after tax) | Warning |
| Payslip | Consistency | Hours × Rate ≈ Gross | Warning |
| Contract | Format | Has signature, date | Error |
| Bank Statement | Cross-ref | Deposits match payslip amounts | Warning |

---

## 7. Evidence for Each Finding Type

### 7.1 Minimum Wage Finding

| Evidence Needed | Priority | Why |
|-----------------|----------|-----|
| Employment Contract | HIGH | Shows agreed rate |
| Payslip | HIGH | Shows actual rate paid |
| Bank Statement | MEDIUM | Shows payment amounts |
| Roster/Timesheet | MEDIUM | Shows hours worked |

### 7.2 Missing Super Finding

| Evidence Needed | Priority | Why |
|-----------------|----------|-----|
| Payslip | HIGH | Should show super contributions |
| Super Statement | HIGH | Shows if contributions received |
| Bank Statement | MEDIUM | Shows payment amounts for calculation |
| Employment Contract | MEDIUM | Shows employment terms |

### 7.3 Missing Payslip Finding

| Evidence Needed | Priority | Why |
|-----------------|----------|-----|
| Chat messages | HIGH | Shows request/response about payslips |
| Bank Statement | MEDIUM | Shows payments without corresponding payslips |
| Email | MEDIUM | Shows communication about payslips |

### 7.4 Penalty Rates Finding

| Evidence Needed | Priority | Why |
|-----------------|----------|-----|
| Employment Contract | HIGH | Shows penalty rate terms |
| Payslip | HIGH | Shows rates paid |
| Roster | HIGH | Shows weekend/holiday work |
| Award lookup | HIGH | Shows applicable penalty rates |

### 7.5 Visa Hours Breach

| Evidence Needed | Priority | Why |
|-----------------|----------|-----|
| Roster | HIGH | Shows scheduled hours |
| Timesheet | HIGH | Shows actual hours |
| Visa grant letter | HIGH | Shows work conditions |
| Payslip | MEDIUM | Shows hours paid for |

---

## 8. Evidence Processing Pipeline

### 8.1 Pipeline Overview

```
Upload → Validate → Extract → Normalize → Link → Store
```

### 8.2 Stage Details

| Stage | Input | Output | Tools |
|-------|-------|--------|-------|
| Upload | Raw file | Stored file | File storage |
| Validate | Stored file | Validation result | Validation rules |
| Extract | Validated file | Raw text/data | OCR, NLP |
| Normalize | Raw text/data | Structured facts | Fact extraction |
| Link | Structured facts | EmploymentFacts | Fact mapping |
| Store | All records | Database | Database |

### 8.3 Extraction Methods

| Evidence Type | Method | Tool |
|---------------|--------|------|
| PDF (text) | Text extraction | PDF parser |
| PDF (scanned) | OCR | Tesseract, Azure Vision |
| Image | OCR | Tesseract, Azure Vision |
| WeChat screenshot | OCR + Layout analysis | Vision API |
| WhatsApp export | Text parsing | Regex, NLP |
| Email | Text extraction | Email parser |

---

## 9. Evidence Display to User

### 9.1 Evidence List

```
Evidence Collected:
✓ Employment Contract (uploaded 2026-05-15)
  - Shows: $22/hr, full-time, start date
  - Status: Validated

✗ Payslip
  - Status: Missing
  - Required for: Wage verification, Super verification

✓ Bank Statement (uploaded 2026-05-20)
  - Shows: Weekly deposits of $880
  - Status: Validated
```

### 9.2 Evidence Gap Analysis

```
For your "Below Minimum Wage" finding, we have:

✓ Employment Contract - shows agreed rate
✓ Bank Statement - shows payments

We still need:
✗ Payslip - to verify actual rate and hours

Recommendation: Request payslip from employer in writing.
```

---

## 10. Example: Complete Evidence Flow

### 10.1 Scenario

User uploads WeChat conversation showing employer paying $18/hr cash.

### 10.2 Processing

```
1. Upload
   - File: wechat_screenshot.jpg
   - Type: WECHAT_MESSAGE
   - Category: communication

2. Validate
   - File format: Valid JPEG
   - File size: 2.5MB (acceptable)
   - Content: Contains Chinese text

3. Extract
   - OCR extracts text: "工资是18块一小时"
   - Extraction confidence: 0.85

4. Normalize
   - ExtractedFact:
     - factField: "payRate"
     - extractedValue: "18块一小时"
     - normalizedValue: 18.00
     - extractionConfidence: 0.85

5. Link
   - EmploymentFacts.payRate = 18.00
   - FactSource:
     - evidenceId: "ev-001"
     - sourceReliability: 0.65 (WeChat)
     - extractionConfidence: 0.85
     - overallConfidence: 0.55 (0.65 × 0.85)

6. Store
   - Evidence record saved
   - ExtractedFact saved
   - FactSource saved
   - EmploymentFacts updated
```

### 10.3 Result

```
EmploymentFacts:
  payRate: 18.00
  confidence: 0.55 (medium-low)
  source: WeChat screenshot
  sourceReliability: 0.65
  extractionConfidence: 0.85

Note: Confidence is medium-low because:
1. WeChat is informal communication (reliability 0.65)
2. Extraction may have errors (confidence 0.85)

Recommendation: Verify with official document (payslip or contract)
```

---

## 11. Evidence Confidence Calculation

### 11.1 Formula

```
evidenceConfidence = sourceReliability × extractionConfidence × crossValidationFactor

Where:
- sourceReliability: Based on EvidenceType (0.40 - 0.95)
- extractionConfidence: From OCR/NLP (0.0 - 1.0)
- crossValidationFactor: 1.0 if corroborated, 0.8 if standalone
```

### 11.2 Confidence Levels

| Level | Score | Meaning | Action |
|-------|-------|---------|--------|
| High | >= 0.8 | Reliable, can be used | Proceed |
| Medium | 0.5 - 0.79 | Uncertain, may need verification | Note in Finding |
| Low | < 0.5 | Unreliable, needs verification | Request better evidence |

### 11.3 How Confidence Affects Findings

```
If evidenceConfidence >= 0.8:
  Finding confidence = high
  No additional verification needed

If evidenceConfidence 0.5 - 0.79:
  Finding confidence = medium
  Note: "Based on [evidence type]. Consider verifying with [better evidence type]."

If evidenceConfidence < 0.5:
  Finding confidence = low
  Note: "Based on [evidence type] which may not be reliable. [Better evidence type] recommended."
```

---

## 12. Privacy and Security

### 12.1 Data Handling

| Data | Storage | Retention | Access |
|------|---------|-----------|--------|
| Uploaded files | Encrypted storage | User-controlled | User only |
| Extracted text | Database | User-controlled | User only |
| Extracted facts | Database | User-controlled | User + System |
| Metadata | Database | 2 years | User + System |

### 12.2 User Control

- Users can delete their evidence at any time
- Users can request export of all their data
- Evidence is never shared with third parties
- Evidence is never used to train models

---

*Document Version: 1.0.0*
*Last Updated: 2026-06-01*
*Status: Design Phase*
