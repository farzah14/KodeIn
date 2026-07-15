"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeSync } from "@/components/ThemeSync";
import { LanguageProvider } from "@/lib/i18n";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProvider>
        <ThemeSync />
        <ErrorBoundary label="App">{children}</ErrorBoundary>
      </LanguageProvider>
    </SessionProvider>
  );
}
