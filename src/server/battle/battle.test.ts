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

  it("redacts player2's code and result for player1 when not both done", () => {
    const state = toPublicBattleState(mockRoom, "user-1");
    // Player 1 can see their own details
    expect(state.player1Code).toBe("def player1(): pass");
    expect(state.player1Result).toBe("success");
    // Player 1 cannot see Player 2 details
    expect(state.player2Code).toBe("");
    expect(state.player2Result).toBe("pending");
  });

  it("redacts player1's code and result for player2 when not both done", () => {
    const state = toPublicBattleState(mockRoom, "user-2");
    // Player 2 can see their own details
    expect(state.player2Code).toBe("def player2(): pass");
    expect(state.player2Result).toBe("pending");
    // Player 2 cannot see Player 1 details
    expect(state.player1Code).toBe("");
    expect(state.player1Result).toBe("pending");
  });

  it("reveals both players' code and result when both done is true", () => {
    const completedRoom = {
      ...mockRoom,
      player2Done: true,
      player2Result: "success",
    };
    
    // Test for Player 1
    const state1 = toPublicBattleState(completedRoom, "user-1");
    expect(state1.player1Code).toBe("def player1(): pass");
    expect(state1.player2Code).toBe("def player2(): pass");

    // Test for spectator
    const stateSpectator = toPublicBattleState(completedRoom, "spectator");
    expect(stateSpectator.player1Code).toBe("def player1(): pass");
    expect(stateSpectator.player2Code).toBe("def player2(): pass");
  });
});
