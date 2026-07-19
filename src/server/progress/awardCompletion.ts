import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { calculateStreak } from "./streak";

export type AwardCompletionInput = {
  userId: string;
  kind: "LESSON_STEP" | "PRACTICE";
  activityId: string;
  xp: number;
  activityDateISO: string;
};

export type ProgressDTO = {
  completedStepIds: Record<string, boolean | string[]>;
  xp: number;
  streak: {
    current: number;
    longest: number;
    lastActiveISO?: string;
  };
};

export async function awardCompletion(
  input: AwardCompletionInput
): Promise<{ awarded: boolean; progress: ProgressDTO }> {
  const { userId, kind, activityId, xp, activityDateISO } = input;
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await prisma.$transaction(async (tx) => {
        // 1. Replay protection: Insert Completion first.
        // The composite primary key [userId, kind, activityId] will fail if already completed.
        await tx.completion.create({
          data: {
            userId,
            kind,
            activityId,
            xpAwarded: xp,
          },
        });

        // 2. Fetch current progress
        const currentProgress = await tx.progress.findUnique({
          where: { userId },
        });

        const currentStreak = currentProgress?.streakCurrent ?? 0;
        const longestStreak = currentProgress?.streakLongest ?? 0;
        const lastActiveISO = currentProgress?.lastActiveISO ?? null;

        // Calculate new streak
        const streakResult = calculateStreak(
          lastActiveISO,
          currentStreak,
          longestStreak,
          activityDateISO
        );

        // 3. Atomically upsert Progress and increment XP
        const updatedProgress = await tx.progress.upsert({
          where: { userId },
          create: {
            userId,
            xp,
            streakCurrent: streakResult.current,
            streakLongest: streakResult.longest,
            lastActiveISO: streakResult.lastActiveISO,
            completedJson: "{}",
          },
          update: {
            xp: { increment: xp },
            streakCurrent: streakResult.current,
            streakLongest: streakResult.longest,
            lastActiveISO: streakResult.lastActiveISO,
          },
        });

        // Fetch all completions to build ProgressDTO (completedStepIds)
        const completions = await tx.completion.findMany({
          where: { userId },
        });

        const completedStepIds: Record<string, boolean | string[]> = {};
        const practiceCompleted: string[] = [];

        completions.forEach((c) => {
          if (c.kind === "LESSON_STEP") {
            completedStepIds[c.activityId] = true;
          } else if (c.kind === "PRACTICE") {
            practiceCompleted.push(c.activityId);
          }
        });
        completedStepIds["practice"] = practiceCompleted;

        return {
          awarded: true,
          progress: {
            completedStepIds,
            xp: updatedProgress.xp,
            streak: {
              current: updatedProgress.streakCurrent,
              longest: updatedProgress.streakLongest,
              lastActiveISO: updatedProgress.lastActiveISO ?? undefined,
            },
          },
        };
      }, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      });
    } catch (error) {
      // If duplicate key error (P2002), it's already completed. Return current progress.
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        const progressRecord = await prisma.progress.findUnique({
          where: { userId },
        });

        const completions = await prisma.completion.findMany({
          where: { userId },
        });

        const completedStepIds: Record<string, boolean | string[]> = {};
        const practiceCompleted: string[] = [];

        completions.forEach((c) => {
          if (c.kind === "LESSON_STEP") {
            completedStepIds[c.activityId] = true;
          } else if (c.kind === "PRACTICE") {
            practiceCompleted.push(c.activityId);
          }
        });
        completedStepIds["practice"] = practiceCompleted;

        return {
          awarded: false,
          progress: {
            completedStepIds,
            xp: progressRecord?.xp ?? 0,
            streak: {
              current: progressRecord?.streakCurrent ?? 0,
              longest: progressRecord?.streakLongest ?? 0,
              lastActiveISO: progressRecord?.lastActiveISO ?? undefined,
            },
          },
        };
      }

      // Retry on transaction conflict (P2034) or other transaction failures up to maxRetries
      const isConflict = error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034";
      if (isConflict && attempt < maxRetries) {
        // Simple backoff: sleep slightly before retrying
        await new Promise((resolve) => setTimeout(resolve, attempt * 50));
        continue;
      }

      // If we ran out of retries or it is another error, throw it
      throw error;
    }
  }

  throw new Error("Transaction failed after maximum retries");
}
