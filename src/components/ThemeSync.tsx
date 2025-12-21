"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

type Theme = "light" | "dark" | "system";
const KEY = "kodeln_theme";

function applyTheme(theme: Theme) {
  const root = document.documentElement;

  const setDark = (isDark: boolean) => {
    if (isDark) root.classList.add("dark");
    else root.classList.remove("dark");
  };

  if (theme === "dark") setDark(true);
  else if (theme === "light") setDark(false);
  else {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    setDark(!!mq?.matches);
  }
}

export function ThemeSync() {
  const { status } = useSession();

  // 1) Apply dari localStorage (langsung, tanpa nunggu fetch)
  useEffect(() => {
    const t = (localStorage.getItem(KEY) as Theme | null) ?? "system";
    applyTheme(t);
  }, []);

  // 2) Kalau sudah login, ambil theme dari DB (/api/profile) lalu apply
  useEffect(() => {
    if (status !== "authenticated") return;

    (async () => {
      const res = await fetch("/api/profile", { cache: "no-store" });
      if (!res.ok) return;

      const j = (await res.json()) as { theme?: Theme };
      const t = j.theme ?? "system";
      localStorage.setItem(KEY, t);
      applyTheme(t);
    })();
  }, [status]);

  // 3) Dengerin event saat user ganti theme (biar instant, no refresh)
  useEffect(() => {
    const onThemeChanged = () => {
      const t = (localStorage.getItem(KEY) as Theme | null) ?? "system";
      applyTheme(t);
    };

    window.addEventListener("kodeln-theme", onThemeChanged);
    window.addEventListener("storage", onThemeChanged);

    return () => {
      window.removeEventListener("kodeln-theme", onThemeChanged);
      window.removeEventListener("storage", onThemeChanged);
    };
  }, []);

  return null;
}
