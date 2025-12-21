"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

type Provider = {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
};

type ProvidersResponse = Record<string, Provider>;

export default function LoginPage() {
  const sp = useSearchParams();

  const [providers, setProviders] = useState<ProvidersResponse | null>(null);
  const [loading, setLoading] = useState<"google" | "github" | null>(null);

  const error = sp.get("error");

  const errorText = useMemo(() => {
    if (!error) return null;
    if (error === "Configuration")
      return "Konfigurasi login bermasalah. Cek ENV di Vercel (AUTH_URL, AUTH_SECRET, OAuth client, dll).";
    if (error === "OAuthCallbackError")
      return "OAuth callback error. Biasanya redirect URL / client secret tidak cocok.";
    return `Login error: ${error}`;
  }, [error]);

  useEffect(() => {
    let alive = true;

    fetch("/api/auth/providers", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (!alive) return;
        setProviders(j);
      })
      .catch(() => {
        if (!alive) return;
        setProviders({});
      });

    return () => {
      alive = false;
    };
  }, []);

  const hasGoogle = !!providers?.google;
  const hasGithub = !!providers?.github;

  async function handle(providerId: "google" | "github") {
    try {
      setLoading(providerId);
      await signIn(providerId, { callbackUrl: "/learn" });
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <main className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-[28px] border border-gray-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-zinc-100">
            Masuk / Daftar
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-zinc-400">
            Login pertama kali otomatis membuat akun.
          </p>

          {errorText && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
              {errorText}
            </div>
          )}

          <div className="mt-6 space-y-3">
            {/* GOOGLE */}
            {providers === null ? (
              <div className="h-11 w-full animate-pulse rounded-xl bg-gray-100 dark:bg-zinc-900" />
            ) : hasGoogle ? (
              <button
                type="button"
                onClick={() => handle("google")}
                disabled={loading !== null}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
              >
                {loading === "google" ? "Loading..." : "Continue with Google"}
              </button>
            ) : null}

            {/* GITHUB */}
            {providers === null ? (
              <div className="h-11 w-full animate-pulse rounded-xl bg-gray-100 dark:bg-zinc-900" />
            ) : hasGithub ? (
              <button
                type="button"
                onClick={() => handle("github")}
                disabled={loading !== null}
                className="w-full rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black"
              >
                {loading === "github" ? "Loading..." : "Continue with GitHub"}
              </button>
            ) : null}

            {/* Kalau dua-duanya tidak ada */}
            {providers && !hasGoogle && !hasGithub && (
              <div className="rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 dark:border-yellow-900/40 dark:bg-yellow-900/20 dark:text-yellow-200">
                Tidak ada provider OAuth yang aktif. Pastikan ENV provider sudah terpasang di Vercel.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
