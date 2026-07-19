import { describe, it, expect, vi, beforeEach } from "vitest";
import { awardCompletion, AwardCompletionInput } from "./awardCompletion";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

vi.mock("@/lib/prisma", () => {
  const mockPrisma = {
    completion: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
    progress: {
      findUnique: vi.fn(),
      update: vi.fn(),
      upsert: vi.fn(),
    },
    $transaction: vi.fn((cb) => cb(mockPrisma)),
  };
  return { prisma: mockPrisma };
});

describe("awardCompletion", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("awards one XP increment when the same activity completes concurrently", async () => {
    const input: AwardCompletionInput = {
      userId: "user-123",
      kind: "LESSON_STEP",
      activityId: "step-456",
      xp: 10,
      activityDateISO: "2026-07-19",
    };

    // First call succeeds, second call throws a Prisma unique constraint violation (P2002)
    let callCount = 0;
    vi.mocked(prisma.completion.create).mockImplementation((async () => {
      callCount++;
      if (callCount === 2) {
        throw new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
          code: "P2002",
          clientVersion: "7.2.0",
        });
      }
      return {} as any;
    }) as any);

    vi.mocked(prisma.progress.upsert).mockResolvedValue({
      userId: "user-123",
      xp: 10,
      streakCurrent: 1,
      streakLongest: 1,
      lastActiveISO: "2026-07-19",
      completedJson: "{}",
      updatedAt: new Date(),
    });

    vi.mocked(prisma.completion.findMany).mockResolvedValue([
      {
        userId: "user-123",
        kind: "LESSON_STEP",
        activityId: "step-456",
        xpAwarded: 10,
        completedAt: new Date(),
      },
    ]);

    // Run both concurrently
    const [result1, result2] = await Promise.all([
      awardCompletion(input),
      awardCompletion(input),
    ]);

    // One should be awarded, one should not
    expect(result1.awarded).toBe(true);
    expect(result2.awarded).toBe(false);

    // Completion.create was called twice
    expect(prisma.completion.create).toHaveBeenCalledTimes(2);

    // Progress.upsert (the atomic XP increment) was only called once
    expect(prisma.progress.upsert).toHaveBeenCalledTimes(1);

    // Verify the upsert payload uses the atomic increment syntax
    const upsertCall = vi.mocked(prisma.progress.upsert).mock.calls[0][0];
    expect(upsertCall.update.xp).toEqual({ increment: 10 });
  });
});
