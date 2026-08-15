import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
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

  let body: { stepId?: string; code?: string };
  try {
    body = (await req.json()) as { stepId?: string; code?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { stepId, code } = body;
  if (!stepId) {
    return NextResponse.json({ error: "stepId is required" }, { status: 400 });
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
    kind: "LESSON_STEP",
    activityId: stepId,
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
    kind: "LESSON_STEP",
    activityId: stepId,
    xp: verification.xp,
    activityDateISO: getActivityDateISO(),
  });

  return NextResponse.json(awardResult.progress);
}
