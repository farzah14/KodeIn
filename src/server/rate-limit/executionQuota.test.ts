import { describe, it, expect, vi, beforeEach } from "vitest";
import { prisma } from "@/lib/prisma";
import { checkAndIncrementQuota, refundExecutionQuota, MAX_EXECUTIONS_PER_MINUTE } from "./executionQuota";

vi.mock("@/lib/prisma", () => ({
  prisma: { executionQuota: { upsert: vi.fn(), update: vi.fn() } },
}));

const windowStart = new Date(Math.floor(Date.now() / 60000) * 60000);
const userId = "user-quota";

function quotaRow(count: number) {
  return { userId, windowStart, count };
}

function makeRow(count: number) {
  return quotaRow(count);
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("checkAndIncrementQuota", () => {
  it("allows requests up to the cap", async () => {
    for (let count = 1; count < MAX_EXECUTIONS_PER_MINUTE; count++) {
      vi.mocked(prisma.executionQuota.upsert).mockResolvedValue(makeRow(count) as any);
      const result = await checkAndIncrementQuota(userId);
      expect(result.allowed).toBe(true);
      expect(prisma.executionQuota.update).not.toHaveBeenCalled();
    }
  });

  it("allows exactly the 20th slot and rejects the one after", async () => {
    vi.mocked(prisma.executionQuota.upsert).mockResolvedValue(
      makeRow(MAX_EXECUTIONS_PER_MINUTE) as any
    );
    const atCap = await checkAndIncrementQuota(userId);
    expect(atCap.allowed).toBe(true);
    expect(prisma.executionQuota.update).not.toHaveBeenCalled();

    vi.mocked(prisma.executionQuota.upsert).mockResolvedValue(
      makeRow(MAX_EXECUTIONS_PER_MINUTE + 1) as any
    );
    vi.mocked(prisma.executionQuota.update).mockResolvedValue(makeRow(MAX_EXECUTIONS_PER_MINUTE) as any);
    const overCap = await checkAndIncrementQuota(userId);
    expect(overCap.allowed).toBe(false);
  });

  it("returns the slot when the request is rejected, so flood attempts cannot compound", async () => {
    vi.mocked(prisma.executionQuota.upsert).mockResolvedValue(
      makeRow(MAX_EXECUTIONS_PER_MINUTE + 1) as any
    );
    vi.mocked(prisma.executionQuota.update).mockResolvedValue(makeRow(MAX_EXECUTIONS_PER_MINUTE) as any);

    await checkAndIncrementQuota(userId);

    // over-cap request: 1 increment + 1 compensating decrement = count pinned
    // at the cap regardless of how many rejected attempts arrive.
    expect(prisma.executionQuota.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { count: { decrement: 1 } } })
    );
  });

  it("returns the window start so callers can refund a slot", async () => {
    vi.mocked(prisma.executionQuota.upsert).mockResolvedValue(makeRow(1) as any);
    const result = await checkAndIncrementQuota(userId);
    expect(result.windowStart).toEqual(windowStart);
  });
});

describe("refundExecutionQuota", () => {
  it("decrements the claimed slot in the given window", async () => {
    vi.mocked(prisma.executionQuota.update).mockResolvedValue(makeRow(1) as any);

    await refundExecutionQuota(userId, windowStart);

    expect(prisma.executionQuota.update).toHaveBeenCalledWith({
      where: { userId_windowStart: { userId, windowStart } },
      data: { count: { decrement: 1 } },
    });
  });

  it("does not throw when the row is gone (window already rotated)", async () => {
    vi.mocked(prisma.executionQuota.update).mockRejectedValue(new Error("P2025"));
    await expect(refundExecutionQuota(userId, windowStart)).resolves.toBeUndefined();
  });
});