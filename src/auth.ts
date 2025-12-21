import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

function required(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // WAJIB di production (Vercel)
  secret: required("AUTH_SECRET"),

  // di Vercel paling aman true (biar tidak UntrustedHost)
  trustHost: true,

  // opsional, tapi membantu saat debugging
  debug: process.env.NODE_ENV === "development",

  adapter: PrismaAdapter(prisma),

  providers: [
    Google({
      clientId: required("AUTH_GOOGLE_ID"),
      clientSecret: required("AUTH_GOOGLE_SECRET"),
    }),
    GitHub({
      clientId: required("AUTH_GITHUB_ID"),
      clientSecret: required("AUTH_GITHUB_SECRET"),
    }),
  ],

  pages: { signIn: "/login" },
});
