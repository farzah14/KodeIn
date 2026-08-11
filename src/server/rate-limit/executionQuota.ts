import { prisma } from "@/lib/prisma";

export const MAX_EXECUTIONS_PER_MINUTE = 20;

export type QuotaResult = {
  allowed: boolean;
  count: number;
  windowStart: Date;
};

/**
 * Atomically claims (and counts) one execution slot for the current 1-minute
 * window.
 *
 * The count is incremented first so concurrent callers cannot race past the
 * cap, but when the increment pushes the count over the cap the slot is
 * returned immediately. Blocked attempts therefore never compound the window
 * count: a flood of rejected requests cannot drive the counter to an
 * arbitrarily high value that would outlive the minute ("self-lockout").
 */
export async function checkAndIncrementQuota(userId: string): Promise<QuotaResult> {
  const now = Date.now();
  // 1-minute bucket window
  const windowStart = new Date(Math.floor(now / 60000) * 60000);

  const quota = await prisma.executionQuota.upsert({
    where: {
      userId_windowStart: {
        userId,
        windowStart,
      },
    },
    create: {
      userId,
      windowStart,
      count: 1,
    },
    update: {
      count: { increment: 1 },
    },
  });

  const allowed = quota.count <= MAX_EXECUTIONS_PER_MINUTE;
  if (!allowed) {
    await prisma.executionQuota
      .update({
        where: { userId_windowStart: { userId, windowStart } },
        data: { count: { decrement: 1 } },
      })
      .catch(() => {});
  }

  return { allowed, count: quota.count, windowStart: quota.windowStart };
}

/**
 * Returns an already claimed slot when the request never actually ran code
 * (execution rejected, timed out, etc.). Without this, repeated failures burn
 * the whole quota and lock the user out for the rest of the minute.
 */
export async function refundExecutionQuota(userId: string, windowStart: Date): Promise<void> {
  await prisma.executionQuota
    .update({
      where: { userId_windowStart: { userId, windowStart } },
      data: { count: { decrement: 1 } },
    })
    .catch(() => {});
}