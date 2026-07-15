import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { practiceChallenges } from "@/lib/practiceChallenges";
import type { Progress as ProgressModel } from "@prisma/client";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type ProgressDTO = {
  completedStepIds: Record<string, boolean | string[]>;
  xp: number;
  streak: {
    current: number;
    longest: number;
    lastActiveISO?: string;
  };
};

function safeParseCompleted(json: string | null | undefined): Record<string, boolean | string[]> {
  try {
    const obj = JSON.parse(json || "{}");
    return typeof obj === "object" && obj ? (obj as Record<string, boolean | string[]>) : {};
  } catch {
    return {};
  }
}

function normalize(progressRow: ProgressModel): ProgressDTO {
  const completedStepIds = safeParseCompleted(progressRow.completedJson);

  return {
    completedStepIds,
    xp: progressRow.xp ?? 0,
    streak: {
      current: progressRow.streakCurrent ?? 0,
      longest: progressRow.streakLongest ?? 0,
      lastActiveISO: progressRow.lastActiveISO ?? undefined,
    },
  };
}

function updateStreak(row: {
  streakCurrent: number;
  streakLongest: number;
  lastActiveISO: string | null;
}) {
  const todayISO = new Date().toISOString().slice(0, 10);
  const last = row.lastActiveISO;

  let current = row.streakCurrent ?? 0;
  let longest = row.streakLongest ?? 0;

  if (!last) {
    current = 1;
  } else if (last === todayISO) {
    // already active today
  } else {
    const lastDate = new Date(last + "T00:00:00Z");
    const diffDays = Math.floor((Date.now() - lastDate.getTime()) / (24 * 3600 * 1000));
    current = diffDays === 1 ? current + 1 : 1;
  }

  longest = Math.max(longest, current);

  return { todayISO, current, longest };
}

export async function POST(req: Request): Promise<NextResponse> {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    let body: { challengeId?: string; xp?: number };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    const { challengeId } = body;
    if (!challengeId) {
      return NextResponse.json({ error: "challengeId is required" }, { status: 400 });
    }

    const challenge = practiceChallenges.find((c) => c.id === challengeId);
    if (!challenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }
    const xpEarned = challenge.xp;

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 });
    }

    const userId = user.id;

    const updated = await prisma.$transaction(async (tx) => {
      const row =
        (await tx.progress.findUnique({ where: { userId } })) ??
        (await tx.progress.create({ data: { userId } }));

      const completed = safeParseCompleted(row.completedJson);
      const practiceArray = completed.practice;
      const practiceSet = new Set(Array.isArray(practiceArray) ? practiceArray : []);

      const alreadyDone = practiceSet.has(challengeId);

      // streak update
      const { todayISO, current, longest } = updateStreak({
        streakCurrent: row.streakCurrent,
        streakLongest: row.streakLongest,
        lastActiveISO: row.lastActiveISO,
      });

      if (!alreadyDone) {
        practiceSet.add(challengeId);
        completed.practice = Array.from(practiceSet);
      }

      return await tx.progress.update({
        where: { userId },
        data: {
          xp: alreadyDone ? row.xp : row.xp + xpEarned,
          completedJson: JSON.stringify(completed),
          streakCurrent: current,
          streakLongest: longest,
          lastActiveISO: todayISO,
        },
      });
    });

    return NextResponse.json(normalize(updated));
  } catch (error) {
    console.error("Complete Practice Error:", error);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
