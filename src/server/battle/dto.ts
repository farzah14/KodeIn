import { BattleRoom } from "@prisma/client";

export type BattleStateDTO = {
  id: string;
  status: string;
  challengeId: string;
  player1Id: string;
  player2Id: string | null;
  player1Done: boolean;
  player2Done: boolean;
  winnerId: string | null;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
  // Redacted fields
  player1Code: string;
  player2Code: string;
  player1Result: string;
  player2Result: string;
  // User profile info (optional)
  player1?: { name: string | null; image: string | null } | null;
  player2?: { name: string | null; image: string | null } | null;
};

export function toPublicBattleState(
  room: BattleRoom & {
    player1?: { name: string | null; image: string | null } | null;
    player2?: { name: string | null; image: string | null } | null;
  },
  userId: string | null
): BattleStateDTO {
  const bothDone = room.player1Done && room.player2Done;

  // Player 1 details are visible to Player 1, or to anyone if both are done
  const showPlayer1CodeAndResult = userId === room.player1Id || bothDone;
  
  // Player 2 details are visible to Player 2, or to anyone if both are done
  const showPlayer2CodeAndResult = userId === room.player2Id || bothDone;

  return {
    id: room.id,
    status: room.status,
    challengeId: room.challengeId,
    player1Id: room.player1Id,
    player2Id: room.player2Id,
    player1Done: room.player1Done,
    player2Done: room.player2Done,
    winnerId: room.winnerId,
    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
    expiresAt: room.expiresAt,
    
    player1Code: showPlayer1CodeAndResult ? room.player1Code : "",
    player1Result: showPlayer1CodeAndResult ? room.player1Result : "pending",
    
    player2Code: showPlayer2CodeAndResult ? room.player2Code : "",
    player2Result: showPlayer2CodeAndResult ? room.player2Result : "pending",

    player1: room.player1,
    player2: room.player2,
  };
}
