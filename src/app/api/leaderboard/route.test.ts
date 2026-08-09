import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "./route";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findMany: vi.fn(),
    },
    completion: {
      groupBy: vi.fn(),
    },
  },
}));

describe("Leaderboard API route", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns leaderboard data without leaking user emails, using user ID as avatar fallback", async () => {
    vi.mocked(prisma.user.findMany).mockResolvedValue([
      {
        id: "user-1",
        name: "Alice",
        image: null,
        progress: {
          xp: 150,
          streakCurrent: 5,
          completedJson: JSON.stringify({ practice: ["fizz-buzz"] }),
          userId: "user-1",
          streakLongest: 5,
          lastActiveISO: "2026-07-19",
          updatedAt: new Date(),
        },
      } as any,
      {
        id: "user-2",
        name: "Bob",
        image: "https://example.com/bob.jpg",
        progress: {
          xp: 100,
          streakCurrent: 2,
          userId: "user-2",
          streakLongest: 2,
          lastActiveISO: "2026-07-19",
          updatedAt: new Date(),
        },
      } as any,
    ]);

    vi.mocked(prisma.completion.groupBy).mockResolvedValue([
      { userId: "user-1", _count: { _all: 2 } },
    ] as any);

    const response = await GET();
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.length).toBe(2);

    // Assert email field is not returned at all
    expect(data[0].email).toBeUndefined();
    expect(data[1].email).toBeUndefined();

    // Assert Alice falls back to Alice's user id (secure avatar seed)
    expect(data[0].image).toBe("user-1");

    // Assert Bob preserves his custom image URL
    expect(data[1].image).toBe("https://example.com/bob.jpg");

    // Assert solved practice counts come from the Completion table
    expect(data[0].solvedPractice).toBe(2);
    expect(data[1].solvedPractice).toBe(0);
  });
});
