import { prisma } from "@/lib/prisma";
import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await params;

  if (!id) {
    return Response.json({ error: "MISSING_ID" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      image: true,
      progress: {
        select: {
          xp: true,
          streakCurrent: true,
          streakLongest: true,
          updatedAt: true,
        },
      },
    },
  });

  if (!user) {
    return Response.json({ error: "USER_NOT_FOUND" }, { status: 404 });
  }

  return Response.json({
    id: user.id,
    name: user.name || "Student",
    image: user.image || "",
    stats: user.progress || {
      xp: 0,
      streakCurrent: 0,
      streakLongest: 0,
      updatedAt: new Date(),
    },
  });
}
