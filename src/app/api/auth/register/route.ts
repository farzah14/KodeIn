import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email";
import { registerLimiter, clientIp } from "@/server/rate-limit/memoryRateLimit";
import { rateLimited } from "@/server/rate-limit/responses";

export async function POST(req: NextRequest) {
  try {
    // 0. Rate limit per IP before any expensive work (bcrypt hashing).
    const check = registerLimiter.check(clientIp(req));
    if (!check.allowed) {
      return rateLimited(check.retryAfterSeconds);
    }

    const { name, email, password } = await req.json();

    // 1. Validasi Input
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Nama lengkap wajib diisi." },
        { status: 400 }
      );
    }

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: "Alamat email wajib diisi." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Format email tidak valid." },
        { status: 400 }
      );
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: "Kata sandi minimal harus 8 karakter." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 2. Hash Password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 3. Generate token verifikasi
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 Jam

    // 4. Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { 
        id: true, 
        passwordHash: true, 
        emailVerified: true,
        accounts: { select: { provider: true } } 
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Jika alamat dapat menerima email, instruksi berikutnya akan dikirim." },
        { status: 202 }
      );
    }

    let userId = "";
    // 5. Buat User baru & Token & Progress default dalam Transaksi
    await prisma.$transaction(async (tx) => {
      // Buat user baru (emailVerified bernilai null secara default)
      const user = await tx.user.create({
        data: {
          name: name.trim(),
          email: normalizedEmail,
          passwordHash,
        },
      });
      userId = user.id;

      // Simpan token verifikasi
      await tx.verificationToken.create({
        data: {
          identifier: normalizedEmail,
          token,
          expires,
        },
      });

      // Inisialisasi progress belajar default
      await tx.progress.create({
        data: {
          userId: user.id,
          xp: 0,
          streakCurrent: 0,
          streakLongest: 0,
          completedJson: "{}",
        },
      });
    });

    // 6. Kirim email verifikasi
    try {
      await sendVerificationEmail(normalizedEmail, token);
    } catch (error) {
      console.error("Verification email delivery failed", { userId });
      // Roll back the just-created account so the email address is not burned:
      // without a delivered token the user could never verify or sign in, and
      // any retry of the same email would have been blocked by the 202 path.
      await prisma.$transaction(async (tx) => {
        await tx.verificationToken.deleteMany({ where: { identifier: normalizedEmail } });
        await tx.progress.deleteMany({ where: { userId } });
        await tx.user.delete({ where: { id: userId } });
      }).catch((rollbackError) => {
        console.error("Rollback of failed registration failed", { userId, rollbackError });
      });
      return NextResponse.json(
        { error: "VERIFICATION_DELIVERY_FAILED" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { 
        message: "Registrasi berhasil! Silakan periksa email Anda untuk memverifikasi akun.",
        email: normalizedEmail 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Kesalahan registrasi:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server. Silakan coba beberapa saat lagi." },
      { status: 500 }
    );
  }
}
