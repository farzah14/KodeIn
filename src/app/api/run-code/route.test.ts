import { describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { executeCode } from "@/server/execution/piston";
import { checkAndIncrementQuota, refundExecutionQuota } from "@/server/rate-limit/executionQuota";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("@/server/execution/piston", () => ({ executeCode: vi.fn() }));
vi.mock("@/server/rate-limit/executionQuota", () => ({
  checkAndIncrementQuota: vi.fn(),
  refundExecutionQuota: vi.fn(),
}));

describe("POST /api/run-code", () => {
  it("returns 503 and refunds quota when no runner is configured", async () => {
    const windowStart = new Date("2026-08-12T00:00:00.000Z");
    vi.mocked(auth).mockResolvedValue({ user: { id: "user-1" } } as never);
    vi.mocked(checkAndIncrementQuota).mockResolvedValue({ allowed: true, count: 1, windowStart });
    vi.mocked(executeCode).mockResolvedValue({
      success: false,
      error: "RUNNER_NOT_CONFIGURED",
    });

    const response = await POST(
      new NextRequest("http://localhost/api/run-code", {
        method: "POST",
        body: JSON.stringify({ language: "python", files: [{ content: "print(1)" }] }),
      })
    );

    expect(response.status).toBe(503);
    expect(refundExecutionQuota).toHaveBeenCalledWith("user-1", windowStart);
  });
});
