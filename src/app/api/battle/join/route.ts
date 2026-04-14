import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const { roomId } = await req.json();

  const room = await prisma.battleRoom.findUnique({
    where: { id: roomId }
  });

  if (!room) return NextResponse.json({ error: "ROOM_NOT_FOUND" }, { status: 404 });
  if (room.status !== "waiting") return NextResponse.json({ error: "ROOM_NOT_WAITING" }, { status: 400 });
  if (room.player1Id === session.user.id) return NextResponse.json({ error: "ALREADY_IN_ROOM" }, { status: 400 });

  const updatedRoom = await prisma.battleRoom.update({
    where: { id: roomId },
    data: {
      player2Id: session.user.id,
      status: "active",
    }
  });

  return NextResponse.json({ success: true, roomId: updatedRoom.id });
}
