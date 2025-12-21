import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

function requiredEnv(name: string) {
  const v = process.env[name];
  // Di Vercel build time, env kadang undefined, jadi kita bypass check ini saat build
  if (!v && process.env.NODE_ENV !== "production") {
    console.warn(`Warning: Missing env: ${name}`);
  }
  return v || "";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  
  // Wajib ada di Vercel Production
  secret: process.env.AUTH_SECRET, 

  // Membantu NextAuth mengenali domain Vercel (https)
  trustHost: true,

  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      // FIX UTAMA: Memaksa parameter authorization agar Google mengirim token yang benar
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],

  pages: { 
    signIn: "/login",
    error: "/error", // Tambahkan page error custom jika ada
  },

  // Nyalakan debug sementara di production untuk melihat log asli Vercel
  debug: true, 
});