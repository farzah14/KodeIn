"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { TerminalSquare, CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const statusParam = searchParams.get("status");
    const messageParam = searchParams.get("message");

    if (statusParam === "success") {
      setStatus("success");
      // Auto redirect to login after 5 seconds
      const timer = setTimeout(() => {
        router.push("/login?verified=true");
      }, 5000);
      return () => clearTimeout(timer);
    } else if (statusParam === "error") {
      setStatus("error");
      switch (messageParam) {
        case "missing_token":
          setErrorMessage("Token verifikasi tidak ditemukan.");
          break;
        case "invalid_token":
          setErrorMessage("Token verifikasi tidak valid atau tidak cocok.");
          break;
        case "expired_token":
          setErrorMessage("Link verifikasi telah kadaluwarsa (masa berlaku 24 jam). Silakan daftarkan ulang akun Anda.");
          break;
        case "server_error":
          setErrorMessage("Terjadi kesalahan pada server saat memverifikasi.");
          break;
        default:
          setErrorMessage("Gagal memverifikasi alamat email Anda.");
      }
    } else {
      // Default to error if accessed directly without params
      setStatus("error");
      setErrorMessage("Akses tidak valid.");
    }
  }, [searchParams, router]);

  return (
    <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 shadow-xl dark:border-zinc-900 dark:bg-zinc-950 text-center">
      {/* Logo */}
      <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
        <TerminalSquare size={28} />
      </div>

      {status === "loading" && (
        <div className="flex flex-col items-center gap-4 py-6">
          <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Memproses Verifikasi</h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Sedang memverifikasi alamat email Anda, mohon tunggu sebentar...
          </p>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center gap-4 py-4">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Email Terverifikasi!
          </h2>
          <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed px-2">
            Akun Anda telah berhasil diaktifkan. Anda akan dialihkan ke halaman masuk secara otomatis dalam beberapa detik.
          </p>
          <Link
            href="/login?verified=true"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-md"
          >
            Masuk Sekarang <ArrowRight size={16} />
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center gap-4 py-4">
          <XCircle className="h-16 w-16 text-red-500" />
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Verifikasi Gagal
          </h2>
          <p className="text-sm text-red-600 dark:text-red-400 font-medium bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl p-4 w-full">
            {errorMessage}
          </p>
          <div className="mt-6 flex w-full flex-col gap-3">
            <Link
              href="/signup"
              className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-md"
            >
              Daftar Ulang Akun
            </Link>
            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 transition-all"
            >
              Kembali ke Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-[#09090b] px-4 py-12">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:20px_20px] dark:bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)]"></div>
      <div className="absolute top-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-cyan-500/10 blur-[80px] pointer-events-none"></div>

      <div className="relative z-10">
        <Suspense fallback={
          <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 shadow-xl dark:border-zinc-900 dark:bg-zinc-950 text-center">
            <Loader2 className="mx-auto h-12 w-12 text-indigo-600 animate-spin mb-4" />
            <p className="text-sm text-gray-500">Memuat status verifikasi...</p>
          </div>
        }>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
