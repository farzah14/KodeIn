import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import { NextRequest } from "next/server";

vi.mock("@/lib/prisma", () => {
  const mockPrisma = {
    user: {
      findUnique: vi.fn(),
    },
    passwordResetToken: {
      create: vi.fn(),
      deleteMany: vi.fn(),
    },
    $transaction: vi.fn((cb) => cb(mockPrisma)),
  };
  return { prisma: mockPrisma };
});

vi.mock("@/lib/email", () => ({
  sendPasswordResetEmail: vi.fn(),
}));
vi.mock("@/server/rate-limit/dbRateLimit", () => ({
  checkDbRateLimit: vi.fn().mockResolvedValue({ allowed: true, retryAfterSeconds: 0 }),
  clientIp: vi.fn().mockReturnValue("test-ip"),
  FORGOT_PASSWORD_MAX_PER_KEY: 1,
  FORGOT_PASSWORD_WINDOW_MS: 60_000,
}));

describe("POST /api/auth/forgot-password", () => {
  let emailedToken = "";

  beforeEach(() => {
    vi.clearAllMocks();
    emailedToken = "";
  });

  it("returns a neutral 202 when the email does not exist (no enumeration)", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const req = new NextRequest("http://localhost:3000/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email: "nobody@example.com" }),
    });

    const res = await POST(req);

    expect(res.status).toBe(202);
    const data = await res.json();
    expect(data.message).toBe("Jika alamat dapat menerima email, instruksi berikutnya akan dikirim.");
    expect(data.error).toBeUndefined();
    expect(prisma.passwordResetToken.create).not.toHaveBeenCalled();
    expect(sendPasswordResetEmail).not.toHaveBeenCalled();
  });

  it("returns a neutral 202 for OAuth-only accounts without creating a token", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "oauth-user-id",
      name: "OAuth User",
      passwordHash: null,
      emailVerified: new Date("2026-01-01T00:00:00.000Z"),
    } as never);

    const req = new NextRequest("http://localhost:3000/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email: "google-user@example.com" }),
    });

    const res = await POST(req);

    expect(res.status).toBe(202);
    expect(prisma.passwordResetToken.create).not.toHaveBeenCalled();
    expect(sendPasswordResetEmail).not.toHaveBeenCalled();
  });

  it("creates a token and sends the reset email for a verified credential user", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "credential-user-id",
      name: "Budi",
      passwordHash: "existing-hash",
      emailVerified: new Date("2026-01-01T00:00:00.000Z"),
    } as never);
    vi.mocked(prisma.passwordResetToken.create).mockResolvedValue({} as never);
    vi.mocked(sendPasswordResetEmail).mockImplementation(async (_email, _name, token) => {
      emailedToken = token;
      return true;
    });

    const req = new NextRequest("http://localhost:3000/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email: "budi-reset2@example.com" }),
    });

    const res = await POST(req);

    expect(res.status).toBe(202);
    expect(prisma.passwordResetToken.deleteMany).toHaveBeenCalledWith({
      where: { userId: "credential-user-id" },
    });
    expect(prisma.passwordResetToken.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: "credential-user-id",
          tokenHash: expect.any(String),
          expires: expect.any(Date),
        }),
      })
    );
    expect(sendPasswordResetEmail).toHaveBeenCalledWith(
      "budi-reset2@example.com",
      "Budi",
      expect.any(String)
    );
    const createCall = vi.mocked(prisma.passwordResetToken.create).mock.calls[0][0];
    expect(createCall.data.tokenHash).not.toBe(emailedToken);
    expect(createCall.data.tokenHash).toHaveLength(64);
  });

  it("rolls back the token when the reset email cannot be delivered", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "credential-user-id",
      name: "Budi",
      passwordHash: "existing-hash",
      emailVerified: new Date("2026-01-01T00:00:00.000Z"),
    } as never);
    vi.mocked(prisma.passwordResetToken.create).mockResolvedValue({} as never);
    vi.mocked(sendPasswordResetEmail).mockRejectedValue(new Error("smtp unavailable"));

    const req = new NextRequest("http://localhost:3000/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email: "budi-failed-delivery@example.com" }),
    });

    const res = await POST(req);

    expect(res.status).toBe(202);
    expect(prisma.passwordResetToken.deleteMany).toHaveBeenCalledWith({
      where: { userId: "credential-user-id" },
    });
  });

  it("rejects object-valued email fields without throwing", async () => {
    const req = new NextRequest("http://localhost:3000/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email: {} }),
    });

    expect((await POST(req)).status).toBe(400);
  });
});
