import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  secret: requiredEnv("AUTH_SECRET"),

  trustHost: true,

  providers: [
    GoogleProvider({
      clientId: requiredEnv("AUTH_GOOGLE_ID"),
      clientSecret: requiredEnv("AUTH_GOOGLE_SECRET"),
    }),
    GitHubProvider({
      clientId: requiredEnv("AUTH_GITHUB_ID"),
      clientSecret: requiredEnv("AUTH_GITHUB_SECRET"),
    }),
  ],

  pages: { signIn: "/login" },

  debug: process.env.NODE_ENV !== "production",
});
