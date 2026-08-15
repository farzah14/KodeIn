import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: vi.fn() },
    progress: { findUnique: vi.fn(), create: vi.fn() },
    completion: { findMany: vi.fn() },
  },
}));

describe("GET /api/progress", () => {
  beforeEach(() => vi.clearAllMocks());

  it("builds completed activities from Completion rows instead of legacy JSON", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { email: "learner@example.com" } } as never);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: "user-1" } as never);
    vi.mocked(prisma.progress.findUnique).mockResolvedValue({
      userId: "user-1",
      xp: 25,
      streakCurrent: 2,
      streakLongest: 4,
      lastActiveISO: "2026-08-12",
      completedJson: JSON.stringify({ stale: true }),
    } as never);
    vi.mocked(prisma.completion.findMany).mockResolvedValue([
      { kind: "LESSON_STEP", activityId: "step-1" },
      { kind: "PRACTICE", activityId: "fizz-buzz" },
    ] as never);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.completedStepIds).toEqual({
      "step-1": true,
      practice: ["fizz-buzz"],
    });
    expect(data.completedStepIds.stale).toBeUndefined();
    expect(prisma.completion.findMany).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      select: { kind: true, activityId: true },
    });
  });
});
