import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const appUrl = process.env.AUTH_URL || "http://localhost:3000";

  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(`${appUrl}/verify-email?status=error&message=missing_token`);
    }

    // 1. Cari token di database
    const verificationToken = await prisma.verificationToken.findFirst({
      where: { token },
    });

    if (!verificationToken) {
      return NextResponse.redirect(`${appUrl}/verify-email?status=error&message=invalid_token`);
    }

    // 2. Cek apakah token kadaluwarsa
    if (new Date() > verificationToken.expires) {
      // Hapus token yang kadaluwarsa
      await prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: verificationToken.identifier,
            token: verificationToken.token,
          },
        },
      }).catch(console.error);

      return NextResponse.redirect(`${appUrl}/verify-email?status=error&message=expired_token`);
    }

    // 3. Update status verifikasi user & hapus token dalam transaksi
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { email: verificationToken.identifier },
        data: { emailVerified: new Date() },
      });

      await tx.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: verificationToken.identifier,
            token: verificationToken.token,
          },
        },
      });
    });

    return NextResponse.redirect(`${appUrl}/verify-email?status=success`);
  } catch (error) {
    console.error("Kesalahan verifikasi email:", error);
    return NextResponse.redirect(`${appUrl}/verify-email?status=error&message=server_error`);
  }
}
