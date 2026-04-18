import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const { roomId } = await params;
  
  const room = await prisma.battleRoom.findUnique({ where: { id: roomId } });
  if (!room || room.status !== "active") return NextResponse.json({ error: "BATTLE_NOT_ACTIVE" }, { status: 400 });

  const isPlayer1 = room.player1Id === session.user.id;
  const isPlayer2 = room.player2Id === session.user.id;

  if (!isPlayer1 && !isPlayer2) return NextResponse.json({ error: "NOT_IN_ROOM" }, { status: 403 });

  const updateData: Partial<{
    status: string;
    player1Done: boolean;
    player1Result: string;
    player2Done: boolean;
    player2Result: string;
    winnerId: string | null;
  }> = { status: "finished" };
  
  if (isPlayer1) {
    updateData.player1Done = true;
    updateData.player1Result = "fail";
    updateData.winnerId = room.player2Id; // Player 2 wins
  } else {
    updateData.player2Done = true;
    updateData.player2Result = "fail";
    updateData.winnerId = room.player1Id; // Player 1 wins
  }

  try {
    const updatedRoom = await prisma.battleRoom.update({
      where: { id: roomId },
      data: updateData
    });
    return NextResponse.json({ success: true, room: updatedRoom });
  } catch (error: unknown) {
    console.error("Surrender error:", error);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
