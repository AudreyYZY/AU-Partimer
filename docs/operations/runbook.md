# Deployment and recovery

## Runtime and setup

Use Node.js 22 and PostgreSQL 17. Install with `npm ci`; the postinstall hook
generates Prisma Client. Build with `npm run build`, run with `npm start`.
The PDF extractor requires a Node process runtime with child processes enabled.
Its worker script and unpdf dependency are included in Next output tracing.
Do not deploy the upload route to an Edge runtime.

For a new database run `npm run db:deploy`. The initial migration assumes an
empty database. For an existing database, inspect and baseline its schema first;
do not apply an initial CREATE migration blindly to existing tables.
No illustrative award-rate rows are seeded.

## Configuration

- DATABASE_URL: PostgreSQL connection string. Required for production request
  budgets and optional server backups.
- NEXT_PUBLIC_APP_URL: exact public origin used by the origin check.
- OPENAI_API_KEY / OPENAI_MODEL: optional situation-analysis provider configuration.
- ABN_LOOKUP_GUID: optional official registry integration.
- APP_ACCESS_TOKEN: random pilot token of at least 32 characters. Production
  online chat, registry, uploads and backup require an access cookie or bearer token.
- ENABLE_REMOTE_BACKUP: explicitly set to true to enable backups.
- CASE_ENCRYPTION_KEY: 64 hex characters (32 random bytes), stored outside the database.

The browser-only screening workflow works without provider keys or a database.
Unconfigured production online services fail closed. Do not advertise them as
available just because a page exists.

## Access and retention

Server backup is a controlled pilot, not an account or SSO system. Each browser
gets a random 256-bit HttpOnly/SameSite cookie. Only its SHA-256 hash is stored.
Every read, update and delete includes the owner hash. Updates use an expected
revision to reject stale writes. AES-256-GCM binds the ciphertext to owner and
case ID. Never rotate the encryption key without migrating ciphertext.

The owner cookie expires after 30 days; export remains the recovery mechanism.
There is no cross-device account recovery. Deleting a local case does not delete
its server copy; the backup panel has a separate delete action.
Device storage is plaintext browser storage and opt-in, unsuitable for shared
devices. No raw uploaded file is stored by the upload endpoint.

## Request budgets and observability

Production budgets are atomic PostgreSQL counters shared across instances:
8 chat requests per minute, 100 per day, and 60 requests per minute for each
other route class. These are global pilot limits, not per-user entitlements.
Development uses bounded in-memory counters. Provider retries are disabled for
chat; tool steps and output tokens are capped. Budget exhaustion returns 429.

Only request ID, route class, status and duration are logged. Do not enable
logging of request bodies, provider URLs with credentials, documents or messages.
The capability endpoint is configuration/liveness information, not proof of
provider or database health. CI tests are separate from production smoke tests.

## Backup restoration drill

1. Create a disposable database using the same migration.
2. Restore a database backup and the corresponding encryption key separately.
3. Verify a test owner can read only their own case.
4. Verify a stale update fails with 409 and cross-owner reads return no cases.
5. Delete the test case, confirm it is gone, and destroy the disposable database.

Production rollout also needs a documented retention policy. Prune expired
ApiBudget rows regularly and decide an approved lifetime for encrypted cases;
no background retention job is installed by this change.

## Release checklist

Run lint, typecheck, unit tests, real PostgreSQL integration tests, evaluation,
production build and desktop/mobile browser tests. Then perform credentialed
provider smoke tests, restore drill and human validation described in
docs/research/validation-protocol.md.

Monitor 429/5xx rates, latency, provider costs and evidence failures. Alert on
unexpected changes in outcome distribution or source-review expiry. The initial
policy requests source review by 2026-10-07; this is an internal maintenance
deadline, not a legal validity date.
