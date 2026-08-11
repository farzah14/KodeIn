import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import crypto from "crypto";

vi.mock("@/lib/prisma", () => {
  const mockPrisma = {
    user: {
      update: vi.fn(),
    },
    passwordResetToken: {
      findUnique: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
    $transaction: vi.fn((cb) => cb(mockPrisma)),
  };
  return { prisma: mockPrisma };
});
vi.mock("@/server/rate-limit/dbRateLimit", () => ({
  checkDbRateLimit: vi.fn().mockResolvedValue({ allowed: true, retryAfterSeconds: 0 }),
  clientIp: vi.fn().mockReturnValue("test-ip"),
  RESET_PASSWORD_MAX_PER_IP: 10,
  RESET_PASSWORD_WINDOW_MS: 600_000,
}));

describe("POST /api/auth/reset-password", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects a missing or malformed token", async () => {
    const req = new NextRequest("http://localhost:3000/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token: "", password: "new-password-123" }),
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
    expect(prisma.passwordResetToken.findUnique).not.toHaveBeenCalled();
  });

  it("rejects a password shorter than 8 characters", async () => {
    const req = new NextRequest("http://localhost:3000/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token: "some-token", password: "short" }),
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
    expect(prisma.passwordResetToken.findUnique).not.toHaveBeenCalled();
  });

  it("rejects an unknown token without updating the user", async () => {
    vi.mocked(prisma.passwordResetToken.findUnique).mockResolvedValue(null);

    const req = new NextRequest("http://localhost:3000/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token: "unknown-token", password: "new-password-123" }),
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("INVALID_TOKEN");
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it("removes an expired token and rejects the reset", async () => {
    vi.mocked(prisma.passwordResetToken.findUnique).mockResolvedValue({
      userId: "user-id",
      expires: new Date(Date.now() - 1000),
    } as never);
    vi.mocked(prisma.passwordResetToken.delete).mockResolvedValue({} as never);

    const req = new NextRequest("http://localhost:3000/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token: "expired-token", password: "new-password-123" }),
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("EXPIRED_TOKEN");
    expect(prisma.passwordResetToken.delete).toHaveBeenCalledWith({
      where: { tokenHash: crypto.createHash("sha256").update("expired-token").digest("hex") },
    });
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it("updates the password and consumes the token exactly once", async () => {
    vi.mocked(prisma.passwordResetToken.findUnique).mockResolvedValue({
      userId: "user-id",
      expires: new Date(Date.now() + 60 * 60 * 1000),
    } as never);
    vi.mocked(prisma.passwordResetToken.deleteMany).mockResolvedValue({ count: 1 } as never);
    vi.mocked(prisma.user.update).mockResolvedValue({ id: "user-id" } as never);

    const req = new NextRequest("http://localhost:3000/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token: "valid-token", password: "new-password-123" }),
    });

    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "user-id" },
        data: expect.objectContaining({ passwordHash: expect.any(String) }),
      })
    );
    expect(prisma.passwordResetToken.deleteMany).toHaveBeenCalledWith({
      where: { userId: "user-id" },
    });
    expect(prisma.passwordResetToken.findUnique).toHaveBeenCalledWith({
      where: { tokenHash: crypto.createHash("sha256").update("valid-token").digest("hex") },
      select: { userId: true, expires: true },
    });
    const data = await res.json();
    expect(data.message).toContain("Kata sandi Anda berhasil diubah");
  });

  it("rejects object-valued reset fields without throwing", async () => {
    const req = new NextRequest("http://localhost:3000/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token: {}, password: [] }),
    });

    expect((await POST(req)).status).toBe(400);
    expect(prisma.passwordResetToken.findUnique).not.toHaveBeenCalled();
  });
});
