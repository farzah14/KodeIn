import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { verifyActivity } from "@/server/execution/verifyActivity";
import { awardCompletion } from "@/server/progress/awardCompletion";
import { checkAndIncrementQuota, refundExecutionQuota } from "@/server/rate-limit/executionQuota";
import { executionQuotaExceeded } from "@/server/rate-limit/responses";
import { getActivityDateISO } from "@/server/progress/activityDate";

export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<NextResponse> {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    let body: { challengeId?: string; code?: string };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    
    const { challengeId, code } = body;
    if (!challengeId) {
      return NextResponse.json({ error: "challengeId is required" }, { status: 400 });
    }
    if (!code) {
      return NextResponse.json({ error: "code is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 });
    }

    const quotaResult = await checkAndIncrementQuota(user.id);
    if (!quotaResult.allowed) {
      return executionQuotaExceeded();
    }

    // 1. Verify Activity on Server
    const verification = await verifyActivity({
      kind: "PRACTICE",
      activityId: challengeId,
      code,
    });

    if (!verification.passed) {
      if (verification.reason !== "TEST_FAILED") {
        await refundExecutionQuota(user.id, quotaResult.windowStart);
      }
      return NextResponse.json(
        { error: verification.reason },
        {
          status:
            verification.reason === "RUNNER_UNAVAILABLE" || verification.reason === "RUNNER_NOT_CONFIGURED"
              ? 503
              : 400,
        }
      );
    }

    // 2. Award Completion Idempotently
    const awardResult = await awardCompletion({
      userId: user.id,
      kind: "PRACTICE",
      activityId: challengeId,
      xp: verification.xp,
      activityDateISO: getActivityDateISO(),
    });

    return NextResponse.json(awardResult.progress);
  } catch (error) {
    console.error("Complete Practice Error:", error);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
