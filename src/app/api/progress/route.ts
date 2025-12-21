import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { Progress as ProgressModel } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

type ProgressDTO = {
  completedStepIds: Record<string, boolean>;
  xp: number;
  streak: {
    current: number;
    longest: number;
    lastActiveISO?: string;
  };
};

function safeParseCompleted(json: string | null | undefined): Record<string, boolean> {
  try {
    const obj = JSON.parse(json || "{}");
    return typeof obj === "object" && obj ? (obj as Record<string, boolean>) : {};
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

export async function GET(): Promise<Response> {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!user) {
    return Response.json({ error: "USER_NOT_FOUND" }, { status: 404 });
  }

  const row =
    (await prisma.progress.findUnique({ where: { userId: user.id } })) ??
    (await prisma.progress.create({ data: { userId: user.id } }));

  return Response.json(normalize(row));
}
