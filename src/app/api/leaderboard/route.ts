import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const leaderboard = await prisma.user.findMany({
      where: {
        progress: {
          isNot: null,
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
        email: true,
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
      take: 50,
    });

    const formattedLeaderboard = leaderboard.map((user, index) => ({
      rank: index + 1,
      id: user.id,
      name: user.name || "Anonymous",
      image: user.image || user.email || "user",
      xp: user.progress?.xp || 0,
      streak: user.progress?.streakCurrent || 0,
    }));

    return NextResponse.json(formattedLeaderboard);
  } catch (error: unknown) {
    console.error("Leaderboard API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
