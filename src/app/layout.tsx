import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "./providers";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "KodeIn — Belajar Coding Interaktif Jadi Gampang!",
  description: "Platform belajar coding modern gratis di Indonesia. Pelajari struktur coding secara interaktif, mulai dari Python hingga framework website secara menyenangkan tanpa perlu instalasi.",
  keywords: ["belajar coding", "kursus python", "javascript", "belajar programming", "kodein", "tutorial coding interaktif", "code runner", "sekolah koding"],
  authors: [{ name: "KodeIn Team" }],
  openGraph: {
    title: "KodeIn — Petualangan Belajar Coding",
    description: "Belajar coding kini segampang dan se-fun main game. Yuk coba KodeIn secara gratis, sekarang juga!",
    url: "https://kodein.example.com",
    siteName: "KodeIn",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KodeIn — Belajar Coding Interaktif Jadi Gampang!",
    description: "Platform belajar coding modern secara menyenangkan tanpa perlu instalasi.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 text-gray-900 dark:bg-black dark:text-zinc-100`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
