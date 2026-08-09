"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, TerminalSquare, ShieldCheck, Mail, Lock } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    const codeParam = searchParams.get("code");
    const verifiedParam = searchParams.get("verified");

    if (codeParam) {
      setError(codeParam);
    } else if (errorParam) {
      if (errorParam === "CredentialsSignin") {
        setError("Email atau kata sandi salah.");
      } else {
        setError(errorParam);
      }
    }

    if (verifiedParam === "true") {
      setSuccess("Email Anda berhasil diverifikasi! Silakan masuk menggunakan akun Anda.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim() || !password) {
      return setError("Email dan kata sandi wajib diisi.");
    }

    setIsLoading(true);

    try {
      await signIn("credentials", {
        email: email.toLowerCase().trim(),
        password,
        callbackUrl: "/learn",
      });
    } catch {
      setError("Gagal masuk. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 p-4 text-sm text-red-600 dark:text-red-400 font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 p-4 text-sm text-green-600 dark:text-green-400 font-medium">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email */}
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
              className="block w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300">
              Kata Sandi
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              Lupa kata sandi?
            </Link>
          </div>
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
              className="block w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-indigo-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold tracking-wide text-white hover:bg-indigo-700 focus:outline-none disabled:opacity-50 transition-all cursor-pointer shadow-md hover:shadow-lg"
        >
          {isLoading ? "Memproses..." : "Masuk"}
        </button>
      </form>

      <div className="relative flex items-center justify-center py-2">
        <div className="absolute w-full border-t border-gray-100 dark:border-zinc-900"></div>
        <span className="relative bg-white px-4 text-xs font-semibold text-gray-400 dark:bg-[#09090b] dark:text-zinc-500 uppercase tracking-wider">
          atau masuk dengan
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Google OAuth */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/learn", prompt: "select_account" })}
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-xs font-bold text-gray-800 shadow-sm transition-all hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900 cursor-pointer"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </button>

        {/* GitHub OAuth */}
        <button
          onClick={() => signIn("github", { callbackUrl: "/learn" })}
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-xs font-bold text-gray-800 shadow-sm transition-all hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900 cursor-pointer"
        >
          <svg className="h-4 w-4 fill-current text-black dark:text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
          </svg>
          GitHub
        </button>
      </div>

      <div className="mt-2 text-center text-sm text-gray-500 dark:text-zinc-400">
        Belum memiliki akun?{" "}
        <Link href="/signup" className="font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
          Daftar di sini
        </Link>
      </div>

      <div className="text-center text-xs text-gray-400 dark:text-zinc-500 leading-relaxed">
        Dengan masuk, Anda menyetujui{" "}
        <Link href="/terms" className="underline hover:text-gray-600 dark:hover:text-zinc-300">
          Ketentuan Layanan
        </Link>{" "}
        dan{" "}
        <Link href="/privacy" className="underline hover:text-gray-600 dark:hover:text-zinc-300">
          Kebijakan Privasi
        </Link>{" "}
        dari KodeIn.
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full bg-white dark:bg-[#09090b]">
      {/* KIRI: Area Branding (Disembunyikan di Mobile) */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gray-900 p-12 lg:flex">
        {/* Background Mesh/Gradient Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute -left-20 -top-20 h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-[100px]"></div>
        <div className="absolute -right-20 -bottom-20 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[100px]"></div>

        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black shadow-lg">
            <TerminalSquare size={20} />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">KodeIn</span>
        </div>

        {/* Main Quote / Copy */}
        <div className="relative z-10 flex flex-col gap-6">
          <h1 className="text-4xl font-bold text-white leading-tight lg:text-5xl">
            Satu baris kode hari ini,<br />
            Langkah besar untuk esok.
          </h1>
          <p className="text-lg text-gray-400 max-w-md leading-relaxed">
            Bergabunglah dengan siswa lain untuk membangun fundamental programming secara instan melalui latihan yang interaktif.
          </p>
        </div>

        {/* Bottom Social Proof */}
        <div className="relative z-10 flex items-center gap-3 text-sm text-gray-500">
          <ShieldCheck size={18} className="text-green-400" />
          <span>Aman. Data kamu tidak akan pernah kami jual.</span>
        </div>
      </div>

      {/* KANAN: Login Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        {/* Tombol Back */}
        <div className="absolute top-8 left-8 lg:left-[52%]">
          <Link href="/" className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Kembali
          </Link>
        </div>

        <div className="mx-auto w-full max-w-sm">
          {/* Header */}
          <div className="text-center lg:text-left">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 lg:mx-0">
              <TerminalSquare size={28} />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Masuk ke KodeIn
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-zinc-400">
              Lanjutkan perjalanan belajarmu sekarang.
            </p>
          </div>

          <div className="mt-10">
            <Suspense fallback={<div className="text-center text-sm py-4 text-gray-500">Memuat formulir...</div>}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
