import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";
import { NextRequest } from "next/server";

vi.mock("@/lib/prisma", () => {
  const mockPrisma = {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    },
    verificationToken: {
      deleteMany: vi.fn(),
      create: vi.fn(),
    },
    progress: {
      create: vi.fn(),
    },
    $transaction: vi.fn((cb) => cb(mockPrisma)),
  };
  return { prisma: mockPrisma };
});

vi.mock("@/lib/email", () => ({
  sendVerificationEmail: vi.fn(),
}));

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not change name or passwordHash when an unverified email already exists", async () => {
    // 1. Mock existing unverified credentials user
    const existingUser = {
      id: "unverified-user-id",
      passwordHash: "old-hash",
      emailVerified: null,
      accounts: [],
    };
    vi.mocked(prisma.user.findUnique).mockResolvedValue(existingUser as any);

    // 2. Request body with same email but new name & password
    const body = {
      name: "Attacker name",
      email: "victim@example.com",
      password: "attackerpassword123",
    };

    const req = new NextRequest("http://localhost:3000/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const res = await POST(req);
    
    // 3. Assert status is 202 (idempotent / queued verification link resend)
    expect(res.status).toBe(202);

    // 4. Assert user update was never called
    expect(prisma.user.update).not.toHaveBeenCalled();

    // 5. Assert the response message does not leak account details or reveal exact state
    const data = await res.json();
    expect(data.message).toBe("Jika alamat dapat menerima email, instruksi berikutnya akan dikirim.");
    expect(data.error).toBeUndefined();
  });
});
