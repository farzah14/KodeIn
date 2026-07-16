import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import type { NextAuthConfig } from "next-auth";

if (process.env.NODE_ENV === "production" && process.env.NEXT_PHASE !== "phase-production-build") {
  if (!process.env.AUTH_SECRET) throw new Error("Missing AUTH_SECRET env var");
  if (!process.env.AUTH_GOOGLE_ID || !process.env.AUTH_GOOGLE_SECRET) throw new Error("Missing Google OAuth credentials");
}

const providers: NextAuthConfig["providers"] = [];

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: { params: { prompt: "select_account" } },
    })
  );
}


providers.push(
  Credentials({
    name: "Bypass",
    credentials: {
      email: { label: "Email", type: "email" },
    },
    async authorize(credentials) {
      if (!credentials?.email) return null;
      const email = credentials.email as string;
      
      let user = await prisma.user.findUnique({
        where: { email },
      });
      
      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name: email.split("@")[0],
            image: `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`,
          },
        });
      }
      
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      };
    },
  })
);

const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  debug: process.env.NODE_ENV === "development",
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);