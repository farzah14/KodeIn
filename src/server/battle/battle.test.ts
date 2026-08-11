import { describe, it, expect } from "vitest";
import { toPublicBattleState } from "./dto";
import { BattleRoom } from "@prisma/client";

describe("toPublicBattleState redaction helper", () => {
  const mockRoom: BattleRoom = {
    id: "room-1",
    status: "active",
    challengeId: "fizz-buzz",
    player1Id: "user-1",
    player2Id: "user-2",
    player1Code: "def player1(): pass",
    player2Code: "def player2(): pass",
    player1Done: true,
    player2Done: false,
    player1Result: "success",
    player2Result: "pending",
    winnerId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    expiresAt: new Date(),
  };

  it("never includes submitted code in the player1 response", () => {
    const state = toPublicBattleState(mockRoom, "user-1");
    expect(state.player1Result).toBe("success");
    expect(state.player2Result).toBe("pending");
    expect(state).not.toHaveProperty("player1Code");
    expect(state).not.toHaveProperty("player2Code");
  });

  it("never includes submitted code in the player2 response", () => {
    const state = toPublicBattleState(mockRoom, "user-2");
    expect(state.player2Result).toBe("pending");
    expect(state.player1Result).toBe("pending");
    expect(state).not.toHaveProperty("player1Code");
    expect(state).not.toHaveProperty("player2Code");
  });

  it("never reveals code after both players finish", () => {
    const completedRoom = {
      ...mockRoom,
      player2Done: true,
      player2Result: "success",
    };
    
    const state1 = toPublicBattleState(completedRoom, "user-1");
    const stateSpectator = toPublicBattleState(completedRoom, "spectator");
    expect(state1).not.toHaveProperty("player1Code");
    expect(state1).not.toHaveProperty("player2Code");
    expect(stateSpectator).not.toHaveProperty("player1Code");
    expect(stateSpectator).not.toHaveProperty("player2Code");
  });
});
