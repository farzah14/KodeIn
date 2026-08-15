import { describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { verifyActivity } from "@/server/execution/verifyActivity";
import { awardCompletion } from "@/server/progress/awardCompletion";
import { checkAndIncrementQuota, refundExecutionQuota } from "@/server/rate-limit/executionQuota";

vi.mock("server-only", () => ({}));
vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: { user: { findUnique: vi.fn() } },
}));
vi.mock("@/server/execution/verifyActivity", () => ({ verifyActivity: vi.fn() }));
vi.mock("@/server/progress/awardCompletion", () => ({ awardCompletion: vi.fn() }));
vi.mock("@/server/rate-limit/executionQuota", () => ({
  checkAndIncrementQuota: vi.fn(),
  refundExecutionQuota: vi.fn(),
}));

describe("POST /api/progress/complete-step", () => {
  it("refunds quota and returns 503 when the runner is unavailable", async () => {
    const windowStart = new Date("2026-08-12T00:00:00.000Z");
    vi.mocked(auth).mockResolvedValue({ user: { email: "learner@example.com" } } as never);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: "user-1" } as never);
    vi.mocked(checkAndIncrementQuota).mockResolvedValue({
      allowed: true,
      count: 1,
      windowStart,
    });
    vi.mocked(verifyActivity).mockResolvedValue({
      passed: false,
      reason: "RUNNER_UNAVAILABLE",
    });

    const response = await POST(
      new Request("http://localhost/api/progress/complete-step", {
        method: "POST",
        body: JSON.stringify({ stepId: "py-l1-s2", code: "print(1)" }),
      })
    );

    expect(response.status).toBe(503);
    expect(refundExecutionQuota).toHaveBeenCalledWith("user-1", windowStart);
    expect(awardCompletion).not.toHaveBeenCalled();
  });
});
