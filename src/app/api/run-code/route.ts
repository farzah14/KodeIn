import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { executeCode } from "@/server/execution/piston";
import { SupportedLanguage } from "@/server/execution/types";
import { checkAndIncrementQuota, refundExecutionQuota } from "@/server/rate-limit/executionQuota";
import { executionQuotaExceeded } from "@/server/rate-limit/responses";

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate caller
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    // 2. Parse request body
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    // 3. Validate inputs
    const { language, files, stdin } = body;
    if (!language || typeof language !== "string") {
      return NextResponse.json({ error: "Language is required" }, { status: 400 });
    }

    const allowedLanguages = ["python", "javascript", "typescript", "go"];
    if (!allowedLanguages.includes(language)) {
      return NextResponse.json({ error: "UNSUPPORTED_LANGUAGE" }, { status: 400 });
    }

    if (!files || !Array.isArray(files) || files.length === 0 || typeof files[0]?.content !== "string") {
      return NextResponse.json({ error: "Source code is required in files[0].content" }, { status: 400 });
    }

    const sourceCode = files[0].content;
    const inputStdin = typeof stdin === "string" ? stdin : "";

    // 4. Rate limiting check
    const quotaResult = await checkAndIncrementQuota(userId);
    if (!quotaResult.allowed) {
      return executionQuotaExceeded();
    }

    // 5. Execute code
    const result = await executeCode(language as SupportedLanguage, sourceCode, inputStdin);
    if (!result.success) {
      // The slot was claimed before execution; give it back so a flaky
      // runner or a bad program does not burn the user's quota.
      await refundExecutionQuota(userId, quotaResult.windowStart);
    const status = result.error === "TIMEOUT"
      ? 408
      : result.error === "RUNNER_NOT_CONFIGURED"
        ? 503
        : 502;
    return NextResponse.json({ error: result.error }, { status });
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Run Code API Error:", error);
    // Sanitize error details in production to protect internals
    return NextResponse.json(
      { error: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
