import { afterEach, describe, expect, it, vi } from "vitest";
import { runBackfill } from "./backfill";
import { prisma } from "@/lib/prisma";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    progress: { findMany: vi.fn() },
    completion: { createMany: vi.fn() },
  },
}));

describe("runBackfill", () => {
  afterEach(() => vi.restoreAllMocks());

  it("imports only known, unique legacy completions and reports created rows", async () => {
    vi.mocked(prisma.progress.findMany).mockResolvedValue([
      {
        userId: "user-1",
        completedJson: JSON.stringify({
          "py-l1-s2": true,
          practice: ["fizz-buzz", "fizz-buzz", "not-a-challenge"],
        }),
      },
    ] as never);
    vi.mocked(prisma.completion.createMany).mockResolvedValue({ count: 1 });
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);

    await runBackfill();

    expect(prisma.completion.createMany).toHaveBeenNthCalledWith(1, {
      data: [
        { userId: "user-1", kind: "LESSON_STEP", activityId: "py-l1-s2", xpAwarded: 10 },
      ],
      skipDuplicates: true,
    });
    expect(prisma.completion.createMany).toHaveBeenNthCalledWith(2, {
      data: [
        { userId: "user-1", kind: "PRACTICE", activityId: "fizz-buzz", xpAwarded: 50 },
      ],
      skipDuplicates: true,
    });
    expect(log).toHaveBeenLastCalledWith("Backfill completed: 1 lessons, 1 practices backfilled.");
  });
});
