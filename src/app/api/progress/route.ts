import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { buildProgressDTO } from "@/server/progress/progressDTO";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 });
  }

  const row =
    (await prisma.progress.findUnique({ where: { userId: user.id } })) ??
    (await prisma.progress.create({ data: { userId: user.id } }));
  const completions = await prisma.completion.findMany({
    where: { userId: user.id },
    select: { kind: true, activityId: true },
  });

  return NextResponse.json(buildProgressDTO(row, completions));
}
