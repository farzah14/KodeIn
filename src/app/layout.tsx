import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "./providers";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], display: "swap", variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "KodeIn — Belajar Coding Tanpa Bosaan",
  description: "Platform belajar coding interaktif, mulai dari Python hingga web development. Belajar praktis tanpa perlu instalasi.",
};

export const viewport: Viewport = {
  themeColor: "#0A0A0F",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.variable} ${jetbrains.variable} bg-edu-bg text-edu-textPrimary font-sans antialiased min-h-screen selection:bg-edu-primary selection:text-white`}>
        <Script src="https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js" strategy="afterInteractive" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
