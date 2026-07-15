import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { content } from "@/lib/content";
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
    // sudah aktif hari ini, tidak naik lagi
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

  let body: { stepId?: string; xpEarned?: number };
  try {
    body = (await req.json()) as { stepId?: string; xpEarned?: number };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { stepId } = body;
  if (!stepId) {
    return NextResponse.json({ error: "stepId is required" }, { status: 400 });
  }

  let foundStep: { type: "explain" | "code" } | null = null;
  for (const lesson of Object.values(content.lessons)) {
    const step = lesson.steps.find((s) => s.id === stepId);
    if (step) {
      foundStep = step;
      break;
    }
  }

  if (!foundStep) {
    return NextResponse.json({ error: "Step not found" }, { status: 404 });
  }
  const xpEarned = foundStep.type === "code" ? 10 : 2;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 });
  }

  const updated = await prisma.$transaction(async (tx) => {
    const row =
      (await tx.progress.findUnique({ where: { userId: user.id } })) ??
      (await tx.progress.create({ data: { userId: user.id } }));

    const completed = safeParseCompleted(row.completedJson);
    const alreadyDone = !!completed[stepId];

    // streak update: dihitung setiap "berhasil", walau step sudah pernah selesai
    const { todayISO, current, longest } = updateStreak({
      streakCurrent: row.streakCurrent,
      streakLongest: row.streakLongest,
      lastActiveISO: row.lastActiveISO,
    });

    if (!alreadyDone) {
      completed[stepId] = true;
    }

    return await tx.progress.update({
      where: { userId: user.id },
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
}
