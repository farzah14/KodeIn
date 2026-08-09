import { describe, it, expect } from "vitest";
import { MemoryRateLimiter } from "./memoryRateLimit";

describe("MemoryRateLimiter", () => {
  const windowMs = 60_000;
  const max = 2;
  const limiter = new MemoryRateLimiter({ windowMs, max });

  it("allows requests up to the limit", () => {
    const t0 = 1_000_000;
    expect(limiter.check("ip", t0).allowed).toBe(true);
    expect(limiter.check("ip", t0 + 1).allowed).toBe(true);
  });

  it("blocks requests beyond the limit and reports Retry-After", () => {
    const t0 = 2_000_000;
    limiter.check("ip", t0);
    limiter.check("ip", t0 + 1);
    const blocked = limiter.check("ip", t0 + 2);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("resets the window as time passes", () => {
    const t0 = 3_000_000;
    limiter.check("ip", t0);
    limiter.check("ip", t0 + 1);
    expect(limiter.check("ip", t0 + 2).allowed).toBe(false);
    // Window fully expired -> allowed again
    expect(limiter.check("ip", t0 + windowMs + 1).allowed).toBe(true);
  });

  it("does not leak state between keys", () => {
    const t0 = 4_000_000;
    limiter.check("a", t0);
    limiter.check("a", t0 + 1);
    expect(limiter.check("b", t0).allowed).toBe(true);
  });
});