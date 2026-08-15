import { describe, it, expect, vi, beforeEach } from "vitest";
import { getBattle, submitCode, joinBattle, surrenderBattle } from "./actions";
import { prisma } from "@/lib/prisma";
import { executeCode } from "../execution/piston";
import { Prisma, BattleRoom } from "@prisma/client";

vi.mock("server-only", () => ({}));

vi.mock("@/lib/prisma", () => {
  const mockPrisma = {
    user: { findUnique: vi.fn() },
    battleRoom: { findUnique: vi.fn(), update: vi.fn() },
    $transaction: vi.fn(),
  };
  return { prisma: mockPrisma };
});

vi.mock("../execution/piston", () => ({
  executeCode: vi.fn(),
}));

function conflictError(): unknown {
  return new Prisma.PrismaClientKnownRequestError("write conflict", {
    code: "P2034",
    clientVersion: "7.2.0",
  });
}

function makeRoom(overrides: Partial<BattleRoom> = {}): BattleRoom {
  const base: BattleRoom = {
    id: "room-1",
    status: "active",
    challengeId: "fizz-buzz",
    player1Id: "user-1",
    player2Id: null,
    player1Code: "",
    player2Code: "",
    player1Done: false,
    player2Done: false,
    player1Result: "pending",
    player2Result: "pending",
    winnerId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    expiresAt: new Date(Date.now() + 60_000),
  };
  return { ...base, ...overrides };
}

describe("submitCode battle actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // fizz-buzz challenge passes when student code produces the expected outputs.
    const expectedByInput = new Map([
      ["3", "Fizz"],
      ["5", "Buzz"],
      ["15", "FizzBuzz"],
      ["7", "7"],
    ]);
    vi.mocked(executeCode).mockImplementation(async (_lang, _code, stdin) => {
      const stdout = expectedByInput.get(stdin ?? "") ?? "WRONG-ANSWER";
      return {
        success: true,
        run: { stdout, stderr: "", code: 0, signal: null, output: stdout },
      };
    });
  });

  it("rejects nonparticipants before loading player profiles", async () => {
    vi.mocked(prisma.battleRoom.findUnique).mockResolvedValue(makeRoom({ player2Id: "user-2" }));

    const result = await getBattle("room-1", "spectator");

    expect(result).toBeNull();
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });

  it("retries on serialization conflict and records the winning submission", async () => {
    vi.mocked(prisma.battleRoom.findUnique).mockResolvedValue(makeRoom());
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ name: "Alice", image: null } as any);

    // First write conflicts (opponent wrote concurrently), second succeeds.
    vi.mocked(prisma.$transaction)
      .mockRejectedValueOnce(conflictError())
      .mockImplementationOnce(async () =>
        makeRoom({ player1Done: true, player1Result: "success", winnerId: "user-1", status: "finished" })
      );

    const result = await submitCode("room-1", "user-1", "print(1)");

    expect(prisma.$transaction).toHaveBeenCalledTimes(2);
    expect(result.success).toBe(true);
    expect(result.allPassed).toBe(true);
  });

  it("returns a friendly error when conflicts exhaust retries", async () => {
    vi.mocked(prisma.battleRoom.findUnique).mockResolvedValue(makeRoom());
    vi.mocked(prisma.$transaction).mockRejectedValue(conflictError());

    const result = await submitCode("room-1", "user-1", "print(1)");

    expect(prisma.$transaction).toHaveBeenCalledTimes(3);
    expect(result.success).toBe(false);
    expect(result.error).toBe("CONCURRENT_UPDATE_CONFLICT");
  });

  it("rejects oversized submissions before execution or persistence", async () => {
    vi.mocked(prisma.battleRoom.findUnique).mockResolvedValue(makeRoom());

    const result = await submitCode("room-1", "user-1", "x".repeat(20_001));

    expect(result.success).toBe(false);
    expect(result.error).toBe("CODE_TOO_LARGE");
    expect(executeCode).not.toHaveBeenCalled();
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it("does not persist a battle result when the runner is unavailable", async () => {
    vi.mocked(prisma.battleRoom.findUnique).mockResolvedValue(makeRoom());
    vi.mocked(executeCode).mockResolvedValue({
      success: false,
      error: "RUNNER_NOT_CONFIGURED",
    });

    const result = await submitCode("room-1", "user-1", "print(1)");

    expect(result).toEqual({ success: false, error: "RUNNER_NOT_CONFIGURED" });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it("rejects submissions to an expired active room before execution", async () => {
    vi.mocked(prisma.battleRoom.findUnique).mockResolvedValue(
      makeRoom({ expiresAt: new Date(Date.now() - 1_000) })
    );

    const result = await submitCode("room-1", "user-1", "print(1)");

    expect(result.success).toBe(false);
    expect(result.error).toBe("BATTLE_EXPIRED");
    expect(executeCode).not.toHaveBeenCalled();
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it("rejects surrender in an expired active room", async () => {
    const expired = makeRoom({ expiresAt: new Date(Date.now() - 1_000) });
    const txPrisma = {
      battleRoom: {
        findUnique: vi.fn().mockResolvedValue(expired),
        update: vi.fn(),
      },
    };
    vi.mocked(prisma.$transaction).mockImplementation((async (cb: any) => cb(txPrisma)) as any);

    const result = await surrenderBattle("room-1", "user-1");

    expect(result.success).toBe(false);
    expect(result.error).toBe("BATTLE_EXPIRED");
    expect(txPrisma.battleRoom.update).not.toHaveBeenCalled();
  });

  it("prevents joining an expired waiting room", async () => {
    const expired = makeRoom({
      player2Id: null,
      status: "waiting",
      expiresAt: new Date(Date.now() - 1_000),
    });
    const txPrisma = {
      battleRoom: {
        findUnique: vi.fn().mockResolvedValue(expired),
        update: vi.fn(),
      },
    };
    vi.mocked(prisma.$transaction).mockImplementation((async (cb: any) => cb(txPrisma)) as any);

    const result = await joinBattle("room-1", "user-2");

    expect(result.success).toBe(false);
    expect(result.error).toBe("BATTLE_EXPIRED");
    expect(txPrisma.battleRoom.update).not.toHaveBeenCalled();
  });

  it("allows joining a fresh waiting room", async () => {
    const fresh = makeRoom({ status: "waiting", player2Id: null });
    const txPrisma = {
      battleRoom: {
        findUnique: vi.fn().mockResolvedValue(fresh),
        update: vi.fn().mockResolvedValue(makeRoom({ status: "active", player2Id: "user-2" })),
      },
    };
    vi.mocked(prisma.$transaction).mockImplementation((async (cb: any) => cb(txPrisma)) as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ name: "Player 1", image: null } as any);

    const result = await joinBattle("room-1", "user-2");

    expect(result.success).toBe(true);
    expect(txPrisma.battleRoom.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { player2Id: "user-2", status: "active" } })
    );
  });
});
