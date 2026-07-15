import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { battleChallenges } from "@/lib/battleChallenges";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const { roomId } = await params;
  const { code } = await req.json();

  const room = await prisma.battleRoom.findUnique({ where: { id: roomId } });
  if (!room || room.status !== "active") return NextResponse.json({ error: "BATTLE_NOT_ACTIVE" }, { status: 400 });

  const challenge = battleChallenges.find(c => c.id === room.challengeId);
  if (!challenge) return NextResponse.json({ error: "CHALLENGE_NOT_FOUND" }, { status: 404 });

  const isPlayer1 = room.player1Id === session.user.id;
  const isPlayer2 = room.player2Id === session.user.id;

  if (!isPlayer1 && !isPlayer2) return NextResponse.json({ error: "NOT_IN_ROOM" }, { status: 403 });

  // --- SERVER-SIDE VALIDATION (Piston) ---
  // Run all test cases in parallel using Piston
  const runTestCase = async (input: string, expected: string) => {
    try {
      const payload = {
        language: challenge.language,
        version: "*",
        files: [{ content: code }],
        stdin: input,
      };

      const res = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("Piston API Error:", res.status, await res.text());
        throw new Error("Piston API reported an error");
      }

      const result = await res.json();
      
      if (result.run.stderr) {
        console.warn("Piston Execution Stderr:", result.run.stderr);
        return false;
      }

      // Clean check: trim both outputs
      const actualOutput = result.run.output.trim();
      const expectedOutput = expected.trim();
      
      console.log(`Test Case - Input: ${input}, Expected: [${expectedOutput}], Actual: [${actualOutput}]`);
      
      return actualOutput === expectedOutput;
    } catch (err) {
      console.error("Test Case Execution Failed:", err);
      throw err;
    }
  };

  try {
    const results = await Promise.all(challenge.testCases.map(tc => runTestCase(tc.input, tc.expectedOutput)));
    const allPassed = results.every(r => r === true);

    const updateData: Record<string, string | boolean> = {};
    if (isPlayer1) {
      updateData.player1Code = code;
      updateData.player1Done = true;
      updateData.player1Result = allPassed ? "success" : "fail";
    } else {
      updateData.player2Code = code;
      updateData.player2Done = true;
      updateData.player2Result = allPassed ? "success" : "fail";
    }

    // Determine winner if we have a winner and battle is successful
    if (allPassed && !room.winnerId) {
      updateData.winnerId = session.user.id;
      updateData.status = "finished";
    }

    const updatedRoom = await prisma.battleRoom.update({
      where: { id: roomId },
      data: updateData
    });

    return NextResponse.json({ success: true, allPassed, room: updatedRoom });
  } catch (error: unknown) {
    console.error("Battle Submit Error:", error);
    return NextResponse.json({ 
      error: "Execution failed", 
      details: (error as Error).message,
      hint: "Pastikan kode Anda dapat berjalan dan coba lagi." 
    }, { status: 500 });
  }
}
