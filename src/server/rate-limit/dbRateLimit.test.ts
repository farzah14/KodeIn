import { beforeEach, describe, expect, it, vi } from "vitest";
import { checkDbRateLimit } from "./dbRateLimit";
import { prisma } from "@/lib/prisma";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    rateLimitBucket: {
      upsert: vi.fn(),
      update: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

describe("checkDbRateLimit", () => {
  beforeEach(() => vi.clearAllMocks());

  it("claims a shared bucket atomically and returns its retry window", async () => {
    const now = Date.now();
    const windowMs = 60_000;
    const windowStart = new Date(Math.floor(now / windowMs) * windowMs);
    vi.mocked(prisma.rateLimitBucket.upsert).mockResolvedValue({
      key: "ip:127.0.0.1",
      windowStart,
      count: 2,
      expiresAt: new Date(windowStart.getTime() + windowMs),
    } as never);
    vi.mocked(prisma.rateLimitBucket.deleteMany).mockResolvedValue({ count: 0 });

    const result = await checkDbRateLimit("ip:127.0.0.1", { windowMs, max: 5 });

    expect(result.allowed).toBe(true);
    expect(prisma.rateLimitBucket.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { key_windowStart: { key: "ip:127.0.0.1", windowStart } },
        update: { count: { increment: 1 } },
      })
    );
  });

  it("returns an over-limit increment and compensates it", async () => {
    const windowStart = new Date(Math.floor(Date.now() / 60_000) * 60_000);
    vi.mocked(prisma.rateLimitBucket.upsert).mockResolvedValue({
      key: "ip:127.0.0.1",
      windowStart,
      count: 6,
      expiresAt: new Date(windowStart.getTime() + 60_000),
    } as never);
    vi.mocked(prisma.rateLimitBucket.update).mockResolvedValue({} as never);
    vi.mocked(prisma.rateLimitBucket.deleteMany).mockResolvedValue({ count: 0 });

    const result = await checkDbRateLimit("ip:127.0.0.1", { windowMs: 60_000, max: 5 });

    expect(result.allowed).toBe(false);
    expect(result.retryAfterSeconds).toBeGreaterThanOrEqual(1);
    expect(prisma.rateLimitBucket.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { count: { decrement: 1 } } })
    );
  });
});
