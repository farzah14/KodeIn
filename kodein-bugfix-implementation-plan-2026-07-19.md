# KodeIn Verified Bug-Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the confirmed security, progress-integrity, runner, battle, privacy, and migration defects found in commit `d2dc8ed` without bundling unrelated redesign work.

**Architecture:** First contain exposed credentials and establish tests. Then move trust-sensitive behavior into server-only services: execution verifies code, completion rows make XP idempotent, and conditional database updates enforce battle state. API responses use explicit DTOs rather than serialized Prisma records.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5, Auth.js/NextAuth v5, Prisma 7/PostgreSQL, Vitest, Piston-compatible execution backend.

---

## Scope and sequencing

This plan supersedes the stale root `implementation_plan.md` for the findings listed in `kodein-verified-bug-audit-2026-07-19.md`. Execute tasks in order. Tasks 1-2 are incident containment; Tasks 3-8 change application behavior; Tasks 9-10 close migration, documentation, and CI gaps.

## Target file map

**Create**

- `vitest.config.ts` — test runner and `@/` alias configuration.
- `src/test/setup.ts` — deterministic test environment cleanup.
- `src/server/env.ts` — validated server-only configuration.
- `src/server/execution/piston.ts` — one hardened execution adapter.
- `src/server/execution/types.ts` — validated request/response types.
- `src/server/execution/verifyActivity.ts` — canonical server-side activity verification.
- `src/server/progress/awardCompletion.ts` — idempotent completion/XP transaction.
- `src/server/progress/streak.ts` — pure, unit-tested streak calculation.
- `src/server/rate-limit/executionQuota.ts` — durable per-user execution quota.
- `src/server/battle/dto.ts` — allow-listed battle state DTO.
- `src/app/api/auth/resend-verification/route.ts` — resend without credential mutation.
- `src/app/api/runner/health/route.ts` — authenticated/ops-only runner health response.
- `src/**/*.test.ts` and `src/**/*.integration.test.ts` — regression tests named below.
- `prisma/migrations/<generated timestamp>_security_integrity/migration.sql` — schema drift plus new tables.
- `.env.example` — variable names and safe examples only.
- `.github/workflows/ci.yml` — lint, type-check, tests, build, and migration validation.

**Modify**

- `.gitignore`, `package.json`, `package-lock.json`, `README.md`.
- `prisma/schema.prisma`.
- `src/auth.ts`, `src/lib/email.ts`.
- Auth, runner, progress, battle, profile/leaderboard API routes listed in the audit.
- `src/lib/progressStore.ts`, `src/components/steps/CodeStep.tsx`, `src/app/practice/[challengeId]/page.tsx`, `src/app/battle/[roomId]/page.tsx`, `src/app/leaderboard/page.tsx`.

**Delete from Git (preserve a private incident copy outside the repository only if needed)**

- `dev.db`
- `prisma/dev.db`

---

### Task 1: Contain tracked database exposure

**Files:**

- Modify: `.gitignore`
- Remove from Git: `dev.db`
- Remove from Git: `prisma/dev.db`

- [ ] **Step 1: Record the incident boundary without printing secret values**

Run:

```powershell
git rev-list --all --objects -- dev.db prisma/dev.db
git log --oneline --all -- dev.db prisma/dev.db
```

Expected: historical objects/commits are listed. Store the output in the private incident ticket, not in the repository.

- [ ] **Step 2: Add database artifacts to `.gitignore`**

Append exactly:

```gitignore
# Local databases may contain credentials, OAuth tokens, and sessions
*.db
*.db-journal
*.db-shm
*.db-wal
```

- [ ] **Step 3: Stop tracking both databases without deleting unrelated files**

Run:

```powershell
git rm --cached -- dev.db prisma/dev.db
git status --short
```

Expected: `.gitignore` is modified and the two database paths are staged as deletions.

- [ ] **Step 4: Rotate affected credentials before history cleanup**

Perform these external actions in this order:

1. Generate and deploy a new `AUTH_SECRET`; this invalidates existing JWT sessions.
2. Revoke the OAuth grants/tokens for the three affected users represented in the database, or disconnect and require OAuth re-linking.
3. Rotate Google and GitHub OAuth client secrets if the repository was ever public or accessible to untrusted collaborators.
4. Force password reset for all credential accounts found in the tracked database.
5. Confirm no production database URL or Resend key exists in either SQLite file before closing the incident.

Expected: old sessions and tokens no longer authenticate.

- [ ] **Step 5: Commit containment**

```powershell
git add .gitignore dev.db prisma/dev.db
git commit -m "security: remove tracked local databases"
```

- [ ] **Step 6: Coordinate history rewrite (destructive; obtain maintainer approval)**

After all collaborators pause pushes and make backup branches:

```powershell
git filter-repo --path dev.db --path prisma/dev.db --invert-paths
git remote add origin https://github.com/farzah14/KodeIn.git
git push --force --all origin
git push --force --tags origin
```

Expected: `git rev-list --all --objects -- dev.db prisma/dev.db` returns no paths. Every collaborator must re-clone; old clones still contain the sensitive objects.

---

### Task 2: Add a regression-test foundation

**Files:**

- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`

- [ ] **Step 1: Install the test tools**

Run:

```powershell
npm install --save-dev vitest @vitest/coverage-v8 vite-tsconfig-paths
```

- [ ] **Step 2: Add scripts to `package.json`**

Add under `scripts`:

```json
"typecheck": "tsc --noEmit --incremental false",
"test": "vitest run",
"test:watch": "vitest",
"test:coverage": "vitest run --coverage",
"check": "npm run lint && npm run typecheck && npm run test && npm run build"
```

- [ ] **Step 3: Create `vitest.config.ts`**

```typescript
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    setupFiles: ["./src/test/setup.ts"],
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/server/**/*.ts", "src/app/api/**/*.ts"],
    },
  },
});
```

- [ ] **Step 4: Create `src/test/setup.ts`**

```typescript
import { afterEach } from "vitest";

afterEach(() => {
  delete process.env.PISTON_BASE_URL;
  delete process.env.PISTON_AUTH_TOKEN;
  delete process.env.RESEND_API_KEY;
  delete process.env.AUTH_URL;
});
```

- [ ] **Step 5: Verify the empty harness and commit**

Run: `npm test`  
Expected: Vitest exits successfully with “No test files found” only if `passWithNoTests` is explicitly not required; immediately continue to Task 3 so CI never lands with no tests.

Commit after the first regression test is added in Task 3:

```powershell
git add package.json package-lock.json vitest.config.ts src/test
git commit -m "test: add Vitest regression harness"
```

---

### Task 3: Prevent unverified-account password takeover and make email fail closed

**Files:**

- Create: `src/server/env.ts`
- Create: `src/app/api/auth/resend-verification/route.ts`
- Create: `src/app/api/auth/register/route.test.ts`
- Create: `src/app/api/auth/resend-verification/route.test.ts`
- Modify: `src/app/api/auth/register/route.ts`
- Modify: `src/lib/email.ts`
- Modify: `src/auth.ts`
- Modify: `src/app/signup/page.tsx`
- Create/Modify: `.env.example`, `README.md`

- [ ] **Step 1: Write the failing takeover regression test**

Test name:

```typescript
it("does not change name or passwordHash when an unverified email already exists", async () => {
  // Mock prisma.user.findUnique to return an unverified credentials user.
  // POST the same email with a different name/password.
  // Assert prisma.user.update was never called.
  // Assert the response does not reveal whether the address exists.
});
```

Run:

```powershell
npx vitest run src/app/api/auth/register/route.test.ts
```

Expected before fix: FAIL because `prisma.user.update` is called.

- [ ] **Step 2: Create server-only environment validation**

Create `src/server/env.ts`:

```typescript
import "server-only";

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export function authEnv() {
  return {
    secret: required("AUTH_SECRET"),
    appUrl: new URL(required("AUTH_URL")).toString().replace(/\/$/, ""),
  };
}

export function emailEnv() {
  return {
    apiKey: required("RESEND_API_KEY"),
    from: required("EMAIL_FROM"),
    appUrl: authEnv().appUrl,
  };
}
```

In development tests, mock these functions; do not add production fallbacks to localhost.

- [ ] **Step 3: Make registration idempotent without credential mutation**

Replace the existing-user branch in `register/route.ts` with this behavior:

```typescript
if (existingUser) {
  return NextResponse.json(
    { message: "Jika alamat dapat menerima email, instruksi berikutnya akan dikirim." },
    { status: 202 },
  );
}
```

Do not list linked providers and do not update `name` or `passwordHash`.

- [ ] **Step 4: Add the dedicated resend endpoint**

The endpoint must:

1. Parse and normalize an email.
2. Always return the same `202` response for unknown, verified, OAuth-only, and unverified addresses.
3. For an unverified credentials account only, replace verification tokens in a transaction and send a new token.
4. Never mutate `User.name`, `User.passwordHash`, accounts, or progress.
5. Rate-limit by normalized email hash and request IP.

Core transaction:

```typescript
await prisma.$transaction(async (tx) => {
  await tx.verificationToken.deleteMany({ where: { identifier: email } });
  await tx.verificationToken.create({
    data: { identifier: email, token, expires },
  });
});
```

- [ ] **Step 5: Make email delivery truthful**

Change `sendVerificationEmail` to throw on missing configuration or provider failure. Only log the raw verification URL when `NODE_ENV === "development"`; never treat missing Resend configuration as success in production.

Route behavior after account creation:

```typescript
try {
  await sendVerificationEmail(normalizedEmail, token);
} catch (error) {
  console.error("Verification email delivery failed", { userId });
  return NextResponse.json(
    { error: "VERIFICATION_DELIVERY_FAILED" },
    { status: 503 },
  );
}
```

Do not log email addresses, tokens, or provider response bodies.

- [ ] **Step 6: Remove account-enumerating login errors**

In `src/auth.ts`, return the same credentials error for unknown user, OAuth-only user, and wrong password:

```typescript
throw new CustomAuthError("Email atau kata sandi tidak valid.");
```

Keep a distinct “email not verified” message only after a valid password comparison, so verification status is not disclosed to someone who does not know the password.

- [ ] **Step 7: Stop requiring Google OAuth in every production deployment**

Require `AUTH_SECRET`; add Google/GitHub only when both variables for that provider are present. If exactly one variable in a pair is present, throw a configuration error naming the incomplete provider pair. This matches the README statement that OAuth providers are optional.

- [ ] **Step 8: Update signup UI and environment docs**

- On `202`, show the generic response and a “Resend verification” action.
- Document `AUTH_URL`, not `NEXTAUTH_URL`, because application email links use `AUTH_URL`.
- Document `RESEND_API_KEY`, `EMAIL_FROM`, `PISTON_BASE_URL`, and optional `PISTON_AUTH_TOKEN`.
- Add only names/safe examples to `.env.example`; never copy `.env` values.

- [ ] **Step 9: Run tests and commit**

Run:

```powershell
npx vitest run src/app/api/auth/register/route.test.ts src/app/api/auth/resend-verification/route.test.ts
npm run typecheck
npm run lint
```

Expected: takeover test passes; no secret values appear in output.

Commit:

```powershell
git add src/auth.ts src/lib/email.ts src/server/env.ts src/app/api/auth src/app/signup/page.tsx .env.example README.md
git commit -m "fix(auth): prevent unverified account takeover"
```

---

### Task 4: Repair migration history and normalize completion/quota data

**Files:**

- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/<generated timestamp>_security_integrity/migration.sql`
- Create: `src/server/progress/awardCompletion.ts`
- Create: `src/server/progress/streak.ts`
- Create: `src/server/progress/awardCompletion.integration.test.ts`

- [ ] **Step 1: Add schema relations and models**

Add to `User`:

```prisma
completions    Completion[]
executionQuota ExecutionQuota[]
```

Add:

```prisma
enum CompletionKind {
  LESSON_STEP
  PRACTICE
}

model Completion {
  userId      String
  kind        CompletionKind
  activityId  String
  xpAwarded   Int
  completedAt DateTime       @default(now())
  user        User           @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([userId, kind, activityId])
  @@index([userId, completedAt])
}

model ExecutionQuota {
  userId      String
  windowStart DateTime
  count       Int      @default(0)
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([userId, windowStart])
  @@index([windowStart])
}
```

- [ ] **Step 2: Generate a real PostgreSQL migration**

Against a disposable development PostgreSQL database only:

```powershell
npx prisma migrate dev --name security_integrity --create-only
```

Inspect the generated SQL. It must include the previously missing `User.passwordHash` column and `BattleRoom` table as well as `Completion` and `ExecutionQuota`. Do not deploy until those operations are confirmed idempotent for the current production schema.

- [ ] **Step 3: Write the concurrent-completion regression test**

Test name:

```typescript
it("awards one XP increment when the same activity completes concurrently", async () => {
  const results = await Promise.all([
    awardCompletion(input),
    awardCompletion(input),
  ]);
  expect(results.filter((r) => r.awarded)).toHaveLength(1);
  expect(await completionCount(input)).toBe(1);
  expect(await progressXp(input.userId)).toBe(input.xp);
});
```

Expected before normalized implementation: the old JSON design cannot guarantee this invariant.

- [ ] **Step 4: Implement `awardCompletion` as one idempotent transaction**

Required behavior:

1. Insert `Completion` first; the composite primary key is the replay guard.
2. Upsert `Progress` and use `{ increment: xp }`, never `row.xp + xp`.
3. Update streak inside the same serializable transaction.
4. Retry Prisma `P2034` serialization/write conflicts at most three times.
5. On Prisma `P2002` for the completion key, return `{ awarded: false }` and the current progress without incrementing XP.

Function contract:

```typescript
export type AwardCompletionInput = {
  userId: string;
  kind: "LESSON_STEP" | "PRACTICE";
  activityId: string;
  xp: number;
  activityDateISO: string;
};

export async function awardCompletion(
  input: AwardCompletionInput,
): Promise<{ awarded: boolean; progress: ProgressDTO }>;
```

- [ ] **Step 5: Backfill completion rows from `completedJson`**

Add a one-time migration script that:

- Reads each `Progress.completedJson`.
- Inserts lesson keys as `LESSON_STEP` and `practice[]` values as `PRACTICE` with `skipDuplicates`.
- Sets `xpAwarded` from current canonical catalogs.
- Does not recalculate or reduce the existing total `Progress.xp` during backfill.
- Logs counts only, never user identifiers.

Run first on a database clone and reconcile total rows before production.

- [ ] **Step 6: Verify migration and commit**

Run:

```powershell
npx prisma validate
npx prisma generate
npx prisma migrate deploy
npx vitest run src/server/progress/awardCompletion.integration.test.ts
```

Expected: fresh and upgraded test databases both match `schema.prisma`; concurrent replay awards XP once.

Commit:

```powershell
git add prisma src/server/progress
git commit -m "fix(progress): make completions atomic and idempotent"
```

---

### Task 5: Restore and harden the code-execution backend

**Files:**

- Create: `src/server/execution/types.ts`
- Create: `src/server/execution/piston.ts`
- Create: `src/server/execution/piston.test.ts`
- Create: `src/server/rate-limit/executionQuota.ts`
- Modify: `src/app/api/run-code/route.ts`
- Create: `src/app/api/runner/health/route.ts`
- Modify: `src/lib/runner/pistonRunner.ts`

- [ ] **Step 1: Choose the supported deployment mode**

Select and document exactly one production configuration:

- **Recommended:** self-host Piston and set `PISTON_BASE_URL` to that private service.
- **Alternative:** obtain an approved public API token and set `PISTON_AUTH_TOKEN`; confirm the exact header format with the provider before implementation.

Do not deploy against anonymous `https://emkc.org` calls; official Piston policy has required authorization since 2026-02-15.

- [ ] **Step 2: Write failing adapter tests**

Cover:

```typescript
it("rejects an unsupported language");
it("rejects source code over 20,000 UTF-8 bytes");
it("uses server timeouts instead of caller timeouts");
it("aborts an upstream request after 8 seconds");
it("maps upstream failures to RUNNER_UNAVAILABLE without response-body leakage");
```

- [ ] **Step 3: Define server constants and request types**

```typescript
export const EXECUTION_LIMITS = {
  sourceBytes: 20_000,
  stdinBytes: 4_000,
  outputBytes: 20_000,
  compileTimeoutMs: 5_000,
  runTimeoutMs: 3_000,
  upstreamTimeoutMs: 8_000,
  memoryBytes: 128 * 1024 * 1024,
} as const;

export const LANGUAGE_VERSIONS = {
  python: "3.10.0",
  javascript: "18.15.0",
  typescript: "5.0.3",
  go: "1.16.2",
} as const;
```

SQL is intentionally excluded until its runtime contract is tested; do not map a version value (`sqlite3`) into the language field.

- [ ] **Step 4: Implement one Piston adapter**

`executeCode()` must construct the upstream payload itself. It must accept one source string, not arbitrary files/args/timeouts from the browser. Use `AbortSignal.timeout(EXECUTION_LIMITS.upstreamTimeoutMs)`, validate response structure, truncate output, and return a discriminated result. Never return upstream bodies or stack traces to clients.

- [ ] **Step 5: Require authentication and durable quota in `/api/run-code`**

Route order:

1. `auth()` and reject missing user ID with 401.
2. Parse JSON in `try/catch`.
3. Validate language/source/stdin.
4. Atomically increment the user's current one-minute `ExecutionQuota` bucket.
5. Reject count above 20 with 429 and `Retry-After: 60`.
6. Call `executeCode` and map errors to stable public codes.

- [ ] **Step 6: Add a health route**

The route should call the configured `/api/v2/runtimes` endpoint with a two-second abort timeout and return only `{ ok: boolean }`. Protect it with an authenticated admin/ops check; do not expose base URL or token state publicly.

- [ ] **Step 7: Verify and commit**

Run:

```powershell
npx vitest run src/server/execution/piston.test.ts
npm run typecheck
npm run lint
```

Expected: all limit, timeout, and error-redaction tests pass.

Commit:

```powershell
git add src/server/execution src/server/rate-limit src/app/api/run-code src/app/api/runner src/lib/runner/pistonRunner.ts
git commit -m "fix(runner): enforce supported backend and resource limits"
```

---

### Task 6: Make code completion server-verifiable

**Files:**

- Create: `src/server/execution/verifyActivity.ts`
- Create: `src/server/execution/verifyActivity.test.ts`
- Create: `src/server/challenges/hiddenCases.ts`
- Modify: `src/app/api/progress/complete-step/route.ts`
- Modify: `src/app/api/progress/complete-practice/route.ts`
- Modify: `src/lib/progressStore.ts`
- Modify: `src/components/steps/CodeStep.tsx`
- Modify: `src/app/practice/[challengeId]/page.tsx`

- [ ] **Step 1: Write bypass regression tests**

```typescript
it("rejects a code step completion when no code is supplied");
it("rejects a practice completion when server tests fail");
it("awards completion only after server verification passes");
it("does not award again when the verified request is replayed");
```

Expected before fix: direct authenticated POST with only an activity ID succeeds.

- [ ] **Step 2: Create server-only hidden cases**

`hiddenCases.ts` must start with `import "server-only";` and export cases keyed by canonical activity ID. Add at least one boundary case per code activity. Tests must assert every code activity has a hidden-case entry; this prevents silently adding unverified activities later.

- [ ] **Step 3: Implement the verifier contract**

```typescript
export type VerificationRequest =
  | { kind: "LESSON_STEP"; activityId: string; code?: string }
  | { kind: "PRACTICE"; activityId: string; code: string };

export type VerificationResult =
  | { passed: true; xp: number }
  | { passed: false; reason: "INVALID_ACTIVITY" | "CODE_REQUIRED" | "TEST_FAILED" | "RUNNER_UNAVAILABLE" };
```

For explain-only steps, `code` may be absent and completion means the user explicitly continued. For every code/practice activity, run canonical plus hidden cases through `executeCode`. Do not accept `xp`, `forceSuccess`, expected outputs, test cases, or timeouts from the client.

- [ ] **Step 4: Wire verification and award in one server request**

Completion route flow:

```typescript
const verification = await verifyActivity({ kind, activityId, code });
if (!verification.passed) return failureResponse(verification.reason);

const result = await awardCompletion({
  userId: session.user.id,
  kind,
  activityId,
  xp: verification.xp,
  activityDateISO: new Date().toISOString().slice(0, 10),
});
return NextResponse.json(result.progress);
```

- [ ] **Step 5: Remove trusted XP/success fields from clients**

Change contracts to:

```typescript
completeStep(stepId: string, code?: string)
completePractice(challengeId: string, code: string)
```

Delete client payload fields `xp`, `xpEarned`, and `forceSuccess`. Client-side Pyodide may remain as fast feedback, but only the server response may trigger success/XP UI.

- [ ] **Step 6: Verify and commit**

Run:

```powershell
npx vitest run src/server/execution/verifyActivity.test.ts src/app/api/progress
npm run typecheck
```

Expected: direct ID-only calls fail for code activities; valid server-verified code awards once.

Commit:

```powershell
git add src/server/challenges src/server/execution/verifyActivity* src/app/api/progress src/lib/progressStore.ts src/components/steps/CodeStep.tsx src/app/practice
git commit -m "fix(progress): require server-verified solutions"
```

---

### Task 7: Make battle state private and transitions atomic

**Files:**

- Create: `src/server/battle/dto.ts`
- Create: `src/app/api/battle/battle.integration.test.ts`
- Modify: `src/app/api/battle/join/route.ts`
- Modify: `src/app/api/battle/[roomId]/state/route.ts`
- Modify: `src/app/api/battle/[roomId]/submit/route.ts`
- Modify: `src/app/api/battle/[roomId]/surrender/route.ts`

- [ ] **Step 1: Write failing privacy and race tests**

```typescript
it("rejects battle state for an unauthenticated caller");
it("rejects battle state for a nonparticipant");
it("never serializes player1Code or player2Code");
it("accepts exactly one of two concurrent join requests");
it("keeps the first successful winner under concurrent submits");
it("rejects joining or submitting to an expired room");
```

- [ ] **Step 2: Define an explicit public DTO**

```typescript
export type BattleStateDTO = {
  id: string;
  status: "waiting" | "active" | "finished";
  challengeId: string;
  player1Id: string;
  player2Id: string | null;
  player1Done: boolean;
  player2Done: boolean;
  player1Result: string;
  player2Result: string;
  winnerId: string | null;
  player1: { name: string | null; image: string | null } | null;
  player2: { name: string | null; image: string | null } | null;
};
```

Build this DTO field by field. Never spread `room`.

- [ ] **Step 3: Authenticate the SSE route before creating the stream**

Call `auth()`, fetch only participant IDs, and return 401/403 before constructing `ReadableStream`. Within polling, select only DTO fields. Stop polling when the room is finished, expired, missing, or the request aborts.

- [ ] **Step 4: Make join conditional**

```typescript
const claimed = await prisma.battleRoom.updateMany({
  where: {
    id: roomId,
    status: "waiting",
    player2Id: null,
    player1Id: { not: userId },
    expiresAt: { gt: new Date() },
  },
  data: { player2Id: userId, status: "active" },
});

if (claimed.count !== 1) {
  return NextResponse.json({ error: "ROOM_NOT_AVAILABLE" }, { status: 409 });
}
```

- [ ] **Step 5: Make first winner immutable**

After code verification, use a conditional update whose `where` includes `status: "active"`, `winnerId: null`, membership, and `expiresAt > now`. A zero count means another request already finished the room; fetch and return the canonical final state without overwriting it.

- [ ] **Step 6: Make surrender conditional**

Use the same active/no-winner preconditions. Reject surrender by a nonparticipant and never replace an existing winner.

- [ ] **Step 7: Remove duplicate direct Piston calls**

Battle submit must call the hardened `executeCode`/verification service from Task 5, not fetch `emkc.org` directly and not run one remote request per test case. Build a single harness containing all cases so one submission creates one execution job.

- [ ] **Step 8: Verify and commit**

Run:

```powershell
npx vitest run src/app/api/battle/battle.integration.test.ts
npm run typecheck
```

Expected: code fields never appear; one join and one winner succeed under concurrency.

Commit:

```powershell
git add src/server/battle src/app/api/battle
git commit -m "fix(battle): protect state and enforce atomic transitions"
```

---

### Task 8: Stop SSE connection churn in the battle client

**Files:**

- Modify: `src/app/battle/[roomId]/page.tsx`
- Create: `src/app/battle/[roomId]/page.test.tsx`

- [ ] **Step 1: Write the failing connection-count test**

Mock `EventSource`, render the page, simulate multiple editor changes, and assert the constructor was called once for the same `roomId`.

- [ ] **Step 2: Remove `code` from the effect dependency**

Use:

```typescript
useEffect(() => {
  const sse = new EventSource(`/api/battle/${roomId}/state`);
  sse.onmessage = (event) => {
    const data = JSON.parse(event.data) as BattleStateDTO;
    setRoom(data);
    if (data.status === "active") {
      const challenge = battleChallenges.find((item) => item.id === data.challengeId);
      if (challenge) setCode((current) => current || challenge.starterCode);
    }
  };
  return () => sse.close();
}, [roomId]);
```

Do not close the stream immediately in `onerror`; EventSource has native retry behavior. Show a disconnected state after a bounded timeout instead.

- [ ] **Step 3: Verify and commit**

Run: `npx vitest run src/app/battle/[roomId]/page.test.tsx`  
Expected: typing does not create another EventSource.

Commit:

```powershell
git add src/app/battle/[roomId]
git commit -m "fix(battle): keep one state stream per room"
```

---

### Task 9: Remove leaderboard email leakage and sanitize public errors

**Files:**

- Modify: `src/app/api/leaderboard/route.ts`
- Modify: `src/app/leaderboard/page.tsx`
- Modify: `src/app/api/run-code/route.ts`
- Modify: `src/app/api/battle/create/route.ts`
- Modify: `src/app/api/battle/[roomId]/submit/route.ts`
- Create: `src/app/api/leaderboard/route.test.ts`

- [ ] **Step 1: Write the email-leak regression test**

Mock a user with `image: null` and `email: "private@example.test"`. Assert the serialized response does not contain `private@example.test` or an `email` key.

- [ ] **Step 2: Return a public avatar contract**

Prisma select:

```typescript
select: {
  id: true,
  name: true,
  image: true,
  progress: { select: { xp: true, streakCurrent: true } },
}
```

DTO fields:

```typescript
{
  id: user.id,
  name: user.name || "Anonymous",
  image: isAllowedPublicImage(user.image) ? user.image : "",
  avatarSeed: user.id,
  xp: user.progress?.xp ?? 0,
  streak: user.progress?.streakCurrent ?? 0,
}
```

Update the page to pass `seed={entry.avatarSeed}` to `UserAvatar`.

- [ ] **Step 3: Remove internal details from public 500 responses**

Delete `details: (error as Error).message` and upstream body fields from all API responses. Log a generated request ID plus a redacted error server-side; return `{ error: "INTERNAL_ERROR", requestId }`.

- [ ] **Step 4: Verify and commit**

Run:

```powershell
npx vitest run src/app/api/leaderboard/route.test.ts
rg -n "details:|user\.email \|\|" src/app/api
```

Expected: test passes; the search returns no public error-detail or email-fallback pattern.

Commit:

```powershell
git add src/app/api src/app/leaderboard/page.tsx
git commit -m "fix(privacy): remove email and error-detail leaks"
```

---

### Task 10: Add CI gates, clean warnings, and finalize documentation

**Files:**

- Create: `.github/workflows/ci.yml`
- Modify: files reported by ESLint
- Modify: `README.md`
- Modify: root `implementation_plan.md` (replace with a short superseded notice or archive it)

- [ ] **Step 1: Add CI workflow**

Workflow requirements:

```yaml
name: ci
on:
  pull_request:
  push:
    branches: [main]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint -- --max-warnings=0
      - run: npm run typecheck
      - run: npm test
      - run: npm run build
```

Supply test-only environment variables through workflow `env`; do not commit real secrets. Mock runner/email integrations in unit tests.

- [ ] **Step 2: Clear the 13 audited lint warnings**

Remove unused constants/imports/disable comments, use `next/image` or a documented custom image loader in `UserAvatar`, and rerun ESLint with `--max-warnings=0`. Do not mix behavioral refactors into this cleanup commit.

- [ ] **Step 3: Correct README runtime and migration instructions**

Document:

- PostgreSQL only; remove local SQLite artifacts from the project structure.
- `npx prisma migrate deploy` for deployment, not `db push`.
- Supported Piston deployment mode and health check.
- Required auth/email environment variables and optional provider pairs.
- Test/check commands.

- [ ] **Step 4: Mark the old plan as superseded**

Do not leave two active contradictory plans. Replace the first paragraph of root `implementation_plan.md` with a link to the approved copy of this verified plan after it is moved into `docs/superpowers/plans/2026-07-19-kodein-verified-bug-fixes.md` inside the repository.

- [ ] **Step 5: Run the full release gate**

```powershell
npm run lint -- --max-warnings=0
npm run typecheck
npm test
npm run build
npm audit --json
git status --short
```

Expected:

- 0 lint errors and 0 warnings.
- TypeScript PASS.
- All regression and integration tests PASS.
- Production build PASS.
- Dependency audit result recorded with date; do not fail the release solely on informational entries without review.
- Git status contains only intended plan/implementation changes.

- [ ] **Step 6: Commit final quality gate**

```powershell
git add .github README.md implementation_plan.md src package.json package-lock.json
git commit -m "ci: enforce KodeIn release checks"
```

---

## Release acceptance criteria

- [ ] `dev.db` and `prisma/dev.db` are absent from the current tree and rewritten history; credentials/tokens are rotated.
- [ ] Re-registering an unverified email cannot mutate credentials.
- [ ] Missing email configuration produces a truthful failure, never a fake success.
- [ ] Code activities cannot award XP without server verification.
- [ ] Concurrent replay awards a completion once; concurrent different completions do not lose data.
- [ ] Runner uses a supported authenticated/self-hosted backend with auth, quotas, size limits, memory/time limits, and aborts.
- [ ] Battle SSE is participant-only and never contains either code field.
- [ ] Concurrent joins/wins produce one accepted player and one immutable winner.
- [ ] Typing creates no additional EventSource connections.
- [ ] Leaderboard responses never contain email addresses.
- [ ] Fresh database deployment from migrations matches `schema.prisma`.
- [ ] Lint, type-check, tests, build, and dependency audit complete successfully in CI.

## Implementation handoff

Plan complete. Recommended execution is **subagent-driven development**, one task at a time with review between tasks. The safe alternative is **inline execution** in this task using `executing-plans` with checkpoints. Task 1 history rewriting and all credential rotations require explicit human coordination before execution.

