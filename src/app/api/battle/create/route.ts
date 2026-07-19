import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getRandomChallenge } from "@/lib/battleChallenges";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  console.log("Create Battle Room: Starting for user", session.user.id);
  
  try {
    const challenge = getRandomChallenge();
    console.log("Create Battle Room: Using challenge", challenge.id);
    
    const room = await prisma.battleRoom.create({
      data: {
        challengeId: challenge.id,
        player1Id: session.user.id,
        status: "waiting",
        expiresAt: new Date(Date.now() + 1000 * 60 * 60),
      }
    });

    console.log("Create Battle Room: Created", room.id);
    return NextResponse.json({ roomId: room.id });
  } catch (error: unknown) {
    console.error("Create Battle Room: Error", error);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}

