import NextAuth, { CredentialsSignin } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import type { NextAuthConfig } from "next-auth";
import bcrypt from "bcryptjs";

class CustomAuthError extends CredentialsSignin {
  constructor(message: string) {
    super();
    this.code = message;
  }
}

if (process.env.NODE_ENV === "production" && process.env.NEXT_PHASE !== "phase-production-build") {
  if (!process.env.AUTH_SECRET) throw new Error("Missing AUTH_SECRET env var");
  
  const hasGoogleId = !!process.env.AUTH_GOOGLE_ID;
  const hasGoogleSecret = !!process.env.AUTH_GOOGLE_SECRET;
  if (hasGoogleId !== hasGoogleSecret) {
    throw new Error("Incomplete Google OAuth configuration pair: Set both AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET, or neither.");
  }

  const hasGithubId = !!process.env.AUTH_GITHUB_ID;
  const hasGithubSecret = !!process.env.AUTH_GITHUB_SECRET;
  if (hasGithubId !== hasGithubSecret) {
    throw new Error("Incomplete GitHub OAuth configuration pair: Set both AUTH_GITHUB_ID and AUTH_GITHUB_SECRET, or neither.");
  }
}

const providers: NextAuthConfig["providers"] = [];

// 1. Google OAuth Provider
if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: { params: { prompt: "select_account" } },
    })
  );
}

// 2. GitHub OAuth Provider
if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    })
  );
}

// 3. Credentials Provider (Email & Password)
providers.push(
  Credentials({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        throw new CustomAuthError("Email dan kata sandi wajib diisi.");
      }

      const email = (credentials.email as string).toLowerCase().trim();
      const password = credentials.password as string;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user || !user.passwordHash) {
        throw new CustomAuthError("Email atau kata sandi tidak valid.");
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        throw new CustomAuthError("Email atau kata sandi tidak valid.");
      }

      // Pastikan email telah diverifikasi (hanya dicek setelah password valid)
      if (!user.emailVerified) {
        throw new CustomAuthError("Email belum diverifikasi. Silakan periksa kotak masuk email Anda.");
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
        if (token.id) {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { id: token.id as string },
              select: { name: true, image: true, email: true },
            });
            if (dbUser) {
              session.user.name = dbUser.name;
              session.user.image = dbUser.image;
              if (dbUser.email) {
                session.user.email = dbUser.email;
              }
            }
          } catch (error) {
            console.error("Failed to fetch latest user session details:", error);
          }
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    newUser: "/signup",
  },
  debug: process.env.NODE_ENV === "development",
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);