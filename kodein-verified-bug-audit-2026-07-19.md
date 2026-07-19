# KodeIn Verified Bug Audit

**Audit date:** 2026-07-19 (Asia/Jakarta)  
**Repository:** `D:\KodeIn`  
**Commit audited:** `d2dc8ed` (`main`)  
**Scope:** application code, API routes, Prisma schema/migrations, tracked artifacts, authentication, code execution, progress integrity, battle correctness, build/lint/type-check, and dependency audit.

## Executive result

The project builds, type-checks, and has no dependency advisories reported by npm, but it is not production-safe yet. The audit confirmed 10 actionable defects: 3 critical, 4 high, and 3 medium. The most urgent issue is not a TypeScript failure: a tracked SQLite database contains account and session records in Git history.

The existing `D:\KodeIn\implementation_plan.md` is stale. Some of its proposed changes are already present, and its “server-side XP verification” still trusts a client-supplied activity ID rather than proving that code passed tests. Do not execute that plan unchanged.

## Verification snapshot

| Check | Result | Source and context |
|---|---:|---|
| Production build | PASS | `npm run build`, local repository, 2026-07-19; Next.js compiled and generated all 19 static pages. |
| TypeScript | PASS | `npx tsc --noEmit --incremental false`, local repository, 2026-07-19. |
| ESLint | PASS with 13 warnings | `npm run lint`, local repository, 2026-07-19; 0 errors and 13 warnings. |
| Automated application tests | NONE FOUND | File inventory and `package.json`, local repository, 2026-07-19; there is no test script/framework or `*.test.*` / `*.spec.*` suite. |
| Dependency advisories | 0 | `npm audit --json`, npm registry snapshot, 2026-07-19; 684 total dependency entries checked. This can change after the audit date. |
| Git working tree | CLEAN before audit | `git status --short`, local repository, 2026-07-19. Build output remains ignored. |

## Confirmed findings

### KDN-001 — Critical — Account/session database is committed to Git

**Evidence**

- `git ls-files` confirms both `dev.db` and `prisma/dev.db` are tracked.
- A read-only count (values were deliberately not displayed) found `prisma/dev.db` contains 3 `User` rows, 4 `Account` rows, and 1 `Session` row.
- `git log -- dev.db prisma/dev.db` confirms the database files exist across multiple commits.
- The `Account` schema contains `access_token`, `refresh_token`, and `id_token`; `Session` contains `sessionToken`: `prisma/schema.prisma:24-50`.

**Impact**

Email addresses, password hashes, OAuth tokens, or session tokens may exist in current or historical Git objects. Repository visibility could not be verified from this environment, so public exposure is unconfirmed; history exposure to anyone with repository access is confirmed.

**Root cause**

`.gitignore` excludes `.env` and `.next`, but it does not exclude SQLite database files, and already-tracked files are not removed by adding ignore rules later.

**Required response**

Treat tokens as potentially exposed: stop tracking the databases, rotate `AUTH_SECRET`, revoke OAuth grants/tokens represented in the database, invalidate sessions, force password reset for affected credential users, and coordinate a Git history rewrite. History rewriting and force-pushing are destructive operations and must be scheduled with collaborators.

### KDN-002 — Critical — Signup can overwrite an unverified user's password

**Evidence**

`src/app/api/auth/register/route.ts:62-95` handles an existing unverified credentials account by replacing `name` and `passwordHash`, deleting its verification tokens, and creating a new token. The request is unauthenticated and requires only the email address.

**Deterministic abuse path**

1. A user creates an account but has not verified it.
2. Another person submits the same email and a password they control.
3. The route replaces the original password hash.
4. If the owner clicks the new verification email, the attacker's chosen password becomes usable.

Even without verification, this creates denial of service by invalidating the owner's intended password.

**Root cause**

The route combines account creation, password change, and verification-email resend into one unauthenticated operation.

**Required fix**

Never mutate account credentials from the resend path. Return a generic accepted response for existing addresses. Create a dedicated resend endpoint that rotates only the verification token. Password changes must use a separate password-reset flow with a purpose-bound, expiring token.

### KDN-003 — Critical — Users can award themselves progress and XP without solving code

**Evidence**

- `src/app/api/progress/complete-step/route.ts:83-100` accepts `stepId` and derives XP from catalog metadata, but it never receives or verifies submitted code.
- `src/app/api/progress/complete-practice/route.ts:83-92` accepts `challengeId` and derives XP, but it never receives or verifies code.
- Client-side execution occurs before these calls (`src/app/practice/[challengeId]/page.tsx:93-99` and `src/components/steps/CodeStep.tsx`), but an authenticated caller can bypass the UI and call the completion endpoints directly.

**Impact**

Any authenticated user can mark every known activity complete and inflate leaderboard XP without passing a test. Server-side XP calculation prevents arbitrary XP amounts, but it does not prove completion.

**Root cause**

Authorization is present, but proof of successful activity is not. The server trusts a client-reported completion event.

**Required fix**

For code activities, send code to a server-only verification service, run canonical and hidden tests, and award completion only in the same server transaction after a pass. Store each completion as a unique database row so replay cannot award XP twice.

### KDN-004 — High — Piston integration is currently incompatible with the public API policy

**Evidence**

- Both `src/app/api/run-code/route.ts:33-39` and `src/app/api/battle/[roomId]/submit/route.ts:38-42` call `https://emkc.org/api/v2/piston/execute` without an authorization header.
- The official Piston repository states that the public API has required an authorization token since 2026-02-15 and recommends self-hosting when a key is unavailable: https://github.com/engineer-man/piston#public-api (official source, checked 2026-07-19).

**Impact**

Code checking and battle submission are expected to fail at runtime unless this deployment receives an undocumented exception. The production build cannot detect this because it does not execute the remote call.

**Root cause**

The integration assumes the pre-2026 anonymous public API contract.

**Required fix**

Choose one supported execution backend: self-host Piston and configure `PISTON_BASE_URL`, or obtain an authorized token and implement the provider's documented authentication. Add a startup health check and an integration test that fails closed when the runner is unavailable.

### KDN-005 — High — Battle state leaks both players' code and has no participant authorization

**Evidence**

- `src/app/api/battle/[roomId]/state/route.ts` never calls `auth()`.
- Lines 28-50 fetch the full `BattleRoom` and spread `...room` into every SSE message. The Prisma model includes `player1Code` and `player2Code` at `prisma/schema.prisma:80-81`.
- The client `RoomState` does not need either code field (`src/app/battle/[roomId]/page.tsx:25-38`).

**Impact**

Anyone who knows a room ID—including either opponent—can observe both stored submissions over the network. This exposes solutions during an active competition and reveals player metadata to nonparticipants.

**Root cause**

The API serializes a persistence model directly instead of an authenticated, allow-listed response DTO.

**Required fix**

Authenticate before opening the stream, require the session user to be player 1 or player 2, and use an explicit `select`/DTO that never includes code. Do not return Prisma records directly.

### KDN-006 — High — Battle join and winner selection have race conditions

**Evidence**

- Join uses read-then-write: `src/app/api/battle/join/route.ts:11-25`. Two callers can both read `waiting`; the later update overwrites `player2Id`.
- Winner selection uses read-then-write: `src/app/api/battle/[roomId]/submit/route.ts:16` reads the room, and lines 84-93 set a winner only based on the stale `room.winnerId`. Two passing submissions can both see `null`; the later update can replace the first winner.
- Surrender follows the same stale-state pattern at `src/app/api/battle/[roomId]/surrender/route.ts:14-45`.

**Impact**

The accepted second player or winner can change based on request timing rather than business rules.

**Root cause**

State preconditions are checked in application memory, but the database update does not include those preconditions.

**Required fix**

Use conditional `updateMany` operations whose `where` clauses include the expected state (`waiting`, `player2Id: null`, `winnerId: null`, not expired). Treat `count === 0` as conflict. Add concurrent integration tests.

### KDN-007 — High — Code runner is an unauthenticated, unbounded proxy

**Evidence**

`src/app/api/run-code/route.ts` has no authentication or rate limit. It forwards caller-controlled `files`, `stdin`, `args`, compile timeout, and run timeout. Lines 27-28 explicitly send unlimited memory (`-1`). Lines 52-56 return internal error details.

**Impact**

Anonymous callers can consume the application's runner allowance, submit large payloads, request excessive timeouts, and amplify outbound requests. This can cause cost, throttling, or denial of service.

**Root cause**

The route treats a privileged execution backend as a transparent public proxy.

**Required fix**

Require a session, validate an allow-listed schema, cap code/input/output sizes, ignore caller timeouts in favor of server constants, apply a durable per-user quota, add an upstream abort timeout, and return generic errors.

### KDN-008 — Medium — Progress updates can lose completions under concurrency

**Evidence**

Both completion routes read `completedJson`, modify it in memory, and replace the whole string (`complete-step:111-139`, `complete-practice:105-137`). Two requests starting from the same row can write different snapshots; the later write loses one completion and one XP increment.

**Root cause**

Multiple logical completion records are stored in one JSON string and updated with a read-modify-write sequence.

**Required fix**

Normalize completion records into a table with a composite unique key. Insert the completion and atomically increment XP in one transaction. Keep `completedJson` only during a time-bounded migration, then remove it.

### KDN-009 — Medium — Leaderboard exposes email addresses through the image field

**Evidence**

`src/app/api/leaderboard/route.ts:13` selects email, and line 42 returns `image: user.image || user.email || "user"`. The endpoint is unauthenticated. `UserAvatar` treats a non-URL value as a seed, so a stable non-email ID can provide the same behavior.

**Impact**

Users without uploaded images have their email returned to every leaderboard caller under a misleading field name.

**Required fix**

Do not select email. Return `avatarSeed: user.id` separately and return only validated public image URLs/data allowed by product policy.

### KDN-010 — Medium — SSE reconnects on every code edit

**Evidence**

`src/app/battle/[roomId]/page.tsx:56-68` creates an `EventSource` inside an effect whose dependency list is `[roomId, code]`. Each editor change updates `code`, closes the current stream, and creates a new stream. Each stream polls the database every two seconds.

**Impact**

Typing causes connection churn and unnecessary database load; transient errors also permanently close the stream because `onerror` calls `close()`.

**Required fix**

Depend only on `roomId`; initialize starter code with a functional state update. Implement bounded reconnect/backoff or allow native EventSource reconnection.

## Schema and deployment drift

The only committed PostgreSQL migration (`prisma/migrations/20251221112053_init_postgres/migration.sql`) does not contain `User.passwordHash` or the `BattleRoom` table, although both exist in `prisma/schema.prisma`. A fresh environment using `prisma migrate deploy` would not match the generated Prisma client. The README currently instructs `prisma db push`, which bypasses migration history rather than fixing it. Add and test a real migration before production deployment.

## Not classified as functional bugs

- The 13 ESLint warnings are cleanup/performance debt, not proof of broken behavior. Fix them after the security and integrity work.
- `npm audit` reported zero known advisories on 2026-07-19. This is a time-specific registry result, not a guarantee that dependencies are vulnerability-free.
- Production build and TypeScript checks passed. They do not exercise external Piston, concurrent requests, database history exposure, or authorization logic.

## Recommended order

1. Contain KDN-001 and KDN-002 immediately.
2. Restore a supported runner backend (KDN-004) and harden the proxy (KDN-007).
3. Make progress server-verifiable and atomic (KDN-003/KDN-008).
4. Secure battle state and transitions (KDN-005/KDN-006/KDN-010).
5. Remove leaderboard email leakage and repair migrations/documentation.
6. Add CI gates and clear non-blocking lint warnings.

