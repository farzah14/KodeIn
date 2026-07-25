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

const authSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
const googleId = process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID;
const googleSecret = process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET;
const githubId = process.env.AUTH_GITHUB_ID || process.env.GITHUB_CLIENT_ID;
const githubSecret = process.env.AUTH_GITHUB_SECRET || process.env.GITHUB_CLIENT_SECRET;

if (process.env.NODE_ENV === "production" && process.env.NEXT_PHASE !== "phase-production-build") {
  if (!authSecret) throw new Error("Missing AUTH_SECRET or NEXTAUTH_SECRET env var");
  
  const hasGoogleId = !!googleId;
  const hasGoogleSecret = !!googleSecret;
  if (hasGoogleId !== hasGoogleSecret) {
    throw new Error("Incomplete Google OAuth configuration pair: Set both Google Client ID and Secret, or neither.");
  }

  const hasGithubId = !!githubId;
  const hasGithubSecret = !!githubSecret;
  if (hasGithubId !== hasGithubSecret) {
    throw new Error("Incomplete GitHub OAuth configuration pair: Set both GitHub Client ID and Secret, or neither.");
  }
}

const providers: NextAuthConfig["providers"] = [];

// 1. Google OAuth Provider
if (googleId && googleSecret) {
  providers.push(
    Google({
      clientId: googleId,
      clientSecret: googleSecret,
      authorization: { params: { prompt: "select_account" } },
      allowDangerousEmailAccountLinking: true,
    })
  );
}

// 2. GitHub OAuth Provider
if (githubId && githubSecret) {
  providers.push(
    GitHub({
      clientId: githubId,
      clientSecret: githubSecret,
      allowDangerousEmailAccountLinking: true,
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
  secret: authSecret,
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