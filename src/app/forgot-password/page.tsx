"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, TerminalSquare, ShieldCheck, Mail, Send } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim()) {
      return setError("Alamat email wajib diisi.");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setError("Format email tidak valid.");
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok && res.status === 429) {
        throw new Error(data.error || "Terlalu banyak permintaan. Silakan coba lagi nanti.");
      }
      if (!res.ok) {
        throw new Error(data.error || "Terjadi kesalahan saat mengirim permintaan.");
      }
      setSuccess(data.message);
      setEmail("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal menghubungi server.");
    } finally {
      setIsLoading(false);
    }
  };

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
            Tenang,<br />
            kami bantu kembali.
          </h1>
          <p className="text-lg text-gray-400 max-w-md leading-relaxed">
            Masukkan alamat email yang terdaftar dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 text-sm text-gray-500">
          <ShieldCheck size={18} className="text-green-400" />
          <span>Tautan reset hanya berlaku 1 jam dan sekali pakai.</span>
        </div>
      </div>

      {/* KANAN: Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="absolute top-8 left-8 lg:left-[52%]">
          <Link href="/login" className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Kembali
          </Link>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="text-center lg:text-left">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 lg:mx-0">
              <TerminalSquare size={28} />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Lupa Kata Sandi
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-zinc-400">
              Kami akan mengirimkan tautan reset ke email Anda.
            </p>
          </div>

          <div className="mt-8">
            {success ? (
              <div className="rounded-2xl bg-green-50 p-6 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50">
                <div className="flex items-start gap-3">
                  <Send className="h-6 w-6 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-green-800 dark:text-green-400">
                      Permintaan Dikirim
                    </h3>
                    <p className="mt-2 text-sm text-green-700 dark:text-green-300 leading-relaxed">
                      {success}
                    </p>
                    <div className="mt-4">
                      <Link
                        href="/login"
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-all"
                      >
                        Ke Halaman Masuk
                      </Link>
                    </div>
                  </div>
                </div>
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
                    Alamat Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 dark:text-zinc-500">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="budi@example.com"
                      autoComplete="email"
                      className="block w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-indigo-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold tracking-wide text-white hover:bg-indigo-700 focus:outline-none disabled:opacity-50 transition-all cursor-pointer shadow-md hover:shadow-lg"
                >
                  {isLoading ? "Mengirim..." : "Kirim Tautan Reset"}
                  {!isLoading && <Send size={16} />}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}