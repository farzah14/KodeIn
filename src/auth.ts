import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const googleId = process.env.AUTH_GOOGLE_ID;
const googleSecret = process.env.AUTH_GOOGLE_SECRET;
const githubId = process.env.AUTH_GITHUB_ID;
const githubSecret = process.env.AUTH_GITHUB_SECRET;

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: googleId ?? "",
      clientSecret: googleSecret ?? "",
    }),
    GitHub({
      clientId: githubId ?? "",
      clientSecret: githubSecret ?? "",
    }),
  ],
  pages: { signIn: "/login" },
  trustHost: process.env.AUTH_TRUST_HOST === "true",
});
