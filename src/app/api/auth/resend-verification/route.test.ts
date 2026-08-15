import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";
import { NextRequest } from "next/server";

vi.mock("@/lib/prisma", () => {
  const mockPrisma = {
    user: {
      findUnique: vi.fn(),
    },
    verificationToken: {
      deleteMany: vi.fn(),
      create: vi.fn(),
    },
    $transaction: vi.fn((cb) => cb(mockPrisma)),
  };
  return { prisma: mockPrisma };
});

vi.mock("@/lib/email", () => ({
  sendVerificationEmail: vi.fn(),
}));
vi.mock("@/server/rate-limit/dbRateLimit", () => ({
  checkDbRateLimit: vi.fn().mockResolvedValue({ allowed: true, retryAfterSeconds: 0 }),
  clientIp: vi.fn().mockReturnValue("test-ip"),
  RESEND_MAX_PER_KEY: 1,
  RESEND_WINDOW_MS: 60_000,
}));

describe("POST /api/auth/resend-verification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("always returns 202 even for unknown, verified, or OAuth-only users", async () => {
    // Case 1: Unknown user
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    let req = new NextRequest("http://localhost:3000/api/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email: "unknown@example.com" }),
    });
    let res = await POST(req);
    expect(res.status).toBe(202);
    expect(prisma.verificationToken.create).not.toHaveBeenCalled();

    // Case 2: Verified user
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "verified-id",
      passwordHash: "hash",
      emailVerified: new Date(),
    } as any);
    req = new NextRequest("http://localhost:3000/api/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email: "verified@example.com" }),
    });
    res = await POST(req);
    expect(res.status).toBe(202);
    expect(prisma.verificationToken.create).not.toHaveBeenCalled();

    // Case 3: OAuth-only user (no password hash)
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "oauth-id",
      passwordHash: null,
      emailVerified: null,
    } as any);
    req = new NextRequest("http://localhost:3000/api/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email: "oauth@example.com" }),
    });
    res = await POST(req);
    expect(res.status).toBe(202);
    expect(prisma.verificationToken.create).not.toHaveBeenCalled();
  });

  it("rotates verification token and sends email for unverified credentials user", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "unverified-id",
      passwordHash: "some-password-hash",
      emailVerified: null,
    } as any);

    const req = new NextRequest("http://localhost:3000/api/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email: "unverified@example.com" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(202);
    expect(prisma.verificationToken.deleteMany).toHaveBeenCalled();
    expect(prisma.verificationToken.create).toHaveBeenCalled();
    expect(sendVerificationEmail).toHaveBeenCalled();
  });
});
