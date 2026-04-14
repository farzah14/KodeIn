import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const getEnv = (key: string) => {
  const value = process.env[key];
  if (!value && process.env.NODE_ENV !== "production") {
    console.warn(`Warning: Missing env: ${key}`);
  }
  return value ?? "";
};

const authOptions = {
  adapter: PrismaAdapter(prisma),
  secret: getEnv("AUTH_SECRET"),
  trustHost: true,
  providers: [
    GoogleProvider({
      clientId: getEnv("AUTH_GOOGLE_ID"),
      clientSecret: getEnv("AUTH_GOOGLE_SECRET"),
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GitHubProvider({
      clientId: getEnv("AUTH_GITHUB_ID"),
      clientSecret: getEnv("AUTH_GITHUB_SECRET"),
    }),
  ],
  callbacks: {
    async session({ session, user }: { session: any; user: any }) {
      if (session.user && user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  debug: true,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);