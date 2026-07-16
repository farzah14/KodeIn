"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft, TerminalSquare, ShieldCheck } from "lucide-react";

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
            {/* Opsi Login */}
            <div className="flex flex-col gap-4">
              
              {/* Google Button */}
              <button
                onClick={() => signIn("google", { callbackUrl: "/learn", prompt: "select_account" })}
                className="group relative flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm font-semibold tracking-wide text-gray-800 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Masuk dengan Google
              </button>



            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-200 dark:border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500 dark:bg-[#09090b] dark:text-zinc-500">
                  Atau Mode Pengembang (Bypass)
                </span>
              </div>
            </div>

            {/* Credentials / Bypass Login Form */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const email = formData.get("email") as string;
                if (!email) return;
                
                try {
                  await signIn("credentials", {
                    email,
                    callbackUrl: "/learn",
                  });
                } catch (err) {
                  console.error(err);
                }
              }}
              className="flex flex-col gap-3"
            >
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-gray-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                  Email Demo / Pengembang
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  defaultValue="developer@kodein.dev"
                  className="block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:placeholder-zinc-500 dark:focus:border-indigo-400 dark:focus:bg-zinc-950 transition-all"
                />
              </div>
              <button
                type="submit"
                className="flex w-full items-center justify-center rounded-2xl bg-indigo-600 px-5 py-4 text-sm font-semibold tracking-wide text-white shadow-sm transition-all hover:bg-indigo-500 hover:shadow-lg dark:bg-indigo-500 dark:hover:bg-indigo-400"
              >
                Masuk Mode Pengembang
              </button>
            </form>

             {/* Footer Form */}
             <div className="mt-8 text-center text-xs text-gray-500 dark:text-zinc-500">
               Dengan mendaftar, kamu setuju dengan Persyaratan Layanan <br className="hidden sm:block" />
               dan Kebijakan Privasi dari KodeIn.
             </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}
