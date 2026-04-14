"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeSync } from "@/components/ThemeSync";
import { LanguageProvider } from "@/lib/i18n";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProvider>
        <ThemeSync />
        {children}
      </LanguageProvider>
    </SessionProvider>
  );
}
