import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email";
import { resendLimiter, clientIp } from "@/server/rate-limit/memoryRateLimit";
import { rateLimited } from "@/server/rate-limit/responses";

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
    const ip = clientIp(req);
    const emailHash = crypto.createHash("sha256").update(normalizedEmail).digest("hex");
    const rateLimitKey = `${emailHash}-${ip}`;
    const check = resendLimiter.check(rateLimitKey);

    if (!check.allowed) {
      return rateLimited(check.retryAfterSeconds);
    }

    // Look up the user
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        passwordHash: true,
        emailVerified: true,
      },
    });

    // To prevent user enumeration, we always return 202, even if the user doesn't exist
    // or is already verified, or signed up via OAuth (has no passwordHash).
    if (!user || user.emailVerified || !user.passwordHash) {
      return NextResponse.json(
        { message: "Jika alamat dapat menerima email, instruksi berikutnya akan dikirim." },
        { status: 202 }
      );
    }

    // Generate new verification token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 Hours

    await prisma.$transaction(async (tx) => {
      // Delete old verification tokens
      await tx.verificationToken.deleteMany({
        where: { identifier: normalizedEmail },
      });

      // Save the new verification token
      await tx.verificationToken.create({
        data: {
          identifier: normalizedEmail,
          token,
          expires,
        },
      });
    });

    // Send the verification email
    try {
      await sendVerificationEmail(normalizedEmail, token);
    } catch (error) {
      console.error("Gagal mengirim email verifikasi ulang:", error);
      // Fail closed in case of email delivery failure
      return NextResponse.json(
        { error: "VERIFICATION_DELIVERY_FAILED" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { message: "Jika alamat dapat menerima email, instruksi berikutnya akan dikirim." },
      { status: 202 }
    );
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server. Silakan coba beberapa saat lagi." },
      { status: 500 }
    );
  }
}
