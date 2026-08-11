import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";
import { forgotPasswordLimiter, clientIp } from "@/server/rate-limit/memoryRateLimit";
import { rateLimited } from "@/server/rate-limit/responses";

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function POST(req: NextRequest) {
  try {
    let body: { email?: string };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { email } = body;
    if (!email || !email.trim()) {
      return NextResponse.json({ error: "Alamat email wajib diisi." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Format email tidak valid." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Rate limit check (email hash + IP)
    const emailHash = crypto.createHash("sha256").update(normalizedEmail).digest("hex");
    const rateLimitKey = `${emailHash}-${clientIp(req)}`;
    const check = forgotPasswordLimiter.check(rateLimitKey);

    if (!check.allowed) {
      return rateLimited(check.retryAfterSeconds);
    }

    // Look up only credential users (email + password). OAuth-only accounts have
    // no passwordHash and cannot use this flow.
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, name: true, passwordHash: true, emailVerified: true },
    });

    // To prevent user enumeration, always return 202 even when the address is
    // unknown, unverified, or OAuth-only.
    if (!user || !user.passwordHash || !user.emailVerified) {
      return NextResponse.json(
        { message: "Jika alamat dapat menerima email, instruksi berikutnya akan dikirim." },
        { status: 202 }
      );
    }

    // Invalidate any previous reset token for this user, then issue a fresh one.
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + TOKEN_TTL_MS);

    await prisma.$transaction(async (tx) => {
      await tx.passwordResetToken.deleteMany({ where: { userId: user.id } });
      await tx.passwordResetToken.create({
        data: { userId: user.id, token, expires },
      });
    });

    // Send the reset email
    try {
      await sendPasswordResetEmail(normalizedEmail, user.name, token);
    } catch (error) {
      console.error("Password reset email delivery failed", { userId: user.id });
      // Fail closed on delivery failure like the register flow: a reset email
      // that never arrives would leave the account locked out with a burned token.
      try {
        await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
      } catch (rollbackError) {
        console.error("Rollback of failed reset token failed", { userId: user.id, rollbackError });
      }
      return NextResponse.json({ error: "RESET_EMAIL_DELIVERY_FAILED" }, { status: 503 });
    }

    return NextResponse.json(
      { message: "Jika alamat dapat menerima, instruksi berikutnya akan dikirim." },
      { status: 202 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server. Silakan coba beberapa saat lagi." },
      { status: 500 }
    );
  }
}