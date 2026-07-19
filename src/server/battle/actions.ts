import "server-only";
import { prisma } from "@/lib/prisma";
import { battleChallenges } from "@/lib/battleChallenges";
import { executeCode } from "../execution/piston";
import { SupportedLanguage } from "../execution/types";
import { toPublicBattleState, BattleStateDTO } from "./dto";
import { Prisma, BattleRoom } from "@prisma/client";

async function fetchPlayers(room: BattleRoom) {
  const p1 = await prisma.user.findUnique({
    where: { id: room.player1Id },
    select: { name: true, image: true },
  });
  const p2 = room.player2Id
    ? await prisma.user.findUnique({
        where: { id: room.player2Id },
        select: { name: true, image: true },
      })
    : null;
  return {
    ...room,
    player1: p1,
    player2: p2,
  };
}

export async function getBattle(roomId: string, userId: string | null): Promise<BattleStateDTO | null> {
  const room = await prisma.battleRoom.findUnique({
    where: { id: roomId },
  });

  if (!room) return null;

  const roomWithPlayers = await fetchPlayers(room);
  return toPublicBattleState(roomWithPlayers, userId);
}

export async function joinBattle(
  roomId: string,
  userId: string
): Promise<{ success: boolean; error?: string; room?: BattleStateDTO }> {
  try {
    const updatedRoom = await prisma.$transaction(async (tx) => {
      const room = await tx.battleRoom.findUnique({
        where: { id: roomId },
      });

      if (!room) throw new Error("ROOM_NOT_FOUND");
      if (room.status !== "waiting") throw new Error("ROOM_NOT_WAITING");
      if (room.player1Id === userId) throw new Error("ALREADY_IN_ROOM");

      const updated = await tx.battleRoom.update({
        where: { id: roomId },
        data: {
          player2Id: userId,
          status: "active",
        },
      });

      return updated;
    }, {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    });

    const roomWithPlayers = await fetchPlayers(updatedRoom);
    return { success: true, room: toPublicBattleState(roomWithPlayers, userId) };
  } catch (err: any) {
    return { success: false, error: err.message || "JOIN_FAILED" };
  }
}

export async function submitCode(
  roomId: string,
  userId: string,
  code: string
): Promise<{ success: boolean; error?: string; allPassed?: boolean; room?: BattleStateDTO }> {
  try {
    // 1. Fetch room first to validate status and get challenge info
    const room = await prisma.battleRoom.findUnique({
      where: { id: roomId },
    });

    if (!room || room.status !== "active") {
      return { success: false, error: "BATTLE_NOT_ACTIVE" };
    }

    const challenge = battleChallenges.find((c) => c.id === room.challengeId);
    if (!challenge) {
      return { success: false, error: "CHALLENGE_NOT_FOUND" };
    }

    const isPlayer1 = room.player1Id === userId;
    const isPlayer2 = room.player2Id === userId;

    if (!isPlayer1 && !isPlayer2) {
      return { success: false, error: "NOT_IN_ROOM" };
    }

    // 2. Server-side code execution using secure piston adapter
    let allPassed = true;
    for (const tc of challenge.testCases) {
      const execution = await executeCode(challenge.language as SupportedLanguage, code, tc.input);
      if (!execution.success || execution.run.stdout.trim() !== tc.expectedOutput.trim()) {
        allPassed = false;
        break;
      }
    }

    // 3. Atomically update battle state
    const updatedRoom = await prisma.$transaction(async (tx) => {
      // Re-fetch within serializable transaction to avoid race conditions
      const currentRoom = await tx.battleRoom.findUnique({
        where: { id: roomId },
      });

      if (!currentRoom || currentRoom.status !== "active") {
        throw new Error("BATTLE_NOT_ACTIVE");
      }

      const updateData: Prisma.BattleRoomUpdateInput = {};

      if (isPlayer1) {
        updateData.player1Code = code;
        updateData.player1Done = true;
        updateData.player1Result = allPassed ? "success" : "fail";
      } else {
        updateData.player2Code = code;
        updateData.player2Done = true;
        updateData.player2Result = allPassed ? "success" : "fail";
      }

      // Check new done states
      const p1Done = isPlayer1 ? true : currentRoom.player1Done;
      const p2Done = isPlayer2 ? true : currentRoom.player2Done;

      // Determine winner if passed and no winner yet
      if (allPassed && !currentRoom.winnerId) {
        updateData.winnerId = userId;
        updateData.status = "finished";
      } else if (p1Done && p2Done) {
        // Both players done but no success/winner
        updateData.status = "finished";
      }

      const updated = await tx.battleRoom.update({
        where: { id: roomId },
        data: updateData,
      });

      return updated;
    }, {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    });

    const roomWithPlayers = await fetchPlayers(updatedRoom);

    return {
      success: true,
      allPassed,
      room: toPublicBattleState(roomWithPlayers, userId),
    };
  } catch (err: any) {
    return { success: false, error: err.message || "SUBMIT_FAILED" };
  }
}

export async function surrenderBattle(
  roomId: string,
  userId: string
): Promise<{ success: boolean; error?: string; room?: BattleStateDTO }> {
  try {
    const updatedRoom = await prisma.$transaction(async (tx) => {
      const room = await tx.battleRoom.findUnique({
        where: { id: roomId },
      });

      if (!room || room.status !== "active") {
        throw new Error("BATTLE_NOT_ACTIVE");
      }

      const isPlayer1 = room.player1Id === userId;
      const isPlayer2 = room.player2Id === userId;

      if (!isPlayer1 && !isPlayer2) {
        throw new Error("NOT_IN_ROOM");
      }

      const updateData: Prisma.BattleRoomUpdateInput = {
        status: "finished",
      };

      if (isPlayer1) {
        updateData.player1Done = true;
        updateData.player1Result = "fail";
        updateData.winnerId = room.player2Id; // Player 2 wins
      } else {
        updateData.player2Done = true;
        updateData.player2Result = "fail";
        updateData.winnerId = room.player1Id; // Player 1 wins
      }

      const updated = await tx.battleRoom.update({
        where: { id: roomId },
        data: updateData,
      });

      return updated;
    }, {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    });

    const roomWithPlayers = await fetchPlayers(updatedRoom);

    return { success: true, room: toPublicBattleState(roomWithPlayers, userId) };
  } catch (err: any) {
    return { success: false, error: err.message || "SURRENDER_FAILED" };
  }
}
