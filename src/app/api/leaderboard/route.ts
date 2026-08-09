import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const leaderboard = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        progress: {
          select: {
            xp: true,
            streakCurrent: true,
          },
        },
      },
      orderBy: {
        progress: {
          xp: "desc",
        },
      },
      take: 100, // Increase slightly for more comprehensive rankings
    });

    // Practice counts come from the Completion table, not the (unmaintained)
    // Progress.completedJson column, which was never written by awardCompletion
    // and therefore always rendered a solved count of 0.
    const practiceCounts = await prisma.completion.groupBy({
      by: ["userId"],
      where: { kind: "PRACTICE" },
      _count: { _all: true },
    });
    const solvedById = new Map(practiceCounts.map((row) => [row.userId, row._count._all]));

    const formattedLeaderboard = leaderboard.map((user) => ({
        id: user.id,
        name: user.name || "Anonymous",
        image: user.image && (user.image.startsWith("data:") || user.image.startsWith("http")) ? user.image : user.id,
        xp: user.progress?.xp || 0,
        streak: user.progress?.streakCurrent || 0,
        solvedPractice: solvedById.get(user.id) ?? 0,
    }));

    return NextResponse.json(formattedLeaderboard);
  } catch (error: unknown) {
    console.error("Leaderboard API Error:", error);
    return NextResponse.json(
      { error: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
