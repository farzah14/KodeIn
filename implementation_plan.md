# Bug Fixing & Stability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all 30+ security, logic, data, component, and translation bugs across the KodeIn codebase to ensure stability, safety, and correctness.

**Architecture:** We will implement strict input validation, transaction-based database queries to eliminate race conditions, secure server-side XP verification, try/catch handlers for resilient async operations, and correct the Python content/test cases.

**Tech Stack:** Next.js 16, React 19, Prisma, Tailwind CSS v4, NextAuth v5, Piston API

---

### Task 1: Auth & Database Connection Security

**Files:**
- Modify: `src/auth.ts`
- Modify: `src/lib/prisma.ts`

- [ ] **Step 1: Harden next-auth configuration**
  Open [src/auth.ts](file:///D:/KodeIn/src/auth.ts). Change `debug: true` to use conditional development mode, validate OAuth env vars on startup in production, and remove the invalid `prompt` parameter from GitHub OAuth provider config.
  ```typescript
  // Update authConfig in src/auth.ts:
  if (process.env.NODE_ENV === "production") {
    if (!process.env.AUTH_SECRET) throw new Error("Missing AUTH_SECRET env var");
    if (!process.env.AUTH_GOOGLE_ID || !process.env.AUTH_GOOGLE_SECRET) throw new Error("Missing Google OAuth credentials");
    if (!process.env.AUTH_GITHUB_ID || !process.env.AUTH_GITHUB_SECRET) throw new Error("Missing GitHub OAuth credentials");
  }

  const authConfig: NextAuthConfig = {
    adapter: PrismaAdapter(prisma),
    secret: process.env.AUTH_SECRET,
    trustHost: true,
    session: { strategy: "jwt" },
    providers: [
      Google({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
        authorization: { params: { prompt: "select_account" } },
      }),
      GitHub({
        clientId: process.env.AUTH_GITHUB_ID,
        clientSecret: process.env.AUTH_GITHUB_SECRET,
        // Removed prompt: select_account as GitHub does not support it
      }),
    ],
    // ...
    debug: process.env.NODE_ENV === "development",
  };
  ```

- [ ] **Step 2: Harden Prisma client & connection validation**
  Open [src/lib/prisma.ts](file:///D:/KodeIn/src/lib/prisma.ts). Fix global variable naming declaration mismatch and validate `DATABASE_URL` is set before starting pool creation.
  ```typescript
  import { PrismaClient } from "@prisma/client";
  import { PrismaPg } from "@prisma/adapter-pg";
  import pg from "pg";

  declare global {
    var prismaV7: PrismaClient | undefined;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is missing.");
  }

  function createPrismaClient() {
    const pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  }

  export const prisma = (globalThis as unknown as { prismaV7: PrismaClient | undefined }).prismaV7 || createPrismaClient();

  if (process.env.NODE_ENV !== "production") (globalThis as unknown as { prismaV7: PrismaClient | undefined }).prismaV7 = prisma;
  ```

---

### Task 2: API Route Security, XP Verification, & Race Conditions

**Files:**
- Modify: `src/app/api/progress/complete-step/route.ts`
- Modify: `src/app/api/progress/complete-practice/route.ts`
- Modify: `src/app/api/battle/[roomId]/submit/route.ts`

- [ ] **Step 1: Secure complete-step route**
  Open [src/app/api/progress/complete-step/route.ts](file:///D:/KodeIn/src/app/api/progress/complete-step/route.ts). Secure XP tracking by calculating values server-side based on step type, handle JSON parsing failures, and run the database logic in a transaction.
  ```typescript
  import { auth } from "@/auth";
  import { prisma } from "@/lib/prisma";
  import { content } from "@/lib/content";
  import type { Progress as ProgressModel } from "@prisma/client";
  import { NextResponse } from "next/server";

  export const dynamic = "force-dynamic";
  // ... Keep types, normalize, safeParseCompleted, updateStreak helpers ...

  export async function POST(req: Request): Promise<NextResponse> {
    const session = await auth();
    const email = session?.user?.email;
    if (!email) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { stepId } = body;
    if (!stepId) return NextResponse.json({ error: "stepId is required" }, { status: 400 });

    // Look up step server-side to prevent XP spoofing
    let foundStep = null;
    for (const lesson of Object.values(content.lessons)) {
      const step = lesson.steps.find(s => s.id === stepId);
      if (step) {
        foundStep = step;
        break;
      }
    }

    if (!foundStep) return NextResponse.json({ error: "Step not found" }, { status: 404 });
    const xpEarned = foundStep.type === "code" ? 10 : 2;

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (!user) return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 });

    const updated = await prisma.$transaction(async (tx) => {
      const row =
        (await tx.progress.findUnique({ where: { userId: user.id } })) ??
        (await tx.progress.create({ data: { userId: user.id } }));

      const completed = safeParseCompleted(row.completedJson);
      const alreadyDone = !!completed[stepId];

      const { todayISO, current, longest } = updateStreak({
        streakCurrent: row.streakCurrent,
        streakLongest: row.streakLongest,
        lastActiveISO: row.lastActiveISO,
      });

      if (!alreadyDone) {
        completed[stepId] = true;
      }

      return await tx.progress.update({
        where: { userId: user.id },
        data: {
          xp: alreadyDone ? row.xp : row.xp + xpEarned,
          completedJson: JSON.stringify(completed),
          streakCurrent: current,
          streakLongest: longest,
          lastActiveISO: todayISO,
        },
      });
    });

    return NextResponse.json(normalize(updated));
  }
  ```

- [ ] **Step 2: Secure complete-practice route**
  Open [src/app/api/progress/complete-practice/route.ts](file:///D:/KodeIn/src/app/api/progress/complete-practice/route.ts). Check practice XP server-side and run update inside a Prisma `$transaction`.
  ```typescript
  import { prisma } from "@/lib/prisma";
  import { auth } from "@/auth";
  import { practiceChallenges } from "@/lib/practiceChallenges";
  import type { Progress as ProgressModel } from "@prisma/client";
  import { NextResponse } from "next/server";

  export const dynamic = "force-dynamic";
  // ... Keep types, normalize, safeParseCompleted, updateStreak helpers ...

  export async function POST(req: Request): Promise<NextResponse> {
    const session = await auth();
    const email = session?.user?.email;
    if (!email) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

    try {
      let body;
      try {
        body = await req.json();
      } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
      }
      const { challengeId } = body;
      if (!challengeId) return NextResponse.json({ error: "challengeId is required" }, { status: 400 });

      // Look up challenge XP server-side
      const challenge = practiceChallenges.find(c => c.id === challengeId);
      if (!challenge) return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
      const xpEarned = challenge.xp;

      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });
      if (!user) return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 });
      const userId = user.id;

      const updated = await prisma.$transaction(async (tx) => {
        const row =
          (await tx.progress.findUnique({ where: { userId } })) ??
          (await tx.progress.create({ data: { userId } }));

        const completed = safeParseCompleted(row.completedJson);
        const practiceArray = completed.practice;
        const practiceSet = new Set(Array.isArray(practiceArray) ? practiceArray : []);
        
        const alreadyDone = practiceSet.has(challengeId);

        const { todayISO, current, longest } = updateStreak({
          streakCurrent: row.streakCurrent,
          streakLongest: row.streakLongest,
          lastActiveISO: row.lastActiveISO,
        });

        if (!alreadyDone) {
          practiceSet.add(challengeId);
          completed.practice = Array.from(practiceSet);
        }

        return await tx.progress.update({
          where: { userId },
          data: {
            xp: alreadyDone ? row.xp : row.xp + xpEarned,
            completedJson: JSON.stringify(completed),
            streakCurrent: current,
            streakLongest: longest,
            lastActiveISO: todayISO,
          },
        });
      });
      
      return NextResponse.json(normalize(updated));
    } catch (error) {
      console.error("Complete Practice Error:", error);
      return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
    }
  }
  ```

- [ ] **Step 3: Remove Battle submit backdoor bypass**
  Open [src/app/api/battle/[roomId]/submit/route.ts](file:///D:/KodeIn/src/app/api/battle/%5BroomId%5D/submit/route.ts). Remove lines 27 to 52 containing `forceSuccess` check so that users cannot cheat in multiplayer arena battles.
  ```typescript
  // Remove forceSuccess from request destructured parameters:
  const { code } = await req.json(); // Remove forceSuccess
  
  // Delete the block: if (forceSuccess !== undefined) { ... } completely!
  ```

---

### Task 3: Client-side UI Hydration & Resilience

**Files:**
- Modify: `src/components/Topbar.tsx`
- Modify: `src/components/steps/CodeStep.tsx`
- Modify: `src/components/CodeEditor.tsx`
- Create: `src/components/ErrorBoundary.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Fix Topbar theme SSR hydration mismatch**
  Open [src/components/Topbar.tsx](file:///D:/KodeIn/src/components/Topbar.tsx). Initialize the state as `"system"` and only load the saved value in a `useEffect` hook.
  ```typescript
  const [theme, setThemeState] = useState<"light" | "dark" | "system">("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("kodeln_theme") as "light" | "dark" | "system" | null;
    if (saved) {
      setThemeState(saved);
    }
  }, []);
  ```

- [ ] **Step 2: Add CodeStep try/catch handlers for network & database robustness**
  Open [src/components/steps/CodeStep.tsx](file:///D:/KodeIn/src/components/steps/CodeStep.tsx). Wrap `runWithPiston` call and `completeStep` call in try-catches.
  ```typescript
  // Replace onCheck inside src/components/steps/CodeStep.tsx:
  const onCheck = async () => {
    if (status === "checking") return;
    setStatus("checking");
    setResult(undefined);

    try {
      const res = await runWithPiston({
        language: "python",
        code,
        functionName: step.functionName,
        publicCases: step.publicCases,
        timeoutMs: 3000,
      });

      if (res.status === "pass") {
        setStatus("pass");
        try {
          await completeStep(step.id, 10);
        } catch (persistErr) {
          console.error("Failed to save progress", persistErr);
          alert("Progress passed but failed to sync online. Please check network connection.");
        }
      } else {
        setStatus("fail");
        setResult(res);
      }
    } catch (err) {
      console.error("Execution Error:", err);
      setStatus("fail");
      setResult({
        status: "error",
        friendlyMessage: "Gagal menghubungkan ke engine kode. Silakan coba lagi.",
      });
    }
  };
  ```

- [ ] **Step 3: Handle CodeEditor Monaco loader init failure**
  Open [src/components/CodeEditor.tsx](file:///D:/KodeIn/src/components/CodeEditor.tsx). Add a catch block to `loader.init()` at module scope:
  ```typescript
  if (typeof window !== "undefined") {
    loader.init().then(() => {
      // theme setups...
    }).catch((err) => {
      console.error("Monaco loader failed to initialize:", err);
    });
  }
  ```

- [ ] **Step 4: Create generic Error Boundary**
  Create [src/components/ErrorBoundary.tsx](file:///D:/KodeIn/src/components/ErrorBoundary.tsx) to prevent full-app crashes if a layout fails:
  ```typescript
  import React, { Component, ErrorInfo, ReactNode } from "react";

  interface Props { children?: ReactNode; }
  interface State { hasError: boolean; }

  export class ErrorBoundary extends Component<Props, State> {
    public state: State = { hasError: false };

    public static getDerivedStateFromError(_: Error): State {
      return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
      if (this.state.hasError) {
        return (
          <div className="p-4 border border-red-500 rounded bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-200">
            <h2>Something went wrong in this module.</h2>
            <button
              className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              onClick={() => this.setState({ hasError: false })}
            >
              Try again
            </button>
          </div>
        );
      }
      return this.props.children;
    }
  }
  ```

- [ ] **Step 5: Wrap app pages with Error Boundary**
  Open [src/app/layout.tsx](file:///D:/KodeIn/src/app/layout.tsx). Wrap providers or main children with `ErrorBoundary`.

---

### Task 4: Python Lesson Content & Runner Evaluation Fixes

**Files:**
- Modify: `src/lib/content.ts`
- Modify: `src/lib/runner/pistonRunner.ts`
- Modify: `src/lib/practiceChallenges.ts`

- [ ] **Step 1: Correct hello_world starter code indentation**
  Open [src/lib/content.ts](file:///D:/KodeIn/src/lib/content.ts). Fix step `py-l1-s2` indentation:
  ```typescript
  starterCode: "def hello_world():\n    # Tulis komentar di sini\n    # Kembalikan \"Hello World\"\n    pass",
  ```

- [ ] **Step 2: Correct unique_list non-determinism**
  Open [src/lib/content.ts](file:///D:/KodeIn/src/lib/content.ts). Ensure `unique_list` tests expect a sorted output.
  ```typescript
  starterCode: "def unique_list(items):\n    # TODO: sorted(list(set(items)))\n    pass",
  ```

- [ ] **Step 3: Fix division floats vs ints**
  Open [src/lib/content.ts](file:///D:/KodeIn/src/lib/content.ts). Change expected outputs of `safe_div(10, 2)` and `process_data(2)` to match Python 3 floats.
  ```typescript
  // For safe_div:
  { input: [10, 2], output: 5.0 },
  
  // For process_data:
  { input: [2], output: 50.0 },
  ```

- [ ] **Step 4: Centralize tuple-to-list comparison in piston runner**
  Open [src/lib/runner/pistonRunner.ts](file:///D:/KodeIn/src/lib/runner/pistonRunner.ts). Cast tuple results to arrays in generated script to allow proper comparison with JSON arrays.
  ```typescript
  // Inside testScript template string inside runWithPiston:
  func = globals()['${functionName}']
  result = func(*inputs)

  # Cast tuples to lists for matching JSON array comparisons
  if isinstance(result, tuple):
      result = list(result)
  ```

- [ ] **Step 5: Support class-based test case runners**
  Open [src/lib/runner/pistonRunner.ts](file:///D:/KodeIn/src/lib/runner/pistonRunner.ts). Implement OOP instantiator checks in generated Python testScript.
  ```typescript
  // Inside testScript template string inside runWithPiston:
  # Special class test handling
  if '${functionName}' == 'Calculator':
      obj = func()
      result = obj.add(inputs[0], inputs[1])
  elif '${functionName}' == 'Account':
      obj = func(inputs[0], inputs[1])
      result = obj.balance
  elif '${functionName}' == 'Database':
      obj = func()
      obj.add_item(inputs[0], inputs[1])
      result = obj.get_item(inputs[0])
  else:
      result = func(*inputs)
  ```

- [ ] **Step 6: Fix frequency_map dictionary iteration**
  Open [src/lib/practiceChallenges.ts](file:///D:/KodeIn/src/lib/practiceChallenges.ts). Iterate key/value correctly in starter code:
  ```python
  for k, v in result.items():
      print(f"{k}:{v}")
  ```

---

### Task 5: i18n Translations & Typo Polish

**Files:**
- Modify: `src/lib/i18n.tsx`

- [ ] **Step 1: Correct i18n translations & typos**
  Open [src/lib/i18n.tsx](file:///D:/KodeIn/src/lib/i18n.tsx). Fix English terms and years:
  ```typescript
  "leaderboard.totalUsers": "Programmers", // Changed from "Designers"
  "hero.badge": "Coding Masterclass 2026", // Changed from 2024
  ```
