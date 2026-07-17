import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
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
      if (existingUser.passwordHash) {
        if (existingUser.emailVerified) {
          return NextResponse.json(
            { error: "Email sudah terdaftar. Silakan masuk menggunakan email dan kata sandi Anda." },
            { status: 400 }
          );
        }

        // Akun ada tetapi belum diverifikasi -> kirim ulang email verifikasi!
        await prisma.$transaction(async (tx) => {
          // Update password/nama jika diinput baru
          await tx.user.update({
            where: { id: existingUser.id },
            data: {
              name: name.trim(),
              passwordHash,
            },
          });

          // Hapus token verifikasi lama jika ada
          await tx.verificationToken.deleteMany({
            where: { identifier: normalizedEmail },
          });

          // Simpan token verifikasi baru
          await tx.verificationToken.create({
            data: {
              identifier: normalizedEmail,
              token,
              expires,
            },
          });
        });

        const emailSent = await sendVerificationEmail(normalizedEmail, token);
        if (!emailSent) {
          console.error("Gagal mengirim ulang email verifikasi ke:", normalizedEmail);
        }

        return NextResponse.json(
          { 
            message: "Akun ini belum diverifikasi. Email verifikasi baru telah dikirimkan ke email Anda.",
            email: normalizedEmail 
          },
          { status: 200 }
        );
      }

      // Jika terdaftar melalui provider OAuth (Google, dll)
      const providers = existingUser.accounts.map((acc) => acc.provider).join(", ");
      const providerMsg = providers 
        ? ` (${providers})` 
        : "";
      return NextResponse.json(
        { 
          error: `Email ini sudah terdaftar melalui login sosial${providerMsg}. Silakan masuk menggunakan metode tersebut.` 
        },
        { status: 400 }
      );
    }

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
    const emailSent = await sendVerificationEmail(normalizedEmail, token);
    if (!emailSent) {
      console.error("Gagal mengirim email verifikasi ke:", normalizedEmail);
      // Tetap kembalikan sukses, user bisa minta kirim ulang nanti atau dev melihat log
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
