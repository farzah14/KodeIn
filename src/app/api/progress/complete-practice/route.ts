import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const { challengeId, xp } = await req.json();

    // Get current progress
    let progress = await prisma.progress.findUnique({
      where: { userId: session.user.id }
    });

    if (!progress) {
      progress = await prisma.progress.create({
        data: {
          userId: session.user.id,
          xp: 0,
          completedJson: "{}"
        }
      });
    }

    const completed = JSON.parse(progress.completedJson || "{}");
    const practiceSet = new Set(completed.practice || []);
    
    // If not already completed, add it and give XP
    if (!practiceSet.has(challengeId)) {
      practiceSet.add(challengeId);
      completed.practice = Array.from(practiceSet);

      await prisma.progress.update({
        where: { userId: session.user.id },
        data: {
          xp: { increment: xp },
          completedJson: JSON.stringify(completed)
        }
      });
      
      return NextResponse.json({ success: true, newlyCompleted: true });
    }

    return NextResponse.json({ success: true, newlyCompleted: false });
  } catch (error) {
    console.error("Complete Practice Error:", error);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
