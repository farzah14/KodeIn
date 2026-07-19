import { prisma } from "@/lib/prisma";

export async function checkAndIncrementQuota(
  userId: string
): Promise<{ allowed: boolean; count: number }> {
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

  const maxRequestsPerMinute = 20;

  return {
    allowed: quota.count <= maxRequestsPerMinute,
    count: quota.count,
  };
}
