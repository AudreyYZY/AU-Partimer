# AU-Partimer: Part-time Job Risk & Rights Agent

A practical screening tool for Australian part-time workers to decide whether a job opportunity is worth continuing, what to verify first, and how to reduce risk when they still need income.

## What It Does

Helps Australian international students, casual workers, and migrant workers understand:
- Whether a new part-time opportunity has scam, pay, visa, or documentation risks
- Whether an existing employment situation contains workplace rights issues
- Which facts are still missing before they decide to continue
- What evidence they should collect if they need to start or keep working
- What lower-risk similar job directions they can search for next

**This is NOT legal advice.** It is a practical triage tool that maps user-provided facts to official-source risk signals and conservative next steps.

## Core Features

### 1. Part-time Opportunity Checker

Assess a job offer or trial shift before committing. The checker returns:
- A decision band: stop, verify first, short-term with safeguards, or proceed
- Scam and job-quality risk signals
- Questions to ask the employer before starting
- Harm-reduction safeguards for users who urgently need income
- Safer similar job directions to search for

### 2. Employment Health Check
Answer structured questions about your job and get a comprehensive diagnostic report with:
- Findings with severity levels (Critical, High, Medium, Low, Info)
- Legal basis for each finding
- Recommended actions
- Evidence checklist

### 3. Situation Analyzer
Describe a workplace problem in natural language and get guidance on your rights.

### 4. Document Analysis
Upload payslips, contracts, or screenshots for analysis. PDF/image OCR is planned; the current MVP validates uploads and supports text extraction for plain text files.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL + Prisma |
| UI | Tailwind CSS + shadcn/ui |
| LLM | Vercel AI SDK + DeepSeek |
| Rule Engine | json-rules-engine |
| Auth | Clerk |
| Deployment | Vercel |

## Architecture

```
Opportunity Facts → Decision Engine → Risk Signals → Safeguards → Alternatives
Workplace Facts → Rule Engine → Findings → Report
```

**Key Principle:** Deterministic rules produce risk signals and findings. The LLM may help collect facts or explain outputs, but it does not create legal authority.

## Reliability Boundaries

- Current wage benchmarks must be kept in sync with official Fair Work updates.
- Award-specific pay rates depend on age, duties, classification, and coverage; the app points users to official calculators instead of pretending to know every rate.
- Synthetic or AI-generated case studies are not allowed as legal sources.
- High-risk scam signals such as upfront payment, crypto top-ups, money transfer work, and early identity-document requests should override ordinary opportunity scoring.
- If a user has urgent cash pressure and no other options, the product should provide harm-reduction steps instead of simply telling them to reject the job.

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (or use Prisma Postgres)

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and configure:
   ```bash
   cp .env.example .env
   ```

4. Set up the database:
   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `MIMO_API_KEY` | DeepSeek API key |
| `MIMO_BASE_URL` | DeepSeek API base URL |
| `MIMO_MODEL` | Model to use |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk auth public key |
| `CLERK_SECRET_KEY` | Clerk auth secret key |

## Legal Data Sources

- [Fair Work Ombudsman](https://www.fairwork.gov.au)
- [Fair Work Commission](https://www.fwc.gov.au)
- [Australian Taxation Office](https://www.ato.gov.au)
- [Department of Home Affairs](https://immi.homeaffairs.gov.au)

## Important Contacts

- **Fair Work Ombudsman:** 13 13 94
- **Translating & Interpreting Service:** 13 14 50

## Disclaimer

This tool provides general information only and does not constitute legal advice. For specific legal advice, please consult a qualified lawyer or contact the Fair Work Ombudsman on 13 13 94.

## License

Private — All rights reserved.
