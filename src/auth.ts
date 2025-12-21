import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

function requiredEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  // Pastikan secret ada di runtime (lebih jelas daripada rely inferensi)
  secret: process.env.AUTH_SECRET,

  // Di Vercel aman untuk di-true-kan agar tidak tergantung env var yang mungkin lupa diset
  trustHost: true,

  providers: [
    Google({
      clientId: requiredEnv("AUTH_GOOGLE_ID"),
      clientSecret: requiredEnv("AUTH_GOOGLE_SECRET"),
    }),
    GitHub({
      clientId: requiredEnv("AUTH_GITHUB_ID"),
      clientSecret: requiredEnv("AUTH_GITHUB_SECRET"),
    }),
  ],

  pages: { signIn: "/login" },

  // Nyalakan sementara kalau masih error biar log lebih jelas di Vercel
  debug: process.env.NODE_ENV !== "production",
});
