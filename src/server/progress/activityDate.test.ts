import { describe, it, expect, vi } from "vitest";
import { getActivityDateISO } from "./activityDate";

vi.mock("server-only", () => ({}));

describe("getActivityDateISO", () => {
  it("returns the UTC-midnight day for mid-morning in Jakarta", () => {
    const now = new Date("2026-08-09T02:30:00Z"); // 09:30 WIB
    expect(getActivityDateISO(now)).toBe("2026-08-09");
  });

  it("rolls over at Jakarta midnight, not UTC midnight", () => {
    // 23:30 UTC on the 8th = 06:30 WIB on the 9th — must count as the 9th.
    const now = new Date("2026-08-08T23:30:00Z");
    expect(getActivityDateISO(now)).toBe("2026-08-09");
  });

  it("moves to the next day right after Jakarta midnight", () => {
    // 17:00 UTC on the 9th = 00:00 WIB on the 10th.
    const now = new Date("2026-08-09T17:00:00Z");
    expect(getActivityDateISO(now)).toBe("2026-08-10");
  });

  it("keeps streak days stable across a UTC clock rollback edge case", () => {
    const lateYesterday = new Date("2026-08-07T16:59:59Z"); // 23:59:59 WIB
    const midnight = new Date("2026-08-07T17:00:00Z"); // 00:00 WIB
    expect(getActivityDateISO(lateYesterday)).toBe("2026-08-07");
    expect(getActivityDateISO(midnight)).toBe("2026-08-08");
  });
});