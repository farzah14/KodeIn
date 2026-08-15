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
  const showPlayer1Result = userId === room.player1Id;
  const showPlayer2Result = userId === room.player2Id;

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
    
    player1Result: showPlayer1Result ? room.player1Result : "pending",
    player2Result: showPlayer2Result ? room.player2Result : "pending",

    player1: room.player1,
    player2: room.player2,
  };
}
