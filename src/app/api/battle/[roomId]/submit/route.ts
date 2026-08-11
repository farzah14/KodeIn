import { auth } from "@/auth";
import { submitCode } from "@/server/battle/actions";
import { checkAndIncrementQuota, refundExecutionQuota } from "@/server/rate-limit/executionQuota";
import { executionQuotaExceeded } from "@/server/rate-limit/responses";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const { roomId } = await params;

  const quotaResult = await checkAndIncrementQuota(userId);
  if (!quotaResult.allowed) {
    return executionQuotaExceeded();
  }

  try {
    const { code } = await req.json();
    if (!code) return NextResponse.json({ error: "code is required" }, { status: 400 });

    const result = await submitCode(roomId, userId, code);
    if (!result.success) {
      // Nothing actually executed (validation, race, expired room, ...);
      // refund the claimed slot. Validation errors like the rate-limit
      // rejection itself are caught above and never reach this point.
      await refundExecutionQuota(userId, quotaResult.windowStart);
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
