import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { calculateStreak } from "./streak";
import { buildProgressDTO, ProgressDTO } from "./progressDTO";

export type AwardCompletionInput = {
  userId: string;
  kind: "LESSON_STEP" | "PRACTICE";
  activityId: string;
  xp: number;
  activityDateISO: string;
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

        return {
          awarded: true,
          progress: buildProgressDTO(updatedProgress, completions),
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

        return {
          awarded: false,
          progress: buildProgressDTO(
            progressRecord ?? {
              xp: 0,
              streakCurrent: 0,
              streakLongest: 0,
              lastActiveISO: null,
            },
            completions
          ),
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
