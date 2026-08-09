import { describe, it, expect } from "vitest";
import { executionQuotaExceeded, rateLimited } from "./responses";

describe("responses", () => {
  it("executionQuotaExceeded returns 429 with the fixed retry header and message", async () => {
    const res = executionQuotaExceeded();
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBe("60");
    expect(await res.json()).toEqual({
      error: "Too many execution requests. Please try again after 1 minute.",
    });
  });

  it("rateLimited returns 429 with the dynamic retry hint and header", async () => {
    const res = rateLimited(42);
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBe("42");
    expect(await res.json()).toEqual({
      error: "Terlalu banyak permintaan. Silakan coba lagi dalam 42 detik.",
    });
  });
});