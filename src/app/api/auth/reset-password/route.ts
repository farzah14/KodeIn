import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { resetPasswordLimiter, clientIp } from "@/server/rate-limit/memoryRateLimit";
import { rateLimited } from "@/server/rate-limit/responses";

export async function POST(req: NextRequest) {
  try {
    let body: { token?: string; password?: string };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const check = resetPasswordLimiter.check(clientIp(req));
    if (!check.allowed) {
      return rateLimited(check.retryAfterSeconds);
    }

    const { token, password } = body;

    if (!token || typeof token !== "string" || !token.trim()) {
      return NextResponse.json(
        { error: "Token pengaturan ulang tidak valid." },
        { status: 400 }
      );
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: "Kata sandi minimal harus 8 karakter." },
        { status: 400 }
      );
    }

    if (password.length > 128) {
      return NextResponse.json(
        { error: "Kata sandi terlalu panjang." },
        { status: 400 }
      );
    }

    // Consume the token and apply the new password in one transaction so a
    // reset link can be used exactly once.
    let changedUserId: string | null = null;

    await prisma.$transaction(async (tx) => {
      const resetToken = await tx.passwordResetToken.findUnique({
        where: { token },
        select: { userId: true, expires: true },
      });

      if (!resetToken) {
        throw new ResetTokenError("INVALID_TOKEN");
      }

      if (new Date() > resetToken.expires) {
        // Expired tokens are removed so the link cannot be retried.
        await tx.passwordResetToken.delete({ where: { token } });
        throw new ResetTokenError("EXPIRED_TOKEN");
      }

      const passwordHash = await bcrypt.hash(password, 12);

      await tx.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      });

      await tx.passwordResetToken.deleteMany({ where: { userId: resetToken.userId } });
      changedUserId = resetToken.userId;
    });

    if (!changedUserId) {
      return NextResponse.json(
        { error: "Terjadi kesalahan pada server. Silakan coba beberapa saat lagi." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Kata sandi Anda berhasil diubah. Silakan masuk dengan kata sandi baru." },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ResetTokenError) {
      return NextResponse.json({ error: error.code }, { status: 400 });
    }
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server. Silakan coba beberapa saat lagi." },
      { status: 500 }
    );
  }
}

class ResetTokenError extends Error {
  constructor(public readonly code: "INVALID_TOKEN" | "EXPIRED_TOKEN") {
    super(code);
    this.name = "ResetTokenError";
  }
}