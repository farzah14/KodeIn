"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, TerminalSquare, CheckCircle2, Loader2, Lock, KeyRound } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      return setError("Tautan reset tidak valid. Silakan minta tautan baru.");
    }
    if (password.length < 8) {
      return setError("Kata sandi minimal harus 8 karakter.");
    }
    if (password !== confirmPassword) {
      return setError("Konfirmasi kata sandi tidak cocok.");
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        let message = data.error || "Terjadi kesalahan saat mengatur ulang kata sandi.";
        if (message === "INVALID_TOKEN") {
          message = "Tautan reset tidak valid atau telah digunakan.";
        } else if (message === "EXPIRED_TOKEN") {
          message = "Tautan reset telah kadaluwarsa (masa berlaku 1 jam). Silakan minta tautan baru.";
        }
        throw new Error(message);
      }

      setSuccess(data.message);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal menghubungi server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="text-center lg:text-left">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 lg:mx-0">
          <KeyRound size={28} />
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Atur Ulang Kata Sandi
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-zinc-400">
          Buat kata sandi baru untuk akun Anda.
        </p>
      </div>

      <div className="mt-8">
        {success ? (
          <div className="rounded-2xl bg-green-50 p-6 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 text-center">
            <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto" />
            <h3 className="mt-3 text-sm font-bold text-green-800 dark:text-green-400">
              Kata Sandi Berhasil Diubah
            </h3>
            <p className="mt-2 text-sm text-green-700 dark:text-green-300 leading-relaxed">
              {success}
            </p>
            <p className="mt-2 text-xs text-green-600/70 dark:text-green-400/70">
              Mengarahkan ke halaman masuk...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 p-4 text-sm text-red-600 dark:text-red-400 font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                Kata Sandi Baru
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 dark:text-zinc-500">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="block w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-indigo-500"
                />
              </div>
              <span className="mt-1 block text-xs text-gray-500 dark:text-zinc-500">
                Minimal 8 karakter.
              </span>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                Konfirmasi Kata Sandi Baru
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 dark:text-zinc-500">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="block w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold tracking-wide text-white hover:bg-indigo-700 focus:outline-none disabled:opacity-50 transition-all cursor-pointer shadow-md hover:shadow-lg"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {isLoading ? "Memproses..." : "Perbarui Kata Sandi"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen w-full bg-white dark:bg-[#09090b]">
      {/* KIRI: Area Branding */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gray-900 p-12 lg:flex">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute -left-20 -top-20 h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-[100px]"></div>
        <div className="absolute -right-20 -bottom-20 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[100px]"></div>

        <div className="relative z-10 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black shadow-lg">
            <TerminalSquare size={20} />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">KodeIn</span>
        </div>

        <div className="relative z-10 flex flex-col gap-6">
          <h1 className="text-4xl font-bold text-white leading-tight lg:text-5xl">
            Kata sandi baru,<br />
            semangat baru.
          </h1>
          <p className="text-lg text-gray-400 max-w-md leading-relaxed">
            Amankan akun Anda dengan kata sandi baru dan lanjutkan perjalanan belajarmu.
          </p>
        </div>
      </div>

      {/* KANAN: Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="absolute top-8 left-8 lg:left-[52%]">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Kembali
          </button>
        </div>

        <div className="mx-auto w-full max-w-sm">
          <Suspense
            fallback={
              <div className="flex justify-center py-16">
                <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
              </div>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}